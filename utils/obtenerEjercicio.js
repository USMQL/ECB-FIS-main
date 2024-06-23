import { Alert } from "react-native";
import { obtenerColeccion } from "./firebaseUtils";

export async function seleccionarEjercicioAleatorio(userData){
    if (!userData) throw new Error("No se ha proporcionado los datos del usuario");

    try{
        const ejercicios = await obtenerColeccion("ejercicios");
        const ejerciciosDisponibles = ejercicios.docs.filter((doc) => (
            !doc.data().disabled && doc.data().tipoEjercicio === "Normal" && !userData.stats.ejerciciosTerminados.includes(doc.id)
        ));
        if (ejerciciosDisponibles.length === 0) return null;
        if (ejerciciosDisponibles.length === 1) return ejerciciosDisponibles[0];

        const index = Math.floor(Math.random() * ejerciciosDisponibles.length);

        return ejerciciosDisponibles[index];
    } catch(error){
        console.error("Error al intentar obtener la colección de ejercicios", error);
        Alert.alert("Ups!", "Ha ocurrido un error al intentar obtener la colección de ejercicios");
    }
}