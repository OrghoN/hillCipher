const readFiles = require('read-multiple-files');

readFiles(['hello.txt', 'world.txt'], 'utf8', (err, contents) => {
  if (err) {
    throw err;
  }

  console.log(contents);
});
