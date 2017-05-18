var https = require('https')
var Alexa = require('alexa-sdk')

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
  'LaunchRequest': function () {
    // Launch Request
    console.log(`LAUNCH REQUEST`)
  },
  'GetStopName': function () {
    this.emit(':ask', 'What stop?', 'What stop do you want arrivals for?')
    
    this.emit('GetTrainName')
  },
  'GetTrainName': function () {
    this.emit(':ask', 'What train?')

    this.emit('GetArrivalInformation')
  },
  'GetArrivalInformation': function () {
    console.log('GetArrivalInformation: working')
    var inputTrainName = "green line to clackamas";
    var inputStopName = "gateway";

    var stopId;

    // mapping direction to stop id, using train name
    var stopInfo = {
      "stops": {
        "gateway": {
          "clackamas": 8347,
          "city center": 8370,
          "beaverton": 1000
        },
        "rose quarter": {
          "clackamas": 1234,
          "city center": 1234,
          "airport": 1234
        }
      }
    }
    // gets train color
    var trainColor = inputTrainName.split(' ')[0];

    // loop through stops -> using direction -> assign corresponding stop id
    for (var key in stopInfo.stops[inputStopName]) {
      if (inputTrainName.includes(key)) {
        stopId = stopInfo.stops[inputStopName][key]
        break;
      }
    }
    // api call -> trimet
    var endpoint = `https://developer.trimet.org/ws/v2/arrivals?locIDs=${stopId}&json=true&appID=3B5160342487A47D436E90CD9` // ENDPOINT GOES HERE
    var body = ""
    https.get(endpoint, (response) => {
      response.on('data', (chunk) => { body += chunk })
      response.on('end', () => {
        var data = JSON.parse(body)
        var firstArrival;
        var secondArrival;
        var arrivals = [];
        // loop through arrivals -> search using color -> return next two arrivals
        for (var i = 0; i < data.resultSet.arrival.length; i++) {
          // return arrivals by color
          if (data.resultSet.arrival[i].shortSign.toLowerCase().includes(trainColor)) {
            arrivals.push(data.resultSet.arrival[i])
            firstArrival = arrivals[0]
            secondArrival = arrivals[1]
          }
        }
        console.log(firstArrival)
        console.log(secondArrival)

        var trainName = firstArrival.shortSign;
        var scheduledTime = firstArrival.scheduled;

        context.succeed(
            generateResponse(
              buildSpeechletResponse(`The ${trainName}, will be arriving at ${inputStopName} in ${scheduledTime}`, true),
              {}
            )
          )
      })
    })
  },
  'Unhandled': function() {
    this.emit(':ask', 'Insert your own error message here');
   }
};

// Helper Functions
buildSpeechletResponse = (outputText, shouldEndSession) => {

  return {
    outputSpeech: {
      type: "PlainText",
      text: outputText
    },
    shouldEndSession: shouldEndSession
  }

}

generateResponse = (speechletResponse, sessionAttributes) => {

  return {
    version: "1.0",
    sessionAttributes: sessionAttributes,
    response: speechletResponse
  }

}
