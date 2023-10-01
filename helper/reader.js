const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

async function readJsonFileAsString(filePath) {
  try {
    const data = await readFile(filePath, 'utf8');
    return data;
  } catch (err) {
    console.error('Error reading file:', err);
    throw err; // Re-throw the error to be handled by the caller
  }
}


module.exports = {
    readJsonFileAsString
};