'use strict';
var jsonDevice = { "DeviceId": "myFirstDevice",
"DeviceKey" : "8rGHiig7TQTLNwJpqT7Rv7DpcIobLx2UgNd1kSmufS8="};

var clientFromConnectionString = require('azure-iot-device-amqp').clientFromConnectionString;
var Message = require('azure-iot-device').Message;
var connectionString = 'HostName=MakerNS.azure-devices.net;DeviceId='+jsonDevice.DeviceId+';SharedAccessKey='+jsonDevice.DeviceKey;
var client = clientFromConnectionString(connectionString);

function printResultFor(op) {
  return function printResult(err, res) {
    if (err) console.log(op + ' error: ' + err.toString());
    if (res) console.log(op + ' status: ' + res.constructor.name);
  };
}

var connectCallback = function (err) {
  if (err) {
    console.log('Could not connect: ' + err);
  } else {
    console.log('Client connected');
    client.on('message', function (msg) {
      console.log('Id: ' + msg.messageId + ' Body: ' + msg.data);
      client.complete(msg, printResultFor('completed'));
    });

    // Create a message and send it to the IoT Hub every second
    setInterval(function(){
        var windSpeed = 2000 + Math.round((Math.random() * 500));
        var data = JSON.stringify({ device: 'windSpeed', value: windSpeed });
        var message = new Message(data);
        console.log("Sending message: " + message.getData());
        client.sendEvent(message, printResultFor('send'));
    }, 15000);
  }
};

client.open(connectCallback);