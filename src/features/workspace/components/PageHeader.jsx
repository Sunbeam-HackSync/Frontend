export default function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        {eyebrow && (
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-sky-300">
            {eyebrow}
          </p>
        )}

        <h1 className="text-3xl font-bold text-white md:text-4xl">{title}</h1>

        {description && (
          <p className="mt-3 max-w-3xl text-slate-400">{description}</p>
        )}
      </div>

      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </div>
  );
}
