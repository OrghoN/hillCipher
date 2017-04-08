const readFiles = require('read-multiple-files');
const math = require('mathjs');
const pad = require('array-pad');

const dictionary = require('./dictionary.js');

var text = "Over 60 million people came to New York City last year, but this downtown yoga class offers a quiet place to go with the flow....with cats. ";

// readFiles(['hello.txt', 'world.txt'], 'utf8', (err, contents) => {
//   if (err) {
//     throw err;
//   }
//
//   console.log(contents);
// });

function adjugate(matrix) {
    var det = math.det(matrix);

    return math.chain(matrix).inv().map(function(val) {
        return (math.round(val * det));
    }).done();

}

function createEncodingKey(n, max) {
    var det = 0;
    var encodingKey
    while (det === 0) {
        encodingKey = math.random([n, n], 1, max);
        encodingKey = math.map(encodingKey, function(val) {
            return math.round(val);
        });
        det = math.det(encodingKey);
    }

    return math.matrix(encodingKey);
}

function createDecodingKey(encodingKey) {
    var det = math.det(encodingKey);
    var detInv = math.xgcd(det, dictionary.modulo).toArray()[1];

    var decodingKey = math.map(adjugate(encodingKey), function(val) {
        return math.mod((detInv * val), dictionary.modulo);
    });

    return decodingKey;
}

function generateKeyPair(n = 3, max = 2000) {
    var clearText = "abcdefghijklmnopqrstuvwxyz .?";
    var key;
    var genText;

    while (clearText.localeCompare(genText) !== 0) {
        key = createEncodingKey(n, max);
        genText = code(createDecodingKey(key), code(key, clearText));
    }

    return key;
}

function code(key, text) {
    var block = math.size(key)._data[0];

    //filter text for anything that can be coded
    text = text.toLowerCase().match(/[A-Z .?]/gi);
    //padding, if required
    text = math.mod(text.length, block) == 0 ? text : pad(text, text.length + block - math.mod(text.length, block), " ");

    //chunking
    text = math.matrix(math.reshape(text, [block, text.length / block]));

    //converting text to numbers
    var codedText = math.map(text, function(val) {
        return dictionary.encodingDict[val];
    });

    //encoding
    codedText = math.chain(key).multiply(codedText).mod(dictionary.modulo).map(function(val) {
        return dictionary.decodingDict[val];
    }).done();

    //turning back into string
    codedText = math.flatten(codedText).toArray().join("").trim();

    return codedText;
}

key2 = generateKeyPair();

console.log(code(key2, text));

console.log(code(createDecodingKey(key2), code(key2, text)));

// console.log(dictionary.modulo);
