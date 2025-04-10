// src/page/Accueil.tsx
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
