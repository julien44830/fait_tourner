// src/services/proxyUploads.ts

import { createProxyMiddleware } from "http-proxy-middleware";

/**
 * 🎯 Middleware de proxy pour rediriger les requêtes /uploads
 *    vers le service d'upload_service.
 */
export const proxyUploadsMiddleware = createProxyMiddleware({
  target: "http://localhost:5001", // 🔥 Adresse de ton upload_service
  changeOrigin: true,
  pathRewrite: {
    "^/uploads": "", // 💥 on enlève '/uploads' pour que l'upload_service comprenne
  },
  onProxyReq: (_proxyReq: any, req: { url: any; }, res: any) => {
  },
  onError: (err: any, req: any, res: any) => {
    console.error("❌ Erreur de proxy :", err);
  },
} as Parameters<typeof createProxyMiddleware>[0]);
