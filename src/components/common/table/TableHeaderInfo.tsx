import React from 'react';
export interface TableHeaderInfoProps {
  organizationName?: string;
  registrationNo?: string;
  registeredOffice?: string;
  website?: string;
  email?: string;
  contact?: string;
  branchName?: string;
  reportTitle?: string;
  logo?: string;
}

export const TableHeaderInfo: React.FC<TableHeaderInfoProps> = ({
  organizationName,
  registrationNo,
  registeredOffice,
  website,
  email,
  contact,
  branchName,
  reportTitle,
  logo,
}) => {
  if (!organizationName && !registrationNo && !reportTitle) {
    return null;
  }

  return (
    <div className=" border border-b-0 rounded-t-lg p-1 mb-0">
      <div className="flex items-center justify-between">
        {/* Left side - Logo */}
        {logo && (
          <div className="flex-shrink-0 mr-4">
            <img
              src={logo}
              alt="Organization Logo"
              className="h-8 w-auto object-contain"
              onError={e => {
                // Fallback if image fails to load
                const target = e.currentTarget as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Center - Organization Info */}
        <div className="flex-1 text-center space-y-0.5">
          {organizationName && (
            <h1 className="text-sm font-bold ">{organizationName}</h1>
          )}
          {registrationNo && (
            <p className="text-xs ">REG. NO.: {registrationNo}</p>
          )}
          {registeredOffice && (
            <p className="text-xs ">REG. OFFICE: {registeredOffice}</p>
          )}
          {(website || email || contact) && (
            <p className="text-xs ">
              {website && `WEBSITE: ${website}  `}
              {email && `EMAIL: ${email}  `}
              {contact && `Contact: ${contact}`}
            </p>
          )}
          {branchName && <p className="text-xs ">Branch Name: {branchName}</p>}
          {reportTitle && (
            <h2 className="text-xs font-semibold  mt-1">{reportTitle}</h2>
          )}
        </div>

        {/* Right side - Additional logo or empty space for balance */}
        {logo && (
          <div className="flex-shrink-0 ml-4 opacity-0">
            {/* Invisible spacer for symmetrical layout */}
            <div className="h-12 w-12"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableHeaderInfo;
