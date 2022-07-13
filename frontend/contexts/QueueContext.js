import React, { createContext, useState, useEffect, useContext } from 'react';

import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Setting a timer']); // this is required for timmers with several minutes

import GeneralContext from './GeneralContext';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from 'axios';

const QueueContext = createContext();

const QueueProvider = ({ children }) => {
  //______________________________________________________________________________________
  const { connected, ipBackend, ipRequestDone } = useContext(GeneralContext);

  //______________________________________________________________________________________
  const [someQueryQueue, setSomeQueryQueue] = useState(false);
  const [executeAreQueryQueue, setExecuteAreQueryQueue] = useState(false);
  //--------------------------------------------------------------------------------------
  const [cola, setCola] = useState();
  const [queryToSend, setQueryToSend] = useState([]);

  //______________________________________________________________________________________

  //___________________________________________________________________________________
  const saveEnCola = async (event) => {
    try {
      const jsonValue = await AsyncStorage.getItem('queryEnCola');
      if (jsonValue != null) {
        const oldQueue = JSON.parse(jsonValue);
        queryToSend.push(...oldQueue);
        const newQueue = [...queryToSend, ...event];
        try {
          await AsyncStorage.setItem('queryEnCola', JSON.stringify(newQueue));
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          await AsyncStorage.setItem('queryEnCola', JSON.stringify(event));
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
    setQueryToSend([]);
  };

  //______________________________________________________________________________________
  useEffect(() => {
    if (ipRequestDone === true && connected === true) {
      setExecuteAreQueryQueue(true);
    }
  }, [connected, ipRequestDone]);

  // ______________________________________________________________________________________
  useEffect(() => {
    if (executeAreQueryQueue === true) {
      areSomeQueryQueue();
      setInterval(function () {
        checkQueryQueue();
      }, 1800000); // every 30 min checks the queue
    }
  }, [executeAreQueryQueue]);

  // ______________________________________________________________________________________
  const checkQueryQueue = () => {
    if (ipRequestDone === true && connected === true) {
      setExecuteAreQueryQueue(true);
    }
  };

  //______________________________________________________________________________________
  const areSomeQueryQueue = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('queryEnCola');
      if (jsonValue != null) {
        const queue = JSON.parse(jsonValue);
        setCola(queue);
        setSomeQueryQueue(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setExecuteAreQueryQueue(false);
    }
  };

  //___________________________________________________________________________________
  useEffect(() => {
    if (someQueryQueue === true) {
      setSomeQueryQueue(false);
      sendQueryEnCola(cola);
    }
  }, [someQueryQueue]);

  //___________________________________________________________________________________
  const sendQueryEnCola = (cola) => {
    for (let i = 0; i < cola.length; i++) {
      //-------------------------------------------------
      if (cola[i].origin === 'altaClave') {
        enviarArchClaveAlta(cola[i].payLoad);
      } else if (cola[i].origin === 'modifClave') {
        enviarArchClaveModif(cola[i].payLoad);
        //-----------------------------------------------
      } else if (cola[i].origin === 'altaCliente') {
        enviarArchClienteAlta(cola[i].payLoad);
      } else if (cola[i].origin === 'modifCliente') {
        enviarArchClienteModif(cola[i].payLoad);
        //-----------------------------------------------
      } else if (cola[i].origin === 'altaProveedor') {
        enviarArchProveeAlta(cola[i].payLoad);
      } else if (cola[i].origin === 'modifProveedor') {
        enviarArchProveeModif(cola[i].payLoad);
        //-----------------------------------------------
      } else if (cola[i].origin === 'procGastos') {
        enviarProcGastos(cola[i].payLoad);
        //-----------------------------------------------
      } else if (cola[i].origin === 'procIngresos') {
        enviarProcIngresos(cola[i].payLoad);
      }
    }
    removeCola();
    setCola();
  };

  //___________________________________________________________________________________
  const enviarArchClaveAlta = async (event) => {
    const item = {
      IdClaves: event[0].IdClaves,
      Descripcion: event[0].Descripcion,
      Valor: event[0].Valor,
      Variable: event[0].Variable,
    };
    let source = Axios.CancelToken.source();
    const urlAxiosRequest = 'http://' + ipBackend + ':3001/altaClave';
    try {
      await Axios.post(urlAxiosRequest, item, {
        cancelToken: source.token,
      });
    } catch (error) {
      if (Axios.isCancel(error)) {
      } else {
        throw error;
      }
    }
  };

  //___________________________________________________________________________________
  const enviarArchClaveModif = async (event) => {
    const item = {
      IdClaves: event[0].IdClaves,
      Descripcion: event[0].Descripcion,
      Valor: event[0].Valor,
      Variable: event[0].Variable,
    };
    let source = Axios.CancelToken.source();
    const urlAxiosRequest = 'http://' + ipBackend + ':3001/modifClave';
    try {
      await Axios.put(urlAxiosRequest, item, {
        cancelToken: source.token,
      });
    } catch (error) {
      if (Axios.isCancel(error)) {
      } else {
        throw error;
      }
    }
  };

  //___________________________________________________________________________________
  const enviarArchClienteAlta = async (event) => {
    const item = {
      IdComprador: event[0].IdComprador,
      IdCliente: event[0].IdCliente,
      RazonSocial: event[0].RazonSocial,
      Domicilio: event[0].Domicilio,
      IdLocalidad: event[0].IdLocalidad,
      IdProvincia: event[0].IdProvincia,
      Telefono: event[0].Telefono,
      Responsable: event[0].Responsable,
      IdCategoriaIVA: event[0].IdCategoriaIVA,
      Cuit: event[0].Cuit,
      Observaciones: event[0].Observaciones,
      Celular: event[0].Celular,
      Email: event[0].Email,
      EmailFW: event[0].EmailFW,
      CodPostal: event[0].CodPostal,
      Descuento: event[0].Descuento,
      Habilitado: event.Habilitado,
      ListaPrecios: event[0].ListaPrecios,
      IdZona: event[0].IdZona,
      IdForPago: event[0].IdForPago,
      AcuVenta: event[0].AcuVenta,
    };
    let source = Axios.CancelToken.source();
    const urlAxiosRequest = 'http://' + ipBackend + ':3001/altaCliente';
    try {
      await Axios.post(urlAxiosRequest, item, {
        cancelToken: source.token,
      });
    } catch (error) {
      if (Axios.isCancel(error)) {
      } else {
        throw error;
      }
    }
  };

  //___________________________________________________________________________________
  const enviarArchClienteModif = async (event) => {
    const item = {
      IdComprador: event[0].IdComprador,
      IdCliente: event[0].IdCliente,
      RazonSocial: event[0].RazonSocial,
      Domicilio: event[0].Domicilio,
      IdLocalidad: event[0].IdLocalidad,
      IdProvincia: event[0].IdProvincia,
      Telefono: event[0].Telefono,
      Responsable: event[0].Responsable,
      IdCategoriaIVA: event[0].IdCategoriaIVA,
      Cuit: event[0].Cuit,
      Observaciones: event[0].Observaciones,
      Celular: event[0].Celular,
      Email: event[0].Email,
      EmailFW: event[0].EmailFW,
      CodPostal: event[0].CodPostal,
      Descuento: event[0].Descuento,
      Habilitado: event.Habilitado,
      ListaPrecios: event[0].ListaPrecios,
      IdZona: event[0].IdZona,
      IdForPago: event[0].IdForPago,
      AcuVenta: event[0].AcuVenta,
    };
    let source = Axios.CancelToken.source();
    const urlAxiosRequest = 'http://' + ipBackend + ':3001/modifCliente';
    try {
      await Axios.put(urlAxiosRequest, item, {
        cancelToken: source.token,
      });
    } catch (error) {
      if (Axios.isCancel(error)) {
      } else {
        throw error;
      }
    }
  };

  //___________________________________________________________________________________
  const enviarArchProveeAlta = async (event) => {
    const item = {
      IdProveedor: event[0].IdProveedor,
      RazonSocial: event[0].RazonSocial,
      Domicilio: event[0].Domicilio,
      IdLocalidad: event[0].IdLocalidad,
      IdProvincia: event[0].IdProvincia,
      Telefono: event[0].Telefono,
      Responsable: event[0].Responsable,
      IdCategoriaIVA: event[0].IdCategoriaIVA,
      Cuit: event[0].Cuit,
      Observaciones: event[0].Observaciones,
      Celular: event[0].Celular,
      Email: event[0].Email,
      HabCtaCte: event[0].HabCtaCte,
      Saldo: event[0].Saldo,
      IdTipo: event[0].IdTipo,
      IdForPago: event[0].IdForPago,
      Orden: event[0].Orden,
    };
    let source = Axios.CancelToken.source();
    const urlAxiosRequest = 'http://' + ipBackend + ':3001/altaProveedor';
    try {
      await Axios.post(urlAxiosRequest, item, {
        cancelToken: source.token,
      });
    } catch (error) {
      if (Axios.isCancel(error)) {
      } else {
        throw error;
      }
    }
  };

  //___________________________________________________________________________________
  const enviarArchProveeModif = async (event) => {
    const item = {
      IdProveedor: event[0].IdProveedor,
      RazonSocial: event[0].RazonSocial,
      Domicilio: event[0].Domicilio,
      IdLocalidad: event[0].IdLocalidad,
      IdProvincia: event[0].IdProvincia,
      Telefono: event[0].Telefono,
      Responsable: event[0].Responsable,
      IdCategoriaIVA: event[0].IdCategoriaIVA,
      Cuit: event[0].Cuit,
      Observaciones: event[0].Observaciones,
      Celular: event[0].Celular,
      Email: event[0].Email,
      HabCtaCte: event[0].HabCtaCte,
      Saldo: event[0].Saldo,
      IdTipo: event[0].IdTipo,
      IdForPago: event[0].IdForPago,
      Orden: event[0].Orden,
    };
    let source = Axios.CancelToken.source();
    const urlAxiosRequest = 'http://' + ipBackend + ':3001/modifProveedor';
    try {
      await Axios.put(urlAxiosRequest, item, {
        cancelToken: source.token,
      });
    } catch (error) {
      if (Axios.isCancel(error)) {
      } else {
        throw error;
      }
    }
  };

  //___________________________________________________________________________________
  const enviarProcGastos = async (event) => {
    for (let i = 0; i < event.length; i++) {
      const item = {
        IdConcepto: event[i].IdConcepto,
        Descripcion: event[i].Descripcion,
        FechaCpte: event[i].FechaCpte,
        Importe: event[i].Importe,
        Observaciones: event[i].Observaciones,
        IdCliente: event[i].IdCliente,
        ImporteDolar: event[i].ImporteDolar,
        ValorDolar: event[i].ValorDolar,
        Numero: event[i].Numero,
        Signo: event[i].Signo,
        IdCuenta: event[i].IdCuenta,
        IdChofer: event[i].IdChofer,
        IdAcompañante: event[i].IdAcompañante,
        FechaIngreso: event[i].FechaIngreso,
        Cantidad: event[i].Cantidad,
        IdBanco: event[i].IdBanco,
        NroCheque: event[i].NroCheque,
      };
      let source = Axios.CancelToken.source();
      const urlAxiosRequest = 'http://' + ipBackend + ':3001/procGastos';
      try {
        await Axios.post(urlAxiosRequest, item, {
          cancelToken: source.token,
        });
      } catch (error) {
        if (Axios.isCancel(error)) {
        } else {
          throw error;
        }
      }
    }
  };

  //___________________________________________________________________________________
  const enviarProcIngresos = async (event) => {
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
          throw error;
        }
      }
    }
  };

  //______________________________________________________________________________________
  const removeCola = async () => {
    try {
      await AsyncStorage.removeItem('queryEnCola');
    } catch (error) {
      console.log(error);
    }
  };

  //___________________________________________________________________________________
  //___________________________________________________________________________________
  // data: states & functions exported by the provider
  const data = {
    saveEnCola,
  };

  return <QueueContext.Provider value={data}>{children}</QueueContext.Provider>;
};

export { QueueProvider };
export default QueueContext;
