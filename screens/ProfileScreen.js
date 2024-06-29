import { auth } from '../firebase-config'
import { StyleSheet, Text, View, TextInput, Button, Alert, TouchableOpacity,ScrollView, KeyboardAvoidingView } from 'react-native';
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
    let unsubscribeUserDB = () => (null);
    
    const [variable, setVariable] = useState({
        displayName: userDB?.displayName || "",
        bio: userDB?.bio || "",
    });

    
    // Actualizar el estado del formulario.
    const handleInputChange = (name, value) => {
        setVariable({ ...variable, [name]: value });
    };

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

            if (!variable.displayName) {
                Alert.alert("Ups!", "El nombre de usuario no puede estar vacío.");
                setLoadingSubmit(false);
                return;
            }
            
            await updateUserDB(user, {
                displayName: variable.displayName,
                bio: variable.bio,
            })  
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
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.background}>
            <ScrollView contentContainerStyle={styles.scrollContainer} pinchGestureEnabled={false}>
                <ProfileImage userData={userDB} />
                {/* mostrar el nombre */}
                <Text style={[styles.textDisplayName, {marginVertical: 20}]}>{userDB?.displayName}</Text>

                <View style={[styles.roleDefault, userDB?.isProfesor&& styles.roleProfesor, {marginBottom: 20}]}>
                    <Text style={[styles.roleLabel, userDB?.isProfesor&& styles.roleLabelProfesor]}>{!userDB?.isProfesor? "Estudiante":"Profesor"}</Text>
                </View>
            
                {userDB?.bio&& <Text style={{fontWeight: "bold"}}>Biografia</Text>}
                {userDB?.bio&& (
                <View style={[styles.inputBio, {borderWidth: 0, alignItems: 'center', padding: 0}]}>
                    <Text style={{color: "#666", textAlign: "center"}}>{userDB.bio}</Text>
                </View>
                )}
                {/* escribir el nombre */}
                <Text style={{}}>Cambiar nombre de usuario</Text>
                <TextInput
                    style={styles.inputNombre}
                    placeholder="Cambiar nombre de usuario"
                    value={variable.displayName}
                    onChangeText={text => handleInputChange('displayName',text) }
                    maxLength={30}
                />
                {/* escribir la biografia */}
                <Text style={{}}>Cambiar biografia</Text>
                <TextInput
                    style={styles.inputBio}
                    placeholder="Cambiar biografia"
                    value={variable.bio}
                    onChangeText={text => handleInputChange('bio',text) }
                    multiline={true}
                    maxLength={100}
                />
                <TouchableOpacity onPress={handleSubmit} style={[styles.button, loadingSubmit&& styles.buttonDisabled]} disabled={loadingSubmit}>
                    <Text style={{color: 'white', fontWeight: 'bold'}}>{!loadingSubmit ? ('Guardar cambios del perfil'):('Guardando...') }</Text>
                </TouchableOpacity>     
            </ScrollView>
            <StatusBar style="auto" />
        </KeyboardAvoidingView > 
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        alignItems: 'center',
        paddingBottom: 150,
    },
    textDisplayName: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    roleDefault: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: '#4c9bb3',
        backgroundColor: '#4c9bb344',
    },
    roleLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#4c9bb3',
    },
    roleProfesor: {
        backgroundColor: '#8752a844',
        borderColor: '#8752a8',
    },
    roleLabelProfesor: {
        color: '#8752a8',
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