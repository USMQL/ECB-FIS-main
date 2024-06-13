import { StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { auth } from '../firebase-config'

export default function SignOutButton() {
    const handleSignOut = () => {
        Alert.alert('Cerrar Sesión', '¿Está seguro?', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Si', onPress: () => (
                auth.signOut().then(() => {
                    // navigation.navigate('Login');
                }).catch((error) => {
                    Alert.alert('Error', error.message);
                })
            ),}
        ]);
    }

    return (
        <TouchableOpacity onPress={handleSignOut} style={[styles.signOutButton]}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>Cerrar Sesión</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
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