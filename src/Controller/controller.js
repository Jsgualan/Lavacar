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
    const consult = await db.collection('Operator').where('state','==', true).get()
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
    const consult = await db.collection('Operator').where('dni','==', req.params.dni).get()
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
        "name": req.body.name,
        "last_name": req.body.lastName,
        "dni": req.body.dni,
        "phone": req.body.phone,
        "password": req.body.password,
        "post": req.body.post,
        "state": true
    }
        
    await db.collection('Operator').doc(req.body.dni).set(data)
    res.status(200).send({en: 1, m: "Operador registrado correctamente"})    
            
})

app.post('/saveReserve', async (req, res) => {
    const data = {
        "brand_vehicle": req.body.brandVehicle,
        "color_vehicle": req.body.colorVehicle,
        "date_hour_reserve": req.body.dateHourVehicle,
        "description_service": req.body.descriptionService,
        "idOperator": req.body.idOperator,
        "idUser": req.body.idUser,
        "last_name_user": req.params.lastNameUser,
        "late_vehicle": req.params.lateVehicle,
        "location": firestore.GeoPoint(req.params.latitude,req.params.longitude),
        "model_vehicle": req.body.modelVehicle,
        "name_user": req.body.nameUser,
        "type_vehicle": req.body.typeVehicle,
    }
        
    await db.collection('Reserve').set(data)
    res.status(200).send({en: 1, m: "Reserva registrada correctamente"})    
            
})













app.get('/rol', async (req, res) => {
    const querySnapshot = await db.collection("Rol").get()
    const rol = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) 

    if (rol.length > 0) {
        return res.status(200).send({en: 1, r: rol});
    }
    res.status(200).send({ en: -1, m:'No hay datos que mostrar'});
})


module.exports = app;