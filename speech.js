import {handleSpeechInput, handleErrors, ENGLISH} from './index.js';
import {logger} from './utilities.js';
import {createTranslator} from './translate.js'; 

var SpeechRecognition = window.SpeechRecognition|| window.webkitSpeechRecognition;
var SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
var SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

/**
 * Speech Recognition is distinct from the language of the game. 
 * The UI and game generated language will remain in english.
 * The player generated language and any npc's or written world material
 * will be in the language to be learned
 * 
 * options: en-US ja-JP fr-FR
 */


var listener, translator;
var listenerResults = [];

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
    if(listener){
        showIsListening();
        listenerResults = [];
       // englishListener.start();
        listener.start();
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
    listener.lang = language;
    translator = createTranslator(language);
}

const onResult = (event) => {
    logger('log', `listener on result`, event);
    var speechResult = event.results[0][0].transcript.toLowerCase();
    logger('log',' Confidence: ' + event.results[0][0].confidence +  ' result: ' + speechResult);
    translator.getReadableText(speechResult).then(result => {
        handleSpeechInput(result);
    }).catch(err => {
        handleErrors('speech.js', err);
    })
    
}

const onSpeechStart = (ev) => {
    logger('log', `listener onSpeechStart`, ev);
};

const onSpeechEnd = (ev) => {
    logger('log', `listener onSpeechEnd`, ev);
    listener.stop();
    showIsNotListening();
};

const onNoMatch = (event) => {
    logger('log', `listener onNoMatch`);
    showIsNotListening();
};

const onError = (event) => {
    logger('log', `Error occurred in listener: ${event.error}`);
    showIsNotListening();
};

const onAudioStart = (event) => {
    logger('log', `onAudioStart`, event);
};

const onAudioEnd = (event) => {
    logger('log', `onAudioEnd`, event);
};
//TODO create 2 foreigns, one for the language and one for english
//compare the results

const createListener = (language) => {
    logger('log', `createListener ${language}`);
    let listener = new SpeechRecognition()
    listener.lang = language;
    listener.interimResults = false;
    listener.maxAlternatives = 1;
    listener.onresult = onResult;
    listener.onspeechstart = onSpeechStart;
    listener.onspeechend = onSpeechEnd;
    listener.onnomatch = onNoMatch;
    listener.onerror = onError;
    listener.onaudiostart = onAudioStart;
    listener.onaudioend = onAudioEnd;
    return listener;
}

export const initialize = (language) => {
    listener = createListener(language);
    translator = createTranslator(language);
    //englishListener = createListener(ENGLISH) 
}
