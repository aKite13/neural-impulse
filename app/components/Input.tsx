import React from "react";

type InputProps = {
  label: string;
  isDark?: boolean; // Новый проп для определения тёмной темы
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = ({ label, isDark, ...props }: InputProps) => {
  return (
    <div className="flex flex-col gap-1">
      <label
        className="text-sm font-medium text-[rgb(var(--foreground))] dark:font-semibold"
        style={isDark ? { color: "rgb(var(--primary))" } : undefined}
      >
        {label}
      </label>
      <input
        {...props}
        className={`w-full p-3 rounded-lg border border-indigo-700 focus:outline-none dark:bg-gray-700 dark:text-[rgb(var(--foreground))] dark:border-gray-600 dark:focus:ring-2 dark:focus:ring-[rgb(var(--primary))] ${props.className || ""}`}
      />
    </div>
  );
};

export default Input;