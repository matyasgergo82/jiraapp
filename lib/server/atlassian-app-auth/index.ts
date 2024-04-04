import { kv } from "@vercel/kv";
import { decodeJwt, jwtVerify, decodeProtectedHeader, importSPKI } from "jose";
import { decrypt, encrypt } from "../app-crypto";

/**
 * Verifies the lifecycle request from Atlassian Connect.
 * @param authorizationJwt - The JWT token from the request.
 * @returns Whether the request is valid.
 */
export async function verifyLifecycleRequest(authorizationJwt?: string): Promise<boolean> {
  if (!authorizationJwt) {
    return false;
  }

  // Extract the key ID from the JWT token.
  const keyId: string | undefined = decodeProtectedHeader(authorizationJwt).kid;

  if (!keyId) {
    return false;
  }

  let jwtPublicKeyString = "";

  // Fetch the public key from the Atlassian Connect Install Keys API.
  try {
    jwtPublicKeyString = await (await fetch(`https://connect-install-keys.atlassian.com/${keyId}`)).text();
  } catch {
    return false;
  }

  if (!jwtPublicKeyString) {
    return false;
  }

  // Verify the JWT token using the public key.
  try {
    await jwtVerify(authorizationJwt, await importSPKI(jwtPublicKeyString, "RS256"));
    return true;
  } catch {
    return false;
  }
}

/**
 * Authorizes the client with the given data.
 * @param clientKey - The client key.
 * @param sharedSecret - The shared secret.
 * @param data - Optional data to store with the client.
 */
export async function authorizeClient(clientKey: string, sharedSecret: string, data?: Record<string, unknown>) {
  const clientData = {
    ...data,
    sharedSecret,
  };

  // Encrypt the client data before storing it.
  const encryptedClientData = encrypt(JSON.stringify(clientData));

  await kv.set("APP_INSTALL/" + clientKey, encryptedClientData);
}

/**
 * Unauthorizes the client with the given key.
 * @param clientKey - The client key.
 */
export async function unauthorizeClient(clientKey: string) {
  await kv.del("APP_INSTALL/" + clientKey);
}

/**
 * Verifies the client request from Atlassian Connect.
 * @param authorizationJwt - The JWT token from the request.
 * @returns Whether the request is valid.
 */
export async function verifyClientRequest(authorizationJwt?: string): Promise<boolean> {
  if (!authorizationJwt) {
    return false;
  }

  // Extract the client key from the JWT token.
  const clientKey = decodeJwt(authorizationJwt).iss;

  if (!clientKey) {
    return false;
  }

  // Fetch the client data from the KV store.
  const clientData = await kv.get<string>("APP_INSTALL/" + clientKey);

  if (!clientData) {
    return false;
  }

  // Decrypt the client data.
  const decryptedClientData = clientData && JSON.parse(decrypt(clientData));

  if (!decryptedClientData.sharedSecret) {
    return false;
  }

  // Verify the JWT token using the shared secret.
  try {
    await jwtVerify(authorizationJwt, new TextEncoder().encode(decryptedClientData.sharedSecret));
    return true;
  } catch {
    return false;
  }
}
