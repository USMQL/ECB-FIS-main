import { StatusBar } from 'expo-status-bar';
import { StyleSheet, BackHandler, Text, View, Modal, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { auth } from '../firebase-config'
import { subscribeUserDB, refreshUserDB, updateUserDB } from '../utils/initUser';
import { confirmBackAction } from '../utils/backAction'
import GoBackButton from '../components/GoBackButton';
import { descargarArchivo } from '../utils/firebaseUtils';
import { Image } from 'expo-image';
import LoadingScreen from './LoadingScreen';
import { arrayUnion } from 'firebase/firestore';

export default function ExerciseScreen({ navigation, route }) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const { ejercicioId, ejercicioData } = route.params;
    const [loadingUserData, setLoadingUserData] = useState(true);
    const user = auth.currentUser;
    const [userDB, setUserDB] = useState(null);
    let unsubscribeUserDB = () => (null);
    
    const [resultadoModalVisible, setResultadoModalVisible] = useState(false);
    const [formulaVisible, setFormulaVisible] = useState(false);
    const [respuestaIngresada, setRespuestaIngresada] = useState(null);
    const [puntajeObtenido, setPuntajeObtenido] = useState(ejercicioData.puntaje? Math.abs(ejercicioData.puntaje) : 0);
    const [isRespuestaCorrecta, setIsRespuestaCorrecta] = useState(null);
    const [imagenEjercicio, setImagenEjercicio] = useState(null);
    const [imagenFormula, setImagenFormula] = useState(null);
    async function getImagenes() {
        ejercicioData.imagenURL && setImagenEjercicio(await descargarArchivo(ejercicioData.imagenURL));
        ejercicioData.formulaURL && setImagenFormula(await descargarArchivo(ejercicioData.formulaURL));
    }

    // Cuando se ejecuta refreshUserDB, subscribeUserDB ejecuta la siguiente función.
    const handleRefreshUserDBExercise = async (data) => {
        await setUserDB(data);
        setLoadingUserData(false);
    }
    useEffect(() => {
        // Suscribirse a los cambios en la variable userDB del usuario.
        const upUserDB = async () => {
            unsubscribeUserDB = await subscribeUserDB(handleRefreshUserDBExercise);
            await refreshUserDB(user);
        }
        upUserDB();
        return () => unsubscribeUserDB();
    }, [user]);

    useEffect(() => {
        if (ejercicioData.titulo) {
            navigation.setOptions({ title: ejercicioData.materia });
        }
        navigation.setOptions({
            headerLeft: () => <GoBackButton navigation={navigation} />,
        });
        getImagenes();
    }, []);

    // Función para manejar el cambio en el input de respuesta.
    const handleInputChange = (value) => {
        setRespuestaIngresada(value);
    }
    // Función para enviar la respuesta ingresada.
    const handleEnviarRespuesta = async () => {
        if (!respuestaIngresada) {
            Alert.alert("Hey!", 'Ingrese una respuesta.');
            return;
        }
        // Verificar si la respuesta ingresada es correcta.
        setIsRespuestaCorrecta((ejercicioData.respuesta === respuestaIngresada));
        setResultadoModalVisible(true);
        if (!(ejercicioData.respuesta === respuestaIngresada)) {
            if (puntajeObtenido > 0) setPuntajeObtenido(puntajeObtenido - (puntajeObtenido===1? 1 : 2));
            return;
        }
        setIsRefreshing(true);
        await updateUserDB(user, {
            "stats.ejerciciosTerminados": arrayUnion({
                id: ejercicioId,
                respuestaIngresada: respuestaIngresada,
                isRespuestaCorrecta: isRespuestaCorrecta,
                puntajeObtenido: puntajeObtenido,
            }),
            "stats.ejerciciosTerminadosIds": arrayUnion(ejercicioId),
            "stats.puntajeTotal.ejerciciosGenerados": userDB.stats.puntajeTotal.ejerciciosGenerados + puntajeObtenido,
        });
        setIsRefreshing(false);
        return;
    }

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

    function ResultadoModal() {
        const handleCloseModal = async () => {
            if (isRespuestaCorrecta) {
                setIsRefreshing(true);
                await refreshUserDB(user, userDB);
                setIsRefreshing(false);
                navigation.navigate("Home");
            } else {
                setResultadoModalVisible(!resultadoModalVisible);
            }
        }
        return (
            <Modal visible={resultadoModalVisible} animationType='fade' transparent={true} onRequestClose={handleCloseModal}>
                <View style={resultadoModal.centeredView}>
                    <View style={resultadoModal.modalView}>
                        <Text style={resultadoModal.modalText}>Resultado del ejercicio</Text>
                        {isRespuestaCorrecta? (
                            <Text style={{marginBottom: 20, fontWeight: 'bold'}}>Excelente!</Text>
                        ) : (
                            <Text style={{marginBottom: 20, textAlign: 'center'}}>Vaya, respuesta incorrecta, intenta de nuevo.</Text>
                        )}
                        <Text style={{marginBottom: 20}}>Respuesta ingresada: {respuestaIngresada}</Text>
                        {isRespuestaCorrecta && <Text style={{marginBottom: 20}}>Puntaje obtenido: {puntajeObtenido}</Text>}

                        <TouchableOpacity style={[resultadoModal.button, isRefreshing && resultadoModal.buttonDisabled]} onPress={handleCloseModal} disabled={isRefreshing}>
                        {isRespuestaCorrecta? (
                            <Text style={resultadoModal.buttonText}>Cerrar</Text>
                        ) : (
                            <Text style={resultadoModal.buttonText}>Volver a intentar</Text>
                        )}
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }
    function FormulaModal() {
        return (
            <Modal visible={formulaVisible} animationType="slide" transparent={true} onRequestClose={() => (setFormulaVisible(!formulaVisible))}>
                <View style={stylesModal.centeredView}>
                    <View style={stylesModal.modalView}>
                        <Text style={stylesModal.modalText}>Formula del ejercicio</Text>
                        {imagenFormula? <Image source={imagenFormula} style={{width: "100%", height: 200, marginBottom: 20}} contentFit='contain' /> : <Text style={{marginBottom: 20}}>No hay formula adjunta.</Text>}
                        <Text style={{marginBottom: 20}}>"En la vida, como en física, cada acción tiene su ley, fórmulas de amor y esfuerzo, transforman sueños en fe"</Text>
                        <TouchableOpacity style={[stylesModal.button]} onPress={() => setFormulaVisible(!formulaVisible)}>
                            <Text style={stylesModal.textStyle}>Ocultar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }
    if (loadingUserData) {
        return (<LoadingScreen/>);
    }
    return (
        <View style={{flex: 1, backgroundColor: '#fff'}}>
            <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.description}>{ejercicioData.contenido}</Text>

            {imagenEjercicio && (
                <Image source={imagenEjercicio} style={{width: "100%", height: 200, marginBottom: 20, backgroundColor: '#fff'}} contentFit='contain' />
            )}

            {imagenFormula && (
                <TouchableOpacity style={[stylesModal.button, {marginBottom: 20}]} onPress={() => setFormulaVisible(true)}>
                <Text style={stylesModal.textStyle}>Ver Formula</Text>
                </TouchableOpacity>
            )}

            <View style={styles.answerContainer}>
                <Text style={[styles.subtitle, {marginBottom: 20, textAlign: 'center'}]}>Ingrese su respuesta:</Text>
                
                <View style={{marginBottom: 20}}>
                {ejercicioData.respuestas.length > 1 ? (
                    // Si hay mas de 1 respuesta se mostrará la seccion de respuestas de seleccion mutiple
                    ejercicioData.respuestas.map((respuesta, index) => (
                    <TouchableOpacity style={[styles.respuestaItem, respuestaIngresada === respuesta && styles.selectedRespuestaItem,]}
                        key={index} 
                        onPress={() => handleInputChange(respuesta)}
                    >
                        <Text style={[styles.respuestaItemText, respuestaIngresada === respuesta && styles.selectedRespuestaItemText]}>{respuesta}</Text>
                    </TouchableOpacity>
                    ))
                    ) : (
                    // Si solo hay una respuesta se mostrará un input para ingresar la respuesta.
                    <TextInput style={styles.input}
                        placeholder="Ingrese su respuesta"
                        onChangeText={Text => handleInputChange(Text)}
                        value={respuestaIngresada}
                    />
                )}
                </View>
                
                <TouchableOpacity style={styles.button} onPress={handleEnviarRespuesta}>
                <Text style={styles.buttonText}>Enviar respuesta</Text>
                </TouchableOpacity>
            </View>
            </ScrollView>
            
            {imagenFormula && <FormulaModal/>}
            <ResultadoModal/>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingBottom: 100,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    description: {
        // fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#2a5954',
        padding: 10,
        borderRadius: 20,
        margin: 10,
        elevation: 5,
        shadowColor: '#2d2d2d',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
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
        // borderTopWidth: 1,
        
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    respuestaItem: {
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#eee',
        borderRadius: 5,
    },
    respuestaItemText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
    },
    selectedRespuestaItem: {
        backgroundColor: '#326b75',
    },
    selectedRespuestaItemText: {
        color: '#ddf0ee',
    },
    input: {
        height: 40,
        width: '100%',
        padding: 10,
        marginTop: 5,
        // marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 10,
        textAlignVertical: 'top',
        textAlign: 'left',
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
        backgroundColor: '#fffe',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        padding: 35,
        paddingBottom: 50,
        alignItems: 'center',
        shadowColor: '#000',
        // shadowOpacity: 0.25,
        shadowRadius: 500,
        elevation: 5,
      },
      button: {
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        width: "50%",
        borderRadius: 20,
        padding: 10,
        elevation: 2,
      },
      textStyle: {
        color: '#000',
        fontWeight: 'bold',
      },
      modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontWeight: 'bold',
      },
});

const resultadoModal = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
      },
      modalView: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 500,
        elevation: 5,
      },
      modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
      },
      button: {
        width: '80%',
        alignItems: 'center',
        backgroundColor: '#2a5954',
        padding: 10,
        borderRadius: 20,
        margin: 10,
        elevation: 5,
        shadowColor: '#2d2d2d',
      },
      buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
      },
      buttonDisabled: {
        backgroundColor: '#ccc',
      },
});