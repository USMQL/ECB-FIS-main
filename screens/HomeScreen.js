import { StatusBar } from 'expo-status-bar';
import { StyleSheet, BackHandler, Text, View, TouchableOpacity, RefreshControl, ScrollView } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { auth } from '../firebase-config'
import { subscribeUserDB, refreshUserDB } from '../utils/initUser';
import { exitApp } from '../utils/backAction'
import { seleccionarEjercicioAleatorio } from '../utils/obtenerEjercicio';
import LoadingScreen from './LoadingScreen';
import DailyExercise from '../components/DailyExercise';
import HeaderStyle from '../components/HeaderStyle';
import { obtenerDocumento } from '../utils/firebaseUtils';

export default function HomeScreen({ navigation }) {
    const [loadingUserData, setLoadingUserData] = useState(true);
    const user = auth.currentUser;
    const [userDB, setUserDB] = useState(null);
    const [ejercicioDiario, setEjercicioDiario] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [generarEjercicioButtonDisabled, setGenerarEjercicioButtonDisabled] = useState(false);
    const [exerciseButtonDisabled, setExerciseButtonDisabled] = useState(false);
    let unsubscribeUserDB = () => (null);

    // Cuando se ejecuta refreshUserDB, se actualiza el estado de userDB.
    const handleRefreshUserDBHome = async (data) => {
        await setUserDB(data);
        setLoadingUserData(false);
    }
    useEffect(() => {
        // Suscribirse a los cambios en la variable userDB del usuario.
        const upUserDB = async () => {
            unsubscribeUserDB = await subscribeUserDB(handleRefreshUserDBHome);
            await handleObtenerEjercicioDiario();
            await refreshUserDB(user);
        }
        upUserDB();
        return () => unsubscribeUserDB();
    }, [user]);
    
    // Actualizar datos del usuario.
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        handleObtenerEjercicioDiario();
        refreshUserDB(user).then(() => setRefreshing(false));
    }, []);

    const handleObtenerEjercicioDiario = async () => {
        await obtenerDocumento("cloud", "ejercicioDiario").then((doc) => {
            setEjercicioDiario(doc.data().id);
        }).catch((error) => console.error(error));
    }

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
    
    if (loadingUserData) {
        return (
        <View style={styles.background}>
            <LoadingScreen/>
        </View>
    )
    }
    return (
        <View style={styles.background}>
            {userDB.stats.ejerciciosTerminadosIds.includes(ejercicioDiario)? (
                <HeaderStyle/>
            ):(
                <View style={{width: '100%', zIndex: 10}}>
                    <DailyExercise navigation={navigation} ejercicioDiario={ejercicioDiario} functionOnButtonDisabled={setExerciseButtonDisabled} />
                </View>
            )}
            <ScrollView contentContainerStyle={styles.scrollContainer} refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
                <View style={styles.container}>
                    <Text style={styles.title}>ECB-FIS</Text>
                    <Text style={{margin: 20}}>Bienvenido <Text style={{fontWeight: 'bold'}}>{userDB.displayName}</Text>!</Text>
                    
                    <TouchableOpacity style={[styles.button, generarEjercicioButtonDisabled && styles.buttonDisabled, {marginTop: 60}]} onPress={handleGenerarEjercicio} disabled={generarEjercicioButtonDisabled || exerciseButtonDisabled}>
                        <Text style={{color: 'white', fontWeight: 'bold'}}>{!generarEjercicioButtonDisabled? "Generar Ejercicio":"Generando..."}</Text>
                    </TouchableOpacity>
                    {userDB?.isProfesor && (
                    <TouchableOpacity style={[styles.button, {marginTop: 20, backgroundColor: '#36424a'}]} onPress={() => navigation.navigate("Upload")}>
                        <Text style={{color: 'white', fontWeight: 'bold'}}>Subir Ejercicio</Text>
                    </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
            <StatusBar style="light" />
        </View>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    button: {
        height: 40,
        width: 300,
        padding: 10,
        backgroundColor: '#4c9bb3',
        borderRadius: 20,
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#aaa',
    },
});