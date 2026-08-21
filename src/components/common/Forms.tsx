import clsx from 'clsx';
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';

interface FieldWrapperProps {
  label: string;
  htmlFor?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  hint?: string;
}

export const FieldWrapper = ({ label, htmlFor, error, required, children, hint }: FieldWrapperProps) => (
  <div>
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
    {hint && !error && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = ({ error, className, ...props }: InputProps) => (
  <input
    className={clsx(
      'w-full px-3 py-2 text-sm rounded-lg border bg-white transition-colors',
      'focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent',
      error ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-gray-400',
      className
    )}
    {...props}
  />
);

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const Select = ({ error, className, children, ...props }: SelectProps) => (
  <select
    className={clsx(
      'w-full px-3 py-2 text-sm rounded-lg border bg-white transition-colors',
      'focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent',
      error ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-gray-400',
      className
    )}
    {...props}
  >
    {children}
  </select>
);

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = ({ error, className, ...props }: TextareaProps) => (
  <textarea
    rows={4}
    className={clsx(
      'w-full px-3 py-2 text-sm rounded-lg border bg-white transition-colors resize-none',
      'focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent',
      error ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-gray-400',
      className
    )}
    {...props}
  />
);
