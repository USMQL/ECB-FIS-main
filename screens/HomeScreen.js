import { StatusBar } from 'expo-status-bar';
import { StyleSheet, BackHandler, Text, View, TouchableOpacity, RefreshControl, ScrollView } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { auth } from '../firebase-config'
import { subscribeUserDB, refreshUserDB } from '../utils/initUser';
import { exitApp } from '../utils/backAction'
import { seleccionarEjercicioAleatorio } from '../utils/obtenerEjercicio';

export default function HomeScreen({ navigation }) {
    const user = auth.currentUser;
    const [userDB, setUserDB] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [generarEjercicioButtonDisabled, setGenerarEjercicioButtonDisabled] = useState(false);
    let unsubscribeUserDB = () => (null);

    // Cuando se ejecuta refreshUserDB, subscribeUserDB ejecuta la siguiente función.
    const handleRefreshUserDBHome = async (data) => {
        await setUserDB(data);
    }
    useEffect(() => {
        // Suscribirse a los cambios en la variable userDB del usuario.
        const upUserDB = async () => {
            unsubscribeUserDB = await subscribeUserDB(handleRefreshUserDBHome);
            await refreshUserDB(user);
        }
        upUserDB();
        return () => unsubscribeUserDB();
    }, [user]);
    
    // Actualizar datos del usuario.
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        refreshUserDB(user).then(() => setRefreshing(false));
    }, []);

    const handleGenerarEjercicio = async () => {
        setGenerarEjercicioButtonDisabled(true);
        const ejercicio = await seleccionarEjercicioAleatorio(userDB);
        if (!ejercicio) {
            setGenerarEjercicioButtonDisabled(false);
            return;
        }
        navigation.navigate("Exercise", {
            ejercicioId: ejercicio.id,
            ejercicioData: ejercicio.data(),
        });
        setGenerarEjercicioButtonDisabled(false);
    }
    
    // Salir de la aplicación.
    useEffect(() => {
        const backHandler = BackHandler.addEventListener("hardwareBackPress", exitApp);
        return () => backHandler.remove();
    }, []);
    
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.container} refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
                <Text style={styles.title}>ECB-FIS</Text>
                <Text style={{margin: 20}}>Bienvenido <Text style={{fontWeight: 'bold'}}>{user.email.split('@')[0]}</Text>!</Text>
                
                <TouchableOpacity onPress={handleGenerarEjercicio} style={[!generarEjercicioButtonDisabled? styles.button : styles.buttonDisabled, {}]} disabled={generarEjercicioButtonDisabled}>
                    <Text style={{color: 'white', fontWeight: 'bold'}}>{!generarEjercicioButtonDisabled? "Generar Ejercicio":"Generando..."}</Text>
                </TouchableOpacity>
            </ScrollView>

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
        fontSize: 20,
        fontWeight: 'bold',
    },
    button: {
        height: 40,
        width: 300,
        padding: 10,
        backgroundColor: '#000',
        marginTop: 60,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonDisabled: {
        height: 40,
        width: 300,
        padding: 10,
        backgroundColor: '#aaa',
        marginTop: 60,
        borderRadius: 10,
        alignItems: 'center',
    },
});