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
import StatsScreen from './screens/StatsScreen';
import ExerciseScreen from './screens/ExerciseScreen';

// Componentes.
import SignOutButton from './components/SignOutButton';
import RecPasswordScreen from './screens/RecPasswordScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Saludo from './components/Saludo';
import ProfileHomeButton from './components/ProfileHomeButton';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userdb, setUserdb] = useState(null);
  let unsubscribeUserDB = () => (null);

  const handleRefreshUserDBApp = async (data) => {
    await setUserdb(data);
  }
  useEffect(() => {
    const suscribirCambiosUserDB = async () => {
      unsubscribeUserDB = await subscribeUserDB(handleRefreshUserDBApp);
    }
    suscribirCambiosUserDB();
    return () => (unsubscribeUserDB());
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user){
        await refreshUserDB(user);
      }
      setLoading(false);
    });
    return () => (unsubscribe());
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
          <Stack.Screen name="RecuperarContrasena" component={RecPasswordScreen} options={{
            title: '',
            headerTransparent: true,
            headerTitleAlign: 'center',
            headerBackTitle: "Volver",
            headerBackTitleVisible: true,
            headerBackTitleStyle: {fontWeight: 'bold'},
          }}/>
        </Stack.Navigator>
      ) : (
        // El usuario se encuentra logeado.
      <Tab.Navigator initialRouteName={'Home'} screenOptions={tabNavigatorScreenOptions}>
        <Tab.Screen name="Home" component={HomeScreen} options={{
          title: 'Inicio',
          headerTitle: (props) => (<Saludo/>),
          headerRight: (props) => (<ProfileHomeButton userData={userdb}/>),
          headerTitleAlign: 'left',
          headerTransparent: true,
          tabBarIcon: ({focused, color, size}) => (
            <MaterialCommunityIcons name="home" color={color} size={30}/>
          ),
        }}/>
        <Tab.Screen name="Stats" component={StatsScreen} options={{
          title: 'Estadisticas',
          tabBarIcon: ({focused, color, size}) => (
            <MaterialCommunityIcons name="chart-bar" color={color} size={30}/>
          ),
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
        {userdb?.isProfesor ? (
        <Tab.Screen name="Upload" component={UploadScreen} options={{
          title: 'Subir Ejercicio',
          tabBarIcon: ({focused, color, size}) => (
            <MaterialCommunityIcons name="upload" color={color} size={30}/>
          ),
        }}/>
        ):(null)}
        <Tab.Screen name="Exercise" component={ExerciseScreen} options={{
          title: 'Ejercicio',
          tabBarStyle: {display: 'none'},
          tabBarItemStyle: {display: 'none'},
          unmountOnBlur: true,
          
        }}/>
      </Tab.Navigator>
      )}
    </NavigationContainer>
  );
}

const tabNavigatorScreenOptions = {
  // --- TabBar ---
  tabBarStyle: {
    // position: 'absolute',
    height: 80,
    paddingBottom: 10,
    paddingTop: 10,
    elevation: 0,
  },
  tabBarLabelStyle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  
  // --- Header ---
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
}