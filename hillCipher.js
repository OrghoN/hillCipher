const readFiles = require('read-multiple-files');
const math = require('mathjs');
const modulo = 29;

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

console.log(createEncodingKey());
