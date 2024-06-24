import { Alert, BackHandler } from "react-native";

export function exitApp(){
    Alert.alert("Salir", "¿Está segur@ que desea salir de la aplicación?", [
        { text: "Cancelar", style: "cancel", onPress: () => null },
        { text: "Salir", onPress: () => BackHandler.exitApp() },
    ]);
    return true;
}

export function confirmBackAction(navigation){
    Alert.alert("Volver", "¿Está segur@ que desea volver? Cualquier cambio no guardado se perderá.", [
        { text: "Cancelar", style: "cancel", onPress: () => null },
        { text: "Volver", onPress: () => navigation.goBack() },
    ]);
    return true;
}