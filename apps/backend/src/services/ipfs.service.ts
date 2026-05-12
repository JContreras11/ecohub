import { PinataSDK } from "pinata";

// Initialize Pinata SDK with JWT + Dedicated Gateway Domain
const pinata = new PinataSDK({
  pinataJwt:     process.env.PINATA_JWT || "",
  pinataGateway: process.env.PINATA_GATEWAY_DOMAIN || "gateway.pinata.cloud",
});

export interface ProjectMetadata {
  title:         string;
  description:   string;
  readme:        string;
  tags:          string[];
  authorAddress: string;
  imageCid?:     string; // Set after image is uploaded
  version:       string;
  createdAt:     string;
}

/**
 * Upload a buffer (file) to IPFS via Pinata.
 * The new SDK requires a Web API File object.
 *
 * @param buffer   The file buffer to upload
 * @param fileName The name to give the file on IPFS
 * @param mimeType The MIME type of the file
 * @returns The IPFS CID of the pinned file
 */
export async function uploadFileToPinata(
  buffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<string> {
  // Convert Node.js Buffer → Web API File (required by new SDK)
  const file = new File([buffer], fileName, { type: mimeType });

  const result = await pinata.upload.public.file(file);

  console.log(`[IPFS] File pinned: ${result.cid} (${mimeType}, ${result.size} bytes)`);
  return result.cid;
}

/**
 * Upload a JSON metadata object to IPFS via Pinata.
 *
 * @param metadata The project metadata object
 * @param name     A human-readable name for this pin
 * @returns The IPFS CID of the pinned JSON
 */
export async function uploadMetadataToPinata(
  metadata: ProjectMetadata,
  name: string
): Promise<string> {
  // Serialize to JSON and wrap in a File so we can use the public.file() endpoint
  const json    = JSON.stringify(metadata, null, 2);
  const file    = new File([json], `${name}.json`, { type: "application/json" });

  const result  = await pinata.upload.public.file(file);

  console.log(`[IPFS] Metadata pinned: ${result.cid}`);
  return result.cid;
}

/**
 * Build a public gateway URL for an IPFS CID using the configured gateway.
 */
export async function buildGatewayUrl(cid: string): Promise<string> {
  return pinata.gateways.public.convert(cid);
}

/**
 * Build a synchronous gateway URL without calling Pinata (simple string template).
 * Use this when you don't need a signed/converted URL.
 */
export function buildGatewayUrlSync(cid: string): string {
  const domain = process.env.PINATA_GATEWAY_DOMAIN || "gateway.pinata.cloud";
  return `https://${domain}/ipfs/${cid}`;
}

/**
 * Test Pinata authentication. Call on startup to validate credentials.
 */
export async function testPinataConnection(): Promise<boolean> {
  try {
    // The new SDK doesn't have a testAuthentication() method.
    // We verify by listing files with a limit of 1 — a lightweight auth check.
    await pinata.files.public.list().limit(1);
    console.log("[IPFS] Pinata connection OK");
    return true;
  } catch (err) {
    console.error("[IPFS] Pinata connection FAILED:", err);
    return false;
  }
}
