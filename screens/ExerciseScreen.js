import { StatusBar } from 'expo-status-bar';
import { StyleSheet, BackHandler, Text, View, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { auth } from '../firebase-config'
import { subscribeUserDB, refreshUserDB } from '../utils/initUser';
import { confirmBackAction } from '../utils/backAction'
import GoBackButton from '../components/GoBackButton';
import { descargarArchivo } from '../utils/firebaseUtils';
import { Image } from 'expo-image';


export default function ExerciseScreen({ navigation, route }) {
    const { ejercicioId, ejercicioData } = route.params;
    // const user = auth.currentUser;
    const [userDB, setUserDB] = useState(null);
    let unsubscribeUserDB = null;
    const [formulaVisible, setFormulaVisible] = useState(true);
    
    const [imagenEjercicio, setImagenEjercicio] = useState(null);
    const [imagenFormula, setImagenFormula] = useState(null);
    async function getImagenes() {
        ejercicioData.imagenURL && setImagenEjercicio(await descargarArchivo(ejercicioData.imagenURL));
        ejercicioData.formulaURL && setImagenFormula(await descargarArchivo(ejercicioData.formulaURL));
    }

    // // Cuando se ejecuta refreshUserDB, subscribeUserDB ejecuta la siguiente función.
    // const handleRefreshUserDBExercise = async (data) => {
    //     await setUserDB(data);
    // }
    // useEffect(() => {
    //     // Suscribirse a los cambios en la variable userDB del usuario.
    //     const upUserDB = async () => {
    //         unsubscribeUserDB = await subscribeUserDB(handleRefreshUserDBExercise);
    //         await refreshUserDB(user);
    //     }
    //     upUserDB();
    //     return () => unsubscribeUserDB();
    // }, [user]);

    useEffect(() => {
        if (ejercicioData.titulo) {
            navigation.setOptions({ title: ejercicioData.materia });
        }
        navigation.setOptions({
            headerLeft: () => <GoBackButton navigation={navigation} />,
        });
        getImagenes();
    }, []);

    // Volver a la pantalla anterior.
    useEffect(() => {
        navigation.addListener('beforeRemove', (e) => {
            e.preventDefault();
            confirmBackAction(navigation);
        });
        return () => navigation.removeListener('beforeRemove');
    }, []);
    useEffect(() => {
        const backHandler = BackHandler.addEventListener("hardwareBackPress", () => confirmBackAction(navigation));
        return () => backHandler.remove();
    }, []);

    function FormulaModal() {
        return (
            <Modal visible={formulaVisible} animationType="slide" transparent={true} onRequestClose={() => (setFormulaVisible(!formulaVisible))}>
            <View style={stylesModal.centeredView} onPress={() => setFormulaVisible(!formulaVisible)}>
                <View style={stylesModal.modalView}>
                    <Text style={stylesModal.modalText}>Formula del ejercicio</Text>
                    {imagenFormula? <Image source={imagenFormula} style={{width: "100%", height: 200, marginBottom: 20}} contentFit='contain' /> : <Text style={{marginBottom: 20}}>No hay formula adjunta.</Text>}
                    <TouchableOpacity style={[stylesModal.button]} onPress={() => setFormulaVisible(!formulaVisible)}>
                    <Text style={stylesModal.textStyle}>Ocultar</Text>
                    </TouchableOpacity>
                </View>
            </View>
            </Modal>
        );
    }
    return (
        <View style={{flex: 1}}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={{marginBottom: 20, textAlign: 'center'}}>{ejercicioData.contenido}</Text>
                {imagenEjercicio && <Image source={imagenEjercicio} style={{width: "100%", height: 200, marginBottom: 20}} contentFit='contain' />}
                {/* <Text style={styles.title}>{ejercicioData.titulo}</Text> */}
                {imagenFormula && (
                    <TouchableOpacity style={[stylesModal.button, {marginBottom: 20}]} onPress={() => setFormulaVisible(true)}>
                        <Text style={stylesModal.textStyle}>Ver Formula</Text>
                    </TouchableOpacity>
                )}
                <View style={styles.answerContainer}>
                    <Text style={[styles.subtitle, {marginBottom: 20}]}>Ingrese su respuesta:</Text>
                    {/* {ejercicioData && ejercicioData.respuestas.forEach((element) => {
                        return (
                        <Text>holaf3f3fw3 {element}</Text>);
                    })} */}
                        
                    
                </View>
            </ScrollView>
            {imagenFormula && <FormulaModal/>}
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        margin: 20,
    },
    button: {
        backgroundColor: '#000',
        padding: 10,
        borderRadius: 5,
        margin: 10,
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        margin: 10,
    },
    answerContainer: {
        flex: 1,
        width: '100%',
        borderColor: '#ccc',
        padding: 20,
        // alignItems: 'center',
        borderTopWidth: 1,
        
    },
    subtitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },

});

const stylesModal = StyleSheet.create({
    centeredView: {
        flex: 1,
        // backgroundColor: 'rgba(0,0,0,0.1)',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 22,
      },
      modalView: {
        width: '100%',
        // marginBottom: 20,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderWidth: 1,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        // shadowOpacity: 0.25,
        shadowRadius: 500,
        elevation: 5,
      },
      button: {
        backgroundColor: '#000',
        width: "50%",
        borderRadius: 20,
        padding: 10,
        elevation: 2,
      },
      textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
      },
      modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontWeight: 'bold',
      },
});