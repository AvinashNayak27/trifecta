import { ethers } from "ethers";
import fs from "fs";

function timestampToBigEndian(timestamp) {
  const buffer = Buffer.alloc(8);
  buffer.writeBigUInt64BE(BigInt(timestamp));
  return buffer;
}

// Example usage
const timestamps = 1742743584;

const method = "GET";
const pathAndQuery = "/"; // Include query string if present, like "/?id=123"
const host = "BOG2JXLWK63XYAJH24UYUBP5MMNTVZ5GLFZ2S3VLFEDR6334CZKQ.oyster.run";
const requestBody = '{}';
const responseBody = '{"user":{"username":"avinash_nayak3"}}';

const signature =
  "0xee2691866b36817b00f579f08345f44490e28247ad40686bb4376216f011fb5a2d06034814433df27d7b5124cc009dd048ca5a268ddb975f71588c9dc849e0b91b";

const timestampBytes = timestampToBigEndian(timestamps);

const messageParts = [
  "|oyster-serverless-hasher|",
  "|timestamp|",
  timestampBytes,
  "|request|",
  "|method|",
  method,
  "|pathandquery|",
  pathAndQuery,
  "|host|",
  host,
  "|body|",
  requestBody,
  "|response|",
  "|body|",
  responseBody,
];

const messageBytes = ethers.concat(
  messageParts.map((p) => (typeof p === "string" ? ethers.toUtf8Bytes(p) : p))
);

console.log(messageBytes)

const messageHash = ethers.keccak256(messageBytes);

console.log(messageHash)
console.log(signature)
// Step 3: Recover the address from the signature
const recoveredAddress = ethers.recoverAddress(messageHash, signature);

console.log("Recovered address:", recoveredAddress);

//erite messagebytes and signature to a file
fs.writeFileSync("messageBytes.txt", messageBytes);
fs.writeFileSync("signature.txt", signature);
