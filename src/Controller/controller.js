const express = require('express');
const app = express();
const { FieldValue } = require('firebase-admin/firestore')
const { db } = require('./firebase.js')

app.get('/rol', async (req, res) => {
    const peopleRef = db.collection('rol').doc('qSyypshKJcmHeeO8R2np')
    const doc = await peopleRef.get()
    if (!doc.exists) {
        return res.status(400).send({ en: -1, m:'No hay datos que mostrar'});
    }
    res.status(200).send({en: 1, r: doc.data()});
})


module.exports = app;