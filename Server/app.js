//require('./Config/Config');
const express = require('express');
const app = express();
const joinPath = require('path.join');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

/*app.use(require('./Controller/login'));
app.use(require('./Controller/user'));
app.use(require('./Controller/new'));*/

app.use(express.static(joinPath(__dirname,'./Controller')));
app.get('/', function (req, res) {
    res.status(200).send({EC: 'ECUADOR', PROJECT: "ARCHIVOS", ENVIRONMENT: 'LAVACAR', VERSION: '1.0.0', BY: 'OASIS', INIT: '2023/03/13', ARCHITECT: 'JUNIOR'});
});

app.listen(3030, () => {
    console.log('Escuchando puerto: ', 3000);
});
