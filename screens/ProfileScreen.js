import { auth } from '../firebase-config'
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import { subscribeUserDB, refreshUserDB } from '../utils/initUser';
import { useEffect, useState } from 'react';


export default function ProfileScreen({ navigation }) {
    
    const user = auth.currentUser;
    const [userDB, setUserDB] = useState(null);
    
    const [variable, setVariable] = useState({
        parametro: variable,
    });
    
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
        
    return (

        
        <View >
            
            <TextInput
                style={styles.inputNombre}
                placeholder="Tu nombre"
                value={variable.parametro}
                onChangeText={text => handleInputChange('nombre',variable.parametro) }
            />

            <TextInput
                style={styles.inputBio}
                placeholder="Tu biografia"
                value={variable.parametro}
                onChangeText={text => handleInputChange('bio',variable.parametro) }
            />
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