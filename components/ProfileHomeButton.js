import { TouchableOpacity, StyleSheet, Vibration } from 'react-native';
import { useState, useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { descargarArchivo } from '../utils/firebaseUtils';

export default function ProfileHomeButton({ navigation, userData }) {
    const [imageAvatar, setImageAvatar] = useState(null);
    async function getImageAvatar() {
        userData?.avatar && setImageAvatar(await descargarArchivo(userData?.avatar));
    }
    useEffect(() => {
        getImageAvatar();
    }, [userData?.avatar]);
    return (
        <TouchableOpacity style={styles.button} onPress={() => {
            Vibration.vibrate(10);
            navigation?.navigate("Perfil");
        }}>
            {!imageAvatar? (
                <MaterialCommunityIcons name="account" size={30} color="white" />
            ) : (
                <Image source={imageAvatar} style={{width: 45, height: 45, borderRadius: 100}} contentFit='cover' />
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 45,
        height: 45,
        backgroundColor: '#fff4',
        borderRadius: 100,
        marginRight: 20,
    },
});