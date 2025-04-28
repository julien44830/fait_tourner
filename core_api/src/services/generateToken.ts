import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const payload = {
  id: "628befdd-6b9d-48f8-a63d-007adf92464d",
  email: "badgamer44250@gmail.com"
};

const secret = process.env.SECRET_KEY || "dev-secret";

const token = jwt.sign(payload, secret, { expiresIn: "1h" });

console.log("🪪 Ton token JWT :\n");
console.log(token);

