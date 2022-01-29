import {logger} from './utilities.js';

logger('log', `translator file is running`);
logger('log', `Kuroshiro package`, Kuroshiro);

export const createTranslator = (language) => {
    switch(language){
        case 'ja-JP': 
        default: return new JapaneseTranslator();
    }
}

function JapaneseTranslator(){
    this.kuroshiro = new Kuroshiro.default();
    this.analyzer = new KuromojiAnalyzer();
    this.getReadableText = (phrase) => {
        //some languages don't need to do this
        //return furigana form, and romanji form
        const readables = [];
        return this.kuroshiro.init(this.analyzer)
        .then(()=>{
            return this.kuroshiro.convert(phrase, 
                { to: "hiragana" }
            );
        })
        .then((result)=>{
            logger('log', `hiragana:`, result);
            readables.push(result);
            return this.kuroshiro.convert(phrase, 
                { to: "romaji" }
            );
        })
        .then((result)=>{
            logger('log', `romanji:`, result);
            readables.push(result);
            return readables;
        })
        
    }
}

//french translator and english translator

const testTranslator = () => {
    logger('log', `testing translator`)
    let testPhrase = "感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！";
    let translator = createTranslator('japanese');
    translator.getReadableText(testPhrase).then(result => {
        logger('log', `readable text:`, result);
        result.map(text => {
            msg(`or put another way: ${text}`);
        })
    }).catch((err)=> {
        logger('log', `getReadableText err`, err);
    });
}
