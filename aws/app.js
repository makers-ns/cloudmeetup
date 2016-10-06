var awsIot = require('aws-iot-device-sdk');

var device = awsIot.device({
	"host": "a2qafgaoqmsxfi.iot.eu-west-1.amazonaws.com",
	"port": 8883,
	"clientId": "myPCasAThing",
	"thingName": "myPCasAThing",
	"caCert": "root-CA.crt",
	"clientCert": "e85ef9132a-certificate.pem.crt", // change this
	"privateKey": "e85ef9132a-private.pem.key" // change this
});
//
// Device is an instance returned by mqtt.Client(), see mqtt.js for full
// documentation.
//
device
 .on('connect', function() {
   console.log('connect');
   device.subscribe('control');
   setInterval(function () {
        // Usual MQTT topics are hierarchical like : 'iot-2/evt/status/fmt/json'
        // Here we make it simple 'rms'
        device.publish('rms', '{"RMS":' + random(-96, 0) + '}');//Payload
   }, 2000); //Publishing every 2000ms

   });

device
 .on('message', function(topic, payload) {
   console.log('message', topic, payload.toString());
 });

function random (low, high) {
    return Math.random() * (high - low) + low;
}