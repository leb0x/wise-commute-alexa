'use strict';
var https = require('https')
var Alexa = require('alexa-sdk')

var appId = process.env.appId;

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = appId;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var snippets = {
  APP_NAME: "Wise Commute",
  STOP_QUESTION: "What stop?",
  STOP_QUESTION_REPROMPT: "In order to get arrival information, I need your desired stop.",
  TRAIN_NAME_QUESTION: "What train?",
  TRAIN_NAME_QUESTION_REPROMPT: "In order to get arrival information, I need your desired train.",
  HELP: "You can ask wise commute for arrival information by providing, your desired stop name and train name.",
  STOP: "Thank you for using wise commute.",
  HELP_REPROMPT: "Simply provide stop name and train name.",
  UNHANDLED: "I'm sorry I couldn't understand what you meant. Can you please say that again?"
}

var handlers = {
  'LaunchRequest': function () {
    console.log('launch request started')
  },
  'AMAZON.HelpIntent': function () {
    var speechOutput = snippets.HELP;
    var reprompt = snippets.HELP_REPROMPT;
    this.emit(':ask', speechOutput, reprompt);
  },
  'AMAZON.CancelIntent': function () {
    this.emit(':tell', snippets.STOP);
  },
  'AMAZON.StopIntent': function () {
    this.emit(':tell', snippets.STOP);
  },
  'CreateRequest': function () {
    this.attributes['stopName'] = ''
    this.emit(':ask', snippets.STOP_QUESTION, snippets.STOP_QUESTION_REPROMPT)
  },
  'GetTrainName': function () {
    this.attributes['stopName'] = this.event.request.intent.slots.StopName.value.toLowerCase();
    this.attributes['trainName'] = ''
    this.emit(':ask', snippets.TRAIN_NAME_QUESTION, snippets.TRAIN_NAME_QUESTION_REPROMPT)
  },
  'ArrivalInformation': function () {
    this.attributes['trainName'] = this.event.request.intent.slots.TrainName.value.toLowerCase();
    this.attributes['firstArrival'] = ''

    var inputTrainName = this.attributes.trainName.toLowerCase();
    var inputStopName = this.attributes.stopName.toLowerCase();
    var stopId;

    // mapping direction to stop id, using train name
    var stopInfo = {
      "stops": {
        "gateway": {
          "clackamas": 8347,
          "city center": 8370,
          "beaverton": 8370,
          "gresham": 8347,
          "hillsboro": 8370,
          "airport": 8347,
          "rose quarter": 8370
        },
        "99th": {
          "clackamas": 8347,
          "city center": 8370,
          "beaverton": 8370,
          "gresham": 8347,
          "hillsboro": 8370,
          "airport": 8347,
          "rose quarter": 8370
        },
        "clackamas": {
          "clackamas": 13132,
          "city center": 13132,
          "rose quarter": 13132
        },
        "fuller": {
          "clackamas": 13130,
          "city center": 13133,
          "rose quarter": 13133
        },
        "lents": {
          "clackamas": 13128,
          "city center": 13135,
          "rose quarter": 13135
        },
        "flavel": {
          "clackamas": 13129,
          "city center": 13134,
          "rose quarter": 13134
        },
        "holgate": {
          "clackamas": 13127,
          "city center": 13136,
          "rose quarter": 13136
        },
        "powell": {
          "clackamas": 13126,
          "city center": 13137,
          "rose quarter": 13137
        },
        "division": {
          "clackamas": 13125,
          "city center": 13138,
          "rose quarter": 13138
        },
        "main": {
          "clackamas": 13124,
          "city center": 13139,
          "rose quarter": 13139
        },
        "82nd": {
          "clackamas": 8346,
          "city center": 8371,
          "rose quarter": 8371,
          "gresham": 8346,
          "hillsboro": 8371,
          "airport": 8346,
          "beaverton": 8371
        },
        "60th": {
          "clackamas": 8345,
          "city center": 8372,
          "rose quarter": 8372,
          "gresham": 8345,
          "hillsboro": 8372,
          "airport": 8345,
          "beaverton": 8372
        },
        "hollywood": {
          "clackamas": 8344,
          "city center": 8373,
          "rose quarter": 8373,
          "gresham": 8344,
          "hillsboro": 8373,
          "airport": 8344,
          "beaverton": 8373
        },
        "42nd": {
          "clackamas": 8344,
          "city center": 8373,
          "rose quarter": 8373,
          "gresham": 8344,
          "airport": 8344,
          "beaverton": 8373
        },
        "lloyd": {
          "clackamas": 8343,
          "city center": 8374,
          "rose quarter": 8374,
          "gresham": 8343,
          "hillsboro": 8374,
          "airport": 8343,
          "beaverton": 8374
        },
        "loyd": {
          "clackamas": 8343,
          "city center": 8374,
          "rose quarter": 8374,
          "gresham": 8343,
          "hillsboro": 8374,
          "airport": 8343,
          "beaverton": 8374
        },
        "11th": {
          "clackamas": 8343,
          "city center": 8374,
          "rose quarter": 8374,
          "gresham": 8343,
          "hillsboro": 8374,
          "airport": 8343,
          "beaverton": 8374
        },
        "7th": {
          "clackamas": 8342,
          "city center": 8375,
          "rose quarter": 8375,
          "gresham": 8342,
          "hillsboro": 8375,
          "airport": 8342,
          "beaverton": 8375
        },
        "convention": {
          "clackamas": 8341,
          "city center": 8376,
          "rose quarter": 8376,
          "gresham": 8341,
          "hillsboro": 8376,
          "airport": 8341,
          "beaverton": 8376
        },
        "rose quarter": {
          "clackamas": 8340,
          "city center": 8377,
          "rose quarter": 8377,
          "gresham": 8340,
          "hillsboro": 8377,
          "airport": 8340,
          "beaverton": 8377
        },
        "hatfield": {
          "hillsboro": 9848,
          "gresham": 9848
        },
        "hillsboro": {
          "gresham": 9846,
          "hillsboro":9845
        },
        "3rd": {
          "gresham": 9846,
          "hillsboro":9845
        },
        "tuality": {
          "gresham": 9843,
          "hillsboro":9844
        },
        "8th": {
          "gresham": 9843,
          "hillsboro":9844
        },
        "washington": {
          "gresham": 9841,
          "hillsboro":9842
        },
        "12th": {
          "gresham": 9841,
          "hillsboro":9842
        },
        "fair": {
          "gresham": 9838,
          "hillsboro": 9837
        },
        "hillsboro airport": {
          "gresham": 9838,
          "hillsboro": 9837
        },
        "hawthorn": {
          "gresham": 9839,
          "hillsboro":9840
        },
        "orenco": {
          "gresham": 9835,
          "hillsboro": 9836
        },
        "231st": {
          "gresham": 9835,
          "hillsboro": 9836
        },
        "central": {
          "gresham": 9846,
          "hillsboro":9845
        },
        "quatama": {
          "gresham": 9834,
          "hillsboro": 9833
        },
        "205th": {
          "gresham": 9834,
          "hillsboro": 9833
        },
        "willow": {
          "gresham": 9831,
          "hillsboro": 9832
        },
        "185th": {
          "gresham": 9831,
          "hillsboro": 9832
        },
        "elmonica": {
          "gresham": 9830,
          "hillsboro": 9829
        },
        "170th": {
          "gresham": 9830,
          "hillsboro": 9829
        },
        "merlo": {
          "gresham": 9828,
          "hillsboro": 9827
        },
        "158th": {
          "gresham": 9828,
          "hillsboro": 9827
        },
        "beaverton creek": {
          "gresham": 9822,
          "hillsboro": 9819
        },
        "millikan": {
          "gresham": 9826,
          "hillsboro": 9825
        },
        "beaverton central": {
          "gresham": 9824,
          "hillsboro": 9823
        },
        "beaverton transit center": {
          "gresham": 9821,
          "hillsboro": 9818
        },
        "sunset": {
          "gresham": 9969,
          "hillsboro": 9624
        },
        "washington park": {
          "gresham": 10120,
          "hillsboro": 10121
        },
        "goosehollow": {
          "gresham": 10118,
          "hillsboro": 10117
        },
        "goose": {
          "gresham": 10118,
          "hillsboro": 10117
        },
        "jefferson": {
          "gresham": 10118,
          "hillsboro": 10117
        },
        "providence": {
          "gresham": 9758,
          "hillsboro": 9758
        },
        "psu south": {
          "hillsboro": 7606,
          "gresham": 10293,
          "airport": 10293,
          "beaverton": 7606
        },
        "5th and jackson": {
          "hillsboro": 7606,
          "beaverton": 7606
        },
        "6th and college": {
          "gresham": 10293,
          "airport": 10293
        },
        "psu urban": {
          "hillsboro": 7618,
          "gresham": 7774,
          "airport": 7774,
          "beaverton": 7618
        },
        "5th and mill": {
          "hillsboro": 7618,
          "beaverton": 7618
        },
        "5th and jefferson": {
          "hillsboro": 7608,
          "beaverton": 7608
        },
        "city hall": {
          "hillsboro": 7608
        },
        "6th and montgomery": {
          "gresham": 7774,
          "airport": 7774
        },
        "6th and madison": {
          "gresham": 13123,
          "airport": 13123
        },
        "pioneer courthouse": {
          "gresham": 7777,
          "airport": 7777
        },
        "pioneer place": {
          "hillsboro": 7646,
          "beaverton": 7646
        },
        "6th and pine": {
          "gresham": 7787,
          "airport": 7787
        },
        "6th and davis": {
          "gresham": 9299,
          "airport": 9299
        },
        "union station": {
          "hillsboro": 7601,
          "gresham": 7763,
          "airport": 7763,
          "beaverton": 7601
        },
        "5th and glisan": {
          "hillsboro": 7601,
          "beaverton": 7601
        },
        "6th and hoyt": {
          "gresham": 7763,
          "beaverton": 7763
        },
        "5th and oak": {
          "hillsboro": 7627,
          "beaverton": 7627
        },
        "5th and couch": {
          "hillsboro": 9303,
          "beaverton": 9303
        },
        "102nd": {
          "gresham": 8348,
          "hillsboro": 8369
        },
        "122nd": {
          "gresham": 8349,
          "hillsboro": 8368
        },
        "148th": {
          "gresham": 8350,
          "hillsboro": 8367
        },
        "162nd": {
          "gresham": 8351,
          "hillsboro": 8366
        },
        "172nd": {
          "gresham": 8352,
          "hillsboro": 8365
        },
        "181st": {
          "gresham": 8353,
          "hillsboro": 8364
        },
        "rockwood": {
          "gresham": 8354,
          "hillsboro": 8363
        },
        "ruby": {
          "gresham": 8355,
          "hillsboro": 8362
        },
        "197th": {
          "gresham": 8355,
          "hillsboro": 8362
        },
        "civic": {
          "gresham": 13450,
          "hillsboro": 13449
        },
        "gresham city": {
          "gresham": 8356,
          "hillsboro": 8361
        },
        "gresham central": {
          "gresham": 8357,
          "hillsboro": 8360
        },
        "cleveland": {
          "city center": 8359,
          "hillsboro": 8359
        },
        // blue and green above
      "airport": {
        "airport": 10579,
        "beaverton": 10579
      },
      "portland international": {
        "airport": 10579,
        "beaverton": 10579
      },
      "mount hood": {
        "airport": 10576,
        "beaverton": 10577
      },
      "cascades": {
        "airport": 10574,
        "beaverton": 10575
      },
      "park rose": {
        "airport": 10572,
        "beaverton": 10573
      },
      "parkrose": {
        "airport": 10572,
        "beaverton": 10573
      },
      "sumner": {
        "airport": 10572,
        "beaverton": 10573
      },
      "south east park": {
        "city center": 13720,
        "milwaukie":  13720
      },
      "milwaukie": {
        "city center": 13721,
        "milwaukie": 13718
      },
      "south east tacoma": {
        "city center": 13722,
        "milwaukie": 13717
      },
      "south east bybee": {
        "city center": 13723,
        "milwaukie": 13716
      },
      "17th and holgate": {
        "city center": 13724,
        "milwaukie": 13715
      },
      "rhine": {
        "city center": 13725,
        "milwaukie": 13714
      },
      "clinton": {
        "city center": 13726,
        "milwaukie": 13713
      },
     "museum": {
        "city center": 13727,
        "milwaukie": 13712
      },
      "south waterfront": {
        "city center": 13728,
        "milwaukie": 13711
      },
      "lincoln": {
        "city center": 13729,
        "milwaukie": 13710
      }
    }
  }

    // gets train color
    var trainColor = inputTrainName.split(' ')[0];

    // loop through stops -> using direction -> assign corresponding stop id
    for (var direction in stopInfo.stops[inputStopName]) {
      if (inputTrainName.includes(direction)) {
        stopId = stopInfo.stops[inputStopName][direction]
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
            this.attributes['firstArrival'] = arrivals[0]
            this.attributes['secondArrival'] = arrivals[1]
            var seconds = ((this.attributes.firstArrival.estimated) - (data.resultSet.queryTime))
            var date = new Date(seconds)
            var minutes = date.getMinutes()
            var hours = date.getHours()


            var estimatedArrival = (this.attributes.firstArrival.estimated)
            var date = new Date(0)
            date.setUTCMilliseconds(estimatedArrival)
            console.log(date)
            var estimatedMinutes = date.getMinutes()
            console.log(estimatedMinutes)
            var estimatedHours = date.getHours()
            console.log(estimatedHours)
            var suffix = (estimatedHours >= 12) ? 'PM' : 'AM'
            estimatedHours = (estimatedHours > 12) ? estimatedHours - 12 : estimatedHours
            estimatedHours = (estimatedHours == '00') ? 12 : estimatedHours

            var estimatedArrivalTime = estimatedHours + ':' + estimatedMinutes + ' ' + suffix

            var speechOutput = 'The next ' + this.attributes.firstArrival.shortSign + ' will arrive at ' + this.attributes.stopName + ' in ' + minutes + ' minutes';

            this.emit(':tellWithCard', speechOutput, snippets.APP_NAME, speechOutput)
          }
        }
      })
    })
  },
  'Unhandled': function() {
    this.emit(':ask', snippets.UNHANDLED);
   }
}
