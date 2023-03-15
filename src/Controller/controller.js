const express = require('express');
const app = express();
const { FieldValue } = require('firebase-admin/firestore')
const { db } = require('../firebase')

app.get('/login/:email/:password', async (req, res) => {
    const querySnapshot = await db.collection('User').where('email','==', req.params.email).where('password', '==', req.params.password).get()
    const user = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))
    console.log(user);
    if (user.length > 0) {
        return res.status(200).send({en: 1, u: user});
    }
    res.status(200).send({ en: -1, m:'Usuario o contraseña incorrecto '});*/
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