import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { useEffect, useState } from 'react';
import { auth } from './firebase-config';

// Pantallas.
import LoadingScreen from './screens/LoadingScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';

// Componentes.
import SignOutButton from './components/SignOutButton';

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
    return (<LoadingScreen/>);
  }
  
  return (
    <NavigationContainer>
      {!user ? (
        // El usuario no se encuentra logeado.
        <Stack.Navigator initialRouteName={'Login'}>
          <Stack.Screen name="Login" component={LoginScreen} options={{
            title: '',
            headerTransparent: true,
          }}/>
        </Stack.Navigator>
      ) : (
        // El usuario se encuentra logeado.
        <Stack.Navigator initialRouteName={'Home'}>
          <Stack.Screen name="Home" component={HomeScreen} options={{
            title: 'Inicio',
            headerTransparent: true,
            headerTitleAlign: 'center',
            headerTintColor: '#000',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerLeft: () => (<SignOutButton/>),
          }}/>
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
