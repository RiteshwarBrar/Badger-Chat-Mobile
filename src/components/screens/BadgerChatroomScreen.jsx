import { StyleSheet, Alert, TextInput, Pressable, Modal, Text, View, Button } from "react-native";
import { useEffect, useState } from 'react';
import CS571 from '@cs571/mobile-client';
import BadgerChatMessage from "../helper/BadgerChatMessage";
import { ScrollView } from "react-native-gesture-handler";
import * as SecureStore from 'expo-secure-store';

function BadgerChatroomScreen(props) {
    const [messages, setMessages] = useState([]);
    const [page, setPage] = useState(1);
    const [prev, setPrev] = useState(true);
    const [next, setNext] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [title, onChangeTitle] = useState('');
    const [body, onChangeBody] = useState('');
    const [re, setRe] = useState(1);
    function handlePrev(){
        if(page > 1){
            setNext(false)
            if(page-1==1){
                setPrev(true);
            }
            setPage(ol=>ol-1)
        }
    }
    function handleNext(){
        if(page < 4){
            setPrev(false)
            if(page+1==4){
                setNext(true);
            }
            setPage(ol=>ol+1)
        }
        
    }
   
    function addPost(){
        setModalVisible(!modalVisible)
        
        SecureStore.getItemAsync('JWT').then(token=>{
            if(token){
                fetch("https://cs571.org/api/f23/hw9/messages?chatroom="+props.name,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CS571-ID": CS571.getBadgerId(),
                    "Authorization": "Bearer "+token
    
                },
                body: JSON.stringify ({
                    "title": title,
                    "content": body
                })
            }).then(res => {
                if(res.status !== 200){
                    //console.log(res.status)
                    alert("Could not add a post");
                    throw new Error('Could not fetch chatroom messages');
                }
                Alert.alert("Successfully posted!","Successfully posted!");
                    return res.json();
            }).catch( err => {
            });
                
            }
            else
                throw new Error('Problem in token retrieval');
        }).catch( err => {
    
        });
        onChangeBody(ol=>'')
        onChangeTitle(ol=>'')
        setPage(1)
        setPrev(true);
        setNext(false);
        setRe(ol=> ol+1)

    }

    useEffect(() => {
        // hmm... maybe I should load the chatroom names here
        fetch("https://cs571.org/api/f23/hw9/messages?chatroom="+props.name+"&page="+page,{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "X-CS571-ID": CS571.getBadgerId()
                    
    
                }
            }).then(res => {
                if(res.status !== 200 && res.status !== 304){
                    //console.log(res.status)
                    alert("Could not fetch chatroom messages");
                    throw new Error('Could not fetch chatroom messages');
                }
                
                    return res.json();
            }).then(data => {
              //console.log(data.messages)
              setMessages(data.messages)
    
            }).catch( err => {
    
            });
         // for example purposes only!deletable={mess.poster===sessionStorage.getItem("username")?"yes":"no"} del={delp}
      }, [page, modalVisible, re]);

    return <View style={{ flex: 1 }}>
        

        {/* <Text style={{margin: 100}}>This is a chatroom screen!</Text> */}
        <ScrollView>
            {
           
            messages.length > 0 ?
                    
                        messages.map(mess => {
                            //console.log();
                            return  <BadgerChatMessage 
                            setPage={setPage}
                            setPrev={setPrev}
                            setNext={setNext}
                            setRe={setRe}
                            key={mess.id}
                            {...mess} />
                            
                        })
                    
                
                :
                <>
                    <Text>There's nothing here!</Text>
                </>
        
        }
        
        </ScrollView>
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{fontSize: 20}}>Create a Post</Text>
            <Text></Text>
            <Text>Title</Text>
            <TextInput
                style={styles.input}
                onChangeText={onChangeTitle}
                value={title}
            />
            <Text>Body</Text>
            <TextInput
                style={styles.input}
                onChangeText={onChangeBody}
                value={body}
            />
            <Button color="gray" disabled={title=='' || body=='' ? true :false} title="Create Post " onPress={addPost}/>
            <Text></Text>
            <Button color="gray" title="Cancel " onPress={() => setModalVisible(!modalVisible)}/>
          </View>
        </View>
      </Modal>
        <Text style={{textAlign: 'center'}}>You are on page {page} of 4</Text>
        <View style={{}}>
            <Button title="Previous " onPress={handlePrev} disabled={prev}/>
            <Button title="Next " onPress={handleNext} disabled={next}/>
        </View>
        <Text></Text>
        <Button color="crimson" title="Add Post " disabled={props.isGuest} onPress={() => setModalVisible(!modalVisible)}/>
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      input: {
        height: 40,
        width: 300,
        margin: 12,
        borderWidth: 1,
        padding: 10,
      }
});

export default BadgerChatroomScreen;