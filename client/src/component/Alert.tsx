interface AlertProps {
    message: string;
    type?: "error" | "success" | "info" | "warning";
    onClose?: () => void;
}

export default function Alert({ message, type = "info", onClose }: AlertProps) {
    return (
        <div className={`alert alert-${type}`}>
            {message}
            {onClose && (
                <button
                    className="alert-close"
                    onClick={onClose}
                >
                    ✕
                </button>
            )}
        </div>
    );
}
