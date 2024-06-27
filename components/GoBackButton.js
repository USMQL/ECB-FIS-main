import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { confirmBackAction } from '../utils/backAction';
import { Ionicons } from '@expo/vector-icons';


export default function GoBackButton({ navigation }) {
    const handleConfirmBackAction = () => confirmBackAction(navigation);
    return (
        <TouchableOpacity style={styles.button} onPress={handleConfirmBackAction}>
            <Ionicons name="arrow-back" size={24} color="black" />
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