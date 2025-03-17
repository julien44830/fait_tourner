export default function Login() {
    return (
        <>
            <form className="form-group-connexion">
                <h2>connexion</h2>
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
                <button className="form-btn-connexion">connexion</button>
            </form>
        </>
    );
}
