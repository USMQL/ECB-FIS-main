import { View, Text, StyleSheet } from 'react-native';

export default Saludo = () => {
  const getSaludoActual = () => {
    const currentHour = new Date().getHours();
    
    if (currentHour < 6) {
      return 'Buenas noches!';
    } else if (currentHour < 12) {
      return 'Buenos días!';
    } else if (currentHour < 19) {
      return 'Buenas tardes!';
    } else {
      return 'Buenas noches!';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greetingText}>{getSaludoActual()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff'
  },
});

