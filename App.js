import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { Text, View, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';

import { auth } from './firebase-config';

import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';

const Stack = createStackNavigator();

export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ marginBottom: 20 }}>ECB-FIS</Text>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={ user ? ('Home'):('Login')}>
        <Stack.Screen name="Login" component={LoginScreen} options={{
          title: '',
          headerTransparent: true,
          headerTitleAlign: 'center',
          headerTintColor: '#000',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerLeft: () => (<></>),
        }}/>
        <Stack.Screen name="Home" component={HomeScreen} options={{
          title: 'Inicio',
          headerTransparent: true,
          headerTitleAlign: 'center',
          headerTintColor: '#000',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerLeft: () => (<></>),
        }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
