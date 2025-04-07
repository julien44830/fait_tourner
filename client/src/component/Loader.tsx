export default function Loader({ text = "Chargement" }: { text?: string }) {
    return (
        <p className="loader">
            {text}
            <span className="dot-animation">
                <span>.</span>
                <span>.</span>
                <span>.</span>
            </span>
        </p>
    );
}
