const express = require('express');
const app = express();
const { FieldValue } = require('firebase-admin/firestore')
const { db } = require('../firebase')

app.get('/login', async (req, res) => {
    const type = req.params.type;
    try {
        const userRef = db.collection('Rol').doc(type);
        const response = await userRef.get();
        res.send(response.data());
      } catch(error) {
        //res.send(error);
      }
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