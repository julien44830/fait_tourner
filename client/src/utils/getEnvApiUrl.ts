// src/utils/getEnvApiUrl.ts

// Cette fonction est ignorée par Jest si elle n'est pas appelée
// Elle permet de conserver import.meta.env dans un contexte safe
export const getEnvApiUrl = (): string => {
  // @ts-ignore nécessaire pour Jest
  return import.meta.env.VITE_API_URL;
};
