import '@testing-library/jest-dom';// vitest.setup.ts

// 🩹 Patch pour TextEncoder (nécessaire pour certains modules ex: react-router-dom)
import { TextEncoder, TextDecoder } from "util";

if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === "undefined") {
  global.TextDecoder = TextDecoder;
}
