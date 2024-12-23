import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  RefreshControl,
  ScrollView,
  Dimensions,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import { auth } from "../firebase-config";
import { subscribeUserDB, refreshUserDB } from "../utils/initUser";
import { BarChart } from "react-native-chart-kit";
import { Table, TableWrapper } from "react-native-table-component";

import LoadingScreen from "./LoadingScreen";
import { GlobalStats } from "../utils/statsGlobales";

export default function StatsScreen({ navigation }) {
  const [loadingUserData, setLoadingUserData] = useState(true);
  const user = auth.currentUser;
  const [refreshing, setRefreshing] = useState(false);
  const [userDB, setUserDB] = useState(null);
  const [users, setUsers] = useState(null);
  let unsubscribeUserDB = () => null;
  // por cierto al actualizar se coloca como que users es null
  const handleRefreshUsers = async (data) => {
    await setUsers(data);
  };
  
  const handleRefreshUserDBStats = async (data) => {
    await setUserDB(data);
    await handleRefreshUsers(await GlobalStats());
    setLoadingUserData(false);
  };
  useEffect(() => {
    const upUserDB = async () => {
      unsubscribeUserDB = await subscribeUserDB(handleRefreshUserDBStats);
      await refreshUserDB(user);
    };

    upUserDB();
    return () => unsubscribeUserDB();
  }, [user]);

  // Actualizar datos del usuario.
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refreshUserDB(user).then(() => setRefreshing(false));
  }, []);

  const screenWidth = Dimensions.get("window").width;

  const TopPuntajes = () => {
    // tabla de los top 5 puntajes
    let topPuntajes = users;

    if (!topPuntajes) {
      return null;
    }
    const userName = userDB.displayName;

    topPuntajes.sort((a, b) => b[1] - a[1]);

    const dataUser = topPuntajes.find((user) => user[0] === userName);

    const userIndex = topPuntajes.findIndex((user) => user[0] === userName) + 1;

    let top5Puntajes = topPuntajes.slice(0, 5);

    if (userIndex > 5) {
      top5Puntajes.push([userIndex, dataUser[0], dataUser[1]]);
    }

    top5Puntajes = top5Puntajes.map((user, index) => {
      if (user[1] === dataUser[0]) {
        return [userIndex, dataUser[0], dataUser[1]];
      } else {
        return [
          userIndex >= 5 && user[0] === userName ? userIndex + 1 : index + 1,
          user[0],
          user[1],
        ];
      }
    });
    const fueradetop = top5Puntajes.slice(3);

    return (
      <>
        <BarChart
          data={{
            labels: top5Puntajes.slice(0, 3).map((user) => user[1]),
            datasets: [
              {
                data: top5Puntajes.slice(0, 3).map((user) => user[2]),
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
            style: { borderRadius: 16 },
            propsForVerticalLabels: { fontWeight: "bold" },
          }}
          style={{ marginVertical: 10, borderRadius: 16 }}
        />
        <View>
          <Table
            // borderStyle={{ borderWidth: 1, borderColor: "#63cbfa" }}
            style={{
              marginVertical: 10,
              borderRadius: 16,
              // borderWidth: 1,
              borderColor: "#00acfb",
              backgroundColor: "#63cbfa",
              padding: 10,
              width: screenWidth - 20,
            }}
          >
            <TableWrapper style={{ backgroundColor: "#fffff" }}>
              {fueradetop.map((rowData, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: 10,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "left",
                      flex: 1,
                      color: "#ffff"
                    }}
                  >
                    {rowData[0]}
                  </Text>
                  <Text
                    style={{
                      textAlign: "center",
                      flex: 1,
                      color: "#ffff"
                    }}
                  >
                    {rowData[1]}
                  </Text>
                  <Text
                    style={{
                      textAlign: "right",
                      flex: 1,
                      color: "#ffff"
                    }}
                  >
                    {rowData[2]}
                  </Text>
                </View>
              ))}
            </TableWrapper>
          </Table>
        </View>
      </>
    );
  };

  const GraficoPuntaje = () => {
    // grafico de barras de informacion sobre el puntaje diario y el total
    if (!userDB) {
      return null;
    }
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

  const GraficoRachas = () => {
    // grafico de barras de informacion de las rachas diarias y totales
    if (!userDB) {
      return null;
    }
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

  const InfoGeneral = () => {
    // grafico de barras de informacion general de las estadisticas totales
    if (!userDB) {
      return null;
    }
    const enCurso = userDB.stats.ejerciciosEnCurso.length;
    const intentados = userDB.stats.ejerciciosIntentados.length;
    const terminados = userDB.stats.ejerciciosTerminados.length;
    return (
      <BarChart
        data={{
          labels: ["En Curso", "Intentados", "Terminados"],
          datasets: [
            {
              data: [enCurso, intentados, terminados],
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
    return (
    <View style={styles.container}>
        <LoadingScreen/>
    </View>
)
}
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{paddingBottom: 150}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={{ alignItems: "center", paddingHorizontal: 10 }}>
          {users&& <Text style={{ fontSize: 20, fontWeight: "bold" }}>Top Mundial</Text>}
          {users&& <TopPuntajes />}
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Estadisticas Personales
          </Text>
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
    backgroundColor: "#f1f8ff",
  },
  text: {
    margin: 6,
    textAlign: "center",
  },
});
