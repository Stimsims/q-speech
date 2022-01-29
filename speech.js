import {handleSpeechInput} from './index.js';
import {logger} from './utilities.js';

var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
var SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
var SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

/**
 * Speech recognition is distinct from the language of the game. 
 * The UI and game generated language will remain in english.
 * The player generated language and any npc's or written world material
 * will be in the language to be learned
 * 
 * options: en-US ja-JP fr-FR
 */


var recognition;

const showIsListening = () => {
    let btn = document.getElementById('listen_button');
    btn.innerHTML = 'listening';
}
const showIsNotListening = () => {
    let btn = document.getElementById('listen_button');
    btn.innerHTML = 'listen';
}

export const doListen = () => {
    logger('log', `computer is listening`);
    logger('log', `recognition start`);
    if(recognition){
        showIsListening();
        recognition.start(); //TODO add ui indicator that computer is listening
    }
}

export const addListenButton = (containerId) => {
    let btn = document.createElement("BUTTON");
    btn.innerHTML = "listen";
    btn.setAttribute('id', 'listen_button');
    btn.onclick=doListen;
    logger('log', `adding listen button`, document.getElementById);
    let d = document.getElementById(containerId);
    logger('log', `adding listen to main`, d);
    d.appendChild(btn);
}

export const updateLanguage = (language) => {
    recognition.lang = language;
}

const onResult = function(event) {
    logger('log', "recognition on result", event);
    var speechResult = event.results[0][0].transcript.toLowerCase();
    logger('log', 'Confidence: ' + event.results[0][0].confidence +  ' result: ' + speechResult);
    handleSpeechInput(speechResult);
}

const onSpeechEnd = function() {
    logger('log', `recognition stop`);
    recognition.stop();
    showIsNotListening();
};

const onNoMatch = function(event) {
    logger('log', `speech onNoMatch`);
    showIsNotListening();
};

const onError = function(event) {
    logger('log', 'Error occurred in recognition: ' + event.error);
    showIsNotListening();
};

export const initialize = (language) => {
    recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = onResult;
    recognition.onspeechend = onSpeechEnd;
    recognition.onnomatch = onNoMatch;
    recognition.onerror = onError;
}
