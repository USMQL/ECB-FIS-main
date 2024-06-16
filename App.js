import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useEffect, useState } from 'react';
import { auth } from './firebase-config';

// Pantallas.
import LoadingScreen from './screens/LoadingScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import UploadScreen from './screens/UploadScreen';

// Componentes.
import SignOutButton from './components/SignOutButton';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

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
        <Tab.Navigator initialRouteName={'Home'} screenOptions={tabNavigatorScreenOptions}>
          <Tab.Screen name="Home" component={HomeScreen} options={{
            title: 'Inicio',
            // headerTransparent: true,
            headerStyle: {
              backgroundColor: '#fff',
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTitleAlign: 'center',
            headerTintColor: '#000',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerLeft: () => (<SignOutButton/>),
          }}/>
          <Tab.Screen name="Upload" component={UploadScreen} options={{
            title: 'Subir Ejercicio',
            // headerTransparent: true,
            headerStyle: {
              backgroundColor: '#fff',
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTitleAlign: 'center',
            headerTintColor: '#000',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}/>
        </Tab.Navigator>
      )}
    </NavigationContainer>
  );
}

const tabNavigatorScreenOptions = {
  tabBarStyle: {
    // position: 'absolute',
    height: 80,
    paddingBottom: 10,
  },
  tabBarLabelStyle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
}