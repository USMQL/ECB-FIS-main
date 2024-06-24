import { StatusBar } from 'expo-status-bar';
import { StyleSheet, BackHandler, Text, View, TouchableOpacity, RefreshControl, ScrollView } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { auth } from '../firebase-config'
import { subscribeUserDB, refreshUserDB } from '../utils/initUser';
import { exitApp } from '../utils/backAction'

export default function HomeScreen({ navigation }) {
    const user = auth.currentUser;
    const [userDB, setUserDB] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    let unsubscribeUserDB = null;

    const handleRefreshUserDBHome = async (data) => {
        await setUserDB(data);
      }

    useEffect(() => {
        const upUserDB = async () => {
            unsubscribeUserDB = await subscribeUserDB(handleRefreshUserDBHome);
            await refreshUserDB(user);
        }
        upUserDB();
        return () => unsubscribeUserDB();
    }, [user]);

    // Salir de la aplicación.
    useEffect(() => {
        const backHandler = BackHandler.addEventListener("hardwareBackPress", exitApp);
        return () => backHandler.remove();
    }, []);

    // Actualizar datos del usuario.
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        refreshUserDB(user).then(() => setRefreshing(false));
    }, []);
        
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.container} refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
                <Text style={styles.title}>ECB-FIS</Text>
                <Text style={{margin: 20}}>Bienvenido <Text style={{fontWeight: 'bold'}}>{userDB.displayName}</Text>!</Text>
                
                <TouchableOpacity onPress={() => (alert(userDB.displayName))} style={[styles.button, {}]}>
                    <Text style={{color: 'white', fontWeight: 'bold'}}>Generar Ejercicio</Text>
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
});