import type { TableHeaderInfoProps } from './TableHeaderInfo';

export interface ExportData {
  headerInfo?: TableHeaderInfoProps;
  columns: { header: string; id: string }[];
  rows: { [key: string]: string }[];
  fileName?: string;
}

type ExportFormat = 'pdf' | 'word' | 'excel';

const escapeHtml = (value: unknown): string =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const getImageSource = (value?: string) => {
  if (!value) return '';

  const source = value.trim();
  const allowedSource =
    /^(https?:\/\/|\/|\.\/|\.\.\/)/i.test(source) ||
    /^data:image\/(png|jpe?g|gif|webp);base64,/i.test(source);

  return allowedSource ? escapeHtml(source) : '';
};

const renderOrganizationHeader = (headerInfo?: TableHeaderInfoProps) => {
  if (!headerInfo) return '';

  const {
    organizationName,
    registrationNo,
    registeredOffice,
    website,
    email,
    contact,
    branchName,
    reportTitle,
  } = headerInfo;
  const logo = getImageSource(headerInfo.logo);
  const details: [string, string][] = [
    ...(registrationNo
      ? [['Registration No.', registrationNo] as [string, string]]
      : []),
    ...(registeredOffice
      ? [['Registered Office', registeredOffice] as [string, string]]
      : []),
    ...(website ? [['Website', website] as [string, string]] : []),
    ...(email ? [['Email', email] as [string, string]] : []),
    ...(contact ? [['Contact', contact] as [string, string]] : []),
    ...(branchName ? [['Branch', branchName] as [string, string]] : []),
  ];

  if (!organizationName && !reportTitle && details.length === 0 && !logo) {
    return '';
  }

  return `
    <header class="organization-header">
      <div class="organization-identity">
        ${logo ? `<img class="organization-logo" src="${logo}" alt="Organization logo" />` : ''}
        <div class="organization-heading">
          ${organizationName ? `<h1>${escapeHtml(organizationName)}</h1>` : ''}
          ${reportTitle ? `<p class="report-title">${escapeHtml(reportTitle)}</p>` : ''}
        </div>
      </div>
      ${
        details.length > 0
          ? `<div class="organization-details">
            ${details
              .map(
                ([label, value]) =>
                  `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`
              )
              .join('')}
          </div>`
          : ''
      }
    </header>`;
};

const renderReportTable = (data: ExportData) => {
  const { columns, rows } = data;
  const columnHeaders = columns.length
    ? columns
        .map(({ header }) => `<th scope="col">${escapeHtml(header)}</th>`)
        .join('')
    : '<th scope="col">Report data</th>';
  const columnCount = Math.max(columns.length, 1);

  const tableRows =
    columns.length === 0
      ? '<tr><td class="empty-state">No columns are available for this report.</td></tr>'
      : rows.length === 0
        ? `<tr><td class="empty-state" colspan="${columnCount}">No records found for this report.</td></tr>`
        : rows
            .map(
              row =>
                `<tr>${columns
                  .map(column => {
                    const value = row[column.id];
                    const content =
                      value === undefined || value === null || value === ''
                        ? '<span class="missing-value">—</span>'
                        : escapeHtml(value);
                    return `<td>${content}</td>`;
                  })
                  .join('')}</tr>`
            )
            .join('');

  return `
    <div class="table-wrap">
      <table class="report-table">
        <thead><tr>${columnHeaders}</tr></thead>
        <tbody>${tableRows}</tbody>
      </table>
    </div>`;
};

