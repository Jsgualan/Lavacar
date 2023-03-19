const express = require('express');
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

app.get('/hourDay/:idDay', async (req, res) => {
    const consult = await db.collection('Schedule').where('id_day','==', req.params.idDay).where('state','==',true).get()
    const response = consult.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) 
    console.log(response);
    if (response.length > 0) {
       return res.status(200).send({ en: 1, lH:response});
    }
    res.status(200).send({en: -1, m: "No hay horarios disponibles"});
    
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
        
    const consult = await db.collection('Operator').doc(req.body.dni).set(data)
    res.status(200).send({en: 1, m: "Operador registrado correctamente"})    
            
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