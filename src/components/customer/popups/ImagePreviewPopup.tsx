import React from 'react';
import { X } from 'lucide-react';

interface ImagePreviewPopupProps {
  isOpen: boolean;
  imageUrl: string;
  imageLabel: string;
  onClose: () => void;
}

const ImagePreviewPopup: React.FC<ImagePreviewPopupProps> = ({
  isOpen,
  imageUrl,
  imageLabel,
  onClose,
}) => {
  if (!isOpen || !imageUrl) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999]"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-gray-800 rounded-lg p-4 max-w-[90vw] max-h-[90vh] shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors z-10"
          aria-label="Close preview"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image Label */}
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100 pr-8">
          {imageLabel}
        </h3>

        {/* Image Preview */}
        <div className="flex items-center justify-center overflow-auto">
          <img
            src={imageUrl}
            alt={imageLabel}
            className="max-w-full max-h-[70vh] object-contain rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default ImagePreviewPopup;
