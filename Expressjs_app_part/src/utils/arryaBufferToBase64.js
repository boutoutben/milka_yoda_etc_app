function arrayBufferToBase64(buffer) {
  return btoa(
  String.fromCharCode(...new Uint8Array(buffer))
);
}

module.exports = arrayBufferToBase64