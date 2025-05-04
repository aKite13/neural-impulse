
import React from "react";

type TextAreaProps = {
  rows: number;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  name: string;
  label: string;
  placeholder: string;
  className?: string;
	isDark?: boolean;
};


const TextArea = ({ rows, value, onChange, name, label, placeholder, className, isDark, ...props }: TextAreaProps) => {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-[rgb(var(--foreground))]" style={isDark ? { color: "rgb(var(--primary))" } : undefined} >{label}</label>
      <textarea
			{...props}
        rows={rows}
        value={value}
        onChange={onChange}
        name={name}
        placeholder={placeholder}
        className={`w-full p-3 rounded-lg border border-indigo-700 focus:outline-none dark:bg-gray-700 dark:text-[rgb(var(--foreground))] dark:border-gray-600 dark:focus:ring-2 dark:focus:ring-[rgb(var(--primary))] ${className || ""}`}
      />
    </div>
  );
};

export default TextArea;

