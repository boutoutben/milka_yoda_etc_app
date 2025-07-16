import { Crypto } from '@peculiar/webcrypto';

// ⚠️ Polyfill pour crypto.subtle dans JSDOM
if (!globalThis.crypto) {
  globalThis.crypto = new Crypto();
} else if (!globalThis.crypto.subtle) {
  globalThis.crypto.subtle = new Crypto().subtle;
}
