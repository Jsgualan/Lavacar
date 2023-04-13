const express = require('express');
const app = express();
const joinPath = require('path.join');
const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(require('./Controller/controller'));

app.use(express.static(joinPath(__dirname,'./Controller')));

app.get('/', function (req, res) {
    res.status(200).send({EC: 'ECUADOR', PROJECT: "ARCHIVOS", ENVIRONMENT: 'LAVACAR', VERSION: '1.0.0', BY: 'OASIS-NEST', INIT: '2023/03/12', ARCHITECT: 'JUNIOR GUALÁN'});
});

app.listen(8383, () => {
    console.log('Escuchando puerto: ', 8383);
});

