import React from 'react';
import { Loader2 } from 'lucide-react';

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, variant = 'primary', size = 'md', loading, className = '', ...props 
}) => {
  const baseStyle = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-blue-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900",
  };

  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 py-2 text-sm",
    lg: "h-12 px-6 text-base",
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`} 
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

// --- Badge ---
export const Badge: React.FC<{ type: 'success' | 'warning' | 'danger' | 'neutral', children: React.ReactNode }> = ({ type, children }) => {
  const styles = {
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
    neutral: "bg-gray-100 text-gray-800",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[type]}`}>
      {children}
    </span>
  );
};

// --- Modal ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string; // e.g. "max-w-lg", "max-w-2xl"
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer, maxWidth = "max-w-lg" }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`bg-white rounded-lg shadow-xl w-full ${maxWidth} transform transition-all flex flex-col max-h-[90vh]`}>
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center shrink-0">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">✕</button>
        </div>
        <div className="px-6 py-4 overflow-auto">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-2 rounded-b-lg shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// --- ProTable Simulation ---
interface TableProps<T> {
  columns: { title: string; render: (record: T) => React.ReactNode; width?: string }[];
  dataSource: T[];
  rowKey: keyof T;
  loading?: boolean;
}

export const Table = <T extends {}>({ columns, dataSource, rowKey, loading }: TableProps<T>) => {
  if (loading) {
    return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;
  }

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: col.width }}>
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {dataSource.map((record) => (
            <tr key={String(record[rowKey])} className="hover:bg-gray-50 transition-colors">
              {columns.map((col, idx) => (
                <td key={idx} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {col.render(record)}
                </td>
              ))}
            </tr>
          ))}
          {dataSource.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                暂无数据 / No Data
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};