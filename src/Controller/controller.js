const express = require('express');
const app = express();
const { FieldValue } = require('firebase-admin/firestore')
const { db } = require('../firebase')

app.get('/login/:type', async (req, res) => {
    const type = req.body.type;
    const consult = db.collection('Rol').doc(type)
    const result = await consult.get()
    if (!result.exists) {
        //return res.status(200).send({ en: -1, m:'Usuario o contraseña incorrecta'});
    }
    //res.status(200).send({en: 1, r: result.data()});
})

app.get('/rol', async (req, res) => {
    const querySnapshot = await db.collection("Rol").get()
    const rol = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) 
    if (!rol.exists) {
        return res.status(200).send({ en: -1, m:'No hay datos que mostrar'});
    }
    res.status(200).send({en: 1, r: rol.data()});
})


module.exports = app;