import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

let TouchableOpacity;
if (Platform.OS === 'ios') {
  ({ TouchableOpacity } = require('react-native-gesture-handler'));
} else {
  ({ TouchableOpacity } = require('react-native'));
}

const ConComprasPorComprador = () => {
  return (
    <View style={styles.container}>
      <Text>Consultas - Comrpas por Compradores en un Período</Text>
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

export default ConComprasPorComprador;
