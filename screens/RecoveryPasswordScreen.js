import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  BackHandler,
} from "react-native";
import { useEffect, useState } from "react";

import { auth } from "../firebase-config";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { exitApp } from "../utils/backAction";

const errorMessages = {
  "auth/network-request-failed":
    "Error de red, verifique su conexión a internet",
  "auth/invalid-email": "La dirección de correo electrónico no es válida",
};

export default function RecoveryPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const auth = getAuth();

  // Salir de la aplicación.
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      exitApp
    );
    return () => backHandler.remove();
  }, []);

  // Recuperar contraseña
  const handleButton = async () => {
    if (email === "") {
      Alert.alert("Ups!", "Ingrese un correo electrónico");
      return;
    }
    await sendPasswordResetEmail(auth, email)
      .then(() => {
        Alert.alert("Exito", "Correo de recuperación enviado");
      })
      .catch((error) => {
        Alert.alert("Ups!", errorMessages[error.code] || error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title]}>ECB-FIS</Text>
      <Text style={{ fontSize: 30, marginBottom: 20, fontWeight: "bold" }}>
        Recuperar contraseña
      </Text>

      <Text style={styles.label}>Correo electrónico</Text>
      <TextInput
        onChangeText={(text) => setEmail(text)}
        style={[styles.input, { marginBottom: 20 }]}
        placeholder="email@dominio.com"
        keyboardType="email-address"
      />

      <TouchableOpacity onPress={handleButton} style={styles.button}>
        <Text style={{ color: "white", fontWeight: "bold" }}>
          Enviar correo de recuperación
        </Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
  },
  label: {
    fontWeight: "bold",
  },
  input: {
    height: 40,
    width: 300,
    padding: 10,
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
  },
  button: {
    height: 40,
    width: 300,
    padding: 10,
    backgroundColor: "#000",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
});
