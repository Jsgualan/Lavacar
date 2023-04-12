const express = require('express');
const { firestore } = require('firebase-admin');
const app = express();
const { FieldValue } = require('firebase-admin/firestore')
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
        "idUser": req.body.idUser,
        "last_name": req.body.lastName,
        "name": req.body.name,
        "password": req.body.password,
        "phone": req.body.phone,
        "post": req.body.post,
        "rol": req.body.rol,
        "state": true
    }
    console.log(data);
        
    await db.collection('User').doc(req.body.idOperator).set(data)
    res.status(200).send({en: 1, m: "Operador registrado correctamente"})    
            
})

app.post('/saveReserve', async (req, res) => {
    const data = {
        "idReserve": req.body.idReserve,
        "brand_vehicle": req.body.brandVehicle,
        "color_vehicle": req.body.colorVehicle,
        "date_reserve": req.body.dateReserve,
        "hour_reserve": req.body.hourReserve,
        "description_service": req.body.descriptionService,
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
        "state": req.body.state,
    }
        
    await db.collection('Reserve').doc(req.body.idReserve).set(data)
    res.status(200).send({en: 1, m: "Reserva registrada correctamente"})    
            
})

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
        res.status(200).send({ en: 1, m:'Solicitud rechazada correctamente'});
    })
})

app.put('/addOperatorReserve/:idReserve', async (req, res) => {
    const data = {
        "idOperator": req.body.idOperator,
        "name_operator": req.body.name_operator,
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
        "description_service": req.body.descriptionService,
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

app.put('/editOperator/:idOperator', async (req, res) => {
    const data = {
        "id": req.body.idOperator,
        "name": req.body.name,
        "last_name": req.body.lastName,
        "dni": req.body.dni,
        "phone": req.body.phone,
        "password": req.body.password,
        "post": req.body.post,
        "state": true
    }
    await db.collection('User').where("idUser","==",req.params.idOperator).get().then((querySnapshot) => {
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
        "id": req.body.idUser,
        "email": req.body.email,
        "last_name": req.body.lastName,
        "name": req.body.name,
        "password": req.body.password,
        "rol": req.body.rol,
    }
        
    await db.collection('User').doc(req.body.idUser).set(data)
    res.status(200).send({en: 1, m: "Usuario registrado correctamente"})    
            
})

app.put('/deleteOperator/:idOperator', async (req, res) => {
    const data = {
        "state": req.body.state,
    }
    await db.collection('User').where("idUser","==",req.params.idOperator).get().then((querySnapshot) => {
        querySnapshot.forEach((doc)=>{
            doc.ref.update(data)
        })
        res.status(200).send({ en: 1, m:'Operador eliminado correctamente'});
    })
})


module.exports = app;