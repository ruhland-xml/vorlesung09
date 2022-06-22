const fs = require('fs');
const readline = require('readline');
const {getKeywords} = require('./keywords');


const orgfile = "./allCountries.txt"
const newfile = "./allCountries-JSON.txt";

let counter = 0;

fs.writeFile(newfile, "", function(err){
    if(err){
       console.log(err);
       process.exit();
    }
});

const rl = readline.createInterface({
    input: fs.createReadStream(orgfile),
    crlfDelay: Infinity
});

rl.on('line', (line) => {
    counter++;
    if ( counter % 1000 === 0 ){
        console.log("importfile counter="+counter);
    }
    let entry = line.split('\t').structure();
    let entry_json = JSON.stringify(entry);
    fs.appendFile(newfile,entry_json+"\n", function(err){
        if(err){console.log(err)}
    });
});


Array.prototype.structure = function() {
    let obj =  {
        geonameid: Number(this[0]),
        name: this[1],
        state: this[10],
        country: this[8],
        loc : { type: "Point", coordinates: [this[4], this[5]] },
        alternatenames: this[3].split(','),
        type: this[6],
        meta: {
            keywords: null
        }
    };
    let keywords= getKeywords(obj);
    obj.meta.keywords = keywords;
    return obj;
}
