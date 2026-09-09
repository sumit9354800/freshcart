import { SORT_OPTIONS } from '../../constants';
import type { SortOption } from '../../types';
import { ArrowUpDown } from 'lucide-react';

export interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <div className="relative inline-flex items-center">
      <div className="flex items-center gap-1.5 pl-3 pr-8 py-2 rounded-xl border border-stone-200 bg-white text-xs font-semibold text-stone-700 shadow-xs hover:border-stone-300 focus-within:ring-2 focus-within:ring-emerald-500/20">
        <ArrowUpDown className="w-3.5 h-3.5 text-stone-400 shrink-0" />
        <span className="text-stone-400 font-medium">Sort:</span>
        <select
          id="sort-select"
          value={value}
          onChange={(e) => onChange(e.target.value as SortOption)}
          className="appearance-none bg-transparent font-semibold text-stone-900 border-none focus:outline-none focus:ring-0 cursor-pointer pr-4"
          aria-label="Sort products by"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
