/**
 * 🏠 Composant `Accueil`
 *
 * 🔍 Rôle :
 * Ce composant détecte si l'utilisateur accède à l'application depuis un écran **desktop** ou **mobile**,
 * et affiche dynamiquement l'interface appropriée :
 *
 *   - 💻 `Dashboard` pour les écrans larges (desktop ≥ 1024px)
 *   - 📱 `Home` pour les écrans mobiles
 *
 * 🧠 Utilise un `useEffect` avec un listener `resize` pour mettre à jour l'état `isDesktop`
 * à chaque redimensionnement de la fenêtre.
 *
 * ⚠️ Pendant l'initialisation (`isDesktop === null`), un message de chargement est affiché.
 *
 * ➕ Tu peux ajuster facilement le seuil (`1024px`) en fonction de ta stratégie responsive.
 */

import { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import Home from "./Home";

export default function Accueil() {
    const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

    useEffect(() => {
        const checkSize = () => {
            setIsDesktop(window.innerWidth >= 1024); // 💡 tu peux ajuster ce seuil
        };

        checkSize(); // vérifie la taille initiale
        window.addEventListener("resize", checkSize); // écoute le redimensionnement

        return () => window.removeEventListener("resize", checkSize); // propre
    }, []);

    if (isDesktop === null) return <p>Chargement de l'affichage...</p>;

    return isDesktop ? <Dashboard /> : <Home />;
}
