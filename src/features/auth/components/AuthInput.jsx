// src/features/auth/components/AuthInput.jsx

export default function AuthInput({
    label,
    error,
    type = "text",
    placeholder,
    ...props
}) {
    return (
        <div>

            <label
                className="
                    block
                    mb-3
                    text-sm
                    font-medium
                    text-slate-300
                "
            >
                {label}
            </label>

            <input
                type={type}
                placeholder={placeholder}
                className={`
                    w-full
                    rounded-2xl
                    border
                    bg-slate-900/60
                    px-5
                    py-4
                    text-white
                    outline-none
                    transition
                    focus:ring-2
                    focus:ring-indigo-500/20

                    ${error
                        ? "border-red-500"
                        : "border-slate-700 focus:border-indigo-500"
                    }
                `}
                {...props}
            />

            {error && (
                <p className="mt-2 text-sm text-red-500">
                    {error}
                </p>
            )}

        </div>
    );
}