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
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component';


import LoadingScreen from "./LoadingScreen";
import { GlobalStats } from "../utils/statsGlobales";

export default function StatsScreen({ navigation }) {
  const [loadingUserData, setLoadingUserData] = useState(true);
  const user = auth.currentUser;
  const [refreshing, setRefreshing] = useState(false);
  const [userDB, setUserDB] = useState(null);
  const [users, setUsers] = useState(null);
  let unsubscribeUserDB = () => (null);
  // por cierto al actualizar se coloca como que users es null
  const handleRefreshUsers = async (data) => {
    await setUsers(data);
  }

  const handleRefreshUserDBStats = async (data) => {
    await setUserDB(data);
    setLoadingUserData(false);
  };
  useEffect(() => {
    const upUserDB = async () => {
      unsubscribeUserDB = await subscribeUserDB(handleRefreshUserDBStats);
      await handleRefreshUsers(GlobalStats());
      await refreshUserDB(user);
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


  const TopPuntajes = () => { // tabla de los top 5 puntajes
    const topPuntajes = users._j;

    if (!topPuntajes) {
      return null;
    }

    topPuntajes.sort((a, b) => b[1] - a[1]);

    const userIndex = topPuntajes.findIndex(user => user[0] === auth.currentUser.displayName);
    const userPuntaje = userIndex !== -1 ? topPuntajes[userIndex] : null;

    let top5Puntajes = topPuntajes.slice(0, 5);

    if (userPuntaje && userIndex >= 5) {
      top5Puntajes.push([userIndex + 1, userPuntaje[0], userPuntaje[1]]);
    }

    top5Puntajes = top5Puntajes.map((user, index) => {
      const position = userIndex >= 5 && user[0] === auth.currentUser.displayName ? userIndex + 1 : index + 1;
      return [position, user[0], user[1]];
    });

    const fueradetop = top5Puntajes.slice(3);

    return (
      <>
        <BarChart
          data={{
            labels: top5Puntajes.slice(0, 3).map(user => user[1]),
            datasets: [{
              data: top5Puntajes.slice(0, 3).map(user => user[2]),
            }],
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
            style: { borderRadius: 16 },
          }}
          style={{ marginVertical: 10, borderRadius: 16 }}
        />
        <View >
          <Table borderStyle={{ borderWidth: 1, borderColor: '#63cbfa' }} style={{
            marginVertical: 10,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "#00acfb",
            backgroundColor: "#63cbfa", padding: 10, width: screenWidth - 20
          }}>
            <TableWrapper style={{ flexDirection: 'row' }}>
              <Rows data={fueradetop.map(row => row.slice(0))} flexArr={[1, 2, 1]}  style={{backgroundColor: "#00acfb"}}/>
            </TableWrapper>
          </Table>
        </View>
      </>
    );
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

  if (loadingUserData) {
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
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Top Mundial</Text>
          <TopPuntajes />
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Estadisticas Personales</Text>
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
  head: {
    height: 40,
    backgroundColor: '#f1f8ff',
  },
  text: {
    margin: 6,
    textAlign: 'center'
  },
});
