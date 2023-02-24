'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var webhook_res=""
var app = express();

app.use(bodyParser.json());
app.post('/events/rec',function (request, response) {
//  console.log(request.body);
 if('data' in request.body[0]){
   if('validationCode' in request.body[0].data) {
     webhook_res = {'validationResponse': request.body[0].data.validationCode}
     console.log('Azure EventGrid subscription successfully validated')
     response.send(webhook_res);
   }
    if(request.body[0].data.api=='PutBlob'){
       console.log('&gt;&gt; Blob uploaded - %s', request.body[0].data.url)
     }
     if(request.body[0].data.api=='DeleteBlob'){
       console.log('&gt;&gt; Blob deleted - %s', request.body[0].data.url)
     }
     response.send();
     response.end();
   }
});

app.get('/', function (req, res){
    res.status(200).send({msg: "Hola"});
})
var server = app.listen(process.env.PORT || '8000', function () {
 console.log('App listening on port %s', server.address().port);
 console.log('Press Ctrl+C to quit.');
});