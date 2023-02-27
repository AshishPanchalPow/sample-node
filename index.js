'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var webhook_res=""
var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.post('/events/rec',function (request, response) {
 console.log(request.body);
 if('data' in request.body[0]){
   if('validationCode' in request.body[0].data) {
     webhook_res = {'validationResponse': request.body[0].data.validationCode}
     console.log('Azure EventGrid subscription successfully validated')
     response.send(webhook_res);
   }
    if(request.body[0].data.api=='PutBlob'){
       console.log('>> Blob uploaded - %s', request.body[0].data)
     }
     if(request.body[0].data.api=='DeleteBlob'){
       console.log('>> Blob deleted - %s', request.body[0].data)
     }
     response.send();
     response.end();
   }
});

app.get('/', function (req, res){
    res.status(200).send({msg: "Hola"});
});

var server = app.listen(port, function () {
 console.log('App listening on port %s', port);
 console.log('Press Ctrl+C to quit.');
});
