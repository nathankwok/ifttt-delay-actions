var moment = require("moment-timezone")

// init project
var express = require('express');
var request = require('request');
var app = express();
const baseURL = "https://maker.ifttt.com/trigger/";
const withKey = "/with/key/";

const defaultDelayMinutes = process.env.DEFAULT_DELAY_MINUTES

// Get the Id from IFTTT Maker URL
const iftttId = process.env.IFTTT_MAKER_ID;

app.use(express.json());

// Handle requests from IFTTT
app.post("/", function (request, response) {
  console.log("Request received from IFTTT");
  console.log(request.body);
  
  var action = request.body.action;
  console.log("From JSON, action is " + action);
  
  let delayMinutes;
  try {
    delayMinutes = request.body.delayMinutes
  } catch {
    delayMinutes = defaultDelayMinutes
  }
  let delayMs = delayMinutes * 60 * 1000
  
  
  let executeDate = moment().tz('America/Los_Angeles').add(delayMinutes, 'm').format("YYYY-MM-DD h:mm:ss a")
  console.log(`Executing ${action} in the future at ${executeDate}`);
  
  setTimeout(() => {
    makeRequest(action)
  }, delayMs);
  
  // switch (action) {
  //   case process.env.IFTTT_EVENT_1:
  //     break;
  //   case process.env.IFTTT_EVENT_2:
  //     break;
  // }
  
  console.log("Done triggering.");
  response.end();  
});

// listen for requests
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

// TODO Change to switch
// Loops through each event and where it finds a value for it in .env it will make a request to IFTTT using it
// function checkForTrigger(trigger){
//   var triggerEvent;
//
//   // switch (trigger) {
//   //   case process.env.IFTTT_EVENT_1:
//   //     break;
//   //   case process.env.IFTTT_EVENT_2:
//   //     break;
//   // }
//
//   if(trigger===0)
//     triggerEvent=process.env.IFTTT_EVENT_1;
//   if(trigger===1)
//     triggerEvent=process.env.IFTTT_EVENT_2;
//   if(trigger===2)
//     triggerEvent=process.env.IFTTT_EVENT_3;
//   if(trigger===3)
//     triggerEvent=process.env.IFTTT_EVENT_4;
//   if(trigger===4)
//     triggerEvent=process.env.IFTTT_EVENT_5;
//   if(trigger===5)
//     triggerEvent=process.env.IFTTT_EVENT_6;
//   if(trigger===6)
//     triggerEvent=process.env.IFTTT_EVENT_7;
//   if(trigger===7)
//     triggerEvent=process.env.IFTTT_EVENT_8;
//   if(trigger===8)
//     triggerEvent=process.env.IFTTT_EVENT_9;
//   if(trigger===9)
//     triggerEvent=process.env.IFTTT_EVENT_10;
//
//   if(triggerEvent){
//     // Make a request to baseURL + triggerEvent + withKey + iftttId, which is the complete IFTTT Maker Request URL
//     makeRequest(triggerEvent)
//   }
// }

function makeRequest(action) {
  console.log("Making request with action " + action)
  request(baseURL + action + withKey + iftttId, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body); // Show the response from IFTTT
    } else {
      console.log(baseURL + action + withKey + iftttId + ": "+error); // Show the error
    }
  });
}