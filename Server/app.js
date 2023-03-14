//require('./Config/Config');
const express = require('express');
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const serviceAccount = require("../firebase.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();
const app = express();

const joinPath = require('path.join');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

/*app.use(require('./Controller/login'));
app.use(require('./Controller/user'));
app.use(require('./Controller/new'));*/

app.use(express.static(joinPath(__dirname,'./Controller')));
app.get('/', async (req, res) =>{
    //const querySnapshot = await db.collection('Rol').get()
    //console.log(querySnapshot);
    res.status(200).send({EC: 'ECUADOR', PROJECT: "ARCHIVOS", ENVIRONMENT: 'LAVACAR', VERSION: '1.0.0', BY: 'OASIS', INIT: '2023/03/13', ARCHITECT: 'JUNIOR'});
});

app.listen(3000, () => {
    console.log('Escuchando puerto: ', 3000);
});
