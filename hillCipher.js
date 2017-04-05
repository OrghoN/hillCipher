const readFiles = require('read-multiple-files');
const math = require('mathjs');

// readFiles(['hello.txt', 'world.txt'], 'utf8', (err, contents) => {
//   if (err) {
//     throw err;
//   }
//
//   console.log(contents);
// });

function createDecodingKey(encodingKey) {
    var det = math.det(encodingKey);
    var detInv = math.xgcd(det, 26).toArray()[1];

    var decodingKey = math.chain(encodingKey).inv().map(function(val) {
        return math.mod((detInv * math.round(val * det)), 26)
    }).done();

    return decodingKey;
}

function createEncodingKey(n = 3) {
    return math.random([n,n], 1, 200);
}

console.log(createEncodingKey());
