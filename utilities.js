import settings from './settings.js';

/**
    handles package logging features
 */
export const logger = (level, text, obj) => {
    if(settings.logging){
        if(obj){
            switch(level){
                case 'error': console.error(text, obj); break;
                case 'warn': console.warn(text, obj); break;
                default: console.log(text, obj);
            }
        }else{
            switch(level){
                case 'error': console.error(text); break;
                case 'warn': console.warn(text); break;
                default: console.log(text);
            }
        }
    }
}