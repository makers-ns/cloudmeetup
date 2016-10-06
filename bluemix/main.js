var mqtt = require('mqtt');

var ORG = 'pqm2jq';
var TYPE = 'Type1';
var ID = 'meetup1';

var PROTOCOL = 'mqtt';
var BROKER = ORG + '.messaging.internetofthings.ibmcloud.com';
var PORT = 1883;

//Create the url string
var URL = PROTOCOL + '://' + BROKER;
URL += ':' + PORT;
//url is e.g. 'mqtt://xrxlila.messaging.internetofthings.ibmcloud.com:1883'

var CLIENTID = 'd:' + ORG;
CLIENTID += ':' + TYPE;
CLIENTID += ':' + ID;
//CLIENTID -s e.g. d:xrxila:edison-air:784b87a81234

var AUTHMETHOD = 'use-token-auth';//As of July 15 2015 this is the only one that works on Bluemix
var AUTHTOKEN = 'meetup123';

var requireds = { clientId: CLIENTID, username: AUTHMETHOD, password: AUTHTOKEN };

var mqttConfig = { 'url': URL, 'requireds': requireds };

var client;

client = mqtt.connect(mqttConfig.url, mqttConfig.requireds);

client.on('connect', function () {
    console.log('connect');
    setInterval(function () {
        var TOPIC = 'iot-2/evt/status/fmt/json';
        client.publish(TOPIC, '{"d":{"Volts":' + getFakeVolts() + '}}');//Payload is JSON
    }, 2000);//Keeps publishing every 2000 milliseconds.

});


var fakeVolts = 0.0;
var getFakeVolts = function () {
    var volts = fakeVolts;
    fakeVolts = fakeVolts + 0.1;
    if (fakeVolts > 1.0) { fakeVolts = 0.0; }
    return volts;
}

