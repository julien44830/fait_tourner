import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";

/**
 * 🔐 AuthContextType
 *
 * Décrit les valeurs fournies par le contexte d’authentification :
 * - `token` : le token JWT ou `null`
 * - `isAuthenticated` : booléen indiquant si l'utilisateur est connecté
 * - `isReady` : booléen indiquant si l'initialisation du contexte est terminée
 * - `login` : fonction pour se connecter
 * - `logout` : fonction pour se déconnecter
 */
interface AuthContextType {
    token: string | null;
    isAuthenticated: boolean;
    isReady: boolean;
    login: (token: string) => void;
    logout: () => void;
}

// 🎯 Création du contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * 🧩 Composant `AuthProvider`
 *
 * Fournit un contexte global d’authentification pour toute l'application.
 * Ce contexte permet de :
 * - stocker le token dans `localStorage`
 * - déterminer si un utilisateur est connecté (`isAuthenticated`)
 * - gérer l'état d'initialisation (`isReady`)
 * - exposer des méthodes `login()` et `logout()`
 */
export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [isReady, setIsReady] = useState(false); // indique que le contexte est prêt

    // 🔁 Initialisation automatique au premier montage
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
        }
        setIsReady(true); // permet d'éviter un rendu prématuré
    }, []);

    // ✅ Fonction de connexion
    const login = (newToken: string) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    };

    // 🔓 Fonction de déconnexion
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        setToken(null);
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                isAuthenticated: !!token, // convertit en booléen
                isReady,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

/**
 * ⚙️ Hook personnalisé `useAuth`
 *
 * Permet d'accéder facilement aux données du contexte d’authentification.
 * Doit être utilisé dans un composant enfant de `AuthProvider`.
 */
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth doit être utilisé dans un AuthProvider");
    }
    return context;
}

// 🔄 Export brut du contexte si besoin d’accès direct
export { AuthContext };
