import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, BackHandler } from 'react-native';
import { useEffect, useState } from 'react';

import { auth } from '../firebase-config'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const errorMessages = {
    'auth/email-already-in-use': 'La dirección de correo electrónico ya está en uso',
    'auth/invalid-email': 'La dirección de correo electrónico no es válida',
    'auth/weak-password': 'La contraseña es muy débil',
    'auth/missing-password': 'Ingrese una contraseña',
};

export default function Login({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Salir de la aplicación.
    useEffect(() => {
      const backAction = () => {
        Alert.alert('Salir', '¿Está seguro que desea salir de la aplicación?', [
          { text: 'Cancelar', style: 'cancel', onPress: () => null },
          { text: 'Salir', onPress: () => BackHandler.exitApp() }
        ]);
        return true;
      };
      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
      return () => backHandler.remove();
    }, []);

    // Crear cuenta
    const handleCreateAccount = () => {
      createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        // console.log(user);
        Alert.alert('Exito', 'Cuenta creada con exito');
      })
      .catch((error) => {
        Alert.alert('Error', errorMessages[error.code] || error.message);
      })
    }
    // Iniciar sesion
    const handleLogin = () => {
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        // console.log(user);
        Alert.alert('Exito', 'Sesion iniciada con exito');

        navigation.navigate('Home')
      })
      .catch((error) => {
        Alert.alert('Error', errorMessages[error.code] || error.message);
      })
    }

    return (
      <View style={styles.container}>
        <Text style={[styles.title, {marginBottom: 100}]}>ECB-FIS</Text>

        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput onChangeText={text => setEmail(text)} style={[styles.input, {marginBottom: 20}]} placeholder='email@dominio.com'/>
        
        <Text style={styles.label} >Contraseña</Text>
        <TextInput onChangeText={text => setPassword(text)} style={[styles.input, {marginBottom: 40}]} placeholder='******' secureTextEntry/>

        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={{color: 'white', fontWeight: 'bold'}}>Iniciar Sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleCreateAccount} style={styles.button}>
          <Text style={{color: 'white', fontWeight: 'bold'}}>Crear Cuenta</Text>
        </TouchableOpacity>

        <Text style={[styles.message]}>Al crear una cuenta, aceptas nuestros <Text style={styles.messageBlack}>Términos de Servicio</Text> y <Text style={styles.messageBlack}>Política de Privacidad</Text>.</Text>
        
        <StatusBar style="auto" />
      </View>
    );
  }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },

    title: {
        fontSize: 40,
        fontWeight: 'bold',
    },

    label: {
        // fontSize: 12,
        fontWeight: 'bold',
    },

    input: {
        height: 40,
        width: 300,
        padding: 10,
        marginTop: 5,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 10,
    },

    button: {
        height: 40,
        width: 300,
        padding: 10,
        backgroundColor: '#000',
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },

    message:{
        color: '#828282',
        fontSize: 12,
        width: 325,
        textAlign: 'center',
    },
    messageBlack:{
        color: '#000',
    }
});