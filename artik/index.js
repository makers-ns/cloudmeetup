var ArtikCloud = require('artikcloud-js');
var defaultClient = ArtikCloud.ApiClient.instance;

// Configure OAuth2 access token for authorization: artikcloud_oauth
var artikcloud_oauth = defaultClient.authentications['artikcloud_oauth'];
artikcloud_oauth.accessToken = "86f8f05a411043b989a56b7910fe1701"

var api = new ArtikCloud.MessagesApi()

var data = new ArtikCloud.MessageAction(); // {MessageAction} Message or Action object that is passed in the body

console.dir(data);
data.data = {"temp" : 32};
data.sdid = "4e24f92d372a43cdaefe34720ff94cd3";

var callback = function(error, success, response) {

  if (error) {
    console.log(response.res.text);
  } else {
    console.log(success);
  }
};

api.sendMessageAction(data, callback);

