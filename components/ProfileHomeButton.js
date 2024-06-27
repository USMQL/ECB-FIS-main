// import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ProfileHomeButton({ navigation }) {
    return (
        <TouchableOpacity style={styles.button} onPress={() => null}>
            <MaterialCommunityIcons name="account" size={30} color="white" />
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