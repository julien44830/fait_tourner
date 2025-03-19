import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./page/Home";
import Login from "./page/Login";
import Registration from "./page/Registration";
import Book from "./page/Book";
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
                <Route
                    path="/book/:id"
                    element={<Book />}
                />
            </Routes>
        </Router>
    );
}

export default App;
