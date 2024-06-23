import { StatusBar } from "expo-status-bar";
import {
    StyleSheet,
    BackHandler,
    Text,
    View,
    TouchableOpacity,
    RefreshControl,
    ScrollView,
    Dimensions,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import { auth } from "../firebase-config";
import { subscribeUserDB, refreshUserDB } from "../utils/initUser";
import { exitApp } from "../utils/backAction";
import { getUserDB } from "../utils/initUser";
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart,
} from "react-native-chart-kit";
import LoadingScreen from "./LoadingScreen";

export default function StatsScreen({ navigation }) {
    const user = auth.currentUser;
    const [userDB, setUserDB] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    let unsubscribeUserDB = null;

    const handleRefreshUserDBStats = async (data) => {
        await setUserDB(data);
    };
    
    useEffect(() => {
        const upUserDB = async () => {
            unsubscribeUserDB = await subscribeUserDB(handleRefreshUserDBStats);
            await refreshUserDB(user);
            setLoading(false);
        };
        upUserDB();
        return () => unsubscribeUserDB();
    }, [user]);
    
    // Salir de la aplicación.
    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            exitApp
        );
        return () => backHandler.remove();
    }, []);
    
    // Actualizar datos del usuario.
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        refreshUserDB(user).then(() => setRefreshing(false));
    }, []);

    const screenWidth = Dimensions.get("window").width;

    const chartConfig = {
        backgroundColor: "#e26a00",
        backgroundGradientFrom: "#63cbfa",
        backgroundGradientTo: "#00acfb",
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        useShadowColorFromDataset: false, // optional
    };

    const GraficoPor = () => {
        return (
            <ProgressChart
                data={{
                    labels: ["P.Acierto"], 
                    data: [0],
                }}
                width={screenWidth - 90}
                height={220}
                strokeWidth={16}
                radius={60}
                chartConfig={chartConfig}
                style={{
                    alignItems: "center", 
                    marginVertical: 8,
                    borderRadius: 16,
                }}
                hideLegend={false}
            />
        );
    };

    const GraficoPorEjeDiario = () => { //solo le cambie el name =/
        return (
            <ProgressChart
                data={{
                    labels: ["P.Acierto"], // optional
                    data: [0.0],
                }}
                width={screenWidth - 90}
                height={220}
                strokeWidth={16}
                radius={60}
                chartConfig={chartConfig}
                style={{
                    marginVertical: 8,
                    borderRadius: 16,
                }}
                hideLegend={false}
            />
        );
    };

    const RankingTop = () => {
        return null;
    }
            

    const InfoGeneral = () => { // grafico de barras de informacion general de las estadisticas totales
        const creados = userDB.stats.ejerciciosCreados.length;
        const enCurso = userDB.stats.ejerciciosEnCurso.length;
        const intentados = userDB.stats.ejerciciosIntentados.length;
        const terminados = userDB.stats.ejerciciosTerminados.length;
        return (
            <BarChart
                data={{
                    labels: ["Creados", "En Curso", "Intentados", "Terminados"],
                    datasets: [
                        {
                            data: [creados, enCurso, intentados, terminados],
                        },
                    ],
                }}
                width={screenWidth - 20}
                height={220}
                yAxisLabel=""
                chartConfig={{
                    backgroundColor: "#e26a00",
                    backgroundGradientFrom: "#63cbfa",
                    backgroundGradientTo: "#00acfb",
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                        borderRadius: 16,
                    },
                }}
                style={{
                    marginVertical: 10,
                    borderRadius: 16,
                }}
            />
        );
    };
    // al no llegar de una los datos necesitas la pantalla de carga si no muestars la pantalla en blanco
    if (loading) {
        return <LoadingScreen />;
    }
    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.container} refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                    <View style={{ alignItems: "center", padding: 10 }}>
                <GraficoPor />
                <GraficoPorEjeDiario />
                <InfoGeneral />
                </View>
            </ScrollView>
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
        fontSize: 20,
        fontWeight: "bold",
    },
});


/* fino
{ 
"avatar": null, 
"bio": null, 
"disabled": false, 
"displayName": "juan", 
"email": "juan@gmail.com", 
"emailVerified": false, 
"isAdmin": false, 
"isAnonymous": false, 
"isProfesor": false, 
"stats": {"ejerciciosCreados": [], 
    "ejerciciosEnCurso": [], 
    "ejerciciosIntentados": [], 
    "ejerciciosTerminados": [], 
    "logros": [], 
    "puntajeTotal": {"ejerciciosDiarios": 0, 
        "ejerciciosGenerados": 0}, 
"rachaEjerciciosDiarios": 0, 
"rachaEjerciciosGenerados": 0, 
"recompensas": []}, 
"visibilitySettings": {"showAvatar": true, 
    "showBio": true, 
    "showEmail": false, 
    "showLogros": true, 
    "showPuntajeTotal": true, 
    "showRacha": true, 
    "showRecompensas": true}
}

mira cada lista que vez es realmente el identificador una lista donde se guardarian todos
los identificadores (logros, recompensas, ejerciciosCreados, ejerciciosEnCurso, ejerciciosIntentados, ejerciciosTerminados)
donde con el identificador se puede buscar la informacion directa en ese objeto por eso al hacer lenght se obtiene la cantidad de elementos
mentos
*/