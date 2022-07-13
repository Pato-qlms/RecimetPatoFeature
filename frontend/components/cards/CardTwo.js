import React from 'react'

import { Platform, StyleSheet, Text, View } from 'react-native'

let TouchableOpacity
if (Platform.OS === 'ios') {
  ;({ TouchableOpacity } = require('react-native-gesture-handler'))
} else {
  ;({ TouchableOpacity } = require('react-native'))
}

import colors from '../../assets/colors'

const CardTwo = ({ navigation, route, item }) => {
  //____________________________________________________________________________________________
  const { callBy } = route.params

  //____________________________________________________________________________________________
  const handleSelection = () => {
    //<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
    // Key: IdCliente
    if (typeof item.IdCliente != 'undefined') {
      if (
        callBy == 'conClientesComp' ||
        callBy == 'conClientesRaZoc' ||
        callBy == 'conClientesDom' ||
        callBy == 'cardConClientesLocal'
      ) {
        navigation.navigate('ConClientes', { itemSelected: item.IdCliente })
        //_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
      } else if (callBy == 'procIngresosClie') {
        navigation.navigate('ProcIngresos', { itemSelected: item.IdCliente })
        //_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
      } else if (callBy == 'archClientesClie') {
        navigation.navigate('ArchClientes', { itemSelected: item.IdCliente })
      } else if (callBy == 'procGastosClie') {
        navigation.navigate('ProcGastos', { itemSelected: item.IdCliente })
      } else if (callBy == 'conIngresosClie') {
        navigation.navigate('ConIngresos', {
          itemSelected: item.IdCliente,
        })
      } else if (callBy == 'conComprasClie') {
        navigation.navigate('ConDeuda', {
          itemSelected: item.IdCliente,
        })
      }
    }
    //<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
    // Key: IdProveedores
    if (typeof item.IdProveedor != 'undefined') {
      if (callBy == 'archProveedoresProve') {
        navigation.navigate('ArchProveedores', {
          itemSelected: item.IdProveedor,
        })
      }
    }
    //<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
  }

  //____________________________________________________________________________________________

  //____________________________________________________________________________________________
  //____________________________________________________________________________________________
  return (
    <TouchableOpacity
      onPress={() => {
        handleSelection()
      }}
    >
      <View style={styles.itemContainer}>
        <View style={styles.row}>
          <View style={styles.textContainer}>
            <Text style={styles.textTop}>{item.RazonSocial}</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.textBottom}>{item.Domicilio}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: colors.green,
    borderRadius: 15,
    flex: 1,
    marginHorizontal: 10,
    marginVertical: 5,
  },
  row: {
    flex: 1,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
  },
  textTop: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop: 4,
    paddingHorizontal: 5,
  },
  textBottom: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
    paddingBottom: 4,
    paddingHorizontal: 5,
  },
})

export default CardTwo

//____________________________________________________________________________________________
