import type { ChangeEventHandler, InputHTMLAttributes } from "react";

type Props = {
  label: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
  name?: string;
  multiline?: boolean;
  rows?: number;
  wrapperClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
};

const DEFAULT_LABEL_CLASS =
  "block text-xs font-semibold uppercase tracking-wide text-amber-600";
const DEFAULT_INPUT_CLASS =
  "mt-1 w-full rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-300";

function LabeledField({
  label,
  value,
  onChange,
  type = "text",
  name,
  multiline = false,
  rows = 3,
  wrapperClassName,
  labelClassName = DEFAULT_LABEL_CLASS,
  inputClassName = DEFAULT_INPUT_CLASS,
}: Props) {
  return (
    <label className={wrapperClassName ?? labelClassName}>
      {label}
      {multiline ? (
        <textarea rows={rows} value={value} onChange={onChange} className={inputClassName} />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={inputClassName}
        />
      )}
    </label>
  );
}

export default LabeledField;
