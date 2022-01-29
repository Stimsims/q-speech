import {logger} from './utilities.js';

logger('log', `synthesis script had loaded`);

var synth = window.speechSynthesis;

var pitch = 1;
var rate = 1;
var voice;

export function viewVoices() {
  let voices = synth.getVoices();

  for(var i = 0; i < voices.length ; i++) {
    logger('log', voices[i].name + ' (' + voices[i].lang + ')');
  }
}

const getVoice = (lang) => {
  let result = null;
  let voices = synth.getVoices();
  voices.map(v => {
    if(v.lang === lang) result = v;
  });
  if(!result) throw Error(`changeVoice error: language ${lang} didn't match any of the voice options`);
  return result;
}

export const changeVoice = (language) => {
    //select the first voice that matches language type
    voice = getVoice(language);
}

export const textToSpeech = (text, lang) => {
    logger('log', `textToSpeech text`, text);
    logger('log', `textToSpeech voice`, voice);
    var utterThis = new SpeechSynthesisUtterance(text);
    utterThis.voice = lang?getVoice(lang):voice;
    utterThis.pitch = pitch;
    utterThis.rate = rate;
    synth.speak(utterThis);
}

const testTTS = (language) => {
  //'fr-FR', 'en-US'
  logger('log', `testTTS language`, language)
  if(language === 'ja-JP'){
    textToSpeech('寿司を食べる');
    //textToSpeech('Sushi o taberu');
    //textToSpeech('こんにちは');
  }else if(language === 'fr-FR'){
    textToSpeech('manger des sushis');
  }else{
    textToSpeech('sushi is the best thing in the world to eat');
  }
}

export const updateLanguage = (language) => {
  changeVoice(language);
  testTTS(language);
}
export const initialize = (language) => {
  changeVoice(language);
}
