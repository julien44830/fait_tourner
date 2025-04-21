#!/bin/bash

echo "🧹 Suppression du dossier dist..."
rm -rf dist/

echo "📦 Build de l'application en mode production..."
npx vite build --mode production

echo ""
echo "🔍 Vérification des URLs dans les fichiers buildés..."

echo ""
echo "🔎 URLs trouvées dans les fichiers JS :"
grep -oE 'https?://[^"]+' dist/assets/index-*.js | sort | uniq

echo "🌐 VITE_API_URL injectée : $VITE_API_URL"


echo ""
if grep -q "localhost:4000" dist/assets/index-*.js; then
  echo "❌ Erreur : L'URL localhost:4000 est encore présente dans le build !"
else
  echo "✅ Aucun localhost détecté. La build utilise bien l'URL de production."
fi
