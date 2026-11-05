import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  error?: string;
}

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ align: [] }],
    ['link'],
    ['clean'],
  ],
};

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'list',
  'indent',
  'align',
  'link',
];

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write something...',
  className = '',
  label,
  error,
}: RichTextEditorProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="text-sm font-medium ">{label}</label>}
      <div className="rich-text-editor-wrapper">
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          className="rounded-md"
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <style>{`
        .rich-text-editor-wrapper .ql-container {
          min-height: 150px;
          font-size: 14px;
          border-bottom-left-radius: 0.375rem;
          border-bottom-right-radius: 0.375rem;
        }
        .rich-text-editor-wrapper .ql-toolbar {
          border-top-left-radius: 0.375rem;
          border-top-right-radius: 0.375rem;
        }
        .rich-text-editor-wrapper .ql-editor {
          min-height: 150px;
        }
        .rich-text-editor-wrapper .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }
        
        /* Dark mode styles for Quill editor */
        .dark .rich-text-editor-wrapper .ql-toolbar.ql-snow {
          background-color: #374151;
          border-color: #4b5563;
        }
        .dark .rich-text-editor-wrapper .ql-container.ql-snow {
          background-color: #1f2937;
          border-color: #4b5563;
        }
        .dark .rich-text-editor-wrapper .ql-editor {
          color: #ffffff;
        }
        .dark .rich-text-editor-wrapper .ql-toolbar .ql-stroke {
          stroke: #ffffff;
        }
        .dark .rich-text-editor-wrapper .ql-toolbar .ql-fill {
          fill: #ffffff;
        }
        .dark .rich-text-editor-wrapper .ql-toolbar .ql-picker {
          color: #ffffff;
        }
        .dark .rich-text-editor-wrapper .ql-toolbar .ql-picker-label {
          color: #ffffff;
        }
        .dark .rich-text-editor-wrapper .ql-toolbar .ql-picker-label::before {
          color: #ffffff;
        }
        .dark .rich-text-editor-wrapper .ql-toolbar .ql-picker-options {
          background-color: #374151;
          border-color: #4b5563;
        }
        .dark .rich-text-editor-wrapper .ql-toolbar .ql-picker-item {
          color: #ffffff;
        }
        .dark .rich-text-editor-wrapper .ql-toolbar .ql-picker-item:hover {
          color: #60a5fa;
        }
        .dark .rich-text-editor-wrapper .ql-toolbar button:hover .ql-stroke {
          stroke: #60a5fa;
        }
        .dark .rich-text-editor-wrapper .ql-toolbar button:hover .ql-fill {
          fill: #60a5fa;
        }
        .dark .rich-text-editor-wrapper .ql-toolbar button.ql-active .ql-stroke {
          stroke: #60a5fa;
        }
        .dark .rich-text-editor-wrapper .ql-toolbar button.ql-active .ql-fill {
          fill: #60a5fa;
        }
        .dark .rich-text-editor-wrapper .ql-editor.ql-blank::before {
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
}

export default RichTextEditor;
