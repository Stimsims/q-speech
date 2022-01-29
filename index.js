import {initialize as speechInit, updateLanguage as speechUpdateLanguage, doListen, addListenButton} from './speech.js';
import {createTranslator} from './translate.js';
import {initialize as synthInit, updateLanguage as synthUpdateLanguage, textToSpeech} from './synthesis.js';
import {logger} from './utilities.js';

export const ENGLISH = 'en-US';
export const languages = ['ja-JP', 'fr-FR'];
export let translator;
export var hvbLanguage = languages[0];
var clientLanguageCallback;
var inputCallback;
var errorCallback;

export const handleErrors = (id, error) => {
    logger(`log`, `error from ${id}: ${error}`);
    if(errorCallback){
        errorCallback(error);
    }
}
export const handleSpeechInput = (text) => {
    logger('log', `handleSpeechInput called with text`, text);
    if(inputCallback && text){
        inputCallback(text);
    }
}
const addLanguageButtons = (containerId) => {
    let wrapper = document.createElement("DIV");
    wrapper.setAttribute('id', 'language-buttons-wrapper');
    let btn;
    languages.map(lang => {
        btn = document.createElement("BUTTON");
        btn.innerHTML = lang;
        btn.setAttribute('id', lang);
        if(hvbLanguage === lang){
            btn.classList.add("active-language");
        }
        btn.classList.add("language-button");
        btn.setAttribute('id', lang);
        btn.onclick=changeLanguage;
        wrapper.appendChild(btn);
    })
    let d = document.getElementById(containerId);
    logger('log', `adding listen to main`, d);
    d.appendChild(wrapper);
}

const addTestButton = (containerId) => {
    //textToSpeech
    const tests = [{text: 'hello world', lang: 'en-US'}, {text: 'sushi o taberu', lang: 'ja-JP'}, {text: 'no language set', lang: null}];
    let wrapper = document.createElement("DIV");
    wrapper.setAttribute('id', 'test-buttons-wrapper');
    tests.map(test => {
        let btn = document.createElement("BUTTON");
        btn.innerHTML = test.text;
        btn.onclick=()=>{
            textToSpeech(test.text, test.lang);
        };
        wrapper.appendChild(btn);
    })
    let d = document.getElementById(containerId);
    logger('log', `adding listen to main`, d);
    d.appendChild(wrapper);
}


export const changeLanguage = (event) => {
    let id = event.target.id;
    logger('log', `changeLanguage id ${id} index ${languages.indexOf(id)} callback`, clientLanguageCallback);
    //check the id is a supported language
    if(languages.indexOf(id) < 0){
        throw Error('invalid language id '+ id);
        return;
    }
    //remove active styles from the unselected button
    let prev = document.getElementById(hvbLanguage);
    prev.classList.remove("active-language");
    
    //show active styles on the selected language button
    let next = document.getElementById(id);
    next.classList.add("active-language");

    //the value the package uses to remember the language
    hvbLanguage = id;
    //update settings to the new language so Quest understands the language
    if(clientLanguageCallback) clientLanguageCallback(hvbLanguage);
    //change the translator so languages can be displayed helpfully to the player. 
    translator = createTranslator(hvbLanguage);
    //change the speech recognition language so it pattern matches the right utterances
    speechUpdateLanguage(hvbLanguage);
    //change the synthesis voice and language
    synthUpdateLanguage(hvbLanguage);
}

const initialize = (language, callback, handleInputCallback, handleErrorsCallback) => {
    hvbLanguage = language;
    clientLanguageCallback = callback;
    inputCallback = handleInputCallback;
    errorCallback = handleErrorsCallback;
    translator = createTranslator(language);
    speechInit(language);
    //init speech synthesis to narrate selected texts to the player
    synthInit(language);
}

const showUi = (containerId) => {
    //listen for speech
    addListenButton(containerId);
    //add buttons to test changing languages
    addLanguageButtons(containerId);
    // //for testing features
    // addTestButton(containerId);
}

if(window){
    window.hvbSpeech = {
        initialize, //required - to initialize the api components
        showUi, //optional - to inject the api views, provide a container ID
        doListen, //optional - call functions directly from custom UI components
        changeLanguage,
        textToSpeech
    }
}else{
    logger('warn', `there is no window package for hvbSpeech to attach itself to`);
}