const pdfStyles = `
  @page { size: A4 portrait; margin: 14mm 13mm 16mm; }
  * { box-sizing: border-box; }
  html { background: #eef1f5; }
  body { margin: 0; color: #253247; font: 10pt/1.45 Arial, Helvetica, sans-serif; }
  .preview-toolbar { position: sticky; top: 0; z-index: 5; display: flex; justify-content: flex-end; gap: 10px; padding: 12px 20px; background: #fff; border-bottom: 1px solid #d7dee8; box-shadow: 0 2px 8px rgb(25 40 60 / 8%); }
  .preview-toolbar button { border: 1px solid #294b70; border-radius: 5px; padding: 8px 14px; color: #fff; background: #294b70; font: 600 10pt Arial, sans-serif; cursor: pointer; }
  .preview-toolbar button.secondary { color: #294b70; background: #fff; }
  .preview-toolbar button:disabled { cursor: wait; opacity: .65; }
  .report-sheet { position: relative; isolation: isolate; width: 210mm; min-height: 297mm; margin: 20px auto; padding: 14mm 13mm 16mm; overflow: hidden; background: #fff; box-shadow: 0 4px 24px rgb(25 40 60 / 12%); }
  .report-watermark { position: fixed; z-index: 0; top: 50%; left: 50%; width: 105mm; max-height: 105mm; object-fit: contain; opacity: .045; transform: translate(-50%, -50%); pointer-events: none; }
  .report-content { position: relative; z-index: 1; }
  .organization-header { margin-bottom: 18px; padding-bottom: 13px; border-bottom: 2px solid #294b70; break-inside: avoid; page-break-inside: avoid; }
  .organization-identity { display: flex; align-items: center; justify-content: center; gap: 16px; min-height: 54px; text-align: center; }
  .organization-logo { max-width: 92px; max-height: 58px; object-fit: contain; }
  .organization-heading { min-width: 0; }
  .organization-heading h1 { margin: 0; color: #1f3550; font-size: 17pt; font-weight: 700; line-height: 1.2; overflow-wrap: anywhere; }
  .report-title { margin: 5px 0 0; color: #294b70; font-size: 12pt; font-weight: 700; }
  .organization-details { display: flex; flex-wrap: wrap; justify-content: center; column-gap: 18px; row-gap: 3px; margin-top: 10px; color: #526174; font-size: 8.5pt; text-align: center; }
  .organization-details p { margin: 0; overflow-wrap: anywhere; }
  .organization-details strong { color: #34465d; }
  .report-table { width: 100%; border-collapse: collapse; table-layout: fixed; font-size: 8.5pt; }
  .report-table thead { display: table-header-group; }
  .report-table tfoot { display: table-footer-group; }
  .report-table tr { break-inside: avoid; page-break-inside: avoid; }
  .report-table th, .report-table td { padding: 6px 7px; border: 1px solid #cbd4df; text-align: left; vertical-align: top; overflow-wrap: anywhere; word-break: normal; }
  .report-table th { color: #fff; background: #294b70; font-size: 8pt; font-weight: 700; }
  .report-table tbody tr:nth-child(even) { background: #f2f5f9; }
  .report-table tbody tr:nth-child(odd) { background: #fff; }
  .missing-value { color: #7b8796; }
  .empty-state { padding: 18px 8px !important; color: #667487; text-align: center !important; }
  .report-footer { display: flex; justify-content: space-between; gap: 16px; margin-top: 15px; padding-top: 8px; border-top: 1px solid #cbd4df; color: #657286; font-size: 8pt; break-inside: avoid; page-break-inside: avoid; }
  @media screen and (max-width: 800px) { .report-sheet { width: 100%; min-height: 0; margin: 0; padding: 20px; } }
  @media print {
    html, body { width: auto; min-width: 0; background: #fff; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    .preview-toolbar { display: none !important; }
    .report-sheet { width: auto; min-height: 0; margin: 0; padding: 0; overflow: visible; box-shadow: none; }
    .report-watermark { position: fixed; }
    .report-table { font-size: 8pt; }
  }
`;

const wordStyles = `
  body { font-family: Arial, Helvetica, sans-serif; font-size: 10pt; color: #253247; }
  .organization-header { margin-bottom: 16px; padding-bottom: 10px; border-bottom: 2px solid #294b70; text-align: center; }
  .organization-identity { display: flex; align-items: center; justify-content: center; gap: 14px; }
  .organization-logo { max-width: 90px; max-height: 56px; }
  h1 { margin: 0; color: #1f3550; font-size: 17pt; }
  .report-title { margin: 5px 0; font-weight: bold; }
  .organization-details { font-size: 9pt; }
  .organization-details p { display: inline-block; margin: 3px 9px; }
  table { width: 100%; border-collapse: collapse; table-layout: fixed; }
  thead { display: table-header-group; }
  tr { page-break-inside: avoid; }
  th, td { padding: 6px; border: 1px solid #cbd4df; text-align: left; vertical-align: top; overflow-wrap: anywhere; }
  th { color: #fff; background: #294b70; }
  tbody tr:nth-child(even) { background: #f2f5f9; }
  .report-footer { margin-top: 15px; padding-top: 8px; border-top: 1px solid #cbd4df; color: #657286; font-size: 8pt; }
`;

export const generateHTMLTemplate = (
  data: ExportData,
  format: ExportFormat = 'pdf'
) => {
  const title = data.headerInfo?.reportTitle || data.fileName || 'Report';
  const generatedAt = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());
  const isPdfPreview = format === 'pdf';

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <style>${isPdfPreview ? pdfStyles : wordStyles}</style>
  </head>
  <body>
    ${
      isPdfPreview
        ? `<nav class="preview-toolbar" aria-label="Report preview actions">
          <span id="preview-status" role="status">Loading report assets…</span>
          <div>
            <button id="cancel-preview" type="button" class="secondary">Cancel</button>
            <button id="print-report" type="button" disabled>Print / Save as PDF</button>
          </div>
        </nav>`
        : ''
    }
    <div class="report-sheet">
      ${isPdfPreview ? '<img class="report-watermark" src="/frontendImages/print-logo-center.jpeg" alt="" aria-hidden="true" />' : ''}
      <main class="report-content">
        ${renderOrganizationHeader(data.headerInfo)}
        ${renderReportTable(data)}
        <footer class="report-footer">
          <span>Generated on ${escapeHtml(generatedAt)}</span>
          <span>Total records: ${data.rows.length}</span>
        </footer>
      </main>
    </div>
  </body>
</html>`;
};
