'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var webhook_res=""
var app = express();
const port = process.env.PORT || 3000;
const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob");

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
       const blobUrl = request.body[0].data.url;
       const [containerName, blobName] = blobUrl.split("/").slice(-2);
       console.log('>> Blob uploaded - %s', blobUrl);
       readUserContent(containerName, blobName);       
     }
     if(request.body[0].data.api=='DeleteBlob'){
       console.log('>> Blob deleted - %s', request.body[0].data.url);
     }
     response.send();
     response.end();
   }
});

//Local methodd, not to be called dduring prod
app.post('/run/local/:fileName', function(req, res){
  const fileNameToRead = req.params.fileName +".txt";
  console.log(fileNameToRead);
  readUserContent("usercontent", "samplefile.txt");
  res.status(200).send({msg: "Hey "});
});

 async function readUserContent(containerName, blobName){
  const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
  
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    AZURE_STORAGE_CONNECTION_STRING
  );
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  
  const downloadResponse =  await blockBlobClient.download(0);
  //console.log(downloadResponse.readableStreamBody);
  const downloaded = (await streamToBuffer(downloadResponse.readableStreamBody)).toString();
  const [languages, ...sentences] = downloaded.split('\n');
  console.log(languages.split('|'));
  console.log(sentences);
  
}
async function streamToBuffer(readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on("data", (data) => {
      chunks.push(data instanceof Buffer ? data : Buffer.from(data));
    });
    readableStream.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
    readableStream.on("error", reject);
  });
}
// Convert stream to text
async function streamToText(readable) {
  readable.setEncoding('utf8');
  let data = '';
  for await (const chunk of readable) {
    data += chunk;
  }
  return data;
}



app.get('/', function (req, res){
    res.status(200).send({msg: "Hola"});
});

var server = app.listen(port, function () {
 console.log('App listening on port %s', port);
 console.log('Press Ctrl+C to quit.');
});
