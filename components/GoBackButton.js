import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { confirmBackAction } from '../utils/backAction';
import { Image } from 'expo-image';


export default function GoBackButton({ navigation }) {
    const handleConfirmBackAction = () => confirmBackAction(navigation);
    return (
        <TouchableOpacity style={styles.button} onPress={handleConfirmBackAction}>
            <Image style={{width: "100%", height: '100%'}} source="https://img.icons8.com/ios-filled/50/back.png"></Image>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        // backgroundColor: '#ccc',
        // padding: 10,
        borderRadius: 5,
        margin: 20,
        width: 20,
        height: 20,
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        margin: 10,
    },

});