interface SectionHeadingProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  id?: string;
}

const SectionHeading = ({
  eyebrow,
  title,
  subtitle,
  id,
}: SectionHeadingProps) => (
  <div className="mx-auto max-w-3xl text-center">
    <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-700 dark:text-blue-400">
      {eyebrow}
    </p>
    <h2
      id={id}
      className="mt-3 text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 lg:text-4xl"
    >
      {title}
    </h2>
    <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
      {subtitle}
    </p>
  </div>
);

export default SectionHeading;
