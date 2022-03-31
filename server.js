var moment = require("moment-timezone")

// init project
var express = require('express');
var request = require('request');
var app = express();

app.use(express.json());

// listen for requests
var listener = app.listen(process.env.PORT, function () {
  console.log(`Your app is listening on port ${listener.address().port}`);
});

// Get the Id from IFTTT Maker URL
const IFTTT_ID = process.env.IFTTT_MAKER_ID;
const BASEURL = "https://maker.ifttt.com/trigger/";
const WITHKEY = "/with/key/";
const DEFAULT_DELAY_MINS = process.env.DEFAULT_DELAY_MINUTES

var actions_requests = {}

// Handle requests from IFTTT
app.post("/", function (request, response) {
  console.log("Request received from IFTTT");
  console.log(request.body);
  
  var action = request.body.action;
  console.log(`From JSON, action is ${action}`);
  
  let delayMinutes;
  try {
    delayMinutes = parseFloat(request.body.delayMinutes)
  } catch {
    delayMinutes = DEFAULT_DELAY_MINS
  }
  console.log(`From JSON, delayMinutes is ${delayMinutes}`)
  let delayMs = delayMinutes * 60 * 1000
  
  // Handle old request, if exists
  let old_request = actions_requests[action]
  console.log(actions_requests)
  console.log(old_request)
  console.log(typeof(old_request))
  
  if (old_request != null) {
    // Handle old request
    old_request.destroy()
    
    // Put this request in its place
    actions_requests[action] = request
  } else {
    // Have not seen this action before
    actions_requests[action] = request
  }
  
  // TODO handle multiple actions using hashmap
  
  // TODO seperate timer for each action
  // TODO reset timer if action is seen before trigger time, https://stackoverflow.com/questions/315078/how-do-you-handle-multiple-instances-of-settimeout
  
  // Log when it will execute
  let executeDate = moment().tz('America/Los_Angeles').add(delayMinutes, 'm').format("YYYY-MM-DD h:mm:ss a")
  console.log(`Executing ${action} in the future at: ${executeDate}`);
  
  // Set timeout and then execute after timeout
  setTimeout(() => {
    makeRequest(action)
  }, delayMs);
  
  console.log("Trigger set");
  response.end();
});



function makeRequest(action) {
  console.log(`Making request with action ${action}`)
  request(BASEURL + action + WITHKEY + IFTTT_ID, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log(body); // Show the response from IFTTT
    } else {
      console.log(BASEURL + action + WITHKEY + "MY_KEY" + ": " + error); // Show the error
    }
  });
}