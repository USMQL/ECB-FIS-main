import { Text, View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function LoadingScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ marginBottom: 20 }}>ECB-FIS</Text>
            <ActivityIndicator size="large" color="#0000ff" />
            <StatusBar style="auto" />
        </View>
    );
}