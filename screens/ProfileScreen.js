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


<TextInput
                style={styles.input}
                placeholder="Fuerzas, vectores, etc."
                value={formData.materia}
                onChangeText={text => handleInputChange('materia', text)}
            />