const express = require('express');
const app = express();
const { FieldValue } = require('firebase-admin/firestore')
const { db } = require('../firebase')

app.get('/login/:email/:password', async (req, res) => {

    const doc = await db.collection('User').doc(req.params.email, req.params.password).get()

    console.log({
        ...doc.data()
    })
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