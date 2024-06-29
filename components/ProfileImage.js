import { TouchableOpacity, StyleSheet, Vibration } from 'react-native';
import { useState, useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { descargarArchivo } from '../utils/firebaseUtils';

export default function ProfileImage({ userData }) {
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
            }}>
            {!imageAvatar? (
                <MaterialCommunityIcons name="account" size={100} color="white" />
            ) : (
                <Image source={imageAvatar} style={{width: 140, height: 140, borderRadius: 100}} contentFit='cover' />
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 140,
        height: 140,
        backgroundColor: '#0004',
        borderRadius: 100,
    },
});