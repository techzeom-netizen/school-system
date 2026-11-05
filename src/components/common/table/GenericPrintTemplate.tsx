import React from 'react';
import PrintTemplate from './PrintTemplate';

export type PrintInfoField = {
  label: string;
  value: string;
};

export type PrintTableFooterCell = {
  /** Unique key for React rendering */
  id: string;
  /** How many columns this cell spans */
  colSpan?: number;
  value: string;
};

export type PrintTableRow = {
  /** Unique key for React rendering */
  id: string;
  cells: (string | number)[];
};

export type GenericPrintTemplateProps = {
  /** Main heading shown at the top of the content area */
  title: string;
  /** Bordered label row shown under the title (e.g. "Schedule Details") */
  sectionLabel?: string;
  /** Key–value pairs rendered 2 per row in the info block */
  infoFields?: PrintInfoField[];
  /** Optional label shown above the data table */
  tableLabel?: string;
  /** Column headers for the data table */
  tableHeaders: string[];
  /** Row data — each row has an id and an array of cell values matching tableHeaders order */
  tableRows: PrintTableRow[];
  /**
   * Optional footer row — each element maps to a column.
   * Use colSpan to merge cells.
   */
  footerCells?: PrintTableFooterCell[];
  /** Shown at the bottom-left of the signature line */
  preparedByLabel?: string;
  /** Shown at the bottom-right of the signature line */
  authorisedByLabel?: string;
  /** Whether to show the signature line at the bottom. Defaults to true */
  showSignature?: boolean;
};

const GenericPrintTemplate: React.FC<GenericPrintTemplateProps> = ({
  title,
  sectionLabel,
  infoFields = [],
  tableLabel,
  tableHeaders,
  tableRows,
  footerCells,
  preparedByLabel = 'Prepared By',
  authorisedByLabel = 'Authorised Signatory / Manager',
  showSignature = true,
}) => {
  // Split infoFields into pairs for 2-column layout
  const infoPairs: [PrintInfoField, PrintInfoField | null][] = [];
  for (let i = 0; i < infoFields.length; i += 2) {
    infoPairs.push([infoFields[i], infoFields[i + 1] ?? null]);
  }

  return (
    <PrintTemplate>
      <div className="border border-black p-4 text-[12px] text-black">
        {/* Title */}
        <h1 className="text-lg text-center font-semibold mb-3">{title}</h1>

        {/* Section label */}
        {sectionLabel && (
          <div className="border border-black px-3 py-2 font-semibold mb-4">
            {sectionLabel}
          </div>
        )}

        {/* Info fields — 2 per row */}
        {infoPairs.length > 0 && (
          <table className="w-full border-collapse text-[12px] mb-4">
            <thead className="sr-only">
              <tr>
                <th>Label Left</th>
                <th>Sep</th>
                <th>Value Left</th>
                <th>Label Right</th>
                <th>Sep</th>
                <th>Value Right</th>
              </tr>
            </thead>
            <tbody>
              {infoPairs.map(([left, right]) => (
                <tr key={`${left.label}-${left.value}`}>
                  <td className="py-1 font-semibold w-[220px]">{left.label}</td>
                  <td className="py-1 w-[12px]">:</td>
                  <td className="py-1 w-[260px]">{left.value || 'N/A'}</td>

                  {right ? (
                    <>
                      <td className="py-1 font-semibold w-[220px]">
                        {right.label}
                      </td>
                      <td className="py-1 w-[12px]">:</td>
                      <td className="py-1">{right.value || 'N/A'}</td>
                    </>
                  ) : (
                    <td colSpan={3} />
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Divider */}
        {infoPairs.length > 0 && <div className="border-t border-black my-3" />}

        {/* Table label */}
        {tableLabel && (
          <h2 className="font-semibold text-[13px] mb-2">{tableLabel}</h2>
        )}

        {/* Data table */}
        <table className="w-full border-collapse text-[12px] border border-black">
          <thead>
            <tr>
              {tableHeaders.map(header => (
                <th
                  key={header}
                  className="border border-black px-2 py-1 text-left"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableRows.map(row => (
              <tr key={row.id}>
                {row.cells.map((cell, cellIdx) => (
                  // cells are positional by column; label from tableHeaders is the stable key context
                  // eslint-disable-next-line react/no-array-index-key
                  <td
                    key={`${row.id}-${cellIdx}`}
                    className="border border-black px-2 py-1"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>

          {/* Optional footer row */}
          {footerCells && footerCells.length > 0 && (
            <tfoot>
              <tr>
                {footerCells.map(cell => (
                  <td
                    key={cell.id}
                    colSpan={cell.colSpan ?? 1}
                    className="border border-black px-2 py-1 font-semibold"
                  >
                    {cell.value}
                  </td>
                ))}
              </tr>
            </tfoot>
          )}
        </table>

        {/* Signature line */}
        {showSignature && (
          <div className="mt-16 flex justify-between font-semibold text-[12px]">
            <div>{preparedByLabel}</div>
            <div>{authorisedByLabel}</div>
          </div>
        )}
      </div>
    </PrintTemplate>
  );
};

export default GenericPrintTemplate;
