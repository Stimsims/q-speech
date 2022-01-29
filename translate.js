import {logger} from './utilities.js';

logger('log', `translator file is running`);
logger('log', `Kuroshiro package`, Kuroshiro);

export const createTranslator = (language) => {
    switch(language){
        case 'ja-JP': return new JapaneseTranslator();
        default: return new DefaultTranslator();
    }
}

function JapaneseTranslator(){
    this.kuroshiro = new Kuroshiro.default();
    this.analyzer = new KuromojiAnalyzer();
    this.kuroshiro.init(this.analyzer);
    this.getReadableText = (phrase) => {
        //some languages don't need to do this
        //return furigana form, and romanji form
        const readables = [phrase];
        logger(`log`, `this translator`, this);
        return this.kuroshiro.convert(phrase, 
            { to: "hiragana" }
        ).then((result)=>{
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

function DefaultTranslator(){
    this.getReadableText = (phrase) => {
        return new Promise((resolve, reject)=> {
            resolve([phrase]);
        });
    }
}

//french translator and english translator

const testTranslator = (phrases) => {
    logger('log', `testing translator`)
    let translator = createTranslator('japanese');
    phrases.map(phrase => {
        translator.getReadableText(phrase).then(result => {
            logger('log', `translated text:`, result);
            result.map(text => {
                logger('log', text);
            })
        }).catch((err)=> {
            logger('log', `getReadableText err`, err);
        });
    })

}
//it works with kanji, but not romanji
testTranslator(
    [
        "一",
        "Sushi o taberu",
        "通りを歩く",
        "感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！"
    ]
);