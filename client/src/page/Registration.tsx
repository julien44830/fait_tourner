export default function Registration() {
    return (
        <>
            <form className="form-group-connexion">
                <h2>inscription</h2>
                <label htmlFor="name">
                    <fieldset>
                        {" "}
                        <legend>Nom </legend>
                        <input
                            type="name"
                            id="name"
                            name="name"
                        />{" "}
                    </fieldset>
                </label>
                <label htmlFor="lastname">
                    <fieldset>
                        {" "}
                        <legend>Prénom </legend>
                        <input
                            type="lastname"
                            id="lastname"
                            name="lastname"
                        />{" "}
                    </fieldset>
                </label>
                <label htmlFor="email">
                    <fieldset>
                        {" "}
                        <legend>Email </legend>
                        <input
                            type="email"
                            id="email"
                            name="email"
                        />{" "}
                    </fieldset>
                </label>
                <label htmlFor="password">
                    <fieldset>
                        <legend>mot de passe </legend>
                        <input
                            type="password"
                            id="password"
                            name="password"
                        />
                    </fieldset>
                </label>
                <label htmlFor="password">
                    <fieldset>
                        <legend>confirmat de mot de passe </legend>
                        <input
                            type="password"
                            id="password"
                            name="password"
                        />
                    </fieldset>
                </label>
                <button className="form-btn-connexion">Inscription</button>
            </form>
        </>
    );
}
