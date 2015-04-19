var message = 'unloaded';
try {
  importScripts('https://self-signed.badssl.com/test/imported.js');
} catch(ex) {
}
postMessage(message);
