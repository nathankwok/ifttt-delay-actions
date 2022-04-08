var moment = require("moment-timezone")

// init project
const express = require('express');
const request = require('request');
const app = express();

app.use(express.json());

// listen for requests
var listener = app.listen(process.env.PORT, function () {
  console.log(`Your app is listening on port ${listener.address().port}`);
});

// Get the Id from IFTTT Maker URL
const IFTTT_ID = process.env.IFTTT_MAKER_ID;
const BASEURL = "https://maker.ifttt.com/trigger/";
const WITHKEY = "/with/key/";
const DEFAULT_DELAY_MINS = process.env.DEFAULT_DELAY_MINUTES;

var actionsEventIds = {};
var eventId = 0;

// Handle requests from IFTTT
app.post("/", function (request, response) {
  // Use eventId to see if action should be run
  let thisEventId = eventId;
  eventId += 1;
  
  console.log("Request received from IFTTT");
  console.log(request.body);
  
  // Get action
  let action = request.body.action;
  console.log(`From JSON, action is ${action}`);
  
  // Calculate delay in ms
  let delayMinutes;
  try {
    delayMinutes = parseFloat(request.body.delayMinutes)
  } catch {
    delayMinutes = DEFAULT_DELAY_MINS
  }
  let delayMs = delayMinutes * 60 * 1000
  console.log(`From JSON, delayMinutes is ${delayMinutes}`)
  
  // Store the most up-to-date event id for that action
  actionsEventIds[action] = thisEventId;
  
  // Log when it will execute
  let executeDate = moment().tz('America/Los_Angeles').add(delayMinutes, 'm').format("YYYY-MM-DD h:mm:ss a")
  console.log(`Executing ${action} with eventId ${thisEventId} in the future at: ${executeDate}`);
  
  // Set timeout and then execute after timeout
  setTimeout(() => {
    makeRequest(action, thisEventId)
  }, delayMs);
  
  console.log(`Trigger set for eventId ${thisEventId}`);
  response.status(200).send('OK');
});


// Healthcheck
app.get("/", function (request, response) {
  console.log(`Responding to / GET with OK`);
  const data = {
    uptime: process.uptime(),
    message: 'OK',
    date: new Date()
  };
  response.status(200).send(data);
});

app.get("/healthcheck", function (request, response) {
  console.log(`Responding to /healthcheck GET with OK`);
  const data = {
    uptime: process.uptime(),
    message: 'OK',
    date: new Date()
  };
  response.status(200).send(data);
});



function makeRequest(action, thisEventId) {
  let mostRecentEventId = actionsEventIds[action]
  if (mostRecentEventId === thisEventId) {
    console.log(`Making request with action ${action} for eventId ${thisEventId}`)
    request(BASEURL + action + WITHKEY + IFTTT_ID, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        console.log(`${body} with eventId ${thisEventId}`); // Show the response from IFTTT
      } else {
        console.log(BASEURL + action + WITHKEY + "MY_KEY" + ": " + error); // Show the error
      }
    });
  } else {
    console.log(`Found a more recent event. Was looking for ${thisEventId} and found ${actionsEventIds[action]}`)
  }
  
}