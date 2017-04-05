const readFiles = require('read-multiple-files');
const math = require('mathjs');
const pad = require('array-pad')
const modulo = 29;

var text = "The quick brown fox jumps over the lazy dog.?!";
var key = math.matrix([
    [6, 24, 1],
    [13, 16, 10],
    [20, 17, 15]
])

// readFiles(['hello.txt', 'world.txt'], 'utf8', (err, contents) => {
//   if (err) {
//     throw err;
//   }
//
//   console.log(contents);
// });

function createDecodingKey(encodingKey) {
    var det = math.det(encodingKey);
    var detInv = math.xgcd(det, modulo).toArray()[1];

    var decodingKey = math.chain(encodingKey).inv().map(function(val) {
        return math.mod((detInv * math.round(val * det)), modulo)
    }).done();

    return decodingKey;
}

function createEncodingKey(n = 3, max = 1000) {
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

function code(key, text) {
    var block = math.size(key)._data[0];

    //filter text for anything that can be coded and chunking it
    text = text.toLowerCase().match(/[A-Z .]/gi).map(function(item, index, array) {
        return index % block === 0 ? array.slice(index, index + block) : null;
    }).filter(function(item) {
        return item;
    });

    //padding the last chunk if required
    text[text.length-1] = pad(text[text.length-1],block," ")


    return text;
}

console.log(code(key, text));
