const express = require('express');
const app = express();
const { FieldValue } = require('firebase-admin/firestore')
const { db } = require('../firebase')

app.get('/login/:type', async (req, res) => {
    const type = req.body.type;
    const consult = db.collection('Rol').doc(1)
    const result = await consult.get()
    if (!result.exists) {
        //return res.status(200).send({ en: -1, m:'Usuario o contraseña incorrecta'});
    }
    //res.status(200).send({en: 1, r: result.data()});
})

app.get('/rol', async (req, res) => {
    const consult = db.collection('Rol').doc('qSyypshKJcmHeeO8R2np')
    const result = await consult.get()
    if (!result.exists) {
        return res.status(200).send({ en: -1, m:'No hay datos que mostrar'});
    }
    res.status(200).send({en: 1, r: result.data()});
})


module.exports = app;