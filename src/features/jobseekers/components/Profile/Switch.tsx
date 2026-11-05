type SwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
};

const Switch = ({
  checked,
  onChange,
  label,
  disabled = false,
}: SwitchProps) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className={`inline-flex h-6 w-11 items-center rounded-full p-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${
      checked ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
    }`}
  >
    <span
      className={`h-4 w-4 rounded-full bg-white transition ${
        checked ? 'translate-x-5' : ''
      }`}
    />
  </button>
);

export default Switch;
