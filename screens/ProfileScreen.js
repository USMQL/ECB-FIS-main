import { auth } from '../firebase-config'
import { StyleSheet, Text, View, TextInput, Button, Alert, TouchableOpacity,ScrollView } from 'react-native';
import { subscribeUserDB, refreshUserDB, updateUserDB } from '../utils/initUser';
import { useEffect, useState } from 'react';
import LoadingScreen from './LoadingScreen';
import ProfileImage from '../components/ProfileImage';
import { StatusBar } from 'expo-status-bar';


export default function ProfileScreen({ navigation }) {
    const [loadingScreen, setLoadingScreen] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const user = auth.currentUser;
    const [userDB, setUserDB] = useState(null);
    
    const [variable, setVariable] = useState({
        displayName: userDB?.displayName || "",
        bio: userDB?.bio || "",
    });

    
    // Actualizar el estado del formulario.
    const handleInputChange = (name, value) => {
        setVariable({ ...variable, [name]: value });
    };
    let unsubscribeUserDB = () => (null);

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

            if (variable.displayName === "") {
                Alert.alert("Ups!", "El nombre de usuario no puede estar vacío.");
                setLoadingSubmit(false);
                return;
            }
            
            const userData = {
                displayName: variable.displayName,
                bio: variable.bio,
            };
            await updateUserDB(user, userData)  
            await refreshUserDB(user);
            
        } catch (error) {
            console.error('ProfileScreen: Error actualizando el usuario: ', error);
            setLoadingSubmit(false);
        }
        setLoadingSubmit(false);
    };
    if (loadingScreen) {
        return (
        <View style={styles.background}>
            <LoadingScreen/>
        </View>
        )
    }
    return (
        <View style={styles.background}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <ProfileImage userData={userDB} />
                {/* mostrar el nombre */}
                <Text style={{margin: 20}}>Nombre de usuario:  <Text style={{fontWeight: 'bold'}}>@{userDB.displayName}</Text></Text>
            
                {/* */}
                {userDB?.bio&& <Text style={{}}>Tu biografia</Text>}
                <View style={[styles.inputBio, {borderWidth: 0, alignItems: 'center'}]}>
                    <Text style={{}}>{userDB.bio}</Text>
                </View>
                {/* escribir el nombre */}
                <TextInput
                    style={styles.inputNombre}
                    placeholder="Cambiar nombre de usuario"
                    value={variable.displayName}
                    onChangeText={text => handleInputChange('displayName',text) }
                />
                {/* escribir la biografia */}
                <TextInput
                    style={styles.inputBio}
                    placeholder="Cambiar biografia"
                    value={variable.bio}
                    onChangeText={text => handleInputChange('bio',text) }
                    multiline={true}
                />
                <TouchableOpacity onPress={handleSubmit} style={[styles.button, loadingSubmit&& styles.buttonDisabled]} disabled={loadingSubmit}>
                    <Text style={{color: 'white', fontWeight: 'bold'}}>{!loadingSubmit ? ('Guardar cambios del perfil'):('Enviando...') }</Text>
                </TouchableOpacity>     
            </ScrollView>
            <StatusBar style="auto" />
        </View > 
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        alignItems: 'center',
        height: '100%',
    },
    button: {
        width: 300,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        // paddingHorizontal: 32,
        borderRadius: 10,
        elevation: 3,
        backgroundColor: 'black',
    },
    buttonDisabled: {
        backgroundColor: 'gray',
    },
    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
        backgroundColor: 'white'
    },
    inputBio: {
        height: 80,
        width: 300,
        padding: 10,
        marginTop: 5,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 10,
        textAlignVertical: 'top',
        textAlign: 'left',
        backgroundColor: 'white'
    },
    inputNombre: {
        height: 40,
        width: 300,
        padding: 10,
        marginTop: 5,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 10,
        textAlignVertical: 'top',
        textAlign: 'left',
        backgroundColor: 'white'
    },
});