const express = require('express');
const axios = require('axios'); 
const { firestore } = require('firebase-admin');
const app = express();
const { db } = require('../firebase')

app.get('/login/:email/:password', async (req, res) => {
    const consult = await db.collection('User').where('email','==', req.params.email).where('password', '==', req.params.password).get()
    const response = consult.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) 
    
    if (response.length > 0) {
        return res.status(200).send({en: 1, u: response[0]});
    }
    res.status(200).send({ en: -1, m:'Usuario o contraseña incorrecto '}); 
    
})

app.get('/operator', async (req, res) => {
    const consult = await db.collection('User').where('state','==', true).where('rol', '==', 3).get()
    const response = consult.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) 
    
    if (response.length > 0) {
        return res.status(200).send({en: 1, lP: response});
    }
    res.status(200).send({ en: -1, m:'No hay resultados que mostrar'});
})

app.get('/checkOperator/:dni', async (req, res) => {
    const consult = await db.collection('User').where('dni','==', req.params.dni).get()
    const response = consult.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) 
    
    if (response.length > 0) {
        return res.status(200).send({en: -1, m: "Operador registrado anteriormente"});
    }
    res.status(200).send({ en: 1, m:'Operador permitido'});
})

app.get('/hourDay/:day', async (req, res) => {
    const consult = await db.collection('Hour').where('day','==', req.params.day).where('state','==',true).get()
    const response = consult.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) 
    
    if (response.length > 0) {
        return res.status(200).send({en: 1, h: response[0]});
    }
    res.status(200).send({ en: -1, m:'No hay horario registrado'});º
})

app.post('/saveOperator', async (req, res) => {
    const data = {
        "dni": req.body.dni,
        "email": req.body.email,
        "id": req.body.idUser,
        "last_name": req.body.lastName,
        "name": req.body.name,
        "password": req.body.password,
        "phone": req.body.phone,
        "post": req.body.post,
        "rol": req.body.rol,
        "state": true
    }
        
    await db.collection('User').doc(req.body.idUser).set(data)
    res.status(200).send({en: 1, m: "Operador registrado correctamente"})    
            
})

app.post('/saveReserve', async (req, res) => {
    const data = {
        "idReserve": req.body.idReserve,
        "brand_vehicle": req.body.brandVehicle,
        "color_vehicle": req.body.colorVehicle,
        "date_reserve": req.body.dateReserve,
        "hour_reserve": req.body.hourReserve,
        "name_service": req.body.nameService,
        "idOperator": req.body.idOperator,
        "name_operator": req.body.nameOperator,
        "idUser": req.body.idUser,
        "last_name_user": req.body.lastNameUser,
        "late_vehicle": req.body.lateVehicle,
        "location": new firestore.GeoPoint(req.body.latitude,req.body.longitude),
        "model_vehicle": req.body.modelVehicle,
        "name_user": req.body.nameUser,
        "type_vehicle": req.body.typeVehicle,
        "type_service": req.body.typeService,
        "price": req.body.price,
        "description_service": req.body.descriptionService,
        "qualification": 0,
        "additionalValue": req.body.additionalValue,
        "state": req.body.state,
    }


    const consult = await db.collection('User').where('rol','==', 1).get()
    const response = consult.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) 

    sendMessage(response[0].token);
      
        
    await db.collection('Reserve').doc(req.body.idReserve).set(data)
    res.status(200).send({en: 1, m: "Reserva registrada correctamente"})    
            
})

function sendMessage(token){
    let data = JSON.stringify({
        "to": token,
        "notification": {
          "body": "Notificación",
          "content_available": true,
          "priority": "high",
          "subtitle": "Se ha solicitado una nueva reserva",
          "title": "Nueva reserva"
        }
      });
      
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://fcm.googleapis.com/fcm/send',
        headers: { 
          'Authorization': 'key=AAAAcmmgeJU:APA91bHF2JXY4CjvUrzDHYodStt4kjT_VUWOMJBPIak6XGMe_obsvw7Um-i38vdekV71RnIsg9CUt-9uyZP4fTp4W6lNZTaUHX2L2a9ph1Rn5CFJhbLeHkrrXe-t0LGd4YiwW4PP9JB8', 
          'Content-Type': 'application/json'
        },
        data : data
      };
      
      axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
      
}


app.get('/getReserve/:date', async (req, res) => {
    const consult = await db.collection('Reserve').where('date_reserve','==', req.params.date).where('state','!=', 4).get()
    const response = consult.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) 
    
    if (response.length > 0) {
        return res.status(200).send({en: 1, lR: response});
    }
    res.status(200).send({ en: -1, m:'No hoy notificaciones pendientes'});
})

app.put('/declineNotification/:idReserve', async (req, res) => {
    const data = {
        "state": req.body.state,
    }
    await db.collection('Reserve').where("idReserve","==",req.params.idReserve).get().then((querySnapshot) => {
        querySnapshot.forEach((doc)=>{
            doc.ref.update(data)
        })
        res.status(200).send({ en: 1, m:'Reserva eliminada correctamente'});
    })
})

app.put('/addOperatorReserve/:idReserve', async (req, res) => {
    const data = {
        "idOperator": req.body.idOperator,
        "name_operator": req.body.name_operator,
        "additionalValue": req.body.additionalValue,
        "state": req.body.state,
    }
    await db.collection('Reserve').where("idReserve","==",req.params.idReserve).get().then((querySnapshot) => {
        querySnapshot.forEach((doc)=>{
            doc.ref.update(data)
        })
        res.status(200).send({ en: 1, m:'Reserva registrada correctamente'});
    })
})

