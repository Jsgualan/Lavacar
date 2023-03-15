const express = require('express');
const app = express();
const { FieldValue } = require('firebase-admin/firestore')
const { db } = require('../firebase')

app.get('/login/:email/:password', (req, res) => {
    const { email, password } = req.params
    const result = db.collection('Rol').doc(req.params.email, req.params.password);
    if (!result.exists) {
        return res.status(200).send({ en: -1, m:'Usuario o contraseña incorrecta'});
    }

    res.status(200).send({en: 1, u: result.data()});
})

app.get('/rol', async (req, res) => {
    const peopleRef = db.collection('Rol').doc('qSyypshKJcmHeeO8R2np')
    const doc = await peopleRef.get()
    if (!doc.exists) {
        return res.status(200).send({ en: -1, m:'No hay datos que mostrar'});
    }
    res.status(200).send({en: 1, r: doc.data()});
})


module.exports = app;