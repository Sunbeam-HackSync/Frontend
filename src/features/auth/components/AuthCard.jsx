// src/features/auth/components/AuthCard.jsx

export default function AuthCard({
    title,
    subtitle,
    children
}) {
    return (
        <div
            className="
                w-full
                max-w-lg
                glass-card
                rounded-4xl
                p-8
                md:p-10
            "
        >

            <div className="mb-6">

                <h2 className="text-4xl font-bold">
                    {title}
                </h2>

                <p className="text-slate-400 mt-4">
                    {subtitle}
                </p>

            </div>

            {children}

        </div>
    );
}