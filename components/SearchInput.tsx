import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (val: string) => void;
}

/**
 * Optimized Search Input with internal state and debouncing.
 * This prevents parent component re-renders on every keystroke.
 */
export const SearchInput: React.FC<SearchInputProps> = React.memo(({ value, onChange }) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    // Only update the parent state if the value has actually changed
    if (localValue === value) return;

    const timer = setTimeout(() => {
      onChange(localValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, onChange, value]);

  // Sync internal state if the external value changes (e.g. cleared from elsewhere)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <div className="relative group hidden sm:block">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors" size={16} />
      <input
        type="text"
        placeholder="Buscar..."
        aria-label="Buscar productos"
        className="bg-white/5 border border-white/10 pl-12 pr-10 py-2 rounded-2xl text-sm w-40 md:w-80 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all text-slate-300 placeholder:text-slate-600"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)} />
      {localValue && (
        <button
          onClick={() => {
            setLocalValue('');
            onChange('');
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors p-1"
          aria-label="Limpiar búsqueda"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
});
