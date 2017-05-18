var https = require('https')
var Alexa = require('alexa-sdk')

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = process.env.appId;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
  'LaunchRequest': function () {
    console.log('launch request started')
  },
  'CreateRequest': function () {
    this.attributes['stopName'] = ''
    this.emit(':ask', 'What Stop?', 'In order to get arrival information, I need your desired stop.')
  },
  'GetTrainName': function () {
    this.attributes['stopName'] = this.event.request.intent.slots.StopName.value;
    this.attributes['trainName'] = ''
    this.emit(':ask', 'What train?', 'In order to get arrival information, I need your desired train.')
  },
  'ArrivalInformation': function () {
    this.attributes['trainName'] = this.event.request.intent.slots.TrainName.value;
    this.attributes['firstArrival'] = ''

    var inputTrainName = this.attributes.trainName;
    var inputStopName = this.attributes.stopName;
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
          "airport": 8347
        },
        "clackamas": {
          "clackamas": 13132,
          "city center": 13132
        },
        "fuller": {
          "clackamas": 13130,
          "city center": 13133
        },
        "lents": {
          "clackamas": 13128,
          "city center": 13135
        },
        "flavel": {
          "clackamas": 13129,
          "city center": 13134
        },
        "holgate": {
          "clackamas": 13127,
          "city center": 13136
        },
        "powell": {
          "clackamas": 13126,
          "city center": 13137
        },
        "division": {
          "clackamas": 13125,
          "city center": 13138
        },
        "main": {
          "clackamas": 13124,
          "city center": 13139
        },
        "hatfield": {
          "hillsboro": 9849,
          "gresham": 9848
        },
        "washington": {
          "city center": 9841,
          "gresham": 9841,
          "hillsboro":9842
        },
        "fair": {
          "city center": 9838,
          "gresham": 9838,
          "hillsboro": 9837
        },
        "hillsboro": {
          "gresham": 9846,
          "hillsboro":9845
        },
        "tuality": {
          "city center": 9843,
          "gresham": 9843,
          "hillsboro":9844
        },
        "washington": {
          "city center": 9841,
          "gresham": 9841,
          "hillsboro":9842
        },
        "hawthorn": {
          "city center": 9839,
          "gresham": 9839,
          "hillsboro":9840
        },
        "central": {
          "city center": 9856,
          "gresham": 9846,
          "hillsboro":9845
        },
        "orenco": {
          "city center": 9835,
          "gresham": 9835,
          "hillsboro": 9836
        },
        "quatama": {
          "city center": 9834,
          "gresham": 9834,
          "hillsboro": 9833
        },
        "willow": {
          "city center": 9831,
          "gresham": 9831,
          "hillsboro": 9832
        },
        "elmonica": {
          "city center": 9830,
          "gresham": 9830,
          "hillsboro": 9829
        },
        "merlo": {
          "city center": 9828,
          "gresham": 9828,
          "hillsboro": 9827
        },
        "creek": {
          "city center": 9822,
          "gresham": 9822,
          "hillsboro": 9819
        },
        "beaverton central max station": {
          "city center": 9824,
          "gresham": 9824,
          "hillsboro": 9823
        },
        "millikan": {
          "city center": 9826,
          "gresham": 9826,
          "hillsboro": 9825
        },
        "btc": {
          "city center": 9821,
          "gresham": 9821,
          "hillsboro": 9818
        },
        "beaverton transit center": {
          "city center": 9821,
          "gresham": 9821,
          "hillsboro": 9818
        },
        "sunset": {
          "city center": 9969,
          "gresham": 9969,
          "hillsboro": 9626
        },
        "washington park": {
          "city center": 10120,
          "gresham": 10120,
          "hillsboro": 10121
        },
        "goosehollow": {
          "city center": 10118,
          "gresham": 10118,
          "hillsboro": 10117
        },
        "goose": {
          "city center": 10120,
          "gresham": 10120,
          "hillsboro": 10121
        },
        "providence": {
          "city center": 9758,
          "gresham": 9758,
          "hillsboro": 9758
        },
        "sw 6th": {
          "city center": 10120,
          "gresham": 10120,
          "hillsboro": 10121
        },
        "102nd": {
          "gresham": 8348,
          "city center": 8369,
          "hillsboro": 8369
        },
        "East 102nd": {
          "gresham": 8348,
          "city center": 8369,
          "hillsboro": 8369
        },
        "122nd": {
          "gresham": 8349,
          "city center": 8368,
          "hillsboro": 8368
        },
        "East 122nd": {
          "gresham": 8349,
          "city center": 8368,
          "hillsboro": 8368
        },
        "148th": {
          "gresham": 8350,
          "city center": 8367,
          "hillsboro": 8367
        },
        "East 148th": {
          "gresham": 8350,
          "city center": 8367,
          "hillsboro": 8367
        },
        "162nd": {
          "gresham": 8351,
          "city center": 8366,
          "hillsboro": 8366
        },
        "East 162nd": {
          "gresham": 8351,
          "city center": 8366,
          "hillsboro": 8366
        },
        "172nd": {
          "gresham": 8352,
          "city center": 8365,
          "hillsboro": 8365
        },
        "East 172nd": {
          "gresham": 8352,
          "city center": 8365,
          "hillsboro": 8365
        },
        "181st": {
          "gresham": 8353,
          "city center": 8364,
          "hillsboro": 8364
        },
        "rockwood": {
          "gresham": 8354,
          "city center": 8363,
          "hillsboro": 8363
        },
        "ruby": {
          "gresham": 8355,
          "city center": 8362,
          "hillsboro": 8362
        },
        "civic": {
          "gresham": 13450,
          "city center": 13449,
          "hillsboro": 13449
        },
        "gresham city hall": {
          "gresham": 8356,
          "city center": 8361,
          "hillsboro": 8361
        },
        "gresham central": {
          "gresham": 8357,
          "city center": 8360,
          "hillsboro": 8360
        },
        "cleveland": {
          "city center": 8359,
          "hillsboro": 8359
        },
        "airport": {
          "beaverton": 10579
        },
        "mount hood": {
          "airport": 10576,
          "beaverton": 10577
        },
        "cascade": {
          "airport": 10574,
          "beaverton": 10575
       },
        "park rose": {
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


            this.emit(':tell', 'The next arrival for ' + this.attributes.firstArrival.shortSign + ' at ' + this.attributes.stopName + ' will be in ' + minutes + ' minutes')
          }
        }
      })
    })
  },
  'Unhandled': function() {
    this.emit(':ask', 'test');
   }
}
