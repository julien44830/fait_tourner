import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./page/Home";
import Login from "./page/Login";
import Registration from "./page/Registration";
function App() {
    return (
        <Router>
            <Routes>
                <Route
                    path="/accueil"
                    element={<Home />}
                />
                <Route
                    path="/connexion"
                    element={<Login />}
                />
                <Route
                    path="/inscription"
                    element={<Registration />}
                />
            </Routes>
        </Router>
    );
}

export default App;
