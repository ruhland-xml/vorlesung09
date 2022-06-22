// Extrahiert alle Keywords aus einem JSON-Objekt obj
// Ergebnis ist ein Array keywords
// Rekursives Durchlaufen eines JSON-Objects ohne das meta

const fs = require('fs');
const daitchMokotoff = require('talisman/phonetics/daitch-mokotoff');

function extractKeywordsFromJson(obj, keywords) {
    for(var key in obj) {
        if( key !== "meta" && obj[key] instanceof Object) { 
            extractKeywordsFromJson(obj[key],keywords);
        } else {
            let value = obj[key];
            if ( typeof value ===  "string" ){
                newString = value.replace(/[`~!@#$%^&*()_|+\-=?;:,.'"<>\{\}\[\]\\\/]/gi, ' ')
                let stringArray = newString.split(/(\s+)/).filter( e => e.trim().length > 0);
                for ( let i=0; i< stringArray.length; i++ ){
                    let singleString = stringArray[i].toLowerCase();
                    if ( singleString.length>0 && keywords.includes(singleString) === false )
                        keywords.push(singleString);
                }
            }
        };
    }
};

function getSimilarDoichMokotoff(keywords){
    let phonetics = [];
    for ( let i=0; i<keywords.length; i++ ){
        let keyword = keywords[i];
        let results = daitchMokotoff(keyword);
        for ( let k=0; k<results.length; k++ ){
            result = results[k];
            let without_trailing_zeros = result.replace(/0+$/g, "");
            if ( without_trailing_zeros.length > 0 && phonetics.includes(without_trailing_zeros) === false)
                phonetics.push(without_trailing_zeros);
        }
    }
    return phonetics;
}

module.exports = {
    getKeywords: function(obj) { 
        let keywords = [];
        extractKeywordsFromJson(obj,keywords);
        let phonetics = getSimilarDoichMokotoff(keywords);
        let all_words = keywords.concat(phonetics);
        return all_words;
    }
}


