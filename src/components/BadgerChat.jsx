import { useEffect, useContext, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import * as SecureStore from 'expo-secure-store';
import BadgerChatroomScreen from './screens/BadgerChatroomScreen';
import BadgerRegisterScreen from './screens/BadgerRegisterScreen';
import BadgerLoginScreen from './screens/BadgerLoginScreen';
import BadgerLandingScreen from './screens/BadgerLandingScreen';
import CS571 from '@cs571/mobile-client';
import BadgerChatContext from './BadgerChatContext';
import BadgerGuestContext from './BadgerGuestContext';
import BadgerLogoutScreen from './screens/BadgerLogoutScreen';
import BadgerConversionScreen from './screens/BadgerConversionScreen';
import { Alert } from "react-native";
const ChatDrawer = createDrawerNavigator();

export default function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false);
  const [chatrooms, setChatrooms] = useState([]);
  const [username, setUsername] = useState('');
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    // hmm... maybe I should load the chatroom names here
    fetch("https://cs571.org/api/f23/hw9/chatrooms",{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-CS571-ID": CS571.getBadgerId()
                

            }
        }).then(res => {
            if(res.status !== 200){
                alert("Could not fetch chatroom names");
                throw new Error('Could not fetch chatroom names');
            }
            
                return res.json();
        }).then(data => {
          //console.log(data)
          setChatrooms(data)

        }).catch( err => {

        });
     // for example purposes only!
  }, []);

  function handleLogin(username, password) {
    // hmm... maybe this is helpful!
    //console.log(username+":"+password) "Authorization": "Bearer"
    if(username==='' || password===''){
      alert("You must provide both a username and password!");
    }
    else{
        fetch("https://cs571.org/api/f23/hw9/login",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CS571-ID": CS571.getBadgerId()
                

            },
            body: JSON.stringify ({
                "username": username,
                "password": password
            })
        }).then(res => {
            if(res.status !== 200){
                alert("Incorrect username or password!");
                throw new Error('Incorrect username or password!');
            }
            
                //setLoginStatus(username);
                //sessionStorage.setItem("username",username);
                //console.log(res.json())
                
                //nav("/");
          
                return res.json();
        }).then(data => {
          //console.log(data.token)
          SecureStore.setItemAsync('JWT', data.token)
          //SecureStore.setItemAsync('user', username)
          alert("Login was successful");
          setUsername(username)
          setIsLoggedIn(true);
          setIsGuest(false)
        }).catch( err => {

        });
    } // I should really do a fetch to login first!
  }

  function handleSignup(username, password, repeatPassword) {
    // hmm... maybe this is helpful!
    if( password===''){
      alert("Please enter a password");
    }
    else if(repeatPassword!==password){
        alert("Passwords do not match");
    }
    else{
      fetch("https://cs571.org/api/f23/hw9/register",{
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "X-CS571-ID": CS571.getBadgerId()
          },
          body: JSON.stringify ({
              "username": username,
              "password": password
          })
      }).then(res => {
          if(res.status === 409){
              alert("That username has already been taken!");
              throw new Error('That username has already been taken!');
          }
           return res.json();
      }).then(data => {
          //console.log(data)
          SecureStore.setItemAsync('JWT', data.token)
          //SecureStore.setItemAsync('user', username)
          alert("Registration was successful");
          //nav("/");
          setUsername(username)               
          setIsLoggedIn(true)
          setIsGuest(false)
          setIsRegistering(false)
      }).catch( err => {

      });
    }
     // I should really do a fetch to register first!
  }
  function handleLogout() {
   // Alert.alert("Hmmm...", "This should do something!")
    SecureStore.deleteItemAsync('JWT').then(()=>{
        setUsername('')
        setIsLoggedIn(false)
    });
  }

  if (isLoggedIn) {
    return (
      <NavigationContainer>
        <BadgerChatContext.Provider value={[username, setUsername]}>
        <BadgerGuestContext.Provider value={[isGuest, setIsGuest]}>
        <ChatDrawer.Navigator>
          <ChatDrawer.Screen name="Landing" component={BadgerLandingScreen} />
          {
            chatrooms.map(chatroom => {
              return <ChatDrawer.Screen key={chatroom} name={chatroom}>
                {(props) => <BadgerChatroomScreen isGuest={isGuest} name={chatroom} />}
              </ChatDrawer.Screen>
            })
          }{
            isGuest?
            <ChatDrawer.Screen name="Signup">
              {(props) => <BadgerConversionScreen setIsRegistering={setIsRegistering} setIsLoggedIn={setIsLoggedIn}/> }
            </ChatDrawer.Screen>
            :
            <ChatDrawer.Screen name="Logout">
              {(props) => <BadgerLogoutScreen handleLogout={handleLogout}/> }
            </ChatDrawer.Screen>

          }
          
        </ChatDrawer.Navigator>
        </BadgerGuestContext.Provider>
        </BadgerChatContext.Provider>
      </NavigationContainer>
    );
  } else if (isRegistering) {
    return <BadgerRegisterScreen handleSignup={handleSignup} setIsRegistering={setIsRegistering} />
  } else {
    return <BadgerLoginScreen handleLogin={handleLogin} setIsRegistering={setIsRegistering} setIsGuest={setIsGuest} setIsLoggedIn={setIsLoggedIn}/>
  }
}