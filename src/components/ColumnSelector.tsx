import React from 'react';
import { Settings, User, Mail } from 'lucide-react';
import { ExcelColumn } from '../utils/excelReader';

interface ColumnSelectorProps {
  columns: ExcelColumn[];
  nameColumn: string;
  emailColumn: string;
  onNameColumnChange: (column: string) => void;
  onEmailColumnChange: (column: string) => void;
}

export const ColumnSelector: React.FC<ColumnSelectorProps> = ({
  columns,
  nameColumn,
  emailColumn,
  onNameColumnChange,
  onEmailColumnChange
}) => {
  if (columns.length === 0) return null;

  return (
    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/50 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Settings className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Column Mapping
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-1">
            <User className="w-4 h-4" />
            <span>Name Column</span>
          </label>
          <select
            value={nameColumn}
            onChange={(e) => onNameColumnChange(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100"
          >
            <option value="">Select name column...</option>
            {columns.map((column) => (
              <option key={column.key} value={column.key}>
                {column.label} ({column.values.length} entries)
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-1">
            <Mail className="w-4 h-4" />
            <span>Email Column</span>
          </label>
          <select
            value={emailColumn}
            onChange={(e) => onEmailColumnChange(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100"
          >
            <option value="">Select email column...</option>
            {columns.map((column) => (
              <option key={column.key} value={column.key}>
                {column.label} ({column.values.length} entries)
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {nameColumn && emailColumn && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-sm text-green-800 dark:text-green-200">
            ✓ Columns mapped successfully. Ready to generate certificates.
          </p>
        </div>
      )}
    </div>
  );
};