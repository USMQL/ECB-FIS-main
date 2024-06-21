import { Alert, BackHandler } from "react-native";

export function exitApp(){
    Alert.alert("Salir", "¿Está segur@ que desea salir de la aplicación?", [
        { text: "Cancelar", style: "cancel", onPress: () => null },
        { text: "Salir", onPress: () => BackHandler.exitApp() },
    ]);
    return true;
}