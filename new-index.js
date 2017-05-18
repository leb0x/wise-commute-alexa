var Alexa = require('alexa-sdk')


var states = {
  START: '_STARTMODE',

}


var snippets = {
  STOP_QUESTION: "What stop?",
  STOP_QUESTION_REPROMPT: "In order to get arrival information, I need your desired stop."
  TRAIN_NAME_QUESTION: "What train?",
  TRAIN_NAME_QUESTION_REPROMPT: "In order to get arrival information, I need your desired train.",
  HELP: "You can ask wise commute for arrival information by providing, your desired stop name and train name.",
  STOP: "Thank you for using wise commute.",
  HELP_REPROMPT: "Simply provide stop name and train name.",
  UNHANDLED: "I'm sorry I couldn't understand what you meant. Can you please say that again?",

}

var newSessionHandlers = {

    // session variables stored in this.attributes
    // session state is stored in this.handler.state
    // handler.state vs Intent vs
  'LaunchRequest': function() {
        // Initialise State
        this.handler.state = states.START;

        // emitWithState should be called executeStateHandler("Start").
        // As such this will call a handler "Start" in the startStateHandlers object.
        // Maybe this line and the previous line could be more coherently wrapped into a single
        // function:
        // this.stateTransition( states.START, "Start" )
        this.emit("Start")
    },

    // It's unclear whether this can ever happen as it's triggered by Alexa itself.
    "Unhandled": function () {
        var speechText = "I wasn't launched yet";
        this.emit(":ask", speechText);
    }
}

var startStateHandlers = Alexa.CreateStateHandler(states.START, {
  'Start': function() {

    this.attributes['dob'] = '';
    this.attributes['gender'] = '';

    this.handler.state = states.START;
    var speechText = snippets.WELCOME;
    var repromptText = snippets.WELCOME_REPROMPT;

    this.emit(':ask', speechText, repromptText);
    }
