import { SafeAreaView, TextInput, Alert, Button, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from 'react';

function BadgerRegisterScreen(props) {

    const [userName, onChangeUserName] = useState('');
    const [password, onChangePassword] = useState('');
    const [cpassword, onChangeCpassword] = useState('');
    return <View style={styles.container}>
        <Text style={{ fontSize: 36 }}>Join BadgerChat!</Text>
        <Text></Text>
        <SafeAreaView>
            <Text>Username</Text>
            <TextInput
                style={styles.input}
                onChangeText={onChangeUserName}
                value={userName}
            />
            <Text>Password</Text>
            <TextInput
                style={styles.input}
                onChangeText={onChangePassword}
                value={password}
            />
            <Text>Confirm Password</Text>
            <TextInput
                style={styles.input}
                onChangeText={onChangeCpassword}
                value={cpassword}
            />
        </SafeAreaView>
        <Button color="crimson" title="Signup " onPress={() => {
            //Alert.alert("Hmmm...", "This should do something!");
            props.handleSignup(userName, password, cpassword)
        }} />
        <Text></Text>
        <Button color="grey" title="Nevermind!  " onPress={() => props.setIsRegistering(false)} />
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

export default BadgerRegisterScreen;