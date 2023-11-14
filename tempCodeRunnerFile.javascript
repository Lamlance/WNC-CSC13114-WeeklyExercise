import crypto from "crypto";

const hashedPassword = crypto
    .createHmac("sha256", process.env.SECRETE_KEY)
    .update("123456")
    .digest("base64url");

console.log(hashedPassword);