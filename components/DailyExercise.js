import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, TouchableOpacity, Alert, View } from 'react-native';
import Constants from 'expo-constants';
import { useState } from 'react';
import { obtenerDocumento } from '../utils/firebaseUtils';

export default function DailyExercise({ navigation, ejercicioDiario, functionOnButtonDisabled, isButtonDisabled }) {
    const [exerciseButtonDisabled, setExerciseButtonDisabled] = useState(false);
    
    const handleGoEjercicioDiario = async () => {
        setExerciseButtonDisabled(true);
        if (functionOnButtonDisabled) functionOnButtonDisabled(true);
        await obtenerDocumento("ejercicios", ejercicioDiario).then((doc) => {
            navigation.navigate("Exercise", {
                ejercicioId: doc.id,
                ejercicioData: doc.data(),
            });
        }).catch((error) => {
            Alert.alert("Ups!", "No se pudo obtener los datos del ejercicio diario. Intente de nuevo más tarde.");
            if (functionOnButtonDisabled) functionOnButtonDisabled(false);
            setExerciseButtonDisabled(false);
        });
        if (functionOnButtonDisabled) functionOnButtonDisabled(false);
        setExerciseButtonDisabled(false);
    }
    return (
        <LinearGradient style={styles.background} colors={['#8752a8', '#4c9bb3']} end={{x: 1.5, y: 1.5}}>
            <View style={styles.container}>
                <Text style={styles.text}>¡Prueba suerte con el ejercicio diario!</Text>
                <TouchableOpacity style={[styles.button]} onPress={handleGoEjercicioDiario} disabled={exerciseButtonDisabled || isButtonDisabled}>
                    <Text style={styles.buttonText}>Ejercicio Diario</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    background: {
        width: '100%',
        height: Constants.statusBarHeight + 56 + 140,
        paddingTop: Constants.statusBarHeight + 56,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16,
    },
    button: {
        height: 40,
        width: 200,
        padding: 10,
        backgroundColor: '#20424d',
        marginTop: 20,
        borderRadius: 20,
        alignItems: 'center',
        elevation: 2,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});