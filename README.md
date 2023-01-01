# ifttt-delay-actions

A Node.js service that holds a request for a specified period before making a separate request.
This is useful for receiving a request from the IFTTT Maker Webhooks service as a result of a "Then" action, which will then trigger another applet with the Maker Webhook "If" trigger.

## Set Up
### Environment Variables
Set values for these env variables to allow the service to function properly.

`IFTTT_MAKER_ID`: The IFTTT Maker Webhooks service key, used to make requests to the Webhooks service. This identifies which IFTTT account to direct the request to.

`DEFAULT_DELAY_MINUTES`: Default delay in minutes. Used if `delayMinutes` is not specified in the `POST` request JSON body.


## Installation
The code can be run from source or a Docker container. The [public Docker image](https://hub.docker.com/r/nathankwok/ifttt-delay-actions) can be accessed by 
```
docker pull nathankwok/ifttt-delay-actions
```

