import { auth } from '../firebase-config'
import { StyleSheet, Text, View, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import { subscribeUserDB, refreshUserDB, updateUserDB } from '../utils/initUser';
import { useEffect, useState } from 'react';
import { actualizarDocumento , agregarDocumento, obtenerDocumento } from '../utils/firebaseUtils';
import LoadingScreen from './LoadingScreen';


export default function ProfileScreen({ navigation }) {
    const [loadingScreen, setLoadingScreen] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const user = auth.currentUser;
    const [userDB, setUserDB] = useState(null);

    const [variable, setVariable] = useState({
        parametro: variable,
    });


    const handleUpdateUserDB = async () => {
        await updateUserDB(user);
        
      }
    
    // Actualizar el estado del formulario.
    const handleInputChange = (name, value) => {
        setVariable({ ...variable, [name]: value });
    };
    let unsubscribeUserDB = null;

    const handleRefreshUserDBPerfil = async (data) => {
        await setUserDB(data);
        setLoadingScreen(false);
      }

    useEffect(() => {
        const upUserDB = async () => {
            unsubscribeUserDB = await subscribeUserDB(handleRefreshUserDBPerfil);
            await refreshUserDB(user);
        }
        upUserDB();
        return () => unsubscribeUserDB();
    }, [user]);

    // Enviar los datos a la base de datos.
    const handleSubmit = async () => {
        try{
            setLoadingSubmit(true);
            
            const userData = {
                
                displayName: variable.displayName,
                bio: variable.bio,
            };
            await updateUserDB(user, userData)  
            await refreshUserDB(user);
            
        } catch (error) {
            console.error('Error añadiendo el ejercicio: ', error);
            Alert.alert('Ups!', 'Error añadiendo el ejercicio: ', error.message);
        }
        setLoadingSubmit(false);
    };
    if (loadingScreen) return <LoadingScreen/>;
    return (

        
        <View >
            {/* mostrar el nombre */}
            <Text style={{margin: 20}}>Bienvenido <Text style={{fontWeight: 'bold'}}>{userDB.displayName}</Text>!</Text>
            {/* escribir el nombre */}
            <TextInput
                style={styles.inputNombre}
                placeholder="Tu nombre"
                value={variable.displayName}
                onChangeText={text => handleInputChange('displayName',text) }
            />
            {/* */}
            <Text style={{margin: 20}}>Tu biografia <Text style={{fontWeight: 'bold'}}>{userDB.bio}</Text>!</Text>
            {/* escribir la biografia */}
            <TextInput
                style={styles.inputBio}
                placeholder="Tu biografia"
                value={variable.bio}
                onChangeText={text => handleInputChange('bio',text) }
            />
            <TouchableOpacity onPress={handleSubmit} style={[!loadingSubmit ? (styles.button):(styles.buttonDisabled), {width: '100%'}]} disabled={loadingSubmit}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>{!loadingSubmit ? ('Cambiar perfil'):('Enviando...') }</Text>
            </TouchableOpacity>







        </View>
        
    );
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'black',
      },
      text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
      },
      inputBio: {
        height: 80,
        width: '100%',
        padding: 10,
        marginTop: 5,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 10,
        textAlignVertical: 'top',
        textAlign: 'left',
    },
    inputNombre: {
        height: 40,
        width: '100%',
        padding: 10,
        marginTop: 5,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 10,
        textAlignVertical: 'top',
        textAlign: 'left',
    },




});