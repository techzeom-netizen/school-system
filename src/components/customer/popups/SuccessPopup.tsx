import React from 'react';
import { X, CheckCircle } from 'lucide-react';

interface SuccessPopupProps {
  isOpen: boolean;
  message?: string;
  member_ID: string;
  onClose: () => void;
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({
  isOpen,
  message = 'Customer Created Successfully!',
  member_ID,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[10000]"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 text-center transform animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-500 dark:text-green-400" />
          </div>
        </div>

        {/* Success Message */}
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Success!
        </h3>

        <p className="text-gray-600 dark:text-gray-400 text-lg">{message}</p>
        <p className="text-gray-600 dark:text-gray-400 text-sm ">
          Member No: <span className="font-bold">{member_ID}</span>
        </p>

        {/* Decorative Elements */}
        <div className="mt-6 flex justify-center gap-1">
          <span
            className="w-2 h-2 rounded-full bg-green-400 animate-bounce"
            style={{ animationDelay: '0ms' }}
          />
          <span
            className="w-2 h-2 rounded-full bg-green-500 animate-bounce"
            style={{ animationDelay: '150ms' }}
          />
          <span
            className="w-2 h-2 rounded-full bg-green-600 animate-bounce"
            style={{ animationDelay: '300ms' }}
          />
        </div>
      </div>
    </div>
  );
};

export default SuccessPopup;
