import { SafeAreaView, TextInput, Alert, Button, StyleSheet, Text, View } from "react-native";
import { useEffect, useState, useContext } from 'react';
import BadgerGuestContext from '../BadgerGuestContext';

function BadgerLoginScreen(props) {
    const [userName, onChangeUserName] = useState('');
    const [password, onChangePassword] = useState('');
    return <View style={styles.container}>
        <Text style={{ fontSize: 36 }}>BadgerChat Login</Text>
        <Text></Text>
        
        <SafeAreaView>
            <Text style={{textAlign: 'center',}}>Username</Text>
            <TextInput
                style={styles.input}
                onChangeText={onChangeUserName}
                value={userName}
            />
            <Text style={{textAlign: 'center',}}>Password</Text>
            <TextInput
                secureTextEntry={true}
                style={styles.input}
                onChangeText={onChangePassword}
                value={password}
            />
        </SafeAreaView>
        <Button color="crimson" title="Login " onPress={() => {
            //Alert.alert("Hmmm...", "I should check the user's credentials first!");
            props.handleLogin(userName, password)
            props.setIsGuest(false)
        }} />
        <Text></Text>
        <Text style={{textAlign: 'center',}}>New here?</Text>
        <Text></Text>
        <Button color="grey" title="Signup " onPress={() => {
            props.setIsRegistering(true)
            props.setIsGuest(false)
        }} />
        <Text></Text>
        <Button color="grey" title="Continue as Guest " onPress={() => {
            props.setIsGuest(true)
            props.setIsLoggedIn(true);
            }} />
    </View>;

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        height: 40,
        width: 300,
        margin: 12,
        borderWidth: 1,
        padding: 10,
      }
});

export default BadgerLoginScreen;