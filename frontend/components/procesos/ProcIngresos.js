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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MaterialIcons } from '@expo/vector-icons';

//___________________________________________________________________________________
const ProcIngresos = ({ navigation, route }) => {
  //___________________________________________________________________________________

  //___________________________________________________________________________________
  const {
    acompañanteGC,
    choferGC,
    dataGCLoaded,
    fechaGC,
    ipBackend,
    ipRequestDone,
    isPlatformIOS,
    loggedStatus,
    planillaGC,
    tablaClientes,
    tablaCompradores,
    tablaComprobantes,
    tablaProductos,
    tablaConceptos,
    tablesLoaded,
    updateComprobanteREM,
    valorDolarGC,
  } = useContext(GeneralContext);

  //___________________________________________________________________________________
  const { itemSelected } = route.params;
  //-----------------------------------------------------------------------------------
  const { saveEnCola } = useContext(QueueContext);

  //___________________________________________________________________________________
  const [calcImporte, setCalcImporte] = useState(false);
  const [editPlanilla, setEditPlanilla] = useState(false);
  const [editComprador, setEditComprador] = useState(false);
  const [editCliente, setEditCliente] = useState(false);
  const [editProducto, setEditProducto] = useState(false);
  const [editCantidad, setEditCantidad] = useState(false);
  const [editObservaciones, setEditObservaciones] = useState(false);
  const [editPrecio, setEditPrecio] = useState(false);
  const [editPrecioUSD, setEditPrecioUSD] = useState(false);
  const [generarEnvio, setGenerarEnvio] = useState(false);
  const [handleFocus, setHandleFocus] = useState(false);
  const [modifElim, setModifElim] = useState(false);
  const [ingresoGenerado, setIngresoGenerado] = useState(false);
  const [estadoOne, setEstadoOne] = useState(false);
  const [estadoTwo, setEstadoTwo] = useState(false);
  const [estadoThree, setEstadoThree] = useState(false);
  const [estadoFour, setEstadoFour] = useState(false);
  //-----------------------------------------------------------------------------------
  const [cajon, setCajon] = useState();
  const [cantidad, setCantidad] = useState();
  const [carrito, setCarrito] = useState([]);
  const [cliente, setCliente] = useState();
  const [comprador, setComprador] = useState();
  const [estado, setEstado] = useState();
  const [idComprador, setIdComprador] = useState();
  const [idCliente, setIdCliente] = useState();
  const [idProducto, setIdProducto] = useState();
  const [importe, setImporte] = useState();
  const [importeUSD, setImporteUSD] = useState();
  const [itemsBeingSent, setItemsBeingSent] = useState([]);
  const [itemsGenerados, setItemsGenerados] = useState([]);
  const [letra, setLetra] = useState('A');
  const [planilla, setPlanilla] = useState();
  const [planillaSaved, setPlanillaSaved] = useState();
  const [precio, setPrecio] = useState();
  const [precioUSD, setPrecioUSD] = useState();
  const [precioTabla, setPrecioTabla] = useState();
  const [producto, setProducto] = useState();
  const [selecting, setSelecting] = useState();
  const [total, setTotal] = useState();
  const [totalUSD, setTotalUSD] = useState();
  const [observaciones, setObservaciones] = useState();
  const [valorDolar, setValorDolar] = useState();
  const [idConcepto, setIdConcepto] = useState(5);
  const [descipConcepto, setDescipConcepto] = useState();
  const [idCuenta, setIdCuenta] = useState();
  const [signoConcepto, setSignoConcepto] = useState();

  //___________________________________________________________________________________
  const planillaRef = useRef();
  const cantidadRef = useRef();
  const clienteRef = useRef();
  const compradorRef = useRef();
  const precioUSDRef = useRef();
  const observacionesRef = useRef();
  const precioRef = useRef();
  const productoRef = useRef();

  //___________________________________________________________________________________
  useEffect(() => {
    setPlanilla(planillaGC);
    setPlanillaSaved(planillaGC);
    setValorDolar(valorDolarGC);
  }, [dataGCLoaded]);

  //___________________________________________________________________________________
  useEffect(() => {
    if (loggedStatus.isLogged === true && tablesLoaded === true) {
      setComprador(loggedStatus.username);
      setIdComprador(loggedStatus.idCompLogged);
      const filter = (event) => {
        return event.IdConcepto == idConcepto;
      };
      //- - - - - - - - - - - - - - - - - - - - -
      const data = tablaConceptos.filter(filter);
      if (data.length !== 0) {
        setDescipConcepto(data[0].Descripcion);
        setSignoConcepto(data[0].Signo);
        setIdCuenta(data[0].IdCuenta);
      }
    }
  }, [loggedStatus, tablesLoaded]);

  //___________________________________________________________________________________
  useEffect(() => {
    if (handleFocus === true) {
      if (editPlanilla === true) {
        planillaRef.current.focus();
      } else if (editComprador === true) {
        compradorRef.current.focus();
      } else if (editCliente === true) {
        clienteRef.current.focus();
      } else if (editProducto === true) {
        productoRef.current.focus();
      } else if (editCantidad === true) {
        cantidadRef.current.focus();
      } else if (editObservaciones === true) {
        observacionesRef.current.focus();
      } else if (editPrecio === true) {
        precioRef.current.focus();
      } else if (editPrecioUSD === true) {
        precioUSDRef.current.focus();
      }
      setHandleFocus(false);
    }
  }, [handleFocus]);

  //_______________
  useEffect(() => {
    if (
      editCantidad === true ||
      editCliente === true ||
      editComprador === true ||
      editObservaciones === true ||
      editPlanilla === true ||
      editPrecio === true ||
      editPrecioUSD === true ||
      editProducto === true
    ) {
      setHandleFocus(true);
    }
  }, [
    editCantidad,
    editCliente,
    editComprador,
    editPrecioUSD,
    editObservaciones,
    editPlanilla,
    editPrecio,
    editProducto,
  ]);

  //___________________________________________________________________________________
  useEffect(() => {
    if (typeof estado !== 'undefined') {
      if (estado == 1) {
        setEstadoOne(true);
        setEstadoTwo(false);
        setEstadoThree(false);
        setEstadoFour(false);
      } else if (estado == 2) {
        setEstadoOne(false);
        setEstadoTwo(true);
        setEstadoThree(false);
        setEstadoFour(false);
      } else if (estado == 3) {
        setEstadoOne(false);
        setEstadoTwo(false);
        setEstadoThree(true);
        setEstadoFour(false);
      } else if (estado == 4) {
        setEstadoOne(false);
        setEstadoTwo(false);
        setEstadoThree(false);
        setEstadoFour(true);
      }
    }
  }, [estado]);

  //___________________________________________________________________________________
  useEffect(() => {
    if (typeof selecting !== 'undefined') {
      if (selecting === 'comprador') {
        const filter = (event) => {
          return event.IdCompradores == itemSelected;
        };
        const data = tablaCompradores.filter(filter);
        if (data.length !== 0) {
          setComprador(data[0].RazonSocial);
          setIdComprador(data[0].IdCompradores);
        }
      } else if (selecting === 'cliente') {
        const filter = (event) => {
          return event.IdCliente == itemSelected;
        };
        const data = tablaClientes.filter(filter);
        if (data.length !== 0) {
          setCliente(data[0].RazonSocial);
          setIdCliente(data[0].IdCliente);
          if (data[0].IdComprador != idComprador) {
            Alert.alert(
              'Alerta!',
              'Cliente no corresponde a Comprador - ¿Desea Continuar?',
              [
                {
                  text: 'Si',
                  onPress: () => handleSi(),
                },
                {
                  text: 'No',
                  onPress: () => handleNo(),
                },
              ]
            );
          }
          const handleSi = () => {
            return;
          };
          const handleNo = () => {
            setCliente();
            setEditCliente(true);
            return;
          };
        }
      } else if (selecting === 'producto' || selecting === 'cartItem') {
        const filter = (event) => {
          return event.IdProducto == itemSelected;
        };
        const data = tablaProductos.filter(filter);
        if (data.length !== 0) {
          if (carrito.length !== 0) {
            const prodInCart = (event) => {
              return event.idProducto == data[0].IdProducto;
            };
            const productFound = carrito.filter(prodInCart);
            if (productFound.length !== 0) {
              if (selecting === 'cartItem') {
                setProducto(productFound[0].producto);
                setIdProducto(productFound[0].idProducto);
                setCajon(productFound[0].cajon);
                setCantidad(productFound[0].cantidad);
                setPrecio(productFound[0].precio);
                setPrecioUSD(productFound[0].precioUSD);
                setImporte(productFound[0].importe);
                setImporteUSD(productFound[0].importeUSD);
                setValorDolar(productFound[0].valorDolar);
                setEstado(productFound[0].estado);
                setModifElim(true);
              } else {
                Alert.alert(
                  'Alerta!',
                  'Producto ya ingresado. ¿Desea Eliminar / Modificar?',
                  [
                    { text: 'Si', onPress: () => handleSi() },
                    { text: 'No', onPress: () => handleNo() },
                  ]
                );
                const handleSi = () => {
                  setProducto(productFound[0].producto);
                  setIdProducto(productFound[0].idProducto);
                  setCajon(productFound[0].cajon);
                  setCantidad(productFound[0].cantidad);
                  setPrecio(productFound[0].precio);
                  setPrecioUSD(productFound[0].precioUSD);
                  setImporte(productFound[0].importe);
                  setImporteUSD(productFound[0].importeUSD);
                  setValorDolar(productFound[0].valorDolar);
                  setEstado(productFound[0].estado);
                  setModifElim(true);
                  setEditCantidad(true);
                  return;
                };
                const handleNo = () => {
                  setProducto();
                  setCantidad();
                  setCajon();
                  setPrecio();
                  setImporte();
                  setPrecioUSD();
                  setEstado();
                  setEditProducto(true);
                  return;
                };
              }
            } else {
              setProducto(data[0].Descripcion);
              setIdProducto(data[0].IdProducto);
              if (
                data[0].CostoComprador == 0 ||
                typeof data[0].CostoComprador == 'undefined'
              ) {
                handlePrecioCero();
              } else {
                setPrecio(JSON.stringify(parseFloat(data[0].CostoComprador)));
                setPrecioTabla(
                  JSON.stringify(parseFloat(data[0].CostoComprador))
                );
              }
              setCajon(data[0].IdCajon);
            }
          } else {
            setProducto(data[0].Descripcion);
            setIdProducto(data[0].IdProducto);
            if (
              data[0].CostoComprador == 0 ||
              typeof data[0].CostoComprador == 'undefined'
            ) {
              handlePrecioCero();
            } else {
              setPrecio(JSON.stringify(parseFloat(data[0].CostoComprador)));
              setPrecioTabla(
                JSON.stringify(parseFloat(data[0].CostoComprador))
              );
            }
            setCajon(data[0].IdCajon);
          }
        }
      }
      setSelecting();
      navigation.setParams({ itemSelected: 'null' });
    }
  }, [itemSelected]);

  //___________________________________________________________________________________
  const planillaHandler = (event) => {
    if (event !== 'undefined') {
      setPlanilla(event);
    }
  };

  //___________________________________________________________________________________
  const compradorHandler = (event) => {
    if (typeof event !== 'undefined') {
      setComprador(event);
    }
  };

  //___________________________________________________________________________________
  const clienteHandler = (event) => {
    if (typeof event !== 'undefined') {
      setCliente(event);
    }
  };

  //___________________________________________________________________________________
  const productoHandler = (event) => {
    if (typeof event !== 'undefined') {
      setProducto(event);
    }
  };

  //___________________________________________________________________________________
  const cantidadHandler = (event) => {
    if (typeof event !== 'undefined') {
      setCantidad(event);
    }
  };

  //___________________________________________________________________________________
  const precioHandler = (event) => {
    // lineas siguiente se usan si precio es entero o integer
    // if (precio !== 0 && typeof precio !== 'undefined') {
    //   const newPrecio = precio.replace(/[^0-9]/g, '');
    //   if (newPrecio !== '') {
    //     setPrecio(parseFloat(newPrecio));
    //   }
    // }
    if (typeof event !== 'undefined') {
      setPrecio(event);
    }
  };

  //___________________________________________________________________________________
  const precioUSDHandler = (event) => {
    if (typeof event !== 'undefined') {
      setPrecioUSD(event);
    }
  };

  //___________________________________________________________________________________
  const observacionesHandler = (event) => {
    if (typeof event !== 'undefined') {
      setObservaciones(event);
    }
  };

  //___________________________________________________________________________________
  const planillaTouched = () => {
    setPlanilla();
    setEditPlanilla(true);
  };

  //___________________________________________________________________________________
  const compradorTouched = () => {
    setComprador();
    setIdComprador();
    setSelecting('comprador');
    setEditComprador(true);
  };

  //___________________________________________________________________________________
  const clienteTouched = () => {
    setCliente();
    setIdCliente();
    setSelecting('cliente');
    setEditCliente(true);
  };

  //___________________________________________________________________________________
  const productoTouched = () => {
    setCalcImporte(false);
    setProducto();
    setIdProducto();
    setPrecio();
    setCajon();
    setSelecting('producto');
    setEditProducto(true);
  };

  //___________________________________________________________________________________
  const cantidadTouched = () => {
    setCantidad();
    setCalcImporte(false);
    setEditCantidad(true);
  };

  //___________________________________________________________________________________
  const observacionesTouched = () => {
    setEditObservaciones(true);
  };

  //___________________________________________________________________________________
  const precioTouched = () => {
    setPrecio();
    setCalcImporte(false);
    setEditPrecio(true);
  };

  //___________________________________________________________________________________
  const precioUSDTouched = () => {
    setPrecio();
    setImporte();
    setPrecioUSD();
    setCalcImporte(false);
    setEditPrecioUSD(true);
  };

  //___________________________________________________________________________________
  const compTableTouched = () => {
    setSelecting('comprador');
    navigation.navigate('SearchResults', {
      result: tablaCompradores,
      callBy: 'procIngresosComp',
    });
  };

  //___________________________________________________________________________________
  const agregarItemTouched = () => {
    if (typeof comprador === 'undefined') {
      Alert.alert('Alerta!', 'Complete Comprador', [{ text: 'Cerrar Alerta' }]);
    } else if (typeof cliente === 'undefined') {
      Alert.alert('Alerta!', 'Complete Cliente', [{ text: 'Cerrar Alerta' }]);
    } else if (typeof producto === 'undefined') {
      Alert.alert('Alerta!', 'Complete Producto', [{ text: 'Cerrar Alerta' }]);
    } else if (typeof cantidad === 'undefined') {
      Alert.alert('Alerta!', 'Complete Cantidad', [{ text: 'Cerrar Alerta' }]);
    } else if (
      cantidad != 0 &&
      (typeof precio === 'undefined' || precio === 0) &&
      (typeof precioUSD === 'undefined' || precioUSD === 0)
    ) {
      Alert.alert('Alerta!', 'Complete Precio o Precio USD', [
        { text: 'Cerrar Alerta' },
      ]);
    } else if (typeof estado === 'undefined') {
      Alert.alert('Alerta!', 'Complete Estado', [{ text: 'Cerrar Alerta' }]);
    } else if (
      typeof precio !== 'undefined' &&
      precio !== '' &&
      parseFloat(precio) > parseFloat(precioTabla) &&
      (typeof observaciones === 'undefined' || observaciones === '')
    ) {
      Alert.alert('Alerta!', 'Precio mayor al de Tabla, debe Informarlo', [
        { text: 'Cerrar Alerta' },
      ]);
    } else if (
      typeof comprador !== 'undefined' &&
      typeof cliente !== 'undefined' &&
      typeof producto !== 'undefined' &&
      typeof cantidad !== 'undefined' &&
      (typeof precio !== 'undefined' || typeof precioUSD !== 'undefined') &&
      typeof estado !== 'undefined' &&
      modifElim === true
    ) {
      if (cantidad == 0) {
        const newCarrito = carrito.filter((item) => {
          return item.idProducto != idProducto;
        });
        setCarrito(newCarrito);
      } else if (precio !== 0 && cantidad !== 0) {
        setCarrito(
          carrito.map((val) => {
            return val.idProducto == idProducto
              ? {
                  cajon: cajon,
                  cantidad: cantidad,
                  estado: estado,
                  idProducto: idProducto,
                  idNumIngreso: planilla,
                  importe: importe,
                  importeUSD: importeUSD,
                  precio: precio,
                  precioUSD: precioUSD,
                  producto: producto,
                  observaciones: observaciones ? observaciones : '-',
                  valorDolar: valorDolar,
                }
              : val;
          })
        );
      }
      partialCleanUp();
      setModifElim(false);
      return;
    } else if (
      typeof comprador !== 'undefined' &&
      typeof cliente !== 'undefined' &&
      typeof producto !== 'undefined' &&
      typeof cantidad !== 'undefined' &&
      (typeof precio !== 'undefined' || typeof precioUSD !== 'undefined') &&
      typeof estado !== 'undefined' &&
      cantidad !== 0 &&
      precio !== 0 &&
      modifElim === false
    ) {
      const newCarrito = [
        ...carrito,
        {
          cajon: cajon,
          cantidad: cantidad,
          estado: estado,
          idNumIngreso: planilla,
          idProducto: idProducto,
          importe: importe,
          importeUSD: importeUSD,
          precio: precio,
          precioUSD: precioUSD,
          producto: producto,
          observaciones: observaciones ? observaciones : '-',
          valorDolar: valorDolar,
        },
      ];
      setCarrito(newCarrito);
      partialCleanUp();
      return;
    }
  };

  //___________________________________________________________________________________
  const blurPlanilla = () => {
    if (typeof planilla !== 'undefined' && tablesLoaded === true) {
      if (planilla === 0) {
        const filter = (event) => {
          return event.Comprobante == 'REM';
        };
        const data = tablaComprobantes.filter(filter);
        if (data.length !== 0) {
          const planillaString = JSON.stringify(data[0].NumeroA);
          setPlanilla(planillaString);
          setPlanillaSaved(planillaString);
          const newREM = parseFloat(data[0].NumeroA) + 1;
          updateComprobanteREM(newREM);
        }
      } else if (planilla != planillaSaved) {
        Alert.alert('Alerta!', 'No coincide Número Planilla!', [
          {
            text: 'Cerrar Alerta',
          },
        ]);
      }
    } else if (typeof planilla === 'undefined' || planilla === '') {
      Alert.alert('Alerta!', 'Complete Planilla!', [
        {
          text: 'Cerrar Alerta',
        },
      ]);
    }
    setEditPlanilla(false);
  };

  //___________________________________________________________________________________
  const blurComprador = () => {
    if (typeof comprador !== 'undefined' && tablesLoaded === true) {
      const filter = (event) => {
        if (!isNaN(+comprador)) {
          return event.IdCompradores == comprador;
        } else {
          return event.RazonSocial.toLowerCase().includes(
            comprador.toLowerCase()
          );
        }
      };
      const data = tablaCompradores.filter(filter);
      if (data.length !== 0) {
        if (data.length === 1) {
          setComprador(data[0].RazonSocial);
          setIdComprador(data[0].IdCompradores);
        } else if (data.length > 1) {
          navigation.navigate('SearchResults', {
            result: data,
            callBy: 'procIngresosComp',
          });
        }
      } else {
        setComprador();
        setIdComprador();
        Alert.alert('Alerta!', 'Comprador no encontrado', [
          {
            text: 'Cerrar Alerta',
          },
        ]);
      }
    } else if (typeof comprador === 'undefined' || comprador === '') {
      Alert.alert('Alerta!', 'Complete Comprador!', [
        {
          text: 'Cerrar Alerta',
        },
      ]);
    }
    setEditComprador(false);
  };

  //___________________________________________________________________________________
  const blurCliente = () => {
    if (typeof cliente !== 'undefined' && tablesLoaded === true) {
      const filter = (event) => {
        if (!isNaN(+cliente)) {
          return event.IdCliente == cliente;
        } else {
          return event.RazonSocial.toLowerCase().includes(
            cliente.toLowerCase()
          );
        }
      };
      const data = tablaClientes.filter(filter);
      if (data.length !== 0) {
        if (data.length === 1) {
          setCliente(data[0].RazonSocial);
          setIdCliente(data[0].IdCliente);
          if (data[0].IdComprador != idComprador) {
            Alert.alert(
              'Alerta!',
              'Cliente no corresponde a Comprador - ¿Desea Continuar?',
              [
                {
                  text: 'Si',
                  onPress: () => handleSi(),
                },
                {
                  text: 'No',
                  onPress: () => handleNo(),
                },
              ]
            );
          }
          const handleSi = () => {
            return;
          };
          const handleNo = () => {
            setCliente();
            setEditCliente(true);
            return;
          };
        } else if (data.length > 1) {
          navigation.navigate('SearchResults', {
            result: data,
            callBy: 'procIngresosClie',
          });
        }
      } else {
        setCliente();
        setIdCliente();
        Alert.alert('Alerta!', 'Cliente no encontrado/a', [
          {
            text: 'Cerrar Alerta',
          },
        ]);
      }
    } else if (typeof cliente === 'undefined' || cliente === '') {
      Alert.alert('Alerta!', 'Complete Cliente!', [
        {
          text: 'Cerrar Alerta',
        },
      ]);
    }
    setEditCliente(false);
  };

  //___________________________________________________________________________________
  const handleModifProducto = () => {
    productoTouched();
  };

  const handleModifPrecio = () => {
    setEditPrecio(true);
  };

  const handlePrecioCero = () => {
    Alert.alert(
      'Alerta!',
      'Producto con Precio cero. Modifique Producto o Precio',
      [
        {
          text: 'Producto',
          onPress: () => handleModifProducto(),
        },
        { text: 'Precio', onPress: () => handleModifPrecio() },
      ]
    );
  };

  //___________________________________________________________________________________
  const blurProducto = () => {
    if (typeof producto !== 'undefined' && tablesLoaded === true) {
      const filter = (event) => {
        return event.IdProducto.toLowerCase().includes(producto.toLowerCase());
      };
      const data = tablaProductos.filter(filter);
      if (data.length !== 0) {
        if (data.length === 1) {
          if (carrito.length !== 0) {
            const prodInCart = (event) => {
              return (
                event.idProducto.toLowerCase() ==
                data[0].IdProducto.toLowerCase()
              );
            };
            const productFound = carrito.filter(prodInCart);
            if (productFound.length != 0) {
              Alert.alert(
                'Alerta!',
                'Producto ya ingresado. ¿Desea Eliminar / Modificar?',
                [
                  { text: 'Si', onPress: () => handleSi() },
                  { text: 'No', onPress: () => handleNo() },
                ]
              );
              const handleSi = () => {
                setProducto(productFound[0].producto);
                setIdProducto(productFound[0].idProducto);
                setCajon(productFound[0].cajon);
                setCantidad(productFound[0].cantidad);
                setPrecio(productFound[0].precio);
                setPrecioUSD(productFound[0].precioUSD);
                setImporte(productFound[0].importe);
                setImporteUSD(productFound[0].importeUSD);
                setValorDolar(productFound[0].valorDolar);
                setEstado(productFound[0].estado);
                setModifElim(true);
                setEditCantidad(true);
                return;
              };
              const handleNo = () => {
                setProducto();
                setIdProducto();
                setCantidad();
                setPrecio();
                setImporte();
                setEstado();
                setEditProducto(true);
                return;
              };
            } else {
              // if product isn't already in carrito
              setProducto(data[0].Descripcion);
              setIdProducto(data[0].IdProducto);
              if (
                data[0].CostoComprador == 0 ||
                typeof data[0].CostoComprador == 'undefined'
              ) {
                handlePrecioCero();
              } else {
                setPrecio(JSON.stringify(parseFloat(data[0].CostoComprador)));
                setPrecioTabla(
                  JSON.stringify(parseFloat(data[0].CostoComprador))
                );
              }
              setCajon(data[0].IdCajon);
            }
          } else {
            setProducto(data[0].Descripcion);
            setIdProducto(data[0].IdProducto);
            if (
              data[0].CostoComprador == 0 ||
              typeof data[0].CostoComprador == 'undefined'
            ) {
              handlePrecioCero();
            } else {
              setPrecio(JSON.stringify(parseFloat(data[0].CostoComprador)));
              setPrecioTabla(
                JSON.stringify(parseFloat(data[0].CostoComprador))
              );
            }
            setCajon(data[0].IdCajon);
          }
        } else if (data.length > 1) {
          navigation.navigate('SearchResults', {
            result: data,
            callBy: 'procIngresosProd',
          });
        }
      } else {
        setProducto();
        setIdProducto();
        Alert.alert('Alerta!', 'Producto no encontrado', [
          {
            text: 'Cerrar Alerta',
          },
        ]);
      }
    } else if (typeof producto === 'undefined' || producto === '') {
      Alert.alert('Alerta!', 'Complete Producto!', [
        {
          text: 'Cerrar Alerta',
        },
      ]);
    }
    setEditProducto(false);
  };

  //___________________________________________________________________________________
  const blurCantidad = () => {
    if (typeof cantidad === 'undefined' || cantidad === '') {
      Alert.alert('Alerta!', 'Complete Cantidad!', [
        {
          text: 'Cerrar Alerta',
        },
      ]);
    } else {
      if (typeof producto === 'undefined') {
        Alert.alert('Alerta!', 'Complete Producto antes que Cantidad!', [
          {
            text: 'Cerrar Alerta',
          },
        ]);
      } else {
        if (cantidad != 0 && typeof cantidad !== 'undefined') {
          const tempCajon = cajon.substr(1, 2);
          const numCajon = parseInt(tempCajon);
          if (numCajon > 21) {
            const tempOne = cantidad.replace(',', '.');
            const tempTwo = parseFloat(tempOne);
            const tempThree = parseFloat(tempTwo).toFixed(2);
            if (isNaN(tempThree)) {
              Alert.alert('Alerta!', 'Complete Cantidad!', [
                {
                  text: 'Cerrar Alerta',
                },
              ]);
            } else {
              setCantidad(tempThree);
            }
          } else {
            const newCantidad = parseInt(cantidad);
            setCantidad(JSON.stringify(newCantidad));
          }
        }
      }
      if (
        typeof cantidad !== 'undefined' &&
        (typeof precio !== 'undefined' || typeof precioUSD !== 'undefined')
      ) {
        setCalcImporte(true);
      }
    }
    setEditCantidad(false);
  };

  //___________________________________________________________________________________
  const blurPrecio = () => {
    if (typeof precio === 'undefined' || precio === '') {
      Alert.alert('Alerta!', 'Complete Precio!', [
        {
          text: 'Cerrar Alerta',
          onPress: () => {
            setImporte();
          },
        },
      ]);
    } else {
      if (precio > precioTabla) {
        Alert.alert(
          'Alerta!',
          'Precio ingresado es mayor al de Tabla! - Pida Autorización',
          [
            {
              text: 'Cerrar Alerta',
            },
          ]
        );
      }
      const tempOne = precio.replace(',', '.');
      const tempTwo = parseFloat(tempOne);
      const tempThree = parseFloat(tempTwo).toFixed(2);
      if (isNaN(tempThree)) {
        Alert.alert('Alerta!', 'Complete Precio!', [
          {
            text: 'Cerrar Alerta',
          },
        ]);
      } else {
        setPrecio(tempThree);
      }
      if (typeof cantidad !== 'undefined' && typeof precio !== 'undefined') {
        setCalcImporte(true);
      }
    }
    setEditPrecio(false);
  };

  //___________________________________________________________________________________
  const blurPrecioUSD = () => {
    if (typeof precioUSD === 'undefined' || precioUSD === '') {
      Alert.alert('Alerta!', 'Complete Precio USD!', [
        {
          text: 'Cerrar Alerta',
          onPress: () => {
            setImporteUSD();
          },
        },
      ]);
    } else {
      const tempOne = precioUSD.replace(',', '.');
      const tempTwo = parseFloat(tempOne);
      const tempThree = parseFloat(tempTwo).toFixed(2);
      if (isNaN(tempThree)) {
        Alert.alert('Alerta!', 'Complete Precio USD!', [
          {
            text: 'Cerrar Alerta',
          },
        ]);
      } else {
        setPrecioUSD(tempThree);
      }
      if (typeof cantidad !== 'undefined' && typeof precioUSD !== 'undefined') {
        setCalcImporte(true);
      }
    }
    setEditPrecioUSD(false);
  };

  //___________________________________________________________________________________
  const blurObservaciones = () => {
    if (typeof observaciones === 'undefined' || observaciones === '') {
      Alert.alert('Alerta!', 'Complete Observaciones!', [
        {
          text: 'Cerrar Alerta',
        },
      ]);
    }
    setEditObservaciones(false);
  };

  //___________________________________________________________________________________
  useEffect(() => {
    if (calcImporte === true) {
      if (typeof precio !== 'undefined' && precio !== '') {
        if (cantidad != 0 && precio != 0) {
          const importe = parseFloat(cantidad) * parseFloat(precio);
          setImporte(parseFloat(importe.toFixed(2)));
        }
      }
      if (typeof precioUSD !== 'undefined' && precioUSD !== '') {
        if (cantidad != 0 && precioUSD != 0) {
          const impUSD = parseFloat(cantidad) * parseFloat(precioUSD);
          setImporteUSD(parseFloat(impUSD.toFixed(2)));
        }
      }
      setCalcImporte(false);
    }
  }, [calcImporte]);

  //___________________________________________________________________________________
  const calcuTotal = () => {
    if (typeof carrito === 'undefined' || carrito == '') {
      if (cantidad != 0 && precio != 0) {
        setTotal(parseFloat(importe.toFixed(2)));
      }
    } else {
      if (cantidad != 0 && precio != 0) {
        const sum = carrito.reduce((result, item) => {
          return result + parseFloat(item.importe);
        }, 0);
        if (!isNaN(sum)) {
          setTotal(parseFloat(sum.toFixed(2)));
        }
      }
    }
    if (typeof carrito === 'undefined' || carrito == '') {
      if (cantidad != 0 && precioUSD != 0) {
        setTotalUSD(parseFloat(importeUSD.toFixed(2)));
      }
    } else {
      if (cantidad != 0 && precio != 0) {
        const sumUSD = carrito.reduce((result, item) => {
          return result + parseFloat(item.importeUSD);
        }, 0);
        if (!isNaN(sumUSD)) {
          setTotalUSD(parseFloat(sumUSD.toFixed(2)));
        }
      }
    }
  };

  //_______________
  useEffect(() => {
    if (carrito.length !== 0) {
      calcuTotal();
    }
  }, [carrito]);

  //___________________________________________________________________________________
  useEffect(() => {
    if (modifElim === true && cantidad == 0) {
      setPrecio(0);
      setImporte(0);
      setPrecioUSD(0);
      setImporteUSD(0);
    }
  }, [cantidad]);

  //___________________________________________________________________________________
  const handleActualPed = () => {
    return;
  };

  const handleDescartarlo = () => {
    cleanUpAll();
  };

  const handleEnviarlo = () => {
    if (carrito.length !== 0) {
      if (ipRequestDone === true) {
        setGenerarEnvio(true);
      }
    }
  };

  //__________________________
  const nuevoIngreso = () => {
    if (
      typeof cliente !== 'undefined' ||
      typeof producto !== 'undefined' ||
      carrito.length !== 0
    ) {
      Alert.alert(
        'Alerta! - Hay un Ingreso cargado.',
        '¿Desea Continuar con el Actual?  ¿Descartarlo?  ¿Enviarlo?',
        [
          { text: 'Continuar', onPress: () => handleActualPed() },
          { text: 'Descartar', onPress: () => handleDescartarlo() },
          { text: 'Enviar', onPress: () => handleEnviarlo() },
        ]
      );
    }
  };

  //___________________________________________________________________________________
  const enviarCotizacion = () => {
    console.log('enviar Cotizacion');
  };

  //___________________________________________________________________________________
  const verCarrito = () => {
    if (carrito.length !== 0) {
      setSelecting('cartItem');
      navigation.navigate('SearchResults', {
        result: carrito,
        callBy: 'cardProcIngresos',
      });
    }
  };

  //___________________________________________________________________________________
  const handleEnviarIngreso = () => {
    setGenerarEnvio(true);
  };

  //___________________________________________________________________________________
  useEffect(() => {
    if (carrito.length !== 0) {
      if (generarEnvio === true) {
        if (ipRequestDone === true) {
          if (typeof producto !== 'undefined') {
            Alert.alert(
              'Alerta!! - Hay un producto ingresado.',
              '¿Desea Descartar y Enviar / O Continuar con la Carga?',
              [
                { text: 'Descartar y Enviar', onPress: () => generarItem() },
                {
                  text: 'Continuar',
                  onPress: () => {
                    return;
                  },
                },
              ]
            );
          } else {
            generarItem();
          }
        }
      }
    }
  }, [generarEnvio]);

  //___________________________________________________________________________________
  const generarItem = () => {
    setGenerarEnvio(false);
    if (carrito.length !== 0) {
      for (let i = 0; i < carrito.length; i++) {
        const item = {
          Comprobante: 'PLA',
          Numero: planilla,
          IdProducto: carrito[i].idProducto,
          Descripcion: carrito[i].producto,
          IdCajon: carrito[i].cajon,
          Letra: letra,
          Cantidad: carrito[i].cantidad,
          Precio: carrito[i].precio,
          Signo: 1,
          Estado: carrito[i].estado,
          Proceso: 0,
          Lote: 0,
          FechaCpte: fechaGC,
          IdCompradores: idComprador,
          IdCliente: idCliente,
          IdChofer: choferGC,
          IdAcompañante: acompañanteGC,
          Observaciones: carrito[i].observaciones,
        };
        itemsGenerados.push(item);
      }
    }
    setItemsBeingSent(itemsGenerados);
    setIngresoGenerado(true);
  };

  //___________________________________________________________________________________
  useEffect(() => {
    if (ingresoGenerado === true) {
      enviarItem(itemsBeingSent);
      // enviarePdf(itemsBeingSent);
    }
  }, [ingresoGenerado]);

  //___________________________________________________________________________________
  const enviarItem = async (event) => {
    setIngresoGenerado(false);
    // // this code goes uncommented to simulate no conection
    // //______________________________________________
    // const queue = [
    //   {
    //     origin: 'procIngresos',
    //     payLoad: event,
    //   },
    // ];
    // saveEnCola(queue);
    // cleanUpAll();
    //______________________________________________
    for (let i = 0; i < event.length; i++) {
      const item = {
        Comprobante: event[i].Comprobante,
        Numero: event[i].Numero,
        IdProducto: event[i].IdProducto,
        Descripcion: event[i].Descripcion,
        IdCajon: event[i].IdCajon,
        Letra: event[i].Letra,
        Cantidad: event[i].Cantidad,
        Precio: event[i].Precio,
        Signo: event[i].Signo,
        Estado: event[i].Estado,
        Proceso: event[i].Proceso,
        Lote: event[i].Lote,
        FechaCpte: event[i].FechaCpte,
        IdCompradores: event[i].IdCompradores,
        IdCliente: event[i].IdCliente,
        IdChofer: event[i].IdChofer,
        IdAcompañante: event[i].IdAcompañante,
        Observaciones: event[i].Observaciones,
      };
      let source = Axios.CancelToken.source();
      const urlAxiosRequest = 'http://' + ipBackend + ':3001/procIngresos';
      try {
        await Axios.post(urlAxiosRequest, item, {
          cancelToken: source.token,
        });
      } catch (error) {
        if (Axios.isCancel(error)) {
        } else {
          const queue = [
            {
              origin: 'procIngresos',
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
  const partialCleanUp = () => {
    setCantidad();
    setEstado();
    setEstadoOne(false);
    setEstadoTwo(false);
    setEstadoFour(false);
    setEstadoThree(false);
    setIdProducto();
    setImporte();
    setImporteUSD();
    setPrecio();
    setPrecioUSD();
    setProducto();
    setObservaciones();
  };

  //___________________________________________________________________________________
  const cleanUpAll = () => {
    setCantidad();
    setCarrito([]);
    setCliente();
    setEstado();
    setEstadoOne(false);
    setEstadoTwo(false);
    setEstadoThree(false);
    setEstadoFour(false);
    setIdCliente();
    setIdProducto();
    setImporte();
    setImporteUSD();
    setItemsBeingSent([]);
    setItemsGenerados([]);
    setPrecio();
    setPrecioUSD();
    setProducto();
    setObservaciones();
    setTotal();
    setTotalUSD();
  };

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
              <Text style={styles.label}>Planilla</Text>
            </View>
            {/* ------------------------------ */}
            <View style={[styles.boxContainer, { alignContent: 'flex-end' }]}>
              <TouchableOpacity
                onPress={() => {
                  planillaTouched();
                }}
              >
                <TextInput
                  editable={editPlanilla}
                  onBlur={() => blurPlanilla()}
                  onChangeText={planillaHandler}
                  placeholder={''}
                  ref={planillaRef}
                  style={[styles.box, { width: 100 }]}
                  underlineColorAndroid='transparent'
                  value={planilla || ''}
                />
              </TouchableOpacity>
            </View>
            {/* ------------------------------ */}
            <View
              style={[
                styles.btnTableWrapper,
                isPlatformIOS
                  ? { marginLeft: 15 }
                  : { marginLeft: 65, marginRight: 0 },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.btnTablePlace,
                  {
                    alignSelf: 'flex-end',
                    width: 150,
                  },
                ]}
                onPress={() => compTableTouched()}
              >
                <Text style={[styles.btnTable, { alignSelf: 'center' }]}>
                  Compradores
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* ----------- 2 ----------- */}
          <View style={styles.row}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Comprador</Text>
            </View>
            {/* ------------------------------ */}
            <View style={[styles.boxContainer, { alignItems: 'flex-end' }]}>
              <TouchableOpacity
                onPress={() => {
                  compradorTouched();
                }}
              >
                <TextInput
                  editable={editComprador}
                  onBlur={() => blurComprador()}
                  onChangeText={compradorHandler}
                  placeholder={''}
                  ref={compradorRef}
                  style={[styles.box, { width: 230 }]}
                  underlineColorAndroid='transparent'
                  value={comprador || ''}
                />
              </TouchableOpacity>
            </View>
          </View>
          {/* ----------- 3 ----------- */}
          <View style={styles.row}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Cliente</Text>
            </View>
            {/* ------------------------------ */}
            <View style={[styles.boxContainer, { alignItems: 'flex-end' }]}>
              <TouchableOpacity
                onPress={() => {
                  clienteTouched();
                }}
              >
                <TextInput
                  editable={editCliente}
                  onBlur={() => blurCliente()}
                  onChangeText={clienteHandler}
                  placeholder={''}
                  ref={clienteRef}
                  style={[styles.box, { width: 250 }]}
                  underlineColorAndroid='transparent'
                  value={cliente || ''}
                />
              </TouchableOpacity>
            </View>
          </View>
          {/* ----------- 4 ----------- */}
          <View style={styles.row}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Producto</Text>
            </View>
            {/* ------------------------------ */}
            <View style={[styles.boxContainer, { alignItems: 'flex-end' }]}>
              <TouchableOpacity
                onPress={() => {
                  productoTouched();
                }}
              >
                <TextInput
                  editable={editProducto}
                  onBlur={() => blurProducto()}
                  onChangeText={productoHandler}
                  placeholder={''}
                  ref={productoRef}
                  style={[styles.box, { width: 250 }]}
                  underlineColorAndroid='transparent'
                  value={producto || ''}
                />
              </TouchableOpacity>
            </View>
          </View>
          {/* ----------- 5 ----------- */}
          <View style={styles.row}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Cantidad</Text>
            </View>
            {/* ------------------------------ */}
            <View style={[styles.boxContainer, { alignItems: 'flex-end' }]}>
              <TouchableOpacity
                onPress={() => {
                  cantidadTouched();
                }}
              >
                <TextInput
                  editable={editCantidad}
                  keyboardType='numeric'
                  onBlur={() => blurCantidad()}
                  onChangeText={cantidadHandler}
                  placeholder={''}
                  ref={cantidadRef}
                  style={[styles.box, { width: 105 }]}
                  underlineColorAndroid='transparent'
                  value={cantidad || ''}
                />
              </TouchableOpacity>
            </View>
            {/* ------------------------------ */}
            <View style={styles.floatBoxWrapper}>
              <View style={styles.floatLabelContainer}>
                <Text style={[styles.floatLabel, {}]}>Valor Dolar</Text>
              </View>
              {/* ------------------------------ */}
              <View
                style={[
                  styles.boxContainer,
                  { alignItems: 'flex-end', zIndex: 0 },
                ]}
              >
                <TextInput
                  placeholder={''}
                  style={[styles.box, { width: 125 }]}
                  underlineColorAndroid='transparent'
                  value={valorDolar || ''}
                />
              </View>
            </View>
          </View>
          {/* ----------- 6 ----------- */}
          <View style={styles.row}>
            <View style={styles.labelContainer}>
              <Text style={[styles.label, {}]}>Precio</Text>
            </View>
            {/* ------------------------------ */}
            <View style={[styles.boxContainer, { alignItems: 'flex-end' }]}>
              <TouchableOpacity
                onPress={() => {
                  precioTouched();
                }}
              >
                <TextInput
                  editable={editPrecio}
                  keyboardType='numeric'
                  onBlur={() => blurPrecio()}
                  onChangeText={precioHandler}
                  placeholder={''}
                  ref={precioRef}
                  style={[styles.box, { width: 125, alignSelf: 'flex-start' }]}
                  underlineColorAndroid='transparent'
                  value={precio || ''}
                />
              </TouchableOpacity>
            </View>
            {/* ------------------------------ */}
            <View style={styles.floatBoxWrapper}>
              <View style={styles.floatLabelContainer}>
                <Text style={[styles.floatLabel, {}]}>Importe</Text>
              </View>
              {/* ------------------------------ */}
              <View style={[styles.boxContainer, { zIndex: 0 }]}>
                <TextInput
                  editable={false}
                  placeholder={''}
                  style={[styles.box, { width: 125 }]}
                  underlineColorAndroid='transparent'
                  value={JSON.stringify(importe) || ''}
                />
              </View>
            </View>
          </View>
          {/* ----------- 7  ----------- */}
          <View style={styles.row}>
            <View style={styles.labelContainer}>
              <Text style={[styles.label, { width: 105 }]}>Precio USD</Text>
            </View>
            {/* ------------------------------ */}
            <View style={[styles.boxContainer, { alignItems: 'flex-end' }]}>
              <TouchableOpacity
                onPress={() => {
                  precioUSDTouched();
                }}
              >
                <TextInput
                  editable={editPrecioUSD}
                  keyboardType='numeric'
                  onChangeText={precioUSDHandler}
                  onBlur={() => blurPrecioUSD()}
                  placeholder={''}
                  ref={precioUSDRef}
                  style={[styles.box, { width: 100 }]}
                  underlineColorAndroid='transparent'
                  value={precioUSD || ''}
                />
              </TouchableOpacity>
            </View>
            {/* ------------------------------ */}
            <View style={styles.floatBoxWrapper}>
              <View style={styles.floatLabelContainer}>
                <Text style={[styles.floatLabel, {}]}>Importe USD</Text>
              </View>
              {/* ------------------------------ */}
              <View style={[styles.boxContainer, { zIndex: 0 }]}>
                <TextInput
                  editable={false}
                  placeholder={''}
                  style={[styles.box, { width: 125 }]}
                  underlineColorAndroid='transparent'
                  value={JSON.stringify(importeUSD) || ''}
                />
              </View>
            </View>
          </View>
          {/* ----------- 8  ----------- */}
          <View style={styles.row}>
            <View style={[styles.labelContainer, { paddingTop: 10 }]}>
              <Text style={[styles.label, {}]}>Total</Text>
            </View>
            {/* ------------------------------ */}
            <View style={[styles.boxContainer, { paddingTop: 10 }]}>
              <TextInput
                editable={false}
                placeholder={''}
                style={[styles.box, { width: 135 }]}
                underlineColorAndroid='transparent'
                value={JSON.stringify(total) || ''}
              />
            </View>
            {/* ------------------------------ */}
            <View style={styles.floatBoxWrapper}>
              <View style={[styles.floatLabelContainer, { marginRight: 5 }]}>
                <Text style={[styles.floatLabel, {}]}>Total USD</Text>
              </View>
              {/* ------------------------------ */}
              <View style={[styles.boxContainer, { zIndex: 0 }]}>
                <TextInput
                  editable={false}
                  placeholder={''}
                  style={[styles.box, { width: 125 }]}
                  underlineColorAndroid='transparent'
                  value={JSON.stringify(totalUSD) || ''}
                />
              </View>
            </View>
          </View>
          {/* ----------- 9  ----------- */}
          <View style={[styles.row, { paddingTop: 4 }]}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Obs.</Text>
            </View>
            {/* ------------------------------ */}
            <View style={[styles.boxContainer, { alignItems: 'flex-end' }]}>
              <TouchableOpacity
                onPress={() => {
                  observacionesTouched();
                }}
              >
                <TextInput
                  editable={editObservaciones}
                  onBlur={() => blurObservaciones()}
                  onChangeText={observacionesHandler}
                  placeholder={''}
                  ref={observacionesRef}
                  style={[styles.box, { width: 300 }]}
                  underlineColorAndroid='transparent'
                  value={observaciones || ''}
                />
              </TouchableOpacity>
            </View>
          </View>
          {/* ----------- 10 ----------- */}
          <View style={[styles.row, { marginVertical: 5 }]}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Estado</Text>
            </View>
            <View style={[styles.btnWrapper, { marginLeft: 20 }]}>
              <TouchableOpacity
                style={estadoOne ? styles.btnPlace : styles.offBtnPlace}
                onPress={() => setEstado(1)}
              >
                <Text
                  style={[
                    estadoOne ? styles.btnEstado : styles.offBtnEstado,
                    { paddingHorizontal: 9 },
                  ]}
                >
                  F
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.btnWrapper}>
              <TouchableOpacity
                style={estadoTwo ? styles.btnPlace : styles.offBtnPlace}
                onPress={() => setEstado(2)}
              >
                <Text
                  style={estadoTwo ? styles.btnEstado : styles.offBtnEstado}
                >
                  3/4
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.btnWrapper}>
              <TouchableOpacity
                style={estadoThree ? styles.btnPlace : styles.offBtnPlace}
                onPress={() => setEstado(3)}
              >
                <Text
                  style={estadoThree ? styles.btnEstado : styles.offBtnEstado}
                >
                  1/2
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.btnWrapper}>
              <TouchableOpacity
                style={estadoFour ? styles.btnPlace : styles.offBtnPlace}
                onPress={() => setEstado(4)}
              >
                <Text
                  style={estadoFour ? styles.btnEstado : styles.offBtnEstado}
                >
                  1/4
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* ----------- 11 ----------- */}
          <View style={[styles.row, { marginVertical: 10 }]}>
            <View style={[styles.agregarItemContainer, {}]}>
              <TouchableOpacity
                style={[styles.agregarTouch]}
                onPress={() => agregarItemTouched()}
              >
                <View
                  style={[
                    styles.containerLabelAgregar,
                    { alignSelf: 'flex-start' },
                  ]}
                >
                  <Text
                    style={[
                      styles.labelAgregar,
                      {
                        color: colors.white,
                      },
                    ]}
                  >
                    Agregar Item
                  </Text>
                </View>
                <View style={[styles.btnAgregar, { alignSelf: 'flex-end' }]}>
                  <MaterialIcons
                    name='file-download-done'
                    size={35}
                    color={colors.white}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          {/* ----------- 12 ----------- */}
        </View>
        {/* --------- Footer -------- */}
        <View style={styles.footerContainer}>
          <View style={styles.btnFooterWrapper}>
            <TouchableOpacity
              style={styles.footerTouchable}
              onPress={() => nuevoIngreso()}
            >
              <MaterialIcons
                name='post-add'
                size={30}
                style={styles.footerIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.btnFooterWrapper}>
            <TouchableOpacity
              style={styles.footerTouchable}
              onPress={() => enviarCotizacion()}
            >
              <Icon name='email-send-outline' color={colors.white} size={30} />
            </TouchableOpacity>
          </View>
          <View style={styles.btnFooterWrapper}>
            <TouchableOpacity
              style={styles.footerTouchable}
              onPress={() => verCarrito()}
            >
              <MaterialIcons
                name='shopping-cart'
                size={30}
                style={styles.footerIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.btnFooterWrapper}>
            <TouchableOpacity
              style={styles.footerTouchable}
              onPress={() => handleEnviarIngreso()}
            >
              <MaterialIcons name='send' size={30} style={styles.footerIcon} />
            </TouchableOpacity>
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
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 4,
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
  floatLabelContainer: {
    backgroundColor: 'white', // Same color as background
    alignSelf: 'flex-start', // Have View be same width as Text inside
    paddingHorizontal: 3, // Amount of spacing between border and first/last letter
    marginStart: 10, // How far right do you want the label to start
    zIndex: 1, // Label must overlap border
    elevation: 1, // Needed for android
    shadowColor: 'white', // Same as background color because elevation: 1 creates a shadow that we don't want
    position: 'absolute', // Needed to be able to precisely overlap label with border
    top: -12, // Vertical position of label. Eyeball it to see where label intersects border.
  },
  floatLabel: {
    alignSelf: 'flex-start',
    color: colors.blue,
    fontSize: 14,
    fontWeight: 'bold',
    justifyContent: 'center',
  },
  floatBoxWrapper: {
    marginTop: 10,
    marginLeft: 20,
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
  offBtnPlace: {
    backgroundColor: colors.lightGrey,
    borderRadius: 100,
    justifyContent: 'flex-start',
    padding: 10,
  },
  offBtnEstado: {
    alignSelf: 'flex-start',
    color: colors.greenBlue,
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
  agregarItemContainer: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
  agregarTouch: {
    flexDirection: 'row',
    backgroundColor: colors.greenBlue,
    borderRadius: 20,
    paddingHorizontal: 25,
    paddingVertical: 6,
  },
  btnAgregar: {
    alignItems: 'flex-end',
  },
  containerLabelAgregar: {
    paddingTop: 5,
  },
  labelAgregar: {
    color: colors.white,
    fontSize: 19,
    fontWeight: 'bold',
    marginRight: 20,
  },
  footerContainer: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 75,
  },
  btnFooterWrapper: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  footerTouchable: {
    backgroundColor: colors.blue,
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  footerIcon: {
    color: colors.white,
  },
});

export default ProcIngresos;
