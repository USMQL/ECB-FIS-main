import { requestMediaLibraryPermissionsAsync, launchImageLibraryAsync, MediaTypeOptions } from "expo-image-picker";
import { Alert } from "react-native";

export async function seleccionarImagen() {
    const { status } = await requestMediaLibraryPermissionsAsync();
    if (status === 'granted') {
        let result = await launchImageLibraryAsync({
            mediaTypes: MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
            });
        
            if (!result.canceled) {
                return result.assets[0].uri;
            }
            return null;
    } else {
        Alert.alert('Error','Para poder seleccionar una imagen, necesitamos permisos de acceso a la galería. Por favor, habilite los permisos en la configuración de la aplicación.');
        return null;
    }
}