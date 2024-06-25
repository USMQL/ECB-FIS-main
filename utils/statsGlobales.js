import { Alert } from "react-native";
import { obtenerColeccion } from "./firebaseUtils";

export async function GlobalStats(){
    try{
        const globalStats = [];

        const global = await obtenerColeccion("users");
        const globalDisponibles = global.docs.forEach((doc) => (
            globalStats.push([doc.data().displayName, doc.data().stats.puntajeTotal.ejerciciosGenerados]) //asi se guardaria la lista de stats? de cada persona, sis aunque me di cuenta que no van a salir los nombres de los usuarios ya que estan en doc.data().displayName
        ));
        return globalStats;
    } catch(error){
        console.error("Error al intentar obtener la colección de usuarios", error);
        Alert.alert("Ups!", "Ha ocurrido un error al intentar obtener la colección de usuarios");
    }
}
