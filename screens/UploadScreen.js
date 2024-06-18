import { StatusBar } from 'expo-status-bar';
import { Image, View, StyleSheet, TouchableOpacity, TextInput, ScrollView, Text, Alert } from 'react-native';
import { useState } from 'react';

import { auth } from '../firebase-config';
import { agregarDocumento, subirArchivo } from '../utils/firebaseUtils';
import { seleccionarImagen } from '../utils/seleccionarImagen';
import { Picker } from '@react-native-picker/picker';

export default function UploadScreen() {
    const [loading, setLoading] = useState(false);
    const [ejercicioImg, setEjercicioImg] = useState(null);
    const [formulaImg, setFormulaImg] = useState(null);

    const [formData, setFormData] = useState({
        titulo: '', // Título del ejercicio.
        descripcion: '', // De que trata el ejercicio.
        materia: '', // Materia a la que pertenece el ejercicio.
        contenido: '', // Enunciado del ejercicio.
        imagenURL: null, // URL de la imagen del ejercicio.
        formulaURL: null, // URL de la formula del ejercicio.
        respuestas: '', // Posibles respuestas del ejercicio.
        respuesta: '', // Respuesta del ejercicio.
        dificultad: 'Medio', // Dificultad del ejercicio.
        puntaje: 0, // Puntaje del ejercicio.
        tipoEjercicio: 'Normal', // Ejercicio "Diario" o "Normal".
        tiempo: 0, // Tiempo en segundos para resolver el ejercicio.
        retroalimentacion: '', // Retroalimentación del ejercicio.
        foro: null,
        reportado: null,
        publicadoPor: '', // UID del usuario que publicó el ejercicio.
        disabled: false,
    });

    // Seleccionar una imagen de la galería.
    const handleSeleccionarImagenEjercicio = async () => {
        const result = await seleccionarImagen();
        if (result){
            setEjercicioImg(result);
        }
    };
    const handleSeleccionarImagenFormula = async () => {
        const result = await seleccionarImagen();
        if (result){
            setFormulaImg(result);
        }
    };
    // Actualizar el estado del formulario.
    const handleInputChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };
    // Enviar el formulario a la base de datos.
    const handleSubmit = async () => {
        try{
            setLoading(true);
            const imagenRef = await subirArchivo(ejercicioImg, 'ejercicios');
            const formulaRef = await subirArchivo(formulaImg, 'ejercicios-formulas');
            
            const exerciseData = {
                ...formData,
                respuestas: formData.respuestas.split(',').map(r => r.trim()), // Convertir la cadena de respuestas en un array.
                puntaje: parseInt(formData.puntaje, 10),
                tiempo: parseInt(formData.tiempo, 10),
                publicadoPor: auth.currentUser.uid,
                imagenURL: imagenRef,
                formulaURL: formulaRef,
            };

            const docId = await agregarDocumento("ejercicios", exerciseData);
            console.log('Ejercicio añadido con ID: ', docId);
            Alert.alert('Exito', `Ejercicio con id ${docId} añadido con exito`);
        } catch (error) {
            console.error('Error añadiendo el ejercicio: ', error);
            Alert.alert('Ups!', 'Error añadiendo el ejercicio: ', error.message);
        }
        setLoading(false);
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.label}>Título (opcional)</Text>
            <TextInput
                style={styles.input}
                placeholder="Título del ejercicio"
                value={formData.titulo}
                onChangeText={text => handleInputChange('titulo', text)}
            />
            <Text style={styles.label}>Descripción (opcional)</Text>
            <TextInput
                style={styles.input}
                placeholder="de que trata el ejercicio"
                value={formData.descripcion}
                onChangeText={text => handleInputChange('descripcion', text)}
            />
            <Text style={styles.label}>Materia</Text>
            <TextInput
                style={styles.input}
                placeholder="Fuerzas, vectores, etc."
                value={formData.materia}
                onChangeText={text => handleInputChange('materia', text)}
            />
            <Text style={styles.label}>Contenido</Text>
            <TextInput
                style={styles.input}
                placeholder="Texto del ejercicio"
                value={formData.contenido}
                onChangeText={text => handleInputChange('contenido', text)}
            />
            <View style={styles.row}>
                <View style={{marginRight: 40}}>
                    <Text style={styles.label}>Imagen URL</Text>
                    <TouchableOpacity onPress={handleSeleccionarImagenEjercicio} style={styles.button}>
                        <Text style={{color: 'white', fontWeight: 'bold'}}>Subir imagen</Text>
                    </TouchableOpacity>
                </View>
                {ejercicioImg && <Image source={{ uri: ejercicioImg }} style={styles.image} />}
            </View>
            <View style={styles.row}>
                <View style={{marginRight: 40}}>
                    <Text style={styles.label}>Formula URL</Text>
                    <TouchableOpacity onPress={handleSeleccionarImagenFormula} style={styles.button}>
                        <Text style={{color: 'white', fontWeight: 'bold'}}>Subir imagen</Text>
                    </TouchableOpacity>
                </View>
                {formulaImg && <Image source={{ uri: formulaImg }} style={styles.image} />}
            </View>
            <Text style={styles.label}>Respuesta</Text>
            <TextInput
                style={styles.input}
                placeholder="Respuesta correcta"
                value={formData.respuesta}
                onChangeText={text => handleInputChange('respuesta', text)}
            />
            <Text style={styles.label}>Respuestas (opcional)</Text>
            <Text style={{color: '#aaa'}}>En caso de ser un ejercicio de alternativas, ingrese sus respuestas (tambien debe ingresar la respuesta correcta y debe coincidir con el de arriba).</Text>
            <TextInput
                style={styles.input}
                placeholder="Posibles respuestas (separadas por coma)"
                value={formData.respuestas}
                onChangeText={text => handleInputChange('respuestas', text)}
            />
            <Text style={styles.label}>Dificultad</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={formData.dificultad}
                    style={styles.picker}
                    onValueChange={(itemValue, itemIndex) => handleInputChange('dificultad', itemValue)}
                >
                    <Picker.Item label="Fácil" value="Fácil" />
                    <Picker.Item label="Medio" value="Medio" />
                    <Picker.Item label="Difícil" value="Difícil" />
                </Picker>
            </View>
            <Text style={styles.label}>Puntaje (número entero)</Text>
            <TextInput
                style={styles.input}
                placeholder="Puntaje"
                value={formData.puntaje.toString()}
                keyboardType="numeric"
                onChangeText={text => handleInputChange('puntaje', text)}
            />
            <Text style={styles.label}>Tipo de Ejercicio</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={formData.tipoEjercicio}
                    style={styles.picker}
                    onValueChange={(itemValue, itemIndex) => handleInputChange('tipoEjercicio', itemValue)}
                >
                    <Picker.Item label="Diario" value="Diario" />
                    <Picker.Item label="Normal" value="Normal" />
                </Picker>
            </View>
            <Text style={styles.label}>Tiempo (en segundos) (opcional)</Text>
            <TextInput
                style={styles.input}
                placeholder="Tiempo (en segundos)"
                value={formData.tiempo.toString()}
                keyboardType="numeric"
                onChangeText={text => handleInputChange('tiempo', text)}
            />
            <Text style={styles.label}>Retroalimentación (opcional)</Text>
            <TextInput
                style={styles.input}
                placeholder="Retroalimentación del ejercicio"
                value={formData.retroalimentacion}
                onChangeText={text => handleInputChange('retroalimentacion', text)}
            />
            <TouchableOpacity onPress={handleSubmit} style={[!loading ? (styles.button):(styles.buttonDisabled), {width: '100%'}]} disabled={loading}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>{!loading ? ('Enviar a la base de datos'):('Enviando...') }</Text>
            </TouchableOpacity>
            <Text>
                {JSON.stringify(formData, null, 2)}
            </Text>
            
            <StatusBar style="auto" />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
    },
    row: {
        flexDirection: 'row',
        // alignItems: 'center',
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    label: {
        // fontSize: 12,
        fontWeight: 'bold',
    },
    input: {
        height: 40,
        width: '100%',
        padding: 10,
        marginTop: 5,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 10,
    },
    pickerContainer: {
        height: 40,
        width: '100%',
        padding: 10,
        marginTop: 5,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 10,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    picker: {
        width: '100%',
    },
    button: {
        height: 40,
        width: 150,
        padding: 10,
        backgroundColor: '#000',
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 5,
    },
    buttonDisabled: {
        height: 40,
        width: 150,
        padding: 10,
        backgroundColor: '#aaa',
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 5,
    },
});
