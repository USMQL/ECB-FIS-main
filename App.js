import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useEffect, useState } from 'react';
import { auth } from './firebase-config';
import { refreshUserDB, subscribeUserDB } from './utils/initUser';

// Pantallas.
import LoadingScreen from './screens/LoadingScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import UploadScreen from './screens/UploadScreen';

// Componentes.
import SignOutButton from './components/SignOutButton';
import RecoveryPasswordScreen from './screens/RecPasswordScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userdb, setUserdb] = useState(null);
  let unsubscribeUserDB = null;

  const handleRefreshUserDBApp = async (data) => {
    await setUserdb(data);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user){
        await unsubscribeUserDB;
        unsubscribeUserDB = await subscribeUserDB(handleRefreshUserDBApp);
        await refreshUserDB(user);
      }
      setLoading(false);
    });
    return () => {
      unsubscribeUserDB();
      unsubscribe();
    };
  }, []);

  if (loading) {
    return (<LoadingScreen/>);
  }
  
  return (
    <NavigationContainer>
      {!user? (
        // El usuario no se encuentra logeado.
        <Stack.Navigator initialRouteName={'Login'}>
          <Stack.Screen name="Login" component={LoginScreen} options={{
            title: '',
            headerTransparent: true,
          }}/>
          <Stack.Screen name="RecuperarContrasena" component={RecoveryPasswordScreen} options={{
            title: '',
            headerTransparent: true,
            headerBackTitle: "volver",
            headerBackTitleStyle: {
              color: '#000',
              fontWeight: 'bold',
            }
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
          {userdb?.isProfesor ? (
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
          ):(null)}
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