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
  SafeAreaView,
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

  const chartConfig = { // estoy que lo borro
    backgroundColor: "#e26a00",
    backgroundGradientFrom: "#63cbfa",
    backgroundGradientTo: "#00acfb",
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    useShadowColorFromDataset: false, // optional
  };

  const GraficoPuntaje = () => { // grafico de barras de informacion sobre el puntaje diario y el total
    const puntajeTotal = userDB.stats.puntajeTotal;
    return (
      <BarChart
        data={{
          labels: ["Puntaje diario", "Puntaje Total"],
          datasets: [
            {
              data: [
                puntajeTotal.ejerciciosDiarios,
                puntajeTotal.ejerciciosGenerados,
              ],
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

  const GraficoRachas = () => { // grafico de barras de informacion de las rachas diarias y totales
    const rachaEjerciciosDiarios = userDB.stats.rachaEjerciciosDiarios;
    const rachaEjerciciosGenerados = userDB.stats.rachaEjerciciosGenerados;

    return (
      <BarChart
        data={{
          labels: ["Racha Diarios", "Racha Generados"],
          datasets: [
            {
              data: [rachaEjerciciosDiarios, rachaEjerciciosGenerados],
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

  const InfoGeneral = () => {// grafico de barras de informacion general de las estadisticas totales
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
          marginVertical: 5,
          borderRadius: 16,
        }}
      />
    );
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={{ alignItems: "center", padding: 10 }}>
          <InfoGeneral />
          <GraficoPuntaje />
          <GraficoRachas />
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
});
