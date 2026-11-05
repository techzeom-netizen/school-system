import * as XLSX from 'xlsx';
import { ExportData, generateHTMLTemplate } from './exportTemplateGenerator';

export const exportToExcel = (data: ExportData) => {
  try {
    const { headerInfo, columns, rows, fileName } = data;

    // Prepare workbook
    const wb = XLSX.utils.book_new();
    const wsData: string[][] = [];

    // Add header information
    if (headerInfo) {
      if (headerInfo.organizationName) {
        wsData.push([headerInfo.organizationName]);
      }
      if (headerInfo.registrationNo) {
        wsData.push([`REG. NO.: ${headerInfo.registrationNo}`]);
      }
      if (headerInfo.registeredOffice) {
        wsData.push([`REG. OFFICE: ${headerInfo.registeredOffice}`]);
      }

      const contactInfo: string[] = [];
      if (headerInfo.website)
        contactInfo.push(`WEBSITE: ${headerInfo.website}`);
      if (headerInfo.email) contactInfo.push(`EMAIL: ${headerInfo.email}`);
      if (headerInfo.contact)
        contactInfo.push(`Contact: ${headerInfo.contact}`);
      if (contactInfo.length > 0) {
        wsData.push([contactInfo.join('  ')]);
      }

      if (headerInfo.branchName) {
        wsData.push([`Branch Name: ${headerInfo.branchName}`]);
      }
      if (headerInfo.reportTitle) {
        wsData.push([]);
        wsData.push([headerInfo.reportTitle]);
      }
      wsData.push([]);
    }

    // Add column headers
    const headers = columns.map(col => col.header);
    wsData.push(headers);

    // Add data rows
    rows.forEach(row => {
      const rowData = columns.map(col => row[col.id] || '');
      wsData.push(rowData);
    });

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Set column widths
    const colWidths = headers.map(() => ({ wch: 15 }));
    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Report');

    // Generate Excel file and trigger download
    const finalFileName = `${headerInfo?.reportTitle || fileName || 'report'}.xlsx`;
    XLSX.writeFile(wb, finalFileName);

    return true;
  } catch (error) {
    throw new Error(`Error downloading Excel file: ${error}`);
  }
};

export const exportToPDF = (data: ExportData) => {
  const htmlContent = generateHTMLTemplate(data, 'pdf');
  const previewUrl = URL.createObjectURL(
    new Blob([htmlContent], { type: 'text/html' })
  );
  // Opening the generated Blob URL synchronously keeps this inside the menu click.
  const previewWindow = window.open(previewUrl, '_blank');

  if (!previewWindow) {
    URL.revokeObjectURL(previewUrl);
    throw new Error(
      'The PDF preview was blocked. Allow pop-ups for this site and try again.'
    );
  }

  let previewUrlRevoked = false;
  const revokePreviewUrl = () => {
    if (previewUrlRevoked) return;
    previewUrlRevoked = true;
    URL.revokeObjectURL(previewUrl);
  };

  const closePreview = () => {
    if (!previewWindow.closed) previewWindow.close();
    revokePreviewUrl();
  };

  // Also release the Blob URL if the user closes the preview tab directly.
  previewWindow.addEventListener('unload', revokePreviewUrl, { once: true });

  try {
    previewWindow.opener = null;

    const initializePreview = () => {
      if (previewWindow.closed) return;

      const printButtonElement =
        previewWindow.document.getElementById('print-report');
      const cancelButtonElement =
        previewWindow.document.getElementById('cancel-preview');
      const status = previewWindow.document.getElementById('preview-status');

      if (
        !printButtonElement ||
        printButtonElement.tagName !== 'BUTTON' ||
        !cancelButtonElement ||
        cancelButtonElement.tagName !== 'BUTTON' ||
        !status
      ) {
        closePreview();
        return;
      }

      const printButton = printButtonElement as HTMLButtonElement;
      const cancelButton = cancelButtonElement as HTMLButtonElement;

      cancelButton.addEventListener('click', closePreview, { once: true });

      // afterprint fires after printing or when the native print dialog is canceled.
      previewWindow.addEventListener('afterprint', closePreview, {
        once: true,
      });

      let printMediaWasActive = false;
      if (typeof previewWindow.matchMedia === 'function') {
        const printMedia = previewWindow.matchMedia('print');
        printMedia.addEventListener('change', event => {
          if (event.matches) {
            printMediaWasActive = true;
          } else if (printMediaWasActive) {
            closePreview();
          }
        });
      }

      const waitForImage = (image: HTMLImageElement) =>
        new Promise<void>(resolve => {
          if (image.complete) {
            resolve();
            return;
          }

          let timeoutId = 0;
          const finish = () => {
            window.clearTimeout(timeoutId);
            image.removeEventListener('load', finish);
            image.removeEventListener('error', finish);
            resolve();
          };

          image.addEventListener('load', finish, { once: true });
          image.addEventListener('error', finish, { once: true });
          timeoutId = window.setTimeout(finish, 8000);
        });

      void Promise.all(
        Array.from(previewWindow.document.images, waitForImage)
      ).then(() => {
        if (previewWindow.closed) return;

        const failedImages = Array.from(previewWindow.document.images).some(
          image => image.naturalWidth === 0
        );
        status.textContent = failedImages
          ? 'Preview ready with missing images. Choose a PDF destination in the print dialog to save.'
          : 'Preview ready. Choose a PDF destination in the print dialog to save.';
        printButton.disabled = false;
        printButton.addEventListener('click', () => {
          try {
            status.textContent =
              'In the print dialog, choose Save as PDF (or your browser’s PDF destination), then confirm Save.';
            previewWindow.focus();
            previewWindow.print();
          } catch {
            status.textContent =
              'Printing could not be started. Use your browser’s print command.';
          }
        });
      });
    };

    // The Blob document loads asynchronously; do not print until the user acts.
    if (
      previewWindow.document.readyState === 'complete' &&
      previewWindow.location.href === previewUrl
    ) {
      initializePreview();
    } else {
      previewWindow.addEventListener('load', initializePreview, { once: true });
    }

    return true;
  } catch (error) {
    closePreview();
    throw new Error(`Error opening PDF preview: ${String(error)}`);
  }
};

export const exportToWord = (data: ExportData) => {
  try {
    const { headerInfo, fileName } = data;
    const htmlContent = generateHTMLTemplate(data, 'word');

    // Create blob and download
    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${headerInfo?.reportTitle || fileName || 'report'}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);

    return true;
  } catch (error) {
    throw new Error(`Error downloading Word file: ${error}`);
  }
};
