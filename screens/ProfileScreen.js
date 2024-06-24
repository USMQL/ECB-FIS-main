import { auth } from '../firebase-config'
import { StyleSheet, Text, View, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import { subscribeUserDB, refreshUserDB, updateUserDB } from '../utils/initUser';
import { useEffect, useState } from 'react';
import { actualizarDocumento , agregarDocumento, obtenerDocumento } from '../utils/firebaseUtils';


export default function ProfileScreen({ navigation }) {
    const [loading, setLoading] = useState(false);
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
            setLoading(true);
            
            const userData = {
                
                displayName: variable.displayName,
                bio: variable.bio,
            };
            await updateUserDB(user, userData)  

            
        } catch (error) {
            console.error('Error añadiendo el ejercicio: ', error);
            Alert.alert('Ups!', 'Error añadiendo el ejercicio: ', error.message);
        }
        setLoading(false);
    };
        
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
            <TouchableOpacity onPress={handleSubmit} style={[!loading ? (styles.button):(styles.buttonDisabled), {width: '100%'}]} disabled={loading}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>{!loading ? ('Cambiar perfil'):('Enviando...') }</Text>
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