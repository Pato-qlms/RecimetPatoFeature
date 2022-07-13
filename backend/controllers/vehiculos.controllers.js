//_______________________________________________________________________________________
const mysql = require('mysql')

const vehiculos_recim = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'patricio177',
  database: 'vehiculosdev_recim',
  port: 3306,
})

//___________________________________________________

// const vehiculos_recim = mysql.createConnection({
//   host: 'recimet.ddns.net',
//   user: 'root',
//   password: 'ka7224',
//   database: 'vehiculos_recim',
//   port: 3306,
// });

//___________________________________________________

// const vehiculos_recim = mysql.createConnection({
//   host: 'kayrossistemas.ddns.net',
//   user: 'root',
//   password: 'ka7224',
//   database: 'vehiculos_recim',
//   port: 3306,
// });

//_______________________________________________________________________________________
// Archivos proveedores
//_______________________________________________________________________________________
const ProveedoresControllers = (req, res) => {
  vehiculos_recim.query('SELECT * FROM Proveedores', (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.send(result)
    }
  })
}

//_______________________________________________________________________________________
const AltaProveedor = (req, res) => {
  const IdProveedor = req.body.IdProveedor
  const RazonSocial = req.body.RazonSocial
  const Domicilio = req.body.Domicilio
  const IdLocalidad = req.body.IdLocalidad
  const IdProvincia = req.body.IdProvincia
  const Telefono = req.body.Telefono
  const CodPostal = req.body.CodPostal
  const Responsable = req.body.Responsable
  const IdCategoriaIVA = req.body.IdCategoriaIVA
  const Cuit = req.body.Cuit
  const Observaciones = req.body.Observaciones
  const Celular = req.body.Celular
  const Email = req.body.Email
  const HabCtaCte = req.body.HabCtaCte
  const Saldo = req.body.Saldo
  const IdTipo = req.body.IdTipo
  const IdForPago = req.body.IdForPago
  const Web = req.body.Web
  const Orden = req.body.Orden
  vehiculos_recim.query(
    'INSERT Proveedores SET IdProveedor = ?, RazonSocial = ?, Domicilio = ?, IdLocalidad = ?, IdProvincia = ?, Telefono = ?, CodPostal = ?, Responsable = ?, IdCategoriaIVA = ?, Cuit = ?, Observaciones = ?, Celulares = ?, Email = ?, HabCtaCte = ?, Saldo = ?, IdTipo = ?, IdForPago = ?, Web = ?, Orden = ? ',
    [
      IdProveedor,
      RazonSocial,
      Domicilio,
      IdLocalidad,
      IdProvincia,
      Telefono,
      CodPostal,
      Responsable,
      IdCategoriaIVA,
      Cuit,
      Observaciones,
      Celular,
      Email,
      HabCtaCte,
      Saldo ,
      IdTipo,
      IdForPago,
      Web,
      Orden
    ],
    (err, result) => {
      if (err) {
        console.log(err)
      } else {
        res.send(result)
      }
    }
  )
}

//_______________________________________________________________________________________
const ModifProveedor = (req, res) => {
  const IdProveedor = req.body.IdProveedor
  const RazonSocial = req.body.RazonSocial
  const Domicilio = req.body.Domicilio
  const IdLocalidad = req.body.IdLocalidad
  const IdProvincia = req.body.IdProvincia
  const Telefono = req.body.Telefono
  const CodPostal = req.body.CodPostal
  const Responsable = req.body.Responsable
  const IdCategoriaIVA = req.body.IdCategoriaIVA
  const Cuit = req.body.Cuit
  const Observaciones = req.body.Observaciones
  const Celular = req.body.Celular
  const Email = req.body.Email
  const HabCtaCte = req.body.HabCtaCte
  const Saldo = req.body.Saldo
  const IdForPago = req.body.IdForPago
  const Orden = req.body.Orden
  const IdTipo = req.body.IdTipo
  const Web = req.body.Web
  vehiculos_recim.query(
   'UPDATE Proveedores SET  RazonSocial = ?, Domicilio = ?, IdLocalidad = ?, IdProvincia = ?, Telefono = ?, CodPostal = ?, Responsable = ?, IdCategoriaIVA = ?, Cuit = ?, Observaciones = ?, Celulares = ?, Email = ?, HabCtaCte = ?, Saldo = ?, IdForPago = ?, Orden = ?, IdTipo = ?, Web = ? WHERE IdProveedor = ?',
    [
      RazonSocial,
      Domicilio,
      IdLocalidad,
      IdProvincia,
      Telefono,
      CodPostal,
      Responsable,
      IdCategoriaIVA,
      Cuit,
      Observaciones,
      Celular,
      Email,
      HabCtaCte,
      Saldo ,
      IdTipo,
      IdForPago,
      Orden,
      Web,
      IdProveedor,
    ],
    (err, result) => {
      if (err) {
        console.log(err)
      } else {
        res.send(result)
      }
    }
  )
}

//_______________________________________________________________________________________
//_______________________________________________________________________________________
module.exports = {
  ProveedoresControllers,
  AltaProveedor,
  ModifProveedor,
}

//_______________________________________________________________________________________
