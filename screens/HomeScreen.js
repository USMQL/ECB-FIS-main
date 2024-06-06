import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { auth } from '../firebase-config'

export default function HomeScreen({ navigation }) {
    const user = auth.currentUser;

    // Cerrar sesión del usuario.
    const handleSignOut = () => {
        Alert.alert('Cerrar Sesión', '¿Está seguro?', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Si', onPress: () => (
                auth.signOut().then(() => {
                    navigation.navigate('Login');
                }).catch((error) => {
                    Alert.alert('Error', error.message);
                })
            ),}
        ]);
    }

    // Botón de cerrar sesión en la barra de navegación.
    navigation.setOptions({
        headerLeft: () => (
        <TouchableOpacity onPress={handleSignOut} style={[styles.signOutButton]}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>Cerrar Sesión</Text>
        </TouchableOpacity>
        ),
    });
    
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
    signOutButton: {
        width: 120,
        height: 30,
        backgroundColor: 'red',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
    },
});