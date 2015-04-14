var message = 'unloaded';
try {
  importScripts('https://badssl.com/test/imported.js');
} catch(ex) {
}
postMessage(message);
