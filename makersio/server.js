'use strict';

var http = require('http');
var express = require('express');
var app = express();

var iothub = require('azure-iothub');
var bodyParser = require('body-parser');

var connectionString = 'HostName=MakerNS.azure-devices.net;SharedAccessKeyName=<SAS KEYNAME>;SharedAccessKey=<SAS KEY VALUE>';

var registry = iothub.Registry.fromConnectionString(connectionString);
var device = new iothub.Device(null);
var htmlOutput;

//Device
var jsonDevice = { "DeviceId": "<DEVICE ID>",
"DeviceKey" : "<DEVICE KEY>"};
var deviceFromConnectionString = require('azure-iot-device-amqp').clientFromConnectionString;
var Message = require('azure-iot-device').Message;
var deviceConnectionString = 'HostName=MakerNS.azure-devices.net;DeviceId='+jsonDevice.DeviceId+';SharedAccessKey='+jsonDevice.DeviceKey;
var client = deviceFromConnectionString(deviceConnectionString);

app.set('port', process.env.PORT || 3000);
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Hello World from Azure GateWay');
});

app.get('/create/:id', function (req, resApp) {
  var newDevice = new iothub.Device(null);
  newDevice.deviceId = req.params.id;
  registry.create(newDevice, function (err, deviceInfo,res) {
    if (err) {
      resApp.send('Error');
    }
    if (deviceInfo) {
      resApp.send('Create')
    }
  });
});

app.get('/device/:id', function (req, resApp) {
    var getDevice = new iothub.Device(null);
    getDevice.deviceId = req.params.id;
      registry.get(getDevice.deviceId, function (err, deviceInfo, res) {
        if(err){
          resApp.send('{"result":"Error"}');
        }        
        if(deviceInfo){
          resApp.send(deviceInfo);
        }   
      });
});
app.get('/delete/:id', function (req, resApp) {
    var getDevice = new iothub.Device(null);
    getDevice.deviceId = req.params.id;
      registry.delete(getDevice.deviceId, function (err, deviceInfo, res) {
        if(err){
          resApp.send('{"result":"Error"}');
        }
        if(!err){
          resApp.type('application/json');          
          resApp.send('{"result":"OK"}');
        }   
           
      });
});

app.get('/list', function (req, resApp) {
  registry.list(function (err, deviceList, res) {
    if (err) {
      resApp.send('{"error":true}');
    };
    if (deviceList) {
      resApp.type('application/json');
      resApp.send(deviceList);
    }
  });
});

var jsonParser = bodyParser.json();

app.post('/send',jsonParser, function (req, resApp) {
        console.clear;
        console.log(req.body.temp);
        var windSpeed = 10 + (Math.random() * 4);
        var data = JSON.stringify({ deviceId: 'mydevice', windSpeed: req.body.temp });
        var message = new Message(data);
        console.log("Sending message: " + message.getData());
        client.sendEvent(message, function printResult(err, res) {
          if (err) {
            console.log(' error: ' + err.toString());
                  resApp.type('application/json');
                  resApp.send({"result" : "Error"});
          }
          if (res) {
            console.log(' status: ' + res.constructor.name);
                  resApp.type('application/json');
                  resApp.send({"result" : "OK"});
          }
        });
});


app.post('/particle',jsonParser, function (req, resApp) {
        console.clear;
        console.log(req.body);
        
        req.body.value = parseInt(req.body.value);

        var data = JSON.stringify(req.body);
        var message = new Message(data);
        console.log("Sending message: " + message.getData());
        client.sendEvent(message, function printResult(err, res) {
          if (err) {
            console.log(' error: ' + err.toString());
                  resApp.type('application/json');
                  resApp.send({"result" : "Error"});
          }
          if (res) {
            console.log(' status: ' + res.constructor.name);
                  resApp.type('application/json');
                  resApp.send({"result" : "OK"});
          }
        });
        
});


app.post('/texas',jsonParser, function (req, resApp) {
        console.clear;
        console.log(req.body);
        
        var data = JSON.stringify(req.body);
        var message = new Message(data);
        console.log("Sending message: " + message.getData());
        client.sendEvent(message, function printResult(err, res) {
          if (err) {
            console.log(' error: ' + err.toString());
                  resApp.type('application/json');
                  resApp.send({"result" : "Error"});
          }
          if (res) {
            console.log(' status: ' + res.constructor.name);
                  resApp.type('application/json');
                  resApp.send({"result" : "OK"});
          }
        });
        
});

var connectCallback = function (err) {
  if (err) {
    console.log('Could not connect: ' + err);
  } else {
    console.log('Client connected');
  }
};
client.open(connectCallback);
