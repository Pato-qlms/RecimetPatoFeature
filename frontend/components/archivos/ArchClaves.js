import React, { useState, useContext, useRef, useEffect } from 'react';

import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

let TouchableOpacity;
if (Platform.OS === 'ios') {
  ({ TouchableOpacity } = require('react-native-gesture-handler'));
} else {
  ({ TouchableOpacity } = require('react-native'));
}

import colors from '../../assets/colors';
import GeneralContext from '../../contexts/GeneralContext';
import QueueContext from '../../contexts/QueueContext';

import Axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';

const ArchClaves = ({ navigation, route }) => {
  //___________________________________________________________________________________
  const { tablesLoaded, tablaClaves, ipBackend, ipRequestDone, getClaves } =
    useContext(GeneralContext);
  //--------------------------------------------------------------------------------------
  const { saveEnCola } = useContext(QueueContext);

  //___________________________________________________________________________________
  const { itemSelected } = route.params;

  //___________________________________________________________________________________
  const [alta, setAlta] = useState(false);
  const [editClave, setEditClave] = useState(false);
  const [editDescripcion, setEditDescripcion] = useState(false);
  const [editValor, setEditValor] = useState(false);
  const [editVariable, setEditVariable] = useState(false);
  const [envioGenerado, setEnvioGenerado] = useState(false);
  const [generarEnvio, setGenerarEnvio] = useState(false);
  const [handleFocus, setHandleFocus] = useState(false);
  //-----------------------------------------------------------------------------------
  const [clave, setClave] = useState();
  const [descripcion, setDescripcion] = useState();
  const [itemsBeingSent, setItemsBeingSent] = useState();
  const [itemsGenerados, setItemsGenerados] = useState([]);
  const [valor, setValor] = useState();
  const [variable, setVariable] = useState();
  const [selecting, setSelecting] = useState();

  //___________________________________________________________________________________
  const claveRef = useRef();
  const descripcionRef = useRef();
  const valorRef = useRef();
  const variableRef = useRef();

  //___________________________________________________________________________________
  useEffect(() => {
    if (handleFocus === true) {
      if (editClave === true) {
        claveRef.current.focus();
      } else if (editDescripcion === true) {
        descripcionRef.current.focus();
      } else if (editValor === true) {
        valorRef.current.focus();
      } else if (editVariable === true) {
        variableRef.current.focus();
      }
      setHandleFocus(false);
    }
  }, [handleFocus]);

  //_______________
  useEffect(() => {
    if (
      editClave === true ||
      editDescripcion === true ||
      editValor === true ||
      editVariable === true
    ) {
      setHandleFocus(true);
    }
  }, [editClave, editDescripcion, editValor, editVariable]);

  //___________________________________________________________________________________
  const claveHandler = (event) => {
    if (typeof event !== 'undefined') {
      setClave(event);
    }
  };

  //___________________________________________________________________________________
  const descripcionHandler = (event) => {
    if (typeof event !== 'undefined') {
      setDescripcion(event);
    }
  };

  //___________________________________________________________________________________
  const valorHandler = (event) => {
    if (typeof event !== 'undefined') {
      setValor(event);
    }
  };

  //___________________________________________________________________________________
  const variableHandler = (event) => {
    if (typeof event !== 'undefined') {
      setVariable(event);
    }
  };

  //___________________________________________________________________________________
  const claveTouched = () => {
    setClave();
    setSelecting('claves');
    setEditClave(true);
  };

  //___________________________________________________________________________________
  const altaTouched = () => {
    cleanUpAll();
    setAlta(true);
    setEditClave(true);
  };

  //___________________________________________________________________________________
  const descripcionTouched = () => {
    setEditDescripcion(true);
  };

  //___________________________________________________________________________________
  const valorTouched = () => {
    setEditValor(true);
  };

  //___________________________________________________________________________________
  const varieableTouched = () => {
    setEditVariable(true);
  };

  //___________________________________________________________________________________
  const refreshTouched = () => {
    cleanUpAll();
    setAlta(false);
  };

  //___________________________________________________________________________________
  const blurClave = () => {
    if (typeof clave !== 'undefined' && tablesLoaded === true) {
      if (clave.length > 6) {
        Alert.alert('Alerta!', 'Clave acepta máximo 6 caracteres', [
          {
            text: 'Cerrar Alerta',
          },
        ]);
      } else {
        if (alta === false) {
          const filter = (event) => {
            return event.IdClaves.toLowerCase().includes(clave.toLowerCase());
          };
          const data = tablaClaves.filter(filter);
          if (data.length !== 0) {
            if (data.length === 1) {
              setClave(data[0].IdClaves);
              setDescripcion(data[0].Descripcion);
              const valorString = JSON.stringify(data[0].Valor);
              setValor(valorString);
              setVariable(data[0].Variable);
            } else if (data.length > 1) {
              navigation.navigate('SearchResults', {
                result: data,
                callBy: 'archClavesCla',
              });
            }
          } else {
            Alert.alert('Alerta!', 'Clave no encontrada', [
              {
                text: 'Cerrar Alerta',
              },
            ]);
          }
        } else if (alta === true) {
          const filter = (event) => {
            return event.IdClaves.toLowerCase() === clave.toLowerCase();
          };
          const data = tablaClaves.filter(filter);
          if (data.length !== 0) {
            Alert.alert('Alerta!', 'Clave ya Existe. Elija otra Clave', [
              {
                text: 'Cerrar Alerta',
              },
            ]);
          }
        }
      }
    } else {
      Alert.alert('Alerta!', 'Complete Clave!', [
        {
          text: 'Cerrar Alerta',
        },
      ]);
    }
    setEditClave(false);
  };

  //___________________________________________________________________________________
  const blurDescripcion = () => {
    if (typeof descripcion === 'undefined') {
      Alert.alert('Alerta!', 'Complete Descripcion!', [
        {
          text: 'Cerrar Alerta',
        },
      ]);
    }
    setEditDescripcion(false);
  };

  //___________________________________________________________________________________
  const blurValor = () => {
    if (typeof valor === 'undefined') {
      Alert.alert('Alerta!', 'Complete Valor!', [
        {
          text: 'Cerrar Alerta',
        },
      ]);
    } else if (isNaN(+valor)) {
      Alert.alert('Alerta!', 'Utilice Solamente Números', [
        {
          text: 'Cerrar Alerta',
          onPress: () => {
            setValor();
            setEdit(true);
            return;
          },
        },
      ]);
    }
    setEditValor(false);
  };

  //___________________________________________________________________________________
  const blurVariable = () => {
    if (typeof variable === 'undefined') {
      Alert.alert('Alerta!', 'Complete Variable!', [
        {
          text: 'Cerrar Alerta',
        },
      ]);
    }
    setEditVariable(false);
  };

  //___________________________________________________________________________________
  const enviarTouched = () => {
    setGenerarEnvio(true);
  };

  //___________________________________________________________________________________
  useEffect(() => {
    if (generarEnvio === true) {
      if (ipRequestDone === true) {
        if (typeof clave === 'undefined' || clave === '') {
          Alert.alert('Error!', 'Complete Clave', [
            { text: 'Cerrar Alerta', onPress: () => setGenerarEnvio(false) },
          ]);
        } else if (typeof descripcion === 'undefined' || descripcion === '') {
          Alert.alert('Error!', 'Complete Descripcion', [
            { text: 'Cerrar Alerta', onPress: () => setGenerarEnvio(false) },
          ]);
        } else if (typeof valor === 'undefined' || valor === '') {
          Alert.alert('Error!', 'Complete Valor', [
            { text: 'Cerrar Alerta', onPress: () => setGenerarEnvio(false) },
          ]);
        } else if (typeof variable === 'undefined' || variable === '') {
          Alert.alert('Error!', 'Complete Variable', [
            { text: 'Cerrar Alerta', onPress: () => setGenerarEnvio(false) },
          ]);
        } else {
          generarItem();
        }
      }
    }
  }, [generarEnvio]);

  //___________________________________________________________________________________
  const generarItem = () => {
    setGenerarEnvio(false);
    const item = {
      IdClaves: clave.toUpperCase(),
      Descripcion: descripcion,
      Valor: valor,
      Variable: variable,
    };
    itemsGenerados.push(item);
    setItemsBeingSent(itemsGenerados);
    setEnvioGenerado(true);
  };

  //___________________________________________________________________________________
  useEffect(() => {
    if (envioGenerado === true) {
      enviarItem(itemsBeingSent);
    }
  }, [envioGenerado]);

  //___________________________________________________________________________________
  const enviarItem = async (event) => {
    setEnvioGenerado(false);
    const item = {
      IdClaves: event[0].IdClaves,
      Descripcion: event[0].Descripcion,
      Valor: event[0].Valor,
      Variable: event[0].Variable,
    };
    if (alta === true) {
      let source = Axios.CancelToken.source();
      const urlAxiosRequest = 'http://' + ipBackend + ':3001/altaClave';
      try {
        await Axios.post(urlAxiosRequest, item, {
          cancelToken: source.token,
        });
      } catch (error) {
        if (Axios.isCancel(error)) {
        } else {
          const queue = [
            {
              origin: 'altaClave',
              payLoad: event,
            },
          ];
          saveEnCola(queue);
          cleanUpAll();
          throw error;
        }
      }
    } else {
      let source = Axios.CancelToken.source();
      const urlAxiosRequest = 'http://' + ipBackend + ':3001/modifClave';
      try {
        await Axios.put(urlAxiosRequest, item, {
          cancelToken: source.token,
        });
      } catch (error) {
        if (Axios.isCancel(error)) {
        } else {
          const queue = [
            {
              origin: 'modifClave',
              payLoad: event,
            },
          ];
          saveEnCola(queue);
          cleanUpAll();
          throw error;
        }
      }
    }
    cleanUpAll();
  };

  //___________________________________________________________________________________
  const cleanUpAll = () => {
    setAlta(false);
    setClave();
    setDescripcion();
    setItemsBeingSent([]);
    setItemsGenerados([]);
    setValor();
    setVariable();
  };

  //___________________________________________________________________________________
  useEffect(() => {
    if (typeof selecting !== 'undefined') {
      if (selecting === 'claves') {
        const filter = (event) => {
          return event.IdClaves == itemSelected;
        };
        const data = tablaClaves.filter(filter);
        if (data.length !== 0) {
          setClave(data[0].IdClaves);
          setDescripcion(data[0].Descripcion);
          const valorString = JSON.stringify(data[0].Valor);
          setValor(valorString);
          setVariable(data[0].Variable);
        }
      }
      setSelecting();
      navigation.setParams({ itemSelected: 'null' });
    }
  }, [itemSelected]);

  //___________________________________________________________________________________
  //___________________________________________________________________________________
  return (
    <SafeAreaView>
      <ScrollView>
        {/* -----------------Form section------------------ */}
        <View style={styles.formContainer}>
          {/* ----------- 1 ----------- */}
          <View style={styles.row}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Clave</Text>
            </View>
            {/* ------------------------------ */}
            <View style={[styles.boxContainer, { alignItems: 'flex-start' }]}>
              <TouchableOpacity
                onPress={() => {
                  claveTouched();
                }}
              >
                <TextInput
                  editable={editClave}
                  onBlur={() => blurClave()}
                  onChangeText={claveHandler}
                  placeholder={''}
                  ref={claveRef}
                  style={[
                    styles.box,
                    {
                      width: 110,
                      alignSelf: 'flex-start',
                      marginLeft: 10,
                    },
                  ]}
                  underlineColorAndroid='transparent'
                  value={clave || ''}
                />
              </TouchableOpacity>
            </View>
            {/* ------------------------------ */}
            <View style={styles.refreshContainer}>
              <TouchableOpacity
                style={styles.refreshTouch}
                onPress={() => refreshTouched()}
              >
                <View>
                  <MaterialIcons
                    name='refresh'
                    size={30}
                    color={colors.white}
                  />
                </View>
              </TouchableOpacity>
            </View>
            {/* ------------------------------ */}
            <View
              style={[
                styles.btnTableWrapper,
                { marginLeft: 25, marginRight: 10, alignItems: 'flex-start' },
              ]}
            >
              <TouchableOpacity
                style={[styles.btnTablePlace, { width: 80 }]}
                onPress={() => altaTouched()}
              >
                <Text
                  style={[
                    styles.btnTable,
                    { paddingHorizontal: 10, alignSelf: 'center' },
                  ]}
                >
                  Alta
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* ----------- 2 ----------- */}
          <View
            style={[styles.row, { alignSelf: 'flex-start', paddingBottom: 7 }]}
          >
            <View style={[styles.labelContainer, { alignSelf: 'flex-start' }]}>
              <Text
                style={[styles.label, { flex: 1, alignSelf: 'flex-start' }]}
              >
                Descripcion
              </Text>
            </View>
          </View>
          {/* ------------------------------ */}
          <View style={[styles.row, { paddingTop: 0 }]}>
            <View style={[styles.boxContainer, {}]}>
              <TouchableOpacity
                onPress={() => {
                  descripcionTouched();
                }}
              >
                <TextInput
                  editable={editDescripcion}
                  onBlur={() => blurDescripcion()}
                  onChangeText={descripcionHandler}
                  placeholder={''}
                  ref={descripcionRef}
                  style={[
                    styles.box,
                    {
                      paddingLeft: 15,
                      textAlign: 'left',
                      width: '100%',
                    },
                  ]}
                  underlineColorAndroid='transparent'
                  value={descripcion || ''}
                />
              </TouchableOpacity>
            </View>
          </View>
          {/* ----------- 3 ----------- */}
          <View style={styles.row}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Valor</Text>
            </View>
            {/* ------------------------------ */}
            <View style={[styles.boxContainer, { alignItems: 'flex-end' }]}>
              <TouchableOpacity
                onPress={() => {
                  valorTouched();
                }}
              >
                <TextInput
                  editable={editValor}
                  onBlur={() => blurValor()}
                  onChangeText={valorHandler}
                  placeholder={''}
                  ref={valorRef}
                  style={[
                    styles.box,
                    {
                      width: 250,
                    },
                  ]}
                  underlineColorAndroid='transparent'
                  value={valor || ''}
                />
              </TouchableOpacity>
            </View>
          </View>
          {/* ----------- 4 ----------- */}
          <View style={styles.row}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Variable</Text>
            </View>
            {/* ------------------------------ */}
            <View style={[styles.boxContainer, { alignItems: 'flex-end' }]}>
              <TouchableOpacity
                onPress={() => {
                  varieableTouched();
                }}
              >
                <TextInput
                  editable={editVariable}
                  onBlur={() => blurVariable()}
                  onChangeText={variableHandler}
                  placeholder={''}
                  ref={variableRef}
                  style={[
                    styles.box,
                    {
                      width: 250,
                    },
                  ]}
                  underlineColorAndroid='transparent'
                  value={variable || ''}
                />
              </TouchableOpacity>
            </View>
          </View>
          {/* ----------- 5 ----------- */}
          <View style={styles.row}>
            <View style={styles.enviarContainer}>
              <TouchableOpacity
                style={styles.enviarTouch}
                onPress={() => enviarTouched()}
              >
                <View style={styles.containerLabelEnviar}>
                  <Text style={styles.labelEnviar}>Enviar Cambios</Text>
                </View>
                <View style={styles.btnEnviar}>
                  <MaterialIcons name='send' size={25} color={colors.white} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* ----------------------------------------------- */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    paddingTop: 10,
    backgroundColor: colors.white,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 15,
    paddingBottom: 300,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  selecLabelContainer: {
    alignSelf: 'center',
    backgroundColor: colors.green,
    borderRadius: 15,
  },
  selecLabel: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    marginRight: 10,
    marginVertical: 7,
    paddingHorizontal: 1,
  },
  labelContainer: {
    alignSelf: 'center',
    flex: 1,
  },
  label: {
    alignSelf: 'flex-start',
    color: colors.blue,
    fontSize: 20,
    fontWeight: 'bold',
    justifyContent: 'center',
  },
  boxContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  box: {
    alignSelf: 'flex-end',
    backgroundColor: colors.white,
    borderColor: colors.greenBlue,
    borderRadius: 10,
    borderWidth: 3,
    color: colors.blue,
    fontSize: 18,
    fontWeight: 'bold',
    paddingRight: 10,
    paddingVertical: 3,
    textAlign: 'right',
  },
  btnWrapper: {
    alignItems: 'flex-start',
    flex: 1,
  },
  btnPlace: {
    backgroundColor: colors.green,
    borderRadius: 100,
    justifyContent: 'flex-start',
    padding: 10,
  },
  btnEstado: {
    alignSelf: 'flex-start',
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
    justifyContent: 'center',
  },
  btnTablePlace: {
    backgroundColor: colors.greenBlue,
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  btnTableWrapper: {
    alignItems: 'flex-start',
    flex: 1,
    justifyContent: 'center',
  },
  btnTable: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  refreshContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginLeft: 40,
  },
  refreshTouch: {
    backgroundColor: colors.green,
    borderRadius: 100,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  enviarContainer: {
    alignContent: 'center',
    flexDirection: 'row',
    marginTop: 30,
    paddingVertical: 4,
  },
  enviarTouch: {
    flexDirection: 'row',
    backgroundColor: colors.blue,
    borderRadius: 20,
    paddingHorizontal: 25,
    paddingVertical: 7,
    marginTop: 10,
  },
  btnEnviar: {
    alignItems: 'flex-end',
  },
  containerLabelEnviar: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  labelEnviar: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 20,
  },
});

export default ArchClaves;
