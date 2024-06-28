import { TouchableOpacity, StyleSheet, Vibration } from 'react-native';
import { useState, useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { descargarArchivo } from '../utils/firebaseUtils';

export default function ProfileHomeButton({ navigation, userData }) {
    const [avatar, setAvatar] = useState(userData?.avatar);
    const [imageAvatar, setImageAvatar] = useState(null);
    async function getImageAvatar() {
        avatar && setImageAvatar(await descargarArchivo(avatar));
    }
    useEffect(() => {
        getImageAvatar();
    }, [avatar]);
    return (
        <TouchableOpacity style={styles.button} onPress={() => Vibration.vibrate(10)}>
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