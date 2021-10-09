// server.js
// where your node app starts

// init project
var express = require('express');
var request = require('request');
var app = express();
var iftttId;
var baseURL = "https://maker.ifttt.com/trigger/";
var withKey = "/with/key/";

// Get the Id from IFTTT Maker URL
// if(!process.env.IFTTT_MAKER_URL)
//   console.log("You need to set your IFTTT Maker URL - copy the URL from https://ifttt.com/services/maker/settings into the .env file against 'IFTTT_MAKER_URL'");
// else
// TODO Get id from ENV
// iftttId = process.env.IFTTT_MAKER_URL.split('https://maker.ifttt.com/use/')[1];


// Show the homepage
// http://expressjs.com/en/starter/static-files.html
app.use(express.static('views'));

// Handle requests from IFTTT
app.post("/", function (request, response) {
  console.log("Request received from IFTTT");
  console.log("Triggering multiple IFTTT services");
  console.log(request)
  // for(var i=0; i<10; i++){
  //   checkForTrigger(i);
  // }
  console.log("Done triggering.");
  response.end();  
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

// Loops through each event and where it finds a value for it in .env it will make a request to IFTTT using it
function checkForTrigger(trigger){
  var triggerEvent;
  
  if(trigger===0)
    triggerEvent=process.env.IFTTT_EVENT_1;
  if(trigger===1)
    triggerEvent=process.env.IFTTT_EVENT_2;
  if(trigger===2)
    triggerEvent=process.env.IFTTT_EVENT_3;
  if(trigger===3)
    triggerEvent=process.env.IFTTT_EVENT_4;
  if(trigger===4)
    triggerEvent=process.env.IFTTT_EVENT_5;
  if(trigger===5)
    triggerEvent=process.env.IFTTT_EVENT_6;
  if(trigger===6)
    triggerEvent=process.env.IFTTT_EVENT_7;
  if(trigger===7)
    triggerEvent=process.env.IFTTT_EVENT_8;
  if(trigger===8)
    triggerEvent=process.env.IFTTT_EVENT_9;
  if(trigger===9)
    triggerEvent=process.env.IFTTT_EVENT_10;    

  if(triggerEvent){
    // Make a request to baseURL + triggerEvent + withKey + iftttId, which is the complete IFTTT Maker Request URL
    request(baseURL + triggerEvent + withKey + iftttId, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body); // Show the response from IFTTT
      } else {
        console.log(baseURL + triggerEvent + withKey + iftttId + ": "+error); // Show the error
      }
    });
  }
}