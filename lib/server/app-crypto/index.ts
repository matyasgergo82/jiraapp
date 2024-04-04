import aesjs from "aes-js";
import pbkdf2 from "pbkdf2";
import { randomString } from "~/lib/utils";

/**
 * Check if the APP_SECRET environment variable is set.
 */
if (!process.env.APP_SECRET) {
  throw new Error("APP_SECRET environment variable is not set");
}

/**
 * Generate a 32 byte key from the APP_SECRET to use as the secret key for the AES encryption and decryption.
 */
const APP_SECRET_KEY: Buffer = pbkdf2.pbkdf2Sync(process.env.APP_SECRET, "", 1, 32, "sha256");

/**
 * Encrypts the given plain text using AES-CBC encryption.
 * @param plainText - The plain text to encrypt.
 * @returns The encrypted text.
 */
export function encrypt(plainText: string): string {
  const aesCbc = new aesjs.ModeOfOperation.cbc(APP_SECRET_KEY, new Uint8Array(16));

  // Calculate the padding required. The padding is added to the end of the text to make it a multiple of 16 bytes.
  let reqPadding = 16 - (aesjs.utils.utf8.toBytes(plainText).length % 16);
  if (reqPadding === 16) {
    reqPadding = 0;
  }

  // This becomes the IV basically as it is the first 16-byte block. It contains the padding required and some
  // random text, in the format: ==<padding>-<random 10 char string>== (16 ASCII chars in total)
  const firstBlock =
    "==" +
    // padding is max 16 bytes, so we can use 1 hex char to represent it
    reqPadding.toString(16) +
    "-" +
    randomString(10) +
    "==";

  const textBytes = aesjs.utils.utf8.toBytes(firstBlock + plainText + new Array(reqPadding + 1).join("="));
  const encryptedBytes = aesCbc.encrypt(textBytes);

  return aesjs.utils.hex.fromBytes(encryptedBytes);
}

/**
 * Decrypts the given cypher text using AES-CBC decryption.
 * @param cypherText - The cypher text to decrypt.
 * @returns The decrypted text.
 */
export function decrypt(cypherText: string): string {
  const aesCbc = new aesjs.ModeOfOperation.cbc(APP_SECRET_KEY, new Uint8Array(16));

  const encryptedBytes = aesjs.utils.hex.toBytes(cypherText);
  const decryptedBytes = aesCbc.decrypt(encryptedBytes);

  // Get the padding from the third byte (here, character) of the decrypted text.
  const reqPadding = parseInt(aesjs.utils.utf8.fromBytes([decryptedBytes[2]]), 16);

  const decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);

  // Check if the decryption succeesed by checking the padding the format of the first 16 bytes.
  if (!decryptedText.startsWith("==") || !decryptedText.slice(0, 16).endsWith("==")) {
    throw new Error("Decryption failed");
  }

  if (reqPadding === 0) {
    return decryptedText.slice(16);
  }

  // Remove the padding from the decrypted text.
  return decryptedText.slice(16, -reqPadding);
}
