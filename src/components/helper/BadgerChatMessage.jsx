import { Text, Button, Alert } from "react-native";
import BadgerCard from "./BadgerCard"
import BadgerChatContext from '../BadgerChatContext';
import { useEffect, useContext, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import CS571 from '@cs571/mobile-client';

function BadgerChatMessage(props) {
    const [username, setUsername] = useContext(BadgerChatContext);
    const dt = new Date(props.created);

    function deletePost(){
        SecureStore.getItemAsync('JWT').then(token=>{
            if(token){
                console.log(props.id)

                fetch("https://cs571.org/api/f23/hw9/messages?id="+props.id,{
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CS571-ID": CS571.getBadgerId(),
                        "Authorization": "Bearer "+token
        
                    }
                }).then(res => {
                    console.log(res.status)
                    if(res.status !== 200){
                        //console.log(res.status)
                        alert("Could not delete the post");
                        throw new Error('Could not delete the post');
                    }
                    alert("Successfully deleted the post!");
                    props.setPage(ol=>1)
                    props.setPrev(true);
                    props.setNext(false);
                    props.setRe(ol=> ol+1)
                    return res.json();
                });
                
            }
            else
                throw new Error('Problem in token retrieval');
        }).catch( err => {
    
        });
    }

    return <BadgerCard style={{ marginTop: 16, padding: 8, marginLeft: 8, marginRight: 8 }}>
        <Text style={{fontSize: 28, fontWeight: 600}}>{props.title}</Text>
        <Text style={{fontSize: 12}}>by {props.poster} | Posted on {dt.toLocaleDateString()} at {dt.toLocaleTimeString()}</Text>
        <Text></Text>
        <Text>{props.content}</Text>
        {
            username===props.poster? <Button color="crimson" title="DELETE POST " onPress={deletePost}/> :[]
        }
    </BadgerCard>
}

export default BadgerChatMessage;