app.put('/editReserve/:idReserve', async (req, res) => {
    const data = {
        "idReserve": req.body.idReserve,
        "brand_vehicle": req.body.brandVehicle,
        "color_vehicle": req.body.colorVehicle,
        "date_reserve": req.body.dateReserve,
        "hour_reserve": req.body.hourReserve,
        "name_service": req.body.nameService,
        "idOperator": req.body.idOperator,
        "name_operator": req.body.nameOperator,
        "idUser": req.body.idUser,
        "last_name_user": req.body.lastNameUser,
        "late_vehicle": req.body.lateVehicle,
        "location": new firestore.GeoPoint(req.body.latitude,req.body.longitude),
        "model_vehicle": req.body.modelVehicle,
        "name_user": req.body.nameUser,
        "type_vehicle": req.body.typeVehicle,
        "type_service": req.body.typeService,
        "price": req.body.price,
        "description_service": req.body.descriptionService,
        "additionalValue": req.body.additionalValue,
        "state": req.body.state,
    }
    await db.collection('Reserve').where("idReserve","==",req.params.idReserve).get().then((querySnapshot) => {
        querySnapshot.forEach((doc)=>{
            doc.ref.update(data)
        })
        res.status(200).send({ en: 1, m:'Reserva editada correctamente'});
    })
})

app.put('/finishReserve/:idReserve', async (req, res) => {
    const data = {
        "state": req.body.state,
    }
    await db.collection('Reserve').where("idReserve","==",req.params.idReserve).get().then((querySnapshot) => {
        querySnapshot.forEach((doc)=>{
            doc.ref.update(data)
        })
        res.status(200).send({ en: 1, m:'Reserva finalizada correctamente'});
    })
})

app.put('/editOperator/:idUser', async (req, res) => {
    const data = {
        "dni": req.body.dni,
        "email": req.body.email,
        "id": req.body.idUser,
        "last_name": req.body.lastName,
        "name": req.body.name,
        "password": req.body.password,
        "phone": req.body.phone,
        "post": req.body.post,
        "state": true
    }
    
    await db.collection('User').where("id","==",req.params.idUser).get().then((querySnapshot) => {
        querySnapshot.forEach((doc)=>{
            doc.ref.update(data)
        })
        res.status(200).send({ en: 1, m:'Operador editado correctamente'});
    })
})


app.get('/checkUser/:email', async (req, res) => {
    const consult = await db.collection('User').where('email','==', req.params.email).get()
    const response = consult.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) 
    
    if (response.length > 0) {
        return res.status(200).send({en: 1, u: response[0]});
    }
    res.status(200).send({ en: -1, m:'Usuario no registrado'});
})

app.post('/saveUser', async (req, res) => {
    const data = {
        "dni": req.body.dni,
        "email": req.body.email,
        "id": req.body.idUser,
        "last_name": req.body.lastName,
        "name": req.body.name,
        "password": req.body.password,
        "phone": req.body.phone,
        "post": req.body.post,
        "rol": req.body.rol,
        "state": true,
    }
        
    await db.collection('User').doc(req.body.idUser).set(data)
    res.status(200).send({en: 1, m: "Usuario registrado correctamente"})    
            
})

app.put('/deleteOperator/:idUser', async (req, res) => {
    const data = {
        "state": req.body.state,
    }
    await db.collection('User').where("id","==",req.params.idUser).get().then((querySnapshot) => {
        querySnapshot.forEach((doc)=>{
            doc.ref.update(data)
        })
        res.status(200).send({ en: 1, m:'Operador eliminado correctamente'});
    })
})

app.put('/saveToken/:idUser', async (req, res) => {
    const data = {
        "token": req.body.token,
    }
    await db.collection('User').where("id","==",req.params.idUser).get().then((querySnapshot) => {
        querySnapshot.forEach((doc)=>{
            doc.ref.update(data)
        })
        res.status(200).send({ en: 1, m:'Token guardado correctamente'});
    })
})

app.post('/saveService', async (req, res) => {
    const data = {
        "id": req.body.idService,
        "name": req.body.name,
        "price": req.body.price,
        "description": req.body.description,
        "state": true,
    }
        
    await db.collection('Service').doc(req.body.idService).set(data)
    res.status(200).send({en: 1, m: "Servicio registrado correctamente"})    
            
})

app.get('/getService', async (req, res) => {
    const consult = await db.collection('Service').where('state','==', true).get()
    const response = consult.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) 
    
    if (response.length > 0) {
        return res.status(200).send({en: 1, lS: response});
    }
    res.status(200).send({ en: -1, m:'No hay resultados que mostrar'});
})

app.put('/deleteService/:idService', async (req, res) => {
    const data = {
        "state": req.body.state,
    }
    await db.collection('Service').where("id","==",req.params.idService).get().then((querySnapshot) => {
        querySnapshot.forEach((doc)=>{
            doc.ref.update(data)
        })
        res.status(200).send({ en: 1, m:'Servicio eliminado correctamente'});
    })
})

app.put('/editService/:idService', async (req, res) => {
    const data = {
        "name": req.body.name,
        "price": req.body.price,
        "description": req.body.description
    }
    await db.collection('Service').where("id","==",req.params.idService).get().then((querySnapshot) => {
        querySnapshot.forEach((doc)=>{
            doc.ref.update(data)
        })
        res.status(200).send({ en: 1, m:'Servicio actualizado correctamente'});
    })
})

app.put('/editQualification/:idReserve', async (req, res) => {
    const data = {
        "qualification": req.body.qualification,
    }
    await db.collection('Reserve').where("idReserve","==",req.params.idReserve).get().then((querySnapshot) => {
        querySnapshot.forEach((doc)=>{
            doc.ref.update(data)
        })
        res.status(200).send({ en: 1, m:'Calificación enviada correctamente'});
    })
})



module.exports = app;