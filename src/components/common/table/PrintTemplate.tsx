import type { ReactNode } from 'react';
import type { TableHeaderInfoProps } from './TableHeaderInfo';

export interface PrintTemplateProps {
  children?: ReactNode;
  title?: string;
  menuId?: string;
  showBreadcrumbs?: boolean;
  headerInfo?: TableHeaderInfoProps;
  currentPage?: number;
  totalPages?: number;
}

const PrintTemplate = ({ children }: PrintTemplateProps) => (
  <>
    <style>{`
      @media print {
        .print-template-watermark {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    `}</style>

    <div className="print-template-page relative mx-auto min-h-[297mm] w-[210mm] bg-white text-black shadow-lg print:m-0 print:shadow-none">
      <div className="print-template-watermark pointer-events-none absolute inset-0 z-10 flex items-center justify-center opacity-20">
        <img
          src="/frontendImages/print-logo-center.jpeg"
          className="h-auto max-w-xl opacity-20"
          alt="Confidential watermark"
        />
      </div>

      <div className="print-template-content-wrapper relative z-20 flex min-h-[297mm] flex-col px-10 py-6">
        {/* <div className="print-template-header">
          <PrintHeader title={title} headerInfo={headerInfo} />
        </div> */}

        <main className="print-template-main mt-6 flex-1">
          {children ?? (
            <p className="text-sm text-gray-700">
              Print template preview content.
            </p>
          )}
        </main>

        {/* <div className="print-template-footer">
          <PrintFooter currentPage={currentPage} totalPages={totalPages} />
        </div> */}
      </div>
    </div>
  </>
);

export default PrintTemplate;
