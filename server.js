var moment = require("moment-timezone")

// Init project
const express = require('express');
const request = require('request');
const myQApi = require("@hjdhjd/myq");
const app = express();

app.use(express.json());

// Listen for requests
var listener = app.listen(process.env.PORT, function () {
  console.log(`Your app is listening on port ${listener.address().port}`);
  console.log(`The default delay in minutes is ${process.env.DEFAULT_DELAY_MINUTES}`)
});

const IFTTT_ID = process.env.IFTTT_MAKER_ID;
const BASEURL = "https://maker.ifttt.com/trigger/";
const WITHKEY = "/with/key/";
let DEFAULT_DELAY_MINS = process.env.DEFAULT_DELAY_MINUTES;
if ( DEFAULT_DELAY_MINS == null ) {
  DEFAULT_DELAY_MINS = 20
}

const MYQ_EMAIL = process.env.MYQ_EMAIL;
const MYQ_PW = process.env.MYQ_PW;
const MYQ_CODE = process.env.MYQ_CODE;
const RIGHT_GARAGE_DOOR_SERIAL = process.env.RIGHT_GARAGE_DOOR_SERIAL;
const LEFT_GARAGE_DOOR_SERIAL = process.env.LEFT_GARAGE_DOOR_SERIAL;


// Keep track of the latest event for each action
let actionsEventIds = {};
let eventId = 0;



// Handle requests from IFTTT
app.post(["/", "/delay_action"], function (request, response) {
  delay_action_handle_timeout(request, response);
});


// MyQ Actions
app.post("/myq-action", async function (request, response) {
  let code = String(request.body.code)
  let door = String(request.body.door).toUpperCase()
  
  if (code !== MYQ_CODE) {
    console.error("Responding with Unauthorized")
    return response.status(401).send("Unauthorized");
  }
  
  // Login and get devices
  let myQ = new myQApi.myQApi(MYQ_EMAIL, MYQ_PW)
  await myQ.refreshDevices()
  
  let device_serial;
  if (door === "RIGHT") {
    device_serial = RIGHT_GARAGE_DOOR_SERIAL
  } else if (door === "LEFT") {
    device_serial = LEFT_GARAGE_DOOR_SERIAL
  }
  
  let device = await myQ.getDevice(device_serial)
  let success = await myQ.execute(device, "open")
  
  if (success) {
    response.status(200).send('OK');
  } else {
    response.status(500).send("MyQ failed to execute command")
  }
});


// Healthcheck
app.get(["/", "/healthcheck"], function (request, response) {
  healthcheck(request, response);
});



// Helper functions
function healthcheck(request, response) {
  console.log(`Responding to healthcheck request at ${request.path} GET with OK`);
  const data = {
    uptime: process.uptime(),
    uptime_units: 'seconds',
    message: 'OK',
    date: new Date()
  };
  response.status(200).send(data);
}


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


function delay_action_handle_timeout(request, response) {
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
  console.log(`${action} with eventId ${thisEventId} will execute in the future at: ${executeDate}`);
  
  // Set timeout and then execute after timeout
  setTimeout(() => {
    makeRequest(action, thisEventId)
    console.log(`Executed ${action} with eventId ${thisEventId}`);
  }, delayMs);
  
  console.log(`Trigger set for eventId ${thisEventId}`);
  response.status(200).send('OK');
}


