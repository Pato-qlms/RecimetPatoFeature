import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

let TouchableOpacity;
if (Platform.OS === 'ios') {
  ({ TouchableOpacity } = require('react-native-gesture-handler'));
} else {
  ({ TouchableOpacity } = require('react-native'));
}

const ConCataComprados = () => {
  return (
    <View style={styles.container}>
      <Text>Consultas - Catalizadores Comprados en un Período</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ConCataComprados;
