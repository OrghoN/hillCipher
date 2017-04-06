const readFiles = require('read-multiple-files');
const math = require('mathjs');
const pad = require('array-pad')
const modulo = 29;

var text = "The quick brown fox jumps over the lazy dog.!";

var key = math.matrix([
    [6, 24, 1],
    [13, 16, 10],
    [20, 17, 15]
]);

const encodingDict = {
    "a": 0,
    "b": 1,
    "c": 2,
    "d": 3,
    "e": 4,
    "f": 5,
    "g": 6,
    "h": 7,
    "i": 8,
    "j": 9,
    "k": 10,
    "l": 11,
    "m": 12,
    "n": 13,
    "o": 14,
    "p": 15,
    "q": 16,
    "r": 17,
    "s": 18,
    "t": 19,
    "u": 20,
    "v": 21,
    "w": 22,
    "x": 23,
    "y": 24,
    "z": 25,
    ".": 26,
    "?": 27,
    " ": 28
}

const decodingDict = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", ".", "?", " "];

// readFiles(['hello.txt', 'world.txt'], 'utf8', (err, contents) => {
//   if (err) {
//     throw err;
//   }
//
//   console.log(contents);
// });

adjugate = function(matrix) {
    var checkerBoard, column, columns, i, j, k, l, m, n, ref, ref1, ref2, ref3, ref4, results, results1, results2, results3, returnMatrix, row, rows, submatrix, wantedColumns, wantedRows;
    ref = matrix.size(0), rows = ref[0], columns = ref[1];
    returnMatrix = math.matrix([rows, columns]);
    for (row = i = 0, ref1 = rows; 0 <= ref1 ? i < ref1 : i > ref1; row = 0 <= ref1 ? ++i : --i) {
        for (column = j = 0, ref2 = columns; 0 <= ref2 ? j < ref2 : j > ref2; column = 0 <= ref2 ? ++j : --j) {
            wantedRows = (function() {
                results1 = [];
                for (var l = 0; 0 <= row ? l < row : l > row; 0 <= row ? l++ : l--) {
                    results1.push(l);
                }
                return results1;
            }).apply(this).concat((function() {
                results = [];
                for (var k = ref3 = row + 1; ref3 <= rows ? k < rows : k > rows; ref3 <= rows ? k++ : k--) {
                    results.push(k);
                }
                return results;
            }).apply(this));
            wantedColumns = (function() {
                results3 = [];
                for (var n = 0; 0 <= column ? n < column : n > column; 0 <= column ? n++ : n--) {
                    results3.push(n);
                }
                return results3;
            }).apply(this).concat((function() {
                results2 = [];
                for (var m = ref4 = column + 1; ref4 <= columns ? m < columns : m > columns; ref4 <= columns ? m++ : m--) {
                    results2.push(m);
                }
                return results2;
            }).apply(this));
            submatrix = matrix.subset(math.index(wantedRows, wantedColumns));
            returnMatrix.subset(math.index(row, column), -math.det(submatrix));
        }
    }
    checkerBoard = function(value, index, matrix) {
        var coordTotal;
        coordTotal = index.reduce((function(a, b) {
            return a + b;
        }), 0);
        return Math.pow(-1, coordTotal + 1) * value;
    };
    return math.transpose(returnMatrix.map(checkerBoard));
};

function createDecodingKey(encodingKey) {
    var det = math.det(encodingKey);
    var detInv = math.xgcd(det, modulo).toArray()[1];

    //creating mod inverse
    var decodingKey = adjugate(encodingKey);
    decodingKey = math.map(decodingKey, function(val) {
        return math.mod((detInv * val), modulo);
    });

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

    //filter text for anything that can be coded
    text = text.toLowerCase().match(/[A-Z .?]/gi);
    //padding, if required
    text = math.mod(text.length, block) == 0 ? text : pad(text, text.length + block - math.mod(text.length, block), " ");

    //chunking
    text = math.matrix(math.reshape(text, [block, text.length / block]));

    //converting text to numbers
    var codedText = math.map(text, function(val) {
        return encodingDict[val];
    });

    //encoding
    codedText = math.chain(key).multiply(codedText).mod(modulo).map(function(val) {
        return decodingDict[val];
    }).done();

    //turning back into string
    codedText = math.flatten(codedText).toArray().join("").trim();

    return codedText;
}

key2 = createEncodingKey();

console.log(code(key2, text));

console.log(code(createDecodingKey(key2), code(key2, text)));
