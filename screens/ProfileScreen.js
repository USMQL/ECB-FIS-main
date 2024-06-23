import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';

const ProfileScreen = () => {
  const [text, setText] = useState('');

  const handlePress = () => {
    Alert.alert('Button Pressed', `You entered: ${text}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Simple UI</Text>
      <TextInput
        style={styles.input}
        placeholder="aaaaaaaaa"
        value={text}
        onChangeText={setText}
      />
      <Button title="Press Me" onPress={handlePress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 8,
    marginBottom: 20,
    width: '100%',
  },
});

export default ProfileScreen;
