import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { auth } from '../firebase-config'

export default function HomeScreen({ navigation }) {
    const user = auth.currentUser;
        
    return (
        <View style={styles.container}>
            <Text style={styles.title}>ECB-FIS</Text>
            <Text style={{margin: 20}}>Bienvenido <Text style={{fontWeight: 'bold'}}>{user.email.split('@')[0]}</Text>!</Text>
            
            <TouchableOpacity onPress={() => (Alert.alert('','no tengo'))} style={[styles.button, {}]}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>Generar Ejercicio</Text>
            </TouchableOpacity>

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