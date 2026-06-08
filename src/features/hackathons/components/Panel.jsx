export default function Panel({ title, description, actions, children, className = "" }) {
  return (
    <section
      className={`
        rounded-lg
        border
        border-slate-800
        bg-slate-900/50
        p-5
        ${className}
      `}
    >
      {(title || description || actions) && (
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            {title && <h2 className="text-xl font-bold text-white">{title}</h2>}
            {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
          </div>

          {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
        </div>
      )}

      {children}
    </section>
  );
}
