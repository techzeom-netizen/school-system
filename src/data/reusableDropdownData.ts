export type AssetKind =
  | 'laptop'
  | 'phone'
  | 'card'
  | 'monitor'
  | 'headset'
  | 'other';

export interface AssetCategoryOption {
  value: string;
  label: string;
  kind: AssetKind;
}

export const assetCategoryOptions: AssetCategoryOption[] = [
  { value: 'Laptop', label: 'Laptop', kind: 'laptop' },
  { value: 'Monitor', label: 'Monitor', kind: 'monitor' },
  { value: 'Mobile phone', label: 'Mobile phone', kind: 'phone' },
  { value: 'Headset', label: 'Headset', kind: 'headset' },
  { value: 'Access card', label: 'Access card', kind: 'card' },
  { value: 'Other', label: 'Other', kind: 'other' },
];

export interface DropdownOption {
  value: string;
  label: string;
}

export const taxDeclarationFinancialYearOptions: DropdownOption[] = [
  { value: '2026-27', label: '2026-27' },
  { value: '2025-26', label: '2025-26' },
];

export const taxDeclarationFilterOptions: DropdownOption[] = [
  { value: 'all', label: 'All' },
  { value: 'waiting', label: 'Waiting for review' },
  { value: 'approved', label: 'Approved' },
  { value: 'notSubmitted', label: 'Not submitted' },
];

export const payrollReportFinancialYearOptions: DropdownOption[] = [
  { value: 'FY 2026-27', label: 'FY 2026-27' },
  { value: 'FY 2025-26', label: 'FY 2025-26' },
];

export const payrollReportMonthOptions: DropdownOption[] = [
  { value: 'all', label: 'All months' },
  { value: 'Apr', label: 'April' },
  { value: 'May', label: 'May' },
  { value: 'Jun', label: 'June' },
  { value: 'Jul', label: 'July' },
  { value: 'Aug', label: 'August' },
  { value: 'Sep', label: 'September' },
  { value: 'Oct', label: 'October' },
  { value: 'Nov', label: 'November' },
  { value: 'Dec', label: 'December' },
  { value: 'Jan', label: 'January' },
  { value: 'Feb', label: 'February' },
  { value: 'Mar', label: 'March' },
];

export const form16FinancialYearOptions: DropdownOption[] = [
  { value: '2024-25', label: 'FY 2024-25' },
  { value: '2025-26', label: 'FY 2025-26' },
];

export const form16FilterOptions: DropdownOption[] = [
  { value: 'everyone', label: 'Everyone' },
  { value: 'attention', label: 'Needs attention' },
  { value: 'ready', label: 'Ready' },
  { value: 'generated', label: 'Generated' },
  { value: 'shared', label: 'Shared' },
];

export const form16AllDepartmentsOption: DropdownOption = {
  value: 'all',
  label: 'All departments',
};

export const form16GenerationScopeOptions: DropdownOption[] = [
  { value: 'all', label: 'All ready employees (recommended)' },
  { value: 'team', label: 'Only one team' },
];

export const payslipDepartmentOptions: DropdownOption[] = [
  { value: 'all', label: 'All departments' },
  { value: 'Sales', label: 'Sales' },
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Finance', label: 'Finance' },
  { value: 'HR', label: 'HR' },
  { value: 'Operations', label: 'Operations' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Support', label: 'Support' },
];

export const payslipTabOptions: DropdownOption[] = [
  { value: 'ready', label: 'Ready to send' },
  { value: 'fix', label: 'Need a fix' },
  { value: 'sent', label: 'Sent' },
];

export const salaryStructureBasicMethodOptions: DropdownOption[] = [
  { value: 'ctc', label: 'Percentage of yearly pay' },
  { value: 'fixed', label: 'Fixed amount per month' },
];

export const salaryStructurePayMethodOptions: DropdownOption[] = [
  ...salaryStructureBasicMethodOptions,
  { value: 'basic', label: 'Percentage of basic pay' },
  { value: 'rest', label: 'Whatever is left' },
];

export const salaryStructurePayKindOptions: DropdownOption[] = [
  { value: 'employee', label: 'Employee' },
  { value: 'company', label: 'Company' },
];

export const salaryStructureStartOptions: DropdownOption[] = [
  { value: 'blank', label: 'A simple blank structure' },
];

export const attendanceSettingsOfficeRadiusOptions: DropdownOption[] = [
  { value: '100', label: '100 m' },
  { value: '200', label: '200 m (recommended)' },
  { value: '500', label: '500 m' },
  { value: '1000', label: '1 km' },
];

export const attendanceSettingsGracePeriodOptions: DropdownOption[] = [
  { value: '5', label: '5 minutes' },
  { value: '10', label: '10 minutes' },
  { value: '15', label: '15 minutes' },
  { value: '30', label: '30 minutes' },
];

export const helpdeskTicketCategoryOptions: DropdownOption[] = [
  'Payroll',
  'IT Support',
  'Leave',
  'Attendance',
  'Admin',
  'Other',
].map(category => ({ value: category, label: category }));

export const helpdeskTicketPriorityOptions: DropdownOption[] = [
  { value: 'High', label: 'High' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Low', label: 'Low' },
];

export const helpdeskTicketCategoryFilterOptions: DropdownOption[] = [
  { value: 'All', label: 'All categories' },
  ...helpdeskTicketCategoryOptions,
];

export const helpdeskTicketPriorityFilterOptions: DropdownOption[] = [
  { value: 'All', label: 'All priorities' },
  ...helpdeskTicketPriorityOptions,
];

export const companyDocumentAudienceOptions: DropdownOption[] = [
  { value: 'All Employees', label: 'All Employees' },
  { value: 'HR Team', label: 'HR Team' },
  { value: 'Management', label: 'Management' },
  { value: 'Stakeholders', label: 'Stakeholders' },
];

export const companyDocumentAudienceFilterOptions: DropdownOption[] = [
  { value: 'anyone', label: 'Anyone' },
  ...companyDocumentAudienceOptions,
];

export const companyDocumentCategoryFilterOptions: DropdownOption[] = [
  { value: 'all', label: 'All Categories' },
];

export const esignatureStatusFilterOptions: DropdownOption[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'your-turn', label: 'Your turn' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'declined', label: 'Declined' },
  { value: 'expired', label: 'Expired' },
];

export const esignatureSignerOptions: DropdownOption[] = [
  { value: 'You', label: 'You' },
  { value: 'Rahul Menon', label: 'Rahul Menon' },
  { value: 'Ananya Das', label: 'Ananya Das' },
  { value: 'Jay Kapoor', label: 'Jay Kapoor' },
  { value: 'Meera S.', label: 'Meera S.' },
  { value: 'Priya Nair', label: 'Priya Nair' },
  { value: 'Rohan Shah', label: 'Rohan Shah' },
  { value: 'Legal Counsel', label: 'Legal Counsel' },
];

export const esignatureRoleOptions: DropdownOption[] = [
  { value: 'Employee', label: 'Employee' },
  { value: 'HR Manager', label: 'HR Manager' },
  { value: 'Director', label: 'Director' },
  { value: 'Legal', label: 'Legal' },
];

export const esignatureReminderOptions: DropdownOption[] = [
  { value: '1', label: 'Every day' },
  { value: '2', label: 'Every 2 days' },
  { value: '3', label: 'Every 3 days' },
  { value: '0', label: 'No reminders' },
];

export const esignatureDeclineReasonOptions: DropdownOption[] = [
  { value: 'The details are incorrect', label: 'The details are incorrect' },
  {
    value: 'I need changes before signing',
    label: 'I need changes before signing',
  },
  {
    value: 'I am not the right person to sign',
    label: 'I am not the right person to sign',
  },
  { value: 'Something else', label: 'Something else' },
];

export const documentRequestFilterOptions: DropdownOption[] = [
  { value: 'pending', label: 'Waiting for you' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'issued', label: 'Issued' },
  { value: 'rejected', label: 'Rejected' },
];

export interface DocumentRequestAudienceOption extends DropdownOption {
  people: number;
}

export const documentRequestAudienceOptions: DocumentRequestAudienceOption[] = [
  { value: 'all', label: 'All employees · 52 people', people: 52 },
  { value: 'Finance', label: 'Finance · 8 people', people: 8 },
  { value: 'Engineering', label: 'Engineering · 20 people', people: 20 },
  { value: 'Marketing', label: 'Marketing · 6 people', people: 6 },
  { value: 'Operations', label: 'Operations · 10 people', people: 10 },
];

export const documentRequestReminderOptions: DropdownOption[] = [
  { value: '1', label: 'Every day' },
  { value: '2', label: 'Every 2 days' },
  { value: '3', label: 'Every 3 days' },
  { value: '0', label: 'No reminders' },
];

export const documentRequestDepartmentFilterOptions: DropdownOption[] = [
  { value: 'all', label: 'All departments' },
];

export const leaveYearOptions: DropdownOption[] = [
  { label: 'April – March', value: 'april' },
  { label: 'January – December', value: 'january' },
];

export const allowanceOptions: DropdownOption[] = [
  { label: 'Fixed number of days', value: 'days' },
  { label: 'As earned', value: 'asEarned' },
  { label: 'No limit', value: 'noLimit' },
];

export const grantOptions: DropdownOption[] = [
  { label: 'Monthly', value: 'monthly' },
  { label: 'Full, at year start', value: 'yearStart' },
  { label: 'At once, on request', value: 'onRequest' },
  { label: 'On approval', value: 'onApproval' },
  { label: 'Not applicable', value: 'notApplicable' },
];

export const carryOptions: DropdownOption[] = [
  { label: 'No carry forward', value: 'none' },
  { label: 'Carry forward up to a limit', value: 'upTo' },
  { label: 'Expires after some days', value: 'expires' },
];

export const yesNoOptions: DropdownOption[] = [
  { label: 'No', value: 'no' },
  { label: 'Yes', value: 'yes' },
];

export const payOptions: DropdownOption[] = [
  { label: 'Paid', value: 'paid' },
  { label: 'Unpaid', value: 'unpaid' },
];

export const audienceOptions: DropdownOption[] = [
  { label: 'Everyone', value: 'everyone' },
  { label: 'Female', value: 'female' },
  { label: 'Male', value: 'male' },
];

export const colorOptions: DropdownOption[] = [
  { label: 'Blue', value: 'blue' },
  { label: 'Teal', value: 'teal' },
  { label: 'Green', value: 'green' },
  { label: 'Orange', value: 'orange' },
  { label: 'Rose', value: 'rose' },
  { label: 'Violet', value: 'violet' },
  { label: 'Slate', value: 'slate' },
  { label: 'Gray', value: 'gray' },
];

export const documentViewerOptions: DropdownOption[] = [
  { value: 'all', label: 'All employees' },
  { value: 'managersHr', label: 'Managers and HR' },
  { value: 'hrOnly', label: 'HR only' },
];

export const documentFileSizeOptions: DropdownOption[] = [
  { value: '5', label: '5 MB' },
  { value: '10', label: '10 MB' },
  { value: '25', label: '25 MB' },
];

export const documentReviewerOptions: DropdownOption[] = [
  { value: 'hr', label: 'HR team' },
  { value: 'manager', label: 'Reporting manager' },
  { value: 'none', label: 'No check needed' },
];

export const documentReminderOptions: DropdownOption[] = [
  { value: 'daily', label: 'Every day' },
  { value: 'every3days', label: 'Every 3 days' },
  { value: 'weekly', label: 'Every week' },
];

export const documentExpiryOptions: DropdownOption[] = [
  { value: '3', label: '3 days' },
  { value: '7', label: '7 days' },
  { value: '14', label: '14 days' },
  { value: '30', label: '30 days' },
];

export const documentHandlerOptions: DropdownOption[] = [
  { value: 'hr', label: 'HR team' },
  { value: 'manager', label: 'Reporting manager' },
  { value: 'finance', label: 'Finance team' },
];

export const documentReplyOptions: DropdownOption[] = [
  { value: '1', label: '1 working day' },
  { value: '2', label: '2 working days' },
  { value: '5', label: '5 working days' },
];

export const assetSettingsTagStyleOptions: DropdownOption[] = [
  { value: 'auto', label: 'Automatic (AST-0001)' },
  { value: 'manual', label: 'Enter manually' },
];

export const assetSettingsLowStockOptions: DropdownOption[] = [
  { value: '3', label: 'Below 3 items' },
  { value: '5', label: 'Below 5 items' },
  { value: '10', label: 'Below 10 items' },
];

export const assetSettingsRequestApproverOptions: DropdownOption[] = [
  { value: 'manager', label: 'Reporting manager' },
  { value: 'hr', label: 'HR team' },
  { value: 'it', label: 'IT team' },
  { value: 'managerIt', label: 'Manager, then IT team' },
];

export const assetSettingsReturnDeadlineOptions: DropdownOption[] = [
  { value: 'lastDay', label: 'The last working day' },
  { value: '3', label: '3 days before' },
  { value: '7', label: '7 days before' },
];

export const assetSettingsRepairHandlerOptions: DropdownOption[] = [
  { value: 'it', label: 'IT team' },
  { value: 'admin', label: 'Admin team' },
  { value: 'vendor', label: 'Vendor directly' },
];

export const assetSettingsServiceReminderOptions: DropdownOption[] = [
  { value: '3', label: 'Every 3 months' },
  { value: '6', label: 'Every 6 months' },
  { value: '12', label: 'Every year' },
];

export const assetSettingsApprovalLimitOptions: DropdownOption[] = [
  { value: '10000', label: '₹10,000' },
  { value: '25000', label: '₹25,000' },
  { value: '50000', label: '₹50,000' },
  { value: '100000', label: '₹1,00,000' },
];

export const assetSettingsPurchaseApproverOptions: DropdownOption[] = [
  { value: 'finance', label: 'Finance team' },
  { value: 'hr', label: 'HR team' },
  { value: 'manager', label: 'Reporting manager' },
];

export const assetSettingsWarrantyAlertOptions: DropdownOption[] = [
  { value: '15', label: '15 days before' },
  { value: '30', label: '30 days before' },
  { value: '60', label: '60 days before' },
];

export const assetSettingsReportRecipientOptions: DropdownOption[] = [
  { value: 'hr', label: 'HR team' },
  { value: 'finance', label: 'Finance team' },
  { value: 'admin', label: 'Admin team' },
];

export const assetSettingsReportFormatOptions: DropdownOption[] = [
  { value: 'excel', label: 'Excel' },
  { value: 'pdf', label: 'PDF' },
];

export const assetStatusFilterOptions: DropdownOption[] = [
  { value: 'all', label: 'All items' },
  { value: 'pending', label: 'To confirm' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'returning', label: 'Being returned' },
];

export const assetProblemOptions: DropdownOption[] = [
  { value: 'Not working properly', label: 'Not working properly' },
  { value: 'Damaged', label: 'Damaged' },
  { value: 'Lost or stolen', label: 'Lost or stolen' },
];

export const assetReturnModeOptions: DropdownOption[] = [
  { value: 'Hand over to IT desk', label: 'Hand over to IT desk' },
  { value: 'Courier to office', label: 'Courier to office' },
];

export const assetUrgencyOptions: DropdownOption[] = [
  { value: 'Normal', label: 'Normal' },
  { value: 'Urgent', label: 'Urgent' },
];

export interface AssetLabelValue {
  label: string;
  value: string;
}

export const assetDetails: Record<
  'laptop' | 'phone' | 'card' | 'monitor',
  AssetLabelValue[]
> = {
  laptop: [
    { label: 'Serial', value: '7XK29L3' },
    { label: 'Warranty', value: 'till Aug 2029' },
    { label: 'Condition', value: 'Good' },
  ],
  phone: [
    { label: 'IMEI', value: '35 8142 06…' },
    { label: 'Warranty', value: 'till Oct 2028' },
    { label: 'Condition', value: 'New' },
  ],
  card: [
    { label: 'Card no.', value: '0048 2217' },
    { label: 'Location', value: 'Bengaluru HQ' },
    { label: 'Condition', value: 'Good' },
  ],
  monitor: [
    { label: 'Serial', value: 'CN0H4V2' },
    { label: 'Return to', value: 'IT desk' },
    { label: 'Condition', value: 'Good' },
  ],
};

export const assetSpecifications: Record<
  'laptop' | 'phone' | 'card' | 'monitor',
  AssetLabelValue[]
> = {
  laptop: [
    { label: 'Processor', value: 'Intel Core i7, 13th gen' },
    { label: 'Memory and storage', value: '16 GB RAM, 512 GB SSD' },
    { label: 'Accessories', value: 'Charger, bag, mouse' },
  ],
  phone: [
    { label: 'Model', value: 'Galaxy S23, 256 GB' },
    { label: 'SIM', value: 'Company plan, ending 4417' },
    { label: 'Accessories', value: 'Charger, case' },
  ],
  card: [
    { label: 'Access', value: 'Floors 2 to 5, main entrance' },
    { label: 'Valid till', value: 'Until your last working day' },
  ],
  monitor: [
    { label: 'Size', value: '24 inch, Full HD' },
    { label: 'Cables', value: 'HDMI, power' },
  ],
};

// Assets Inventory Data
export type InventoryCategory =
  | 'laptop'
  | 'mobile'
  | 'monitor'
  | 'furniture'
  | 'printer';

export type InventoryStatus =
  | 'allocated'
  | 'available'
  | 'maintenance'
  | 'retired';

export type InventoryStatusFilter = 'all' | InventoryStatus;

export interface InventoryEmployee {
  id: string;
  name: string;
  department: string;
}

export interface InventoryHistoryEntry {
  at: string;
  text: string;
}

export interface InventoryAsset {
  id: string;
  name: string;
  tag: string;
  category: InventoryCategory;
  serial: string;
  status: InventoryStatus;
  employeeId: string | null;
  purchasedOn: string;
  warrantyEnds: string | null;
  history: InventoryHistoryEntry[];
}

export const inventoryEmployees: InventoryEmployee[] = [
  { id: 'emp-001', name: 'Aarav Mehta', department: 'Engineering' },
  { id: 'emp-002', name: 'Priya Nair', department: 'Human Resources' },
  { id: 'emp-003', name: 'Rohan Iyer', department: 'Sales' },
  { id: 'emp-004', name: 'Sneha Reddy', department: 'Finance' },
  { id: 'emp-005', name: 'Karthik Rao', department: 'Marketing' },
];

export const inventoryEmployeeOptions = inventoryEmployees.map(employee => ({
  label: `${employee.name} (${employee.department})`,
  value: employee.id,
}));

export const inventoryCategoryOptions = [
  { label: 'Laptop', value: 'laptop' },
  { label: 'Mobile', value: 'mobile' },
  { label: 'Monitor', value: 'monitor' },
  { label: 'Furniture', value: 'furniture' },
  { label: 'Printer', value: 'printer' },
];

export const inventoryCategoryFilterOptions = [
  { label: 'All categories', value: 'all' },
  ...inventoryCategoryOptions,
];

export const inventoryDepartmentFilterOptions = [
  { label: 'All departments', value: 'all' },
  ...Array.from(new Set(inventoryEmployees.map(e => e.department))).map(
    department => ({ label: department, value: department })
  ),
];

export const inventoryStatusFilterOptions: {
  label: string;
  value: InventoryStatusFilter;
}[] = [
  { label: 'All assets', value: 'all' },
  { label: 'Allocated', value: 'allocated' },
  { label: 'Available', value: 'available' },
  { label: 'Under Maintenance', value: 'maintenance' },
  { label: 'Retired', value: 'retired' },
];

export const inventoryStatusLabels: Record<InventoryStatus, string> = {
  allocated: 'Allocated',
  available: 'Available',
  maintenance: 'Under Maintenance',
  retired: 'Retired',
};

export const initialInventory: InventoryAsset[] = [
  {
    id: 'inv-001',
    name: 'MacBook Pro 14"',
    tag: 'AST-0001',
    category: 'laptop',
    serial: 'C02XK1LMQ6',
    status: 'allocated',
    employeeId: 'emp-001',
    purchasedOn: '2024-03-12',
    warrantyEnds: '2027-03-12',
    history: [
      { at: '2024-03-12T09:00:00', text: 'Added to inventory' },
      { at: '2024-03-14T10:30:00', text: 'Assigned to Aarav Mehta' },
    ],
  },
  {
    id: 'inv-002',
    name: 'Dell Latitude 5440',
    tag: 'AST-0002',
    category: 'laptop',
    serial: 'DL5440-7F2Q',
    status: 'allocated',
    employeeId: 'emp-002',
    purchasedOn: '2023-06-04',
    warrantyEnds: '2026-11-06',
    history: [
      { at: '2023-06-04T09:00:00', text: 'Added to inventory' },
      { at: '2023-06-06T11:00:00', text: 'Assigned to Priya Nair' },
    ],
  },
  {
    id: 'inv-003',
    name: 'Dell UltraSharp U2723QE',
    tag: 'AST-0003',
    category: 'monitor',
    serial: 'CN0Y8H3-2271',
    status: 'available',
    employeeId: null,
    purchasedOn: '2024-08-19',
    warrantyEnds: '2027-08-19',
    history: [{ at: '2024-08-19T09:00:00', text: 'Added to inventory' }],
  },
  {
    id: 'inv-004',
    name: 'iPhone 14',
    tag: 'AST-0004',
    category: 'mobile',
    serial: 'F2LXR7T9PQ',
    status: 'allocated',
    employeeId: 'emp-003',
    purchasedOn: '2024-01-27',
    warrantyEnds: '2027-01-27',
    history: [
      { at: '2024-01-27T09:00:00', text: 'Added to inventory' },
      { at: '2024-01-29T15:10:00', text: 'Assigned to Rohan Iyer' },
    ],
  },
  {
    id: 'inv-005',
    name: 'Lenovo ThinkPad T14',
    tag: 'AST-0005',
    category: 'laptop',
    serial: 'PF3K9X2M',
    status: 'maintenance',
    employeeId: 'emp-004',
    purchasedOn: '2022-11-15',
    warrantyEnds: '2025-11-15',
    history: [
      { at: '2022-11-15T09:00:00', text: 'Added to inventory' },
      { at: '2022-11-17T12:00:00', text: 'Assigned to Sneha Reddy' },
      { at: '2026-10-02T16:45:00', text: 'Sent for repair' },
    ],
  },
  {
    id: 'inv-006',
    name: 'Ergonomic Office Chair',
    tag: 'AST-0006',
    category: 'furniture',
    serial: 'EOC-B-00418',
    status: 'available',
    employeeId: null,
    purchasedOn: '2024-05-02',
    warrantyEnds: null,
    history: [{ at: '2024-05-02T09:00:00', text: 'Added to inventory' }],
  },
  {
    id: 'inv-007',
    name: 'HP LaserJet Pro M404',
    tag: 'AST-0007',
    category: 'printer',
    serial: 'VNB3T05812',
    status: 'retired',
    employeeId: null,
    purchasedOn: '2019-02-21',
    warrantyEnds: '2022-02-21',
    history: [
      { at: '2019-02-21T09:00:00', text: 'Added to inventory' },
      { at: '2026-09-15T10:00:00', text: 'Retired by IT admin' },
    ],
  },
  {
    id: 'inv-008',
    name: 'Samsung Galaxy S23',
    tag: 'AST-0008',
    category: 'mobile',
    serial: 'R5CW31H8KZD',
    status: 'allocated',
    employeeId: 'emp-005',
    purchasedOn: '2023-07-09',
    warrantyEnds: '2027-07-09',
    history: [
      { at: '2023-07-09T09:00:00', text: 'Added to inventory' },
      { at: '2023-07-11T10:20:00', text: 'Assigned to Karthik Rao' },
    ],
  },
];

// Assets Request Data
export type AssetRequestType =
  | 'laptop'
  | 'monitor'
  | 'mobile'
  | 'headset'
  | 'furniture';

export type AssetRequestStatus =
  | 'submitted'
  | 'approved'
  | 'in-progress'
  | 'issued'
  | 'rejected';

export type AssetRequestStatusFilter = 'all' | AssetRequestStatus;

export type AssetRequestUrgency = 'Normal' | 'Urgent';

export interface AssetRequester {
  id: string;
  name: string;
  department: string;
}

export interface AssetRequestHistoryEntry {
  at: string;
  text: string;
}

export interface AssetRequestItem {
  id: string;
  assetType: AssetRequestType;
  requesterId: string;
  urgency: AssetRequestUrgency;
  neededBy: string | null;
  raisedOn: string;
  reason: string;
  status: AssetRequestStatus;
  history: AssetRequestHistoryEntry[];
}

export const assetRequesters: AssetRequester[] = [
  { id: 'rq-001', name: 'Neha Kulkarni', department: 'Engineering' },
  { id: 'rq-002', name: 'Priya Nair', department: 'Human Resources' },
  { id: 'rq-003', name: 'Rohan Iyer', department: 'Sales' },
  { id: 'rq-004', name: 'Karthik Rao', department: 'Marketing' },
  { id: 'rq-005', name: 'Sneha Reddy', department: 'Finance' },
  { id: 'rq-006', name: 'Aarav Mehta', department: 'Engineering' },
  { id: 'rq-007', name: 'Ishaan Verma', department: 'Operations' },
  { id: 'rq-008', name: 'Ananya Das', department: 'Design' },
];

export const assetRequesterOptions = assetRequesters.map(requester => ({
  label: `${requester.name} (${requester.department})`,
  value: requester.id,
}));

export const assetRequestTypeOptions = [
  { label: 'Laptop', value: 'laptop' },
  { label: 'Monitor', value: 'monitor' },
  { label: 'Mobile', value: 'mobile' },
  { label: 'Headset', value: 'headset' },
  { label: 'Furniture', value: 'furniture' },
];

export const assetRequestTypeFilterOptions = [
  { label: 'All asset types', value: 'all' },
  ...assetRequestTypeOptions,
];

export const assetRequestUrgencyOptions = [
  { label: 'Normal', value: 'Normal' },
  { label: 'Urgent', value: 'Urgent' },
];

export const assetRequestUrgencyFilterOptions = [
  { label: 'Any urgency', value: 'all' },
  ...assetRequestUrgencyOptions,
];

export const assetRequestStatusFilterOptions: {
  label: string;
  value: AssetRequestStatusFilter;
}[] = [
  { label: 'All requests', value: 'all' },
  { label: 'Submitted', value: 'submitted' },
  { label: 'Manager approved', value: 'approved' },
  { label: 'In progress', value: 'in-progress' },
  { label: 'Issued', value: 'issued' },
  { label: 'Rejected', value: 'rejected' },
];

export const assetRequestStatusLabels: Record<AssetRequestStatus, string> = {
  submitted: 'Submitted',
  approved: 'Manager approved',
  'in-progress': 'In progress',
  issued: 'Issued',
  rejected: 'Rejected',
};

export const initialAssetRequests: AssetRequestItem[] = [
  {
    id: 'REQ-2026-0201',
    assetType: 'laptop',
    requesterId: 'rq-001',
    urgency: 'Urgent',
    neededBy: '2026-10-20',
    raisedOn: '2026-10-13',
    reason: 'Current laptop battery fails within an hour.',
    status: 'submitted',
    history: [{ at: '2026-10-13T09:15:00', text: 'Request submitted' }],
  },
  {
    id: 'REQ-2026-0200',
    assetType: 'headset',
    requesterId: 'rq-002',
    urgency: 'Normal',
    neededBy: '2026-10-30',
    raisedOn: '2026-10-12',
    reason: 'Needed for daily candidate interview calls.',
    status: 'submitted',
    history: [{ at: '2026-10-12T14:40:00', text: 'Request submitted' }],
  },
  {
    id: 'REQ-2026-0199',
    assetType: 'monitor',
    requesterId: 'rq-003',
    urgency: 'Urgent',
    neededBy: '2026-10-18',
    raisedOn: '2026-10-12',
    reason: 'My current monitor is flickering and unusable.',
    status: 'submitted',
    history: [{ at: '2026-10-12T11:05:00', text: 'Request submitted' }],
  },
  {
    id: 'REQ-2026-0197',
    assetType: 'mobile',
    requesterId: 'rq-004',
    urgency: 'Normal',
    neededBy: '2026-11-05',
    raisedOn: '2026-10-10',
    reason: 'Need a work phone for campaign field visits.',
    status: 'approved',
    history: [
      { at: '2026-10-10T10:00:00', text: 'Request submitted' },
      { at: '2026-10-11T09:30:00', text: 'Approved by manager' },
    ],
  },
  {
    id: 'REQ-2026-0195',
    assetType: 'laptop',
    requesterId: 'rq-005',
    urgency: 'Normal',
    neededBy: '2026-10-25',
    raisedOn: '2026-10-09',
    reason: 'Replacing laptop that is under repair.',
    status: 'in-progress',
    history: [
      { at: '2026-10-09T10:20:00', text: 'Request submitted' },
      { at: '2026-10-09T16:00:00', text: 'Approved by manager' },
      { at: '2026-10-12T12:10:00', text: 'Asset team is arranging the item' },
    ],
  },
  {
    id: 'REQ-2026-0193',
    assetType: 'headset',
    requesterId: 'rq-006',
    urgency: 'Normal',
    neededBy: null,
    raisedOn: '2026-10-08',
    reason: 'Headset for remote stand-up meetings.',
    status: 'approved',
    history: [
      { at: '2026-10-08T09:45:00', text: 'Request submitted' },
      { at: '2026-10-09T11:15:00', text: 'Approved by manager' },
    ],
  },
  {
    id: 'REQ-2026-0190',
    assetType: 'furniture',
    requesterId: 'rq-007',
    urgency: 'Normal',
    neededBy: '2026-10-12',
    raisedOn: '2026-10-03',
    reason: 'Ergonomic chair for back support.',
    status: 'issued',
    history: [
      { at: '2026-10-03T10:00:00', text: 'Request submitted' },
      { at: '2026-10-04T09:00:00', text: 'Approved by manager' },
      { at: '2026-10-11T15:30:00', text: 'Asset issued to employee' },
    ],
  },
  {
    id: 'REQ-2026-0188',
    assetType: 'monitor',
    requesterId: 'rq-008',
    urgency: 'Normal',
    neededBy: null,
    raisedOn: '2026-10-01',
    reason: 'Second monitor for design work.',
    status: 'rejected',
    history: [
      { at: '2026-10-01T13:00:00', text: 'Request submitted' },
      {
        at: '2026-10-02T10:30:00',
        text: 'Rejected (note: Budget freeze for this quarter)',
      },
    ],
  },
];

//  Return & Recovery page.
export type ReturnAssetType =
  | 'laptop'
  | 'mobile'
  | 'monitor'
  | 'headset'
  | 'card';

// 0 = Return requested, 1 = Handed over, 2 = Condition checked, 3 = Closed
export type ReturnStage = 0 | 1 | 2 | 3;

export type ReturnBucket =
  | 'overdue'
  | 'requested'
  | 'handed'
  | 'checked'
  | 'closed';

export type ReturnTab = 'action' | 'waiting' | 'closed' | 'all';

export type ReturnCondition = 'Good' | 'Minor damage' | 'Damaged';

export type ReturnReason =
  | 'Resignation'
  | 'Upgrade'
  | 'Project ended'
  | 'Replaced after repair';

export type ReturnMode = 'Hand over to IT desk' | 'Courier to office';

export interface AssetReturnItem {
  id: string;
  name: string;
  tag: string;
  assetType: ReturnAssetType;
  person: string;
  dept: string;
  reason: ReturnReason;
  returnBy: string;
  mode: ReturnMode;
  stage: ReturnStage;
  condition: ReturnCondition | null;
  conditionNote: string;
  reminded: boolean;
}

export interface ReturnableAsset {
  id: string;
  name: string;
  tag: string;
  assetType: ReturnAssetType;
  person: string;
  dept: string;
}

const offsetDate = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString('en-CA');
};

export const returnAssetTypeLabels: Record<ReturnAssetType, string> = {
  laptop: 'Laptop',
  mobile: 'Mobile',
  monitor: 'Monitor',
  headset: 'Headset',
  card: 'Access card',
};

export const returnBucketLabels: Record<ReturnBucket, string> = {
  overdue: 'Overdue',
  requested: 'Waiting for handover',
  handed: 'Needs condition check',
  checked: 'Ready to close',
  closed: 'Closed',
};

export const returnStepLabels = [
  'Return requested',
  'Asset handed over',
  'Condition checked',
  'Closed',
];

export const returnTabOptions: { label: string; value: ReturnTab }[] = [
  { label: 'Needs action', value: 'action' },
  { label: 'Waiting on employee', value: 'waiting' },
  { label: 'Closed', value: 'closed' },
  { label: 'All', value: 'all' },
];

export const returnReasonOptions = [
  { label: 'Resignation', value: 'Resignation' },
  { label: 'Upgrade', value: 'Upgrade' },
  { label: 'Project ended', value: 'Project ended' },
  { label: 'Replaced after repair', value: 'Replaced after repair' },
];

export const returnReasonFilterOptions = [
  { label: 'All reasons', value: 'all' },
  ...returnReasonOptions,
];

export const returnModeOptions = [
  { label: 'Hand over to IT desk', value: 'Hand over to IT desk' },
  { label: 'Courier to office', value: 'Courier to office' },
];

export const returnConditionOptions = [
  { label: 'Good', value: 'Good' },
  { label: 'Minor damage', value: 'Minor damage' },
  { label: 'Damaged', value: 'Damaged' },
];

// Assets currently with employees that can have a return started.
export const returnableAssets: ReturnableAsset[] = [
  {
    id: 'asset-012',
    name: 'HP EliteBook 840',
    tag: 'AST-0012',
    assetType: 'laptop',
    person: 'Meera Joshi',
    dept: 'Engineering',
  },
  {
    id: 'asset-013',
    name: 'Google Pixel 8',
    tag: 'AST-0013',
    assetType: 'mobile',
    person: 'Vikram Shah',
    dept: 'Sales',
  },
  {
    id: 'asset-014',
    name: 'Dell P2422H monitor',
    tag: 'AST-0014',
    assetType: 'monitor',
    person: 'Ritu Sen',
    dept: 'Human Resources',
  },
  {
    id: 'asset-015',
    name: 'Jabra Evolve2 headset',
    tag: 'AST-0015',
    assetType: 'headset',
    person: 'Arjun Pillai',
    dept: 'Marketing',
  },
];

export const initialAssetReturns: AssetReturnItem[] = [
  {
    id: 'ret-001',
    name: 'MacBook Pro 14"',
    tag: 'AST-0001',
    assetType: 'laptop',
    person: 'Aarav Mehta',
    dept: 'Engineering',
    reason: 'Upgrade',
    returnBy: offsetDate(6),
    mode: 'Hand over to IT desk',
    stage: 0,
    condition: null,
    conditionNote: '',
    reminded: false,
  },
  {
    id: 'ret-002',
    name: 'Dell Latitude 5440',
    tag: 'AST-0002',
    assetType: 'laptop',
    person: 'Priya Nair',
    dept: 'Human Resources',
    reason: 'Resignation',
    returnBy: offsetDate(-5),
    mode: 'Courier to office',
    stage: 0,
    condition: null,
    conditionNote: '',
    reminded: false,
  },
  {
    id: 'ret-003',
    name: 'iPhone 14',
    tag: 'AST-0004',
    assetType: 'mobile',
    person: 'Rohan Iyer',
    dept: 'Sales',
    reason: 'Resignation',
    returnBy: offsetDate(-3),
    mode: 'Hand over to IT desk',
    stage: 0,
    condition: null,
    conditionNote: '',
    reminded: false,
  },
  {
    id: 'ret-004',
    name: 'Dell 24 inch monitor',
    tag: 'AST-0009',
    assetType: 'monitor',
    person: 'Karthik Rao',
    dept: 'Marketing',
    reason: 'Project ended',
    returnBy: offsetDate(6),
    mode: 'Hand over to IT desk',
    stage: 1,
    condition: null,
    conditionNote: '',
    reminded: false,
  },
  {
    id: 'ret-005',
    name: 'Lenovo ThinkPad T14',
    tag: 'AST-0005',
    assetType: 'laptop',
    person: 'Sneha Reddy',
    dept: 'Finance',
    reason: 'Replaced after repair',
    returnBy: offsetDate(2),
    mode: 'Hand over to IT desk',
    stage: 1,
    condition: null,
    conditionNote: '',
    reminded: false,
  },
  {
    id: 'ret-006',
    name: 'Samsung Galaxy S23',
    tag: 'AST-0008',
    assetType: 'mobile',
    person: 'Neha Kulkarni',
    dept: 'Engineering',
    reason: 'Upgrade',
    returnBy: offsetDate(-2),
    mode: 'Hand over to IT desk',
    stage: 2,
    condition: 'Minor damage',
    conditionNote: 'Small scratch on the back panel.',
    reminded: false,
  },
  {
    id: 'ret-007',
    name: 'Office access card',
    tag: 'AST-0010',
    assetType: 'card',
    person: 'Ishaan Verma',
    dept: 'Operations',
    reason: 'Resignation',
    returnBy: offsetDate(-4),
    mode: 'Hand over to IT desk',
    stage: 3,
    condition: 'Good',
    conditionNote: '',
    reminded: false,
  },
  {
    id: 'ret-008',
    name: 'Sony WH-1000XM4 headset',
    tag: 'AST-0011',
    assetType: 'headset',
    person: 'Ananya Das',
    dept: 'Design',
    reason: 'Project ended',
    returnBy: offsetDate(-9),
    mode: 'Courier to office',
    stage: 3,
    condition: 'Damaged',
    conditionNote: 'Left ear cushion is torn.',
    reminded: false,
  },
];

// Maintenance & Repair page.

export type RepairAssetType =
  | 'laptop'
  | 'mobile'
  | 'monitor'
  | 'headset'
  | 'printer'
  | 'furniture';

// 0 = Reported, 1 = Assessed, 2 = In repair, 3 = Fixed
export type RepairStage = 0 | 1 | 2 | 3;

export type RepairPriority = 'High' | 'Normal' | 'Low';

export type RepairPriorityFilter = 'all' | RepairPriority;

export interface RepairItem {
  id: string;
  name: string;
  tag: string;
  assetType: RepairAssetType;
  person: string;
  issue: string;
  priority: RepairPriority;
  diagnosis: string;
  vendor: string | null;
  cost: number | null;
  covered: boolean;
  reportedOn: string;
  backBy: string | null;
  completedOn: string | null;
  stage: RepairStage;
  chased: boolean;
}

export interface RepairableAsset {
  id: string;
  name: string;
  tag: string;
  assetType: RepairAssetType;
  person: string;
}

export interface RepairColumnConfig {
  stage: 0 | 1 | 2;
  title: string;
  help: string;
  dotClass: string;
  emptyText: string;
  primaryLabel: string;
}

export const repairAssetTypeLabels: Record<RepairAssetType, string> = {
  laptop: 'Laptop',
  mobile: 'Mobile',
  monitor: 'Monitor',
  headset: 'Headset',
  printer: 'Printer',
  furniture: 'Furniture',
};

export const repairStageLabels = ['Reported', 'Assessed', 'In repair', 'Fixed'];

export const repairColumns: RepairColumnConfig[] = [
  {
    stage: 0,
    title: 'Reported',
    help: 'New problems to look at',
    dotClass: 'bg-amber-500',
    emptyText: 'No new problems.',
    primaryLabel: 'Assess problem',
  },
  {
    stage: 1,
    title: 'Assessed',
    help: 'Ready to send for repair',
    dotClass: 'bg-primary',
    emptyText: 'Nothing waiting to be sent.',
    primaryLabel: 'Send for repair',
  },
  {
    stage: 2,
    title: 'In repair',
    help: 'With the vendor or team',
    dotClass: 'bg-cyan-600',
    emptyText: 'Nothing in repair.',
    primaryLabel: 'Mark as fixed',
  },
];

export const repairPriorityOptions = [
  { label: 'High', value: 'High' },
  { label: 'Normal', value: 'Normal' },
  { label: 'Low', value: 'Low' },
];

export const repairPriorityFilterOptions: {
  label: string;
  value: RepairPriorityFilter;
}[] = [
  { label: 'All', value: 'all' },
  { label: 'High', value: 'High' },
  { label: 'Normal', value: 'Normal' },
  { label: 'Low', value: 'Low' },
];

export const repairVendorOptions = [
  { label: 'TechFix Services', value: 'TechFix Services' },
  { label: 'MobileCare Hub', value: 'MobileCare Hub' },
  { label: 'PrintCare Solutions', value: 'PrintCare Solutions' },
  { label: 'In-house team', value: 'In-house team' },
];

// Assets that can have a problem reported against them.
export const repairableAssets: RepairableAsset[] = [
  {
    id: 'asset-012',
    name: 'HP EliteBook 840',
    tag: 'AST-0012',
    assetType: 'laptop',
    person: 'Meera Joshi',
  },
  {
    id: 'asset-013',
    name: 'Google Pixel 8',
    tag: 'AST-0013',
    assetType: 'mobile',
    person: 'Vikram Shah',
  },
  {
    id: 'asset-014',
    name: 'Dell P2422H monitor',
    tag: 'AST-0014',
    assetType: 'monitor',
    person: 'Ritu Sen',
  },
  {
    id: 'asset-015',
    name: 'Jabra Evolve2 headset',
    tag: 'AST-0015',
    assetType: 'headset',
    person: 'Arjun Pillai',
  },
];

export const initialRepairs: RepairItem[] = [
  {
    id: 'rep-001',
    name: 'Lenovo ThinkPad T14',
    tag: 'AST-0005',
    assetType: 'laptop',
    person: 'Sneha Reddy',
    issue: 'Screen is flickering',
    priority: 'High',
    diagnosis: 'Display panel needs to be replaced.',
    vendor: 'TechFix Services',
    cost: 6500,
    covered: false,
    reportedOn: offsetDate(-12),
    backBy: offsetDate(4),
    completedOn: null,
    stage: 2,
    chased: false,
  },
  {
    id: 'rep-002',
    name: 'Dell Latitude 5440',
    tag: 'AST-0002',
    assetType: 'laptop',
    person: 'Priya Nair',
    issue: 'Battery drains in under an hour',
    priority: 'Normal',
    diagnosis: 'Battery has lost most of its capacity.',
    vendor: 'TechFix Services',
    cost: null,
    covered: true,
    reportedOn: offsetDate(-12),
    backBy: offsetDate(-4),
    completedOn: null,
    stage: 2,
    chased: false,
  },
  {
    id: 'rep-003',
    name: 'iPhone 14',
    tag: 'AST-0004',
    assetType: 'mobile',
    person: 'Rohan Iyer',
    issue: 'Cracked screen after a fall',
    priority: 'High',
    diagnosis: '',
    vendor: null,
    cost: null,
    covered: false,
    reportedOn: offsetDate(-1),
    backBy: null,
    completedOn: null,
    stage: 0,
    chased: false,
  },
  {
    id: 'rep-004',
    name: 'Dell 24 inch monitor',
    tag: 'AST-0009',
    assetType: 'monitor',
    person: 'Karthik Rao',
    issue: 'No display signal',
    priority: 'Normal',
    diagnosis: 'Faulty display cable and port.',
    vendor: null,
    cost: 1800,
    covered: false,
    reportedOn: offsetDate(-3),
    backBy: null,
    completedOn: null,
    stage: 1,
    chased: false,
  },
  {
    id: 'rep-005',
    name: 'Samsung Galaxy S23',
    tag: 'AST-0008',
    assetType: 'mobile',
    person: 'Neha Kulkarni',
    issue: 'Battery is swelling',
    priority: 'High',
    diagnosis: '',
    vendor: null,
    cost: null,
    covered: false,
    reportedOn: offsetDate(-1),
    backBy: null,
    completedOn: null,
    stage: 0,
    chased: false,
  },
  {
    id: 'rep-006',
    name: 'HP LaserJet Pro M404',
    tag: 'AST-0007',
    assetType: 'printer',
    person: 'Front Office',
    issue: 'Paper jam error',
    priority: 'Low',
    diagnosis: 'Worn pickup roller replaced.',
    vendor: 'PrintCare Solutions',
    cost: 1200,
    covered: false,
    reportedOn: offsetDate(-14),
    backBy: offsetDate(-7),
    completedOn: offsetDate(-7),
    stage: 3,
    chased: false,
  },
  {
    id: 'rep-007',
    name: 'Ergonomic Office Chair',
    tag: 'AST-0006',
    assetType: 'furniture',
    person: 'Ishaan Verma',
    issue: 'Broken armrest',
    priority: 'Low',
    diagnosis: 'Armrest bracket re-fitted.',
    vendor: 'In-house team',
    cost: 0,
    covered: false,
    reportedOn: offsetDate(-13),
    backBy: offsetDate(-9),
    completedOn: offsetDate(-9),
    stage: 3,
    chased: false,
  },
  {
    id: 'rep-008',
    name: 'Sony WH-1000XM4 headset',
    tag: 'AST-0011',
    assetType: 'headset',
    person: 'Ananya Das',
    issue: 'Left ear is not working',
    priority: 'Normal',
    diagnosis: 'Left driver has failed.',
    vendor: null,
    cost: 2400,
    covered: false,
    reportedOn: offsetDate(-4),
    backBy: null,
    completedOn: null,
    stage: 1,
    chased: false,
  },
];

// Vendors & Purchase page.

export type PurchaseAssetType =
  | 'laptop'
  | 'mobile'
  | 'monitor'
  | 'headset'
  | 'printer'
  | 'furniture';

export type PurchaseStatus = 'pending' | 'ordered' | 'received';

export type PurchaseFilter = 'all' | 'pending' | 'way' | 'received';

export interface PurchaseVendor {
  id: string;
  name: string;
  shortName: string;
  categories: string[];
  contact: string;
}

export interface PurchaseHistoryEntry {
  at: string;
  text: string;
}

export interface PurchaseOrder {
  id: string;
  vendorId: string;
  itemName: string;
  quantity: number;
  assetType: PurchaseAssetType;
  amount: number;
  dept: string;
  placedOn: string;
  expectedOn: string;
  status: PurchaseStatus;
  receivedOn: string | null;
  history: PurchaseHistoryEntry[];
}

export const purchaseFilterOptions: {
  label: string;
  value: PurchaseFilter;
}[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending approval', value: 'pending' },
  { label: 'On the way', value: 'way' },
  { label: 'Received', value: 'received' },
];

export const purchaseAssetTypeOptions = [
  { label: 'Laptop', value: 'laptop' },
  { label: 'Mobile', value: 'mobile' },
  { label: 'Monitor', value: 'monitor' },
  { label: 'Headset', value: 'headset' },
  { label: 'Printer', value: 'printer' },
  { label: 'Furniture', value: 'furniture' },
];

export const purchaseCategoryOptions = [
  { label: 'Laptops', value: 'Laptops' },
  { label: 'Mobiles', value: 'Mobiles' },
  { label: 'Monitors', value: 'Monitors' },
  { label: 'Headsets', value: 'Headsets' },
  { label: 'Printers', value: 'Printers' },
  { label: 'Furniture', value: 'Furniture' },
  { label: 'Repairs', value: 'Repairs' },
];

export const purchaseDepartmentOptions = [
  { label: 'Engineering', value: 'Engineering' },
  { label: 'Human Resources', value: 'Human Resources' },
  { label: 'Sales', value: 'Sales' },
  { label: 'Finance', value: 'Finance' },
  { label: 'Marketing', value: 'Marketing' },
  { label: 'Operations', value: 'Operations' },
  { label: 'Design', value: 'Design' },
  { label: 'Front Office', value: 'Front Office' },
];

export const initialPurchaseVendors: PurchaseVendor[] = [
  {
    id: 'ven-dell',
    name: 'Dell India Pvt Ltd',
    shortName: 'Dell India',
    categories: ['Laptops', 'Monitors'],
    contact: 'Rakesh Menon',
  },
  {
    id: 'ven-apple',
    name: 'Apple Authorised Reseller',
    shortName: 'Apple Reseller',
    categories: ['Laptops', 'Mobiles'],
    contact: 'Sana Qureshi',
  },
  {
    id: 'ven-croma',
    name: 'Croma Business',
    shortName: 'Croma',
    categories: ['Monitors', 'Headsets'],
    contact: 'Vivek Anand',
  },
  {
    id: 'ven-lenovo',
    name: 'Lenovo Exclusive Store',
    shortName: 'Lenovo Store',
    categories: ['Laptops'],
    contact: 'Deepa Nambiar',
  },
  {
    id: 'ven-ergo',
    name: 'Ergo Furniture Co.',
    shortName: 'Ergo Furniture',
    categories: ['Furniture'],
    contact: 'Manoj Kulkarni',
  },
  {
    id: 'ven-printcare',
    name: 'PrintCare Solutions',
    shortName: 'PrintCare',
    categories: ['Printers', 'Repairs'],
    contact: 'Latha Srinivas',
  },
];

export const initialPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'PO-2026-0048',
    vendorId: 'ven-ergo',
    itemName: 'Ergonomic Office Chair',
    quantity: 10,
    assetType: 'furniture',
    amount: 82000,
    dept: 'Operations',
    placedOn: offsetDate(-2),
    expectedOn: offsetDate(10),
    status: 'pending',
    receivedOn: null,
    history: [
      { at: offsetDate(-2), text: 'Order created, waiting for approval' },
    ],
  },
  {
    id: 'PO-2026-0047',
    vendorId: 'ven-dell',
    itemName: 'Dell Latitude 5440',
    quantity: 5,
    assetType: 'laptop',
    amount: 410000,
    dept: 'Engineering',
    placedOn: offsetDate(-4),
    expectedOn: offsetDate(8),
    status: 'pending',
    receivedOn: null,
    history: [
      { at: offsetDate(-4), text: 'Order created, waiting for approval' },
    ],
  },
  {
    id: 'PO-2026-0046',
    vendorId: 'ven-apple',
    itemName: 'iPhone 14',
    quantity: 2,
    assetType: 'mobile',
    amount: 138000,
    dept: 'Sales',
    placedOn: offsetDate(-9),
    expectedOn: offsetDate(-2),
    status: 'ordered',
    receivedOn: null,
    history: [
      { at: offsetDate(-9), text: 'Order created, waiting for approval' },
      { at: offsetDate(-8), text: 'Approved and sent to the vendor' },
    ],
  },
  {
    id: 'PO-2026-0045',
    vendorId: 'ven-croma',
    itemName: 'Dell 24 inch monitor',
    quantity: 8,
    assetType: 'monitor',
    amount: 112000,
    dept: 'Marketing',
    placedOn: offsetDate(-11),
    expectedOn: offsetDate(5),
    status: 'ordered',
    receivedOn: null,
    history: [
      { at: offsetDate(-11), text: 'Order created, waiting for approval' },
      { at: offsetDate(-10), text: 'Approved and sent to the vendor' },
    ],
  },
  {
    id: 'PO-2026-0044',
    vendorId: 'ven-lenovo',
    itemName: 'Lenovo ThinkPad T14',
    quantity: 3,
    assetType: 'laptop',
    amount: 270000,
    dept: 'Finance',
    placedOn: offsetDate(-16),
    expectedOn: offsetDate(2),
    status: 'ordered',
    receivedOn: null,
    history: [
      { at: offsetDate(-16), text: 'Order created, waiting for approval' },
      { at: offsetDate(-15), text: 'Approved and sent to the vendor' },
    ],
  },
  {
    id: 'PO-2026-0043',
    vendorId: 'ven-croma',
    itemName: 'Sony WH-1000XM4 headset',
    quantity: 4,
    assetType: 'headset',
    amount: 100000,
    dept: 'Design',
    placedOn: offsetDate(-24),
    expectedOn: offsetDate(-8),
    status: 'received',
    receivedOn: offsetDate(-8),
    history: [
      { at: offsetDate(-24), text: 'Order created, waiting for approval' },
      { at: offsetDate(-23), text: 'Approved and sent to the vendor' },
      { at: offsetDate(-8), text: 'Items received' },
    ],
  },
  {
    id: 'PO-2026-0042',
    vendorId: 'ven-printcare',
    itemName: 'HP LaserJet toner kits',
    quantity: 2,
    assetType: 'printer',
    amount: 14400,
    dept: 'Front Office',
    placedOn: offsetDate(-26),
    expectedOn: offsetDate(-19),
    status: 'received',
    receivedOn: offsetDate(-20),
    history: [
      { at: offsetDate(-26), text: 'Order created, waiting for approval' },
      { at: offsetDate(-25), text: 'Approved and sent to the vendor' },
      { at: offsetDate(-20), text: 'Items received' },
    ],
  },
  {
    id: 'PO-2026-0041',
    vendorId: 'ven-apple',
    itemName: 'MacBook Pro 14"',
    quantity: 1,
    assetType: 'laptop',
    amount: 189900,
    dept: 'Engineering',
    placedOn: offsetDate(-32),
    expectedOn: offsetDate(-22),
    status: 'received',
    receivedOn: offsetDate(-23),
    history: [
      { at: offsetDate(-32), text: 'Order created, waiting for approval' },
      { at: offsetDate(-31), text: 'Approved and sent to the vendor' },
      { at: offsetDate(-23), text: 'Items received' },
    ],
  },
];

export const assetReportRangeOptions: { value: string; label: string }[] = [
  { value: 'all', label: 'All time' },
  { value: 'month', label: 'This month' },
  { value: 'quarter', label: 'This quarter' },
  { value: 'year', label: 'This year' },
];

export const overtimeReportDateRangeOptions: DropdownOption[] = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'lastMonth', label: 'Last Month' },
  { value: 'custom', label: 'Custom' },
];

export const assetReportDepartmentOptions: { value: string; label: string }[] =
  [
    { value: 'all', label: 'All departments' },
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Sales', label: 'Sales' },
    { value: 'Operations', label: 'Operations' },
    { value: 'HR', label: 'HR' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Marketing', label: 'Marketing' },
  ];

export const assetReportCategoryOptions: { value: string; label: string }[] = [
  { value: 'all', label: 'All categories' },
  { value: 'Laptop', label: 'Laptops' },
  { value: 'Mobile phone', label: 'Mobile phones' },
  { value: 'Monitor', label: 'Monitors' },
  { value: 'Access card', label: 'Access cards' },
  { value: 'Other', label: 'Other' },
];

export const assetReportLocationOptions: { value: string; label: string }[] = [
  { value: 'all', label: 'All locations' },
  { value: 'Bengaluru HQ', label: 'Bengaluru HQ' },
  { value: 'Mumbai office', label: 'Mumbai office' },
  { value: 'Delhi office', label: 'Delhi office' },
];

export const assetReportFrequencyOptions: { value: string; label: string }[] = [
  { value: 'Weekly', label: 'Every week' },
  { value: 'Monthly', label: 'Every month' },
];

export const assetReportFormatOptions: { value: string; label: string }[] = [
  { value: 'PDF', label: 'PDF' },
  { value: 'Excel', label: 'Excel' },
];

export const assetReportScheduleOptions: { value: string; label: string }[] = [
  { value: 'full', label: 'Full report' },
  { value: 'register', label: 'Asset register' },
  { value: 'employee', label: 'Employee-wise assets' },
  { value: 'warranty', label: 'Warranty expiry' },
  { value: 'damage', label: 'Lost and damaged' },
  { value: 'maintenance', label: 'Repair and maintenance cost' },
  { value: 'audit', label: 'Physical audit' },
];

export const assetReportStatusChartOptions = [
  { value: 'allocated', label: 'With employees', color: 'blue' },
  { value: 'available', label: 'Available in stock', color: 'aqua' },
  { value: 'repair', label: 'Under repair', color: 'orange' },
  { value: 'retired', label: 'Lost or retired', color: 'yellow' },
] as const;

export const assetReportCategoryChartOptions = [
  { value: 'Laptop', label: 'Laptops', color: 'blue' },
  { value: 'Mobile phone', label: 'Mobile phones', color: 'orange' },
  { value: 'Monitor', label: 'Monitors', color: 'aqua' },
  { value: 'Access card', label: 'Access cards', color: 'yellow' },
  { value: 'Other', label: 'Other', color: 'pink' },
] as const;

// SHIFT SETTINGS:
export const shiftSettingsWeekDays: { value: string; label: string }[] = [
  { value: 'Mon', label: 'Monday' },
  { value: 'Tue', label: 'Tuesday' },
  { value: 'Wed', label: 'Wednesday' },
  { value: 'Thu', label: 'Thursday' },
  { value: 'Fri', label: 'Friday' },
  { value: 'Sat', label: 'Saturday' },
  { value: 'Sun', label: 'Sunday' },
];

export const shiftMasterColorOptions: DropdownOption[] = [
  { label: 'Primary', value: 'primary' },
  { label: 'Secondary', value: 'secondary' },
  { label: 'Accent', value: 'accent' },
  { label: 'Muted', value: 'muted' },
  { label: 'Destructive', value: 'destructive' },
];

export const shiftMasterFilterOptions: DropdownOption[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
];

export const shiftMasterTimeOptions: DropdownOption[] = Array.from(
  { length: 48 },
  (_, index) => {
    const hours = Math.floor(index / 2);
    const minutes = index % 2 === 0 ? '00' : '30';
    const hour12 = hours % 12 === 0 ? 12 : hours % 12;
    return {
      label: `${hour12}:${minutes} ${hours >= 12 ? 'PM' : 'AM'}`,
      value: `${String(hours).padStart(2, '0')}:${minutes}`,
    };
  }
);

export const shiftScheduleRepeatWeeksOptions: DropdownOption[] = [
  { label: '1 week (same every week)', value: '1' },
  { label: '2 weeks', value: '2' },
  { label: '3 weeks', value: '3' },
  { label: '4 weeks', value: '4' },
];

export const shiftScheduleDefaultShiftOptions: DropdownOption[] = [
  { label: 'General (9 AM – 6 PM)', value: 'G' },
  { label: 'Morning (6 AM – 2 PM)', value: 'M' },
  { label: 'Afternoon (2 PM – 10 PM)', value: 'A' },
  { label: 'Night (10 PM – 6 AM)', value: 'N' },
];

export const shiftWiseAttendanceDepartmentOptions: DropdownOption[] = [
  { label: 'All departments', value: 'all' },
];

export const shiftSettingsDefaultShiftOptions: DropdownOption[] = [
  { value: 'general', label: 'General shift (9:30 to 6:30)' },
  { value: 'morning', label: 'Morning shift (6:00 to 2:00)' },
  { value: 'afternoon', label: 'Afternoon shift (2:00 to 10:00)' },
  { value: 'night', label: 'Night shift (10:00 to 6:00)' },
];

export const shiftSettingsGraceTimeOptions: DropdownOption[] = [
  { value: '0', label: 'No grace time' },
  { value: '5', label: '5 minutes' },
  { value: '10', label: '10 minutes' },
  { value: '15', label: '15 minutes' },
  { value: '30', label: '30 minutes' },
];

export const shiftSettingsHalfDayOptions: DropdownOption[] = [
  { value: '3', label: 'Less than 3 hours' },
  { value: '4', label: 'Less than 4 hours' },
  { value: '5', label: 'Less than 5 hours' },
  { value: '6', label: 'Less than 6 hours' },
];

export const shiftSettingsSwapApproverOptions: DropdownOption[] = [
  { value: 'manager', label: 'Reporting manager' },
  { value: 'hr', label: 'HR team' },
];

export const shiftSettingsChangeNoticeOptions: DropdownOption[] = [
  { value: '0', label: 'No notice needed' },
  { value: '1', label: '1 day before' },
  { value: '2', label: '2 days before' },
  { value: '3', label: '3 days before' },
  { value: '7', label: '1 week before' },
];

export const shiftSettingsOvertimeStartOptions: DropdownOption[] = [
  { value: '0', label: 'Right after shift ends' },
  { value: '15', label: 'After 15 minutes' },
  { value: '30', label: 'After 30 minutes' },
  { value: '60', label: 'After 1 hour' },
];

export const shiftSettingsOvertimeLimitOptions: DropdownOption[] = [
  { value: '2', label: '2 hours a day' },
  { value: '3', label: '3 hours a day' },
  { value: '4', label: '4 hours a day' },
  { value: 'none', label: 'No limit' },
];

export const shiftSettingsReportRecipientOptions: DropdownOption[] = [
  { value: 'hr', label: 'HR team' },
  { value: 'managers', label: 'Managers' },
  { value: 'both', label: 'HR team and managers' },
];

// HELPDESK SETTINGS:
export const helpdeskDefaultPriorityOptions: DropdownOption[] = [
  { value: 'low', label: 'Low' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' },
];

export const helpdeskFirstResponseTimeOptions: DropdownOption[] = [
  { value: '4', label: 'Within 4 hours' },
  { value: '8', label: 'Within 8 hours' },
  { value: '24', label: 'Within 1 business day' },
];

export const helpdeskReportFrequencyOptions: DropdownOption[] = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

export const profileReminderFrequencyOptions: DropdownOption[] = [
  { value: 'weekly', label: 'Every week' },
  { value: 'every3days', label: 'Every 3 days' },
  { value: 'monthly', label: 'Every month' },
];

export const attendanceMonthOptions: DropdownOption[] = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

export const attendanceYearOptions: DropdownOption[] = [
  { value: '2025', label: '2025' },
  { value: '2026', label: '2026' },
  { value: '2027', label: '2027' },
];

export const employeeAttendanceMonthOptions: DropdownOption[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
].map((label, index) => ({ value: String(index + 1), label }));

export const employeeAttendanceYearOptions: DropdownOption[] = [
  { value: '2024', label: '2024' },
  { value: '2025', label: '2025' },
  { value: '2026', label: '2026' },
];

export const employeeAttendanceDepartmentOptions: DropdownOption[] = [
  { value: 'all', label: 'All departments' },
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Product', label: 'Product' },
  { value: 'Design', label: 'Design' },
  { value: 'Human Resources', label: 'Human Resources' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Sales', label: 'Sales' },
];

export const employeeAttendanceTimeOptions: DropdownOption[] = Array.from(
  { length: 25 },
  (_, index) => {
    const totalMinutes = 8 * 60 + index * 30;
    const hour = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const hour12 = hour % 12 || 12;

    return {
      value: `${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`,
      label: `${String(hour12).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${hour < 12 ? 'AM' : 'PM'}`,
    };
  }
);

export const attendanceSummaryBranchOptions: DropdownOption[] = [
  { value: 'Head Office', label: 'Head Office' },
  { value: 'Branch Office 1', label: 'Branch Office 1' },
  { value: 'Branch Office 2', label: 'Branch Office 2' },
  { value: 'City Branch', label: 'City Branch' },
];

export const attendanceSummaryBranchFilterOptions: DropdownOption[] = [
  { value: 'all', label: 'All branches' },
  ...attendanceSummaryBranchOptions,
];

export const attendanceCorrectionDesignationOptions: DropdownOption[] = [
  { value: 'Software Engineer', label: 'Software Engineer' },
  { value: 'Product Manager', label: 'Product Manager' },
  { value: 'UI/UX Designer', label: 'UI/UX Designer' },
  { value: 'HR Executive', label: 'HR Executive' },
];

export const attendanceCorrectionDesignationFilterOptions: DropdownOption[] = [
  { value: 'all', label: 'All designations' },
  ...attendanceCorrectionDesignationOptions,
];

export const monthlyMusterMonthOptions: DropdownOption[] = [
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

export const monthlyMusterYearOptions: DropdownOption[] = [
  { value: '2024', label: '2024' },
  { value: '2025', label: '2025' },
  { value: '2026', label: '2026' },
];

export const monthlyMusterBranchOptions: DropdownOption[] = [
  { value: 'Head Office', label: 'Head Office' },
  { value: 'Branch Office 1', label: 'Branch Office 1' },
  { value: 'Branch Office 2', label: 'Branch Office 2' },
];

export const monthlyMusterBranchFilterOptions: DropdownOption[] = [
  { value: 'all', label: 'All branches' },
  ...monthlyMusterBranchOptions,
];

export const monthlyMusterSortOptions: DropdownOption[] = [
  { value: 'name', label: 'Name' },
  { value: 'absent', label: 'Most absent' },
  { value: 'late', label: 'Most late' },
];

export const attendanceInsightsScopeOptions: DropdownOption[] = [
  { value: 'all', label: 'All employees' },
  { value: 'direct', label: 'My direct employees' },
];

export const attendanceInsightsGroupByOptions: DropdownOption[] = [
  { value: 'daily', label: 'Daily trend' },
  { value: 'designation', label: 'Designation' },
  { value: 'employeeType', label: 'Employee type' },
];

export const attendanceInsightsViewOptions: DropdownOption[] = [
  { value: 'count', label: 'Count' },
  { value: 'hours', label: 'Hours' },
];

export const goalsOkrsQuarterOptions: DropdownOption[] = [
  { value: 'Q1 2026', label: 'Q1 2026' },
  { value: 'Q2 2026', label: 'Q2 2026' },
  { value: 'Q3 2026', label: 'Q3 2026' },
  { value: 'Q4 2026', label: 'Q4 2026' },
  { value: 'Q1 2027', label: 'Q1 2027' },
];

export const goalsOkrsLevelOptions: DropdownOption[] = [
  { value: 'Company', label: 'Company' },
  { value: 'Department', label: 'Department' },
  { value: 'Team', label: 'Team' },
  { value: 'Individual', label: 'Individual' },
];

export const goalsOkrsLevelFilterOptions: DropdownOption[] = [
  { value: 'all', label: 'All levels' },
  ...goalsOkrsLevelOptions,
];

export const goalsOkrsStatusOptions: DropdownOption[] = [
  { value: 'On Track', label: 'On Track' },
  { value: 'At Risk', label: 'At Risk' },
  { value: 'Off Track', label: 'Off Track' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Not Started', label: 'Not Started' },
];

export const goalsOkrsStatusFilterOptions: DropdownOption[] = [
  { value: 'all', label: 'All statuses' },
  ...goalsOkrsStatusOptions,
];

export const goalsOkrsSortOptions: DropdownOption[] = [
  { value: 'due', label: 'Due date' },
  { value: 'progress-desc', label: 'Progress: high to low' },
  { value: 'progress-asc', label: 'Progress: low to high' },
  { value: 'risk', label: 'Needs attention first' },
];

export const performanceReviewCycleOptions: DropdownOption[] = [
  { value: 'Q2 2026', label: 'Q2 2026' },
  { value: 'Q3 2026', label: 'Q3 2026' },
  { value: 'Q4 2026', label: 'Q4 2026' },
  { value: 'Annual 2026', label: 'Annual 2026' },
];

export const performanceReviewStageOptions: DropdownOption[] = [
  { value: 'Draft', label: 'Draft' },
  { value: 'Pending Self', label: 'Pending Self' },
  { value: 'Pending Manager', label: 'Pending Manager' },
  { value: 'Pending Calibration', label: 'Pending Calibration' },
  { value: 'Completed', label: 'Completed' },
];

export const performanceReviewStatusOptions: DropdownOption[] = [
  ...performanceReviewStageOptions,
  { value: 'Overdue', label: 'Overdue' },
];

export const performanceReviewStatusFilterOptions: DropdownOption[] = [
  { value: 'all', label: 'All statuses' },
  ...performanceReviewStatusOptions,
];

export const performanceReviewDepartmentOptions: DropdownOption[] = [
  { value: 'Engineering & Delivery', label: 'Engineering & Delivery' },
  {
    value: 'Digital Strategy & Marketing',
    label: 'Digital Strategy & Marketing',
  },
  { value: 'Business Growth', label: 'Business Growth' },
  { value: 'Customer Success', label: 'Customer Success' },
  { value: 'Finance', label: 'Finance' },
  { value: 'People & Culture', label: 'People & Culture' },
];

export const performanceReviewDepartmentFilterOptions: DropdownOption[] = [
  { value: 'all', label: 'All departments' },
  ...performanceReviewDepartmentOptions,
];

export const performanceReviewSortOptions: DropdownOption[] = [
  { value: 'due', label: 'Due date' },
  { value: 'attention', label: 'Needs attention first' },
  { value: 'rating', label: 'Rating: high to low' },
  { value: 'name', label: 'Employee name' },
];

export const oneOnOneEmployeeOptions: DropdownOption[] = [
  { value: 'Lucas Bergström', label: 'Lucas Bergström' },
  { value: 'Mateo Alvarez', label: 'Mateo Alvarez' },
  { value: 'Emma Lindqvist', label: 'Emma Lindqvist' },
  { value: 'Olivia Chen', label: 'Olivia Chen' },
  { value: 'Kenji Nakamura', label: 'Kenji Nakamura' },
  { value: 'Noah Fischer', label: 'Noah Fischer' },
  { value: 'Camila Fernández', label: 'Camila Fernández' },
  { value: 'Amara Okonkwo', label: 'Amara Okonkwo' },
];

export const oneOnOneEmployeeFilterOptions: DropdownOption[] = [
  { value: 'all', label: 'All employees' },
  ...oneOnOneEmployeeOptions,
];

export const oneOnOneSentimentOptions: DropdownOption[] = [
  { value: 'Positive', label: 'Positive' },
  { value: 'Neutral', label: 'Neutral' },
  { value: 'Needs Attention', label: 'Needs Attention' },
];

export const oneOnOneSentimentFilterOptions: DropdownOption[] = [
  { value: 'all', label: 'All sentiments' },
  ...oneOnOneSentimentOptions,
];

export const oneOnOneCategoryOptions: DropdownOption[] = [
  { value: 'Career', label: 'Career' },
  { value: 'Performance', label: 'Performance' },
  { value: 'Wellbeing', label: 'Wellbeing' },
  { value: 'Feedback', label: 'Feedback' },
  { value: 'Growth', label: 'Growth' },
  { value: 'Blockers', label: 'Blockers' },
];

export const oneOnOneCategoryFilterOptions: DropdownOption[] = [
  { value: 'all', label: 'All categories' },
  ...oneOnOneCategoryOptions,
];

export const feedbackTypeOptions: DropdownOption[] = [
  { value: 'Praise', label: 'Praise' },
  { value: 'Constructive', label: 'Constructive' },
  { value: 'Recognition', label: 'Recognition' },
  { value: 'Peer', label: 'Peer' },
  { value: 'Upward', label: 'Upward' },
  { value: 'Self', label: 'Self' },
];

export const feedbackTypeFilterOptions: DropdownOption[] = [
  { value: 'all', label: 'All types' },
  ...feedbackTypeOptions,
];

export const feedbackTagOptions: DropdownOption[] = [
  'Ownership',
  'Quality',
  'Problem Solving',
  'Results',
  'Creativity',
  'Client Impact',
  'Perseverance',
  'Growth Area',
  'Design',
  'Teamwork',
  'Attention to Detail',
  'Leadership',
  'Communication',
  'Collaboration',
  'Impact',
  'Data Craft',
].map(tag => ({ value: tag, label: tag }));

export const feedbackTagFilterOptions: DropdownOption[] = [
  { value: 'all', label: 'All tags' },
  ...feedbackTagOptions,
];

export const talentDepartmentOptions: DropdownOption[] = [
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Product', label: 'Product' },
  { value: 'Data & AI', label: 'Data & AI' },
  { value: 'Design', label: 'Design' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Customer Success', label: 'Customer Success' },
  { value: 'Sales', label: 'Sales' },
  { value: 'People & Culture', label: 'People & Culture' },
];

export const talentDepartmentFilterOptions: DropdownOption[] = [
  { value: 'all', label: 'All departments' },
  ...talentDepartmentOptions,
];

export const talentBoxOptions: DropdownOption[] = [
  { value: 'Star', label: 'Star' },
  { value: 'High Potential', label: 'High Potential' },
  { value: 'Core Player', label: 'Core Player' },
  { value: 'Solid Performer', label: 'Solid Performer' },
  { value: 'Workhorse', label: 'Workhorse' },
];

export const talentBoxFilterOptions: DropdownOption[] = [
  { value: 'all', label: 'All boxes' },
  ...talentBoxOptions,
];

export const talentReadinessOptions: DropdownOption[] = [
  { value: 'Ready Now', label: 'Ready Now' },
  { value: 'Ready in 1-2 yrs', label: 'Ready in 1-2 yrs' },
  { value: 'Ready in 3+ yrs', label: 'Ready in 3+ yrs' },
  { value: 'Not Ready', label: 'Not Ready' },
];

export const talentReadinessFilterOptions: DropdownOption[] = [
  { value: 'all', label: 'All readiness' },
  ...talentReadinessOptions,
];

export const calibrationDepartmentOptions: DropdownOption[] = [
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Business Growth', label: 'Business Growth' },
  { value: 'People & Culture', label: 'People & Culture' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Data & AI', label: 'Data & AI' },
];

export const calibrationDepartmentFilterOptions: DropdownOption[] = [
  { value: 'all', label: 'All departments' },
  ...calibrationDepartmentOptions,
];

export const calibrationStatusOptions: DropdownOption[] = [
  { value: 'Not Started', label: 'Not Started' },
  { value: 'In Review', label: 'In Review' },
  { value: 'Calibrated', label: 'Calibrated' },
  { value: 'Locked', label: 'Locked' },
];

export const calibrationStatusFilterOptions: DropdownOption[] = [
  { value: 'all', label: 'All statuses' },
  ...calibrationStatusOptions,
];

export const calibrationBandOptions: DropdownOption[] = [
  { value: '0%', label: '0%' },
  { value: '3%', label: '3%' },
  { value: '5%', label: '5%' },
  { value: '8%', label: '8%' },
  { value: '12%', label: '12%' },
  { value: '15%+', label: '15%+' },
  { value: 'Promotion', label: 'Promotion' },
];

export const calibrationBandFilterOptions: DropdownOption[] = [
  { value: 'all', label: 'All bands' },
  ...calibrationBandOptions,
];

export const calibrationSortOptions: DropdownOption[] = [
  { value: 'name', label: 'Employee name' },
  { value: 'pct', label: 'Increment: high to low' },
  { value: 'ctc', label: 'New CTC: high to low' },
  { value: 'status', label: 'Status' },
];

export const calibrationBulkModeOptions: DropdownOption[] = [
  { value: 'guideline', label: 'Reset to the guideline for each rating' },
  { value: 'set', label: 'Set everyone to a fixed %' },
  { value: 'add', label: 'Add or subtract percentage points' },
];

export const attendanceSummaryEmployeeFilterOptions: DropdownOption[] = [
  { value: 'all', label: 'All employees' },
  { value: 'my-direct', label: 'My direct employees' },
];

export const attendanceSummaryComparisonOptions: DropdownOption[] = [
  { value: 'team', label: 'Team only' },
  { value: 'compare', label: 'Compare employee' },
];

export const attendanceRegularizationTypeOptions: DropdownOption[] = [
  { value: 'Missed Punch', label: 'Missed Punch' },
  { value: 'Late Arrival', label: 'Late Arrival' },
  { value: 'Early Departure', label: 'Early Departure' },
  { value: 'Other', label: 'Other' },
];

export const attendanceOnDutyTypeOptions: DropdownOption[] = [
  { value: 'Client Visit', label: 'Client Visit' },
  { value: 'Field Work', label: 'Field Work' },
  { value: 'Training', label: 'Training' },
  { value: 'Other', label: 'Other' },
];

export const attendanceOnDutyLocationOptions: DropdownOption[] = [
  { value: 'Head Office (HQ)', label: 'Head Office (HQ)' },
  { value: 'Branch Office 1', label: 'Branch Office 1' },
  { value: 'Client Site A', label: 'Client Site A' },
];

export const attendanceWorkFromHomeTypeOptions: DropdownOption[] = [
  { value: 'Full Day', label: 'Full Day' },
  { value: 'Half Day', label: 'Half Day' },
  { value: 'Multiple Days', label: 'Multiple Days' },
];

export const attendanceLeaveTypeOptions: DropdownOption[] = [
  { value: 'Sick Leave', label: 'Sick Leave' },
  { value: 'Casual Leave', label: 'Casual Leave' },
  { value: 'Earned Leave', label: 'Earned Leave' },
  { value: 'Maternity Leave', label: 'Maternity Leave' },
  { value: 'Unpaid Leave', label: 'Unpaid Leave' },
];

export const attendanceNotifyEmployeeOptions: DropdownOption[] = [
  { value: 'Reporting Manager', label: 'Reporting Manager' },
  { value: 'HR Department', label: 'HR Department' },
  { value: 'Team Members', label: 'Team Members' },
];

export const leaveMonthFilterOptions: DropdownOption[] = [
  { value: 'all', label: 'All months' },
  ...attendanceMonthOptions,
];

export const leaveYearFilterOptions: DropdownOption[] = [
  { value: 'all', label: 'All years' },
  { value: '2026', label: '2026' },
  { value: '2025', label: '2025' },
];

export const leaveStatusFilterOptions: DropdownOption[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Rejected', label: 'Rejected' },
  { value: 'Pending', label: 'Pending' },
];

export const payslipFinancialYearOptions: DropdownOption[] = [
  { value: '2026-27', label: 'FY 2026-27' },
  { value: '2025-26', label: 'FY 2025-26' },
];

export const employeeDirectoryDepartmentOptions: DropdownOption[] = [
  { value: 'Route Intelligence', label: 'Route Intelligence' },
  { value: 'Data & Trust', label: 'Data & Trust' },
  { value: 'Enterprise Sales', label: 'Enterprise Sales' },
  { value: 'Brand & Demand', label: 'Brand & Demand' },
  { value: 'Hub Operations', label: 'Hub Operations' },
  { value: 'People & Culture', label: 'People & Culture' },
];

export const employeeDirectoryDepartmentFilterOptions: DropdownOption[] = [
  { value: 'all', label: 'All departments' },
  ...employeeDirectoryDepartmentOptions,
];

export const employeeDirectoryLocationOptions: DropdownOption[] = [
  { value: 'Pune', label: 'Pune' },
  { value: 'Bangalore', label: 'Bangalore' },
  { value: 'Mumbai', label: 'Mumbai' },
  { value: 'Delhi', label: 'Delhi' },
  { value: 'Remote', label: 'Remote' },
];

export const employeeDirectoryLocationFilterOptions: DropdownOption[] = [
  { value: 'all', label: 'All locations' },
  ...employeeDirectoryLocationOptions,
];

export const employeeDirectoryManagerOptions: DropdownOption[] = [
  { value: 'Ishaan Verma', label: 'Ishaan Verma' },
  { value: 'Tanvi Kulkarni', label: 'Tanvi Kulkarni' },
  { value: 'Rohan Bhatt', label: 'Rohan Bhatt' },
  { value: 'Zoya Qureshi', label: 'Zoya Qureshi' },
  { value: 'Dev Patil', label: 'Dev Patil' },
  { value: 'Samar Joshi', label: 'Samar Joshi' },
];

export const employeeDirectoryManagerFilterOptions: DropdownOption[] = [
  { value: 'all', label: 'All managers' },
  ...employeeDirectoryManagerOptions,
];

export const employeeDirectorySortOptions: DropdownOption[] = [
  { value: 'name', label: 'A to Z' },
  { value: 'newest', label: 'Newest hires' },
  { value: 'oldest', label: 'Longest tenure' },
];

export type ExitStage =
  | 'resignation'
  | 'notice'
  | 'clearance'
  | 'settlement'
  | 'exited';
export type ClearanceItemId =
  | 'assets'
  | 'idCard'
  | 'handover'
  | 'manager'
  | 'finance';

export interface ExitSettlement {
  salaryDue: number;
  leaveEncashment: number;
  bonus: number;
  noticeShortfall: number;
  assetRecovery: number;
}

export interface ExitRecord {
  id: string;
  name: string;
  department: string;
  position: string;
  reason: string;
  resignedOn: string;
  lastWorkingDay: string;
  stage: ExitStage;
  clearance: Record<ClearanceItemId, boolean>;
  settlement: ExitSettlement;
  exitedOn: string | null;
  finalAmount: number | null;
  paymentMode: string | null;
}

export const exitDepartmentOptions: DropdownOption[] = [
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Sales', label: 'Sales' },
  { value: 'Operations', label: 'Operations' },
  { value: 'HR', label: 'HR' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Marketing', label: 'Marketing' },
];

export const exitReasonOptions: DropdownOption[] = [
  { value: 'Better opportunity', label: 'Better opportunity' },
  { value: 'Higher studies', label: 'Higher studies' },
  { value: 'Personal reasons', label: 'Personal reasons' },
  { value: 'Relocation', label: 'Relocation' },
  { value: 'Health reasons', label: 'Health reasons' },
  { value: 'Other', label: 'Other' },
];

export const exitDecisionOptions: DropdownOption[] = [
  { value: 'accept', label: 'Accept the resignation' },
  { value: 'decline', label: 'Decline and ask them to stay' },
];

export const exitPaymentModeOptions: DropdownOption[] = [
  { value: 'Bank transfer', label: 'Bank transfer' },
  { value: 'Cheque', label: 'Cheque' },
];

export const exitProgressFilterOptions: DropdownOption[] = [
  { value: 'all', label: 'All steps' },
  { value: 'notice', label: 'Notice period' },
  { value: 'clearance', label: 'Clearance' },
];

export const exitClearanceItems: {
  id: ClearanceItemId;
  label: string;
  shortLabel: string;
  owner: string;
}[] = [
  {
    id: 'assets',
    label: 'Laptop and other assets returned',
    shortLabel: 'Assets not returned',
    owner: 'IT team',
  },
  {
    id: 'idCard',
    label: 'ID card and access card returned',
    shortLabel: 'ID card not returned',
    owner: 'Admin team',
  },
  {
    id: 'handover',
    label: 'Work handover completed',
    shortLabel: 'Handover pending',
    owner: 'Reporting manager',
  },
  {
    id: 'manager',
    label: 'Manager sign-off',
    shortLabel: 'Manager sign-off pending',
    owner: 'Reporting manager',
  },
  {
    id: 'finance',
    label: 'No pending advances or dues',
    shortLabel: 'Dues pending',
    owner: 'Finance team',
  },
];

const noClearance = (): Record<ClearanceItemId, boolean> => ({
  assets: false,
  idCard: false,
  handover: false,
  manager: false,
  finance: false,
});
const fullClearance = (): Record<ClearanceItemId, boolean> => ({
  assets: true,
  idCard: true,
  handover: true,
  manager: true,
  finance: true,
});
const clearanceWith = (
  doneIds: ClearanceItemId[]
): Record<ClearanceItemId, boolean> => {
  const items = noClearance();
  doneIds.forEach(id => {
    items[id] = true;
  });
  return items;
};

export const getSettlementNet = (settlement: ExitSettlement) =>
  settlement.salaryDue +
  settlement.leaveEncashment +
  settlement.bonus -
  settlement.noticeShortfall -
  settlement.assetRecovery;

const firstNames = [
  'Aditya',
  'Bhavna',
  'Chirag',
  'Deepa',
  'Eshan',
  'Fatima',
  'Girish',
  'Hema',
  'Ishaan',
  'Jaya',
  'Kunal',
  'Lata',
  'Manish',
  'Nandini',
  'Omkar',
  'Pallavi',
  'Qasim',
  'Ritika',
  'Suresh',
  'Tara',
];
const lastNames = [
  'Agarwal',
  'Bose',
  'Chopra',
  'Dutta',
  'Fernandes',
  'Ghosh',
  'Hegde',
  'Iyengar',
  'Jain',
  'Kapoor',
  'Lal',
  'Mishra',
  'Naidu',
  'Oberoi',
  'Pandey',
  'Qureshi',
  'Rastogi',
  'Saxena',
  'Trivedi',
  'Upadhyay',
];
const departments = exitDepartmentOptions.map(option => option.value);
const positions: Record<string, string[]> = {
  Engineering: ['Software Developer', 'QA Engineer', 'DevOps Engineer'],
  Sales: ['Sales Executive', 'Account Manager'],
  Operations: ['Operations Executive', 'Team Lead'],
  HR: ['HR Executive', 'Recruiter'],
  Finance: ['Accountant', 'Finance Analyst'],
  Marketing: ['Marketing Executive', 'Content Writer'],
};
const reasons = exitReasonOptions.map(option => option.value);

const generatedPerson = (index: number) => {
  const department = departments[index % departments.length];
  const roles = positions[department];
  return {
    name: `${firstNames[index % 20]} ${lastNames[(index * 3 + Math.floor(index / 20)) % 20]}`,
    department,
    position: roles[index % roles.length],
    reason: reasons[index % reasons.length],
  };
};

const roundToHundred = (amount: number) => Math.round(amount / 100) * 100;

// Payroll's estimate for people who have not been paid yet.
const sampleSettlement = (seed: number): ExitSettlement => ({
  salaryDue: roundToHundred(40000 + ((seed * 9100) % 80000)),
  leaveEncashment: roundToHundred(10000 + ((seed * 4700) % 40000)),
  bonus: 0,
  noticeShortfall: 0,
  assetRecovery: 0,
});

const buildExitRecords = (): ExitRecord[] => {
  const records: ExitRecord[] = [];
  let counter = 0;
  const push = (
    person: {
      name: string;
      department: string;
      position: string;
      reason: string;
    },
    values: Partial<ExitRecord> &
      Pick<ExitRecord, 'stage' | 'resignedOn' | 'lastWorkingDay'>
  ) => {
    counter += 1;
    records.push({
      id: `EXIT-${String(counter).padStart(4, '0')}`,
      ...person,
      clearance: noClearance(),
      settlement: sampleSettlement(counter),
      exitedOn: null,
      finalAmount: null,
      paymentMode: null,
      ...values,
    });
  };

  // 3 resignations waiting for the employer
  push(
    {
      name: 'Imran Sheikh',
      department: 'Marketing',
      position: 'Marketing Executive',
      reason: 'Better opportunity',
    },
    {
      stage: 'resignation',
      resignedOn: offsetDate(-2),
      lastWorkingDay: offsetDate(28),
    }
  );
  push(
    {
      name: 'Nisha Verma',
      department: 'Sales',
      position: 'Account Manager',
      reason: 'Higher studies',
    },
    {
      stage: 'resignation',
      resignedOn: offsetDate(-1),
      lastWorkingDay: offsetDate(33),
    }
  );
  push(
    {
      name: 'Gautam Nair',
      department: 'Engineering',
      position: 'Software Developer',
      reason: 'Relocation',
    },
    {
      stage: 'resignation',
      resignedOn: offsetDate(0),
      lastWorkingDay: offsetDate(38),
    }
  );

  // 4 final payments ready to approve
  const readyToPay: [string, string, string, number, ExitSettlement][] = [
    [
      'Tanvi Desai',
      'HR',
      'HR Executive',
      2,
      {
        salaryDue: 62000,
        leaveEncashment: 28300,
        bonus: 10000,
        noticeShortfall: 0,
        assetRecovery: 2000,
      },
    ],
    [
      'Aarav Joshi',
      'Engineering',
      'Software Developer',
      7,
      {
        salaryDue: 140000,
        leaveEncashment: 72500,
        bonus: 40000,
        noticeShortfall: 6000,
        assetRecovery: 0,
      },
    ],
    [
      'Priyanka Das',
      'Finance',
      'Finance Analyst',
      8,
      {
        salaryDue: 105000,
        leaveEncashment: 58400,
        bonus: 30000,
        noticeShortfall: 6000,
        assetRecovery: 0,
      },
    ],
    [
      'Farhan Ali',
      'Operations',
      'Team Lead',
      10,
      {
        salaryDue: 145000,
        leaveEncashment: 70100,
        bonus: 40000,
        noticeShortfall: 5000,
        assetRecovery: 0,
      },
    ],
  ];
  readyToPay.forEach(
    ([name, department, position, daysLeft, settlement], index) => {
      push(
        { name, department, position, reason: reasons[index % reasons.length] },
        {
          stage: 'settlement',
          resignedOn: offsetDate(daysLeft - 60),
          lastWorkingDay: offsetDate(daysLeft),
          clearance: fullClearance(),
          settlement,
        }
      );
    }
  );

  // 6 in clearance
  push(
    {
      name: 'Meera Pillai',
      department: 'Sales',
      position: 'Sales Executive',
      reason: 'Personal reasons',
    },
    {
      stage: 'clearance',
      resignedOn: offsetDate(-46),
      lastWorkingDay: offsetDate(14),
      clearance: clearanceWith(['idCard', 'handover', 'manager', 'finance']),
    }
  );
  push(
    {
      name: 'Kavya Menon',
      department: 'Finance',
      position: 'Accountant',
      reason: 'Better opportunity',
    },
    {
      stage: 'clearance',
      resignedOn: offsetDate(-55),
      lastWorkingDay: offsetDate(5),
      clearance: clearanceWith(['assets', 'idCard', 'handover', 'finance']),
    }
  );
  for (let index = 0; index < 4; index += 1) {
    const ids: ClearanceItemId[][] = [
      ['assets', 'idCard'],
      ['handover'],
      ['assets', 'idCard', 'handover'],
      ['manager', 'finance'],
    ];
    push(generatedPerson(index), {
      stage: 'clearance',
      resignedOn: offsetDate(-50 - index),
      lastWorkingDay: offsetDate(3 + index * 2),
      clearance: clearanceWith(ids[index]),
    });
  }

  // 11 serving notice
  push(
    {
      name: 'Sandeep Rao',
      department: 'Operations',
      position: 'Operations Executive',
      reason: 'Higher studies',
    },
    {
      stage: 'notice',
      resignedOn: offsetDate(-37),
      lastWorkingDay: offsetDate(23),
    }
  );
  push(
    {
      name: 'Rahul Bhatt',
      department: 'Engineering',
      position: 'DevOps Engineer',
      reason: 'Better opportunity',
    },
    {
      stage: 'notice',
      resignedOn: offsetDate(-10),
      lastWorkingDay: offsetDate(50),
    }
  );
  for (let index = 0; index < 9; index += 1) {
    push(generatedPerson(4 + index), {
      stage: 'notice',
      resignedOn: offsetDate(-5 - index * 3),
      lastWorkingDay: offsetDate(15 + index * 7),
    });
  }

  // 23 who already left
  for (let index = 0; index < 23; index += 1) {
    const lastDay = -(5 + index * 14);
    const salaryDue = roundToHundred(45000 + ((index * 7300) % 90000));
    const leaveEncashment = roundToHundred(12000 + ((index * 5100) % 60000));
    const settlement: ExitSettlement = {
      salaryDue,
      leaveEncashment,
      bonus: index % 3 === 0 ? 10000 : 0,
      noticeShortfall: index % 5 === 0 ? 4000 : 0,
      assetRecovery: 0,
    };
    push(generatedPerson(13 + index), {
      stage: 'exited',
      resignedOn: offsetDate(lastDay - 60),
      lastWorkingDay: offsetDate(lastDay),
      clearance: fullClearance(),
      settlement,
      exitedOn: offsetDate(lastDay + 3),
      finalAmount: getSettlementNet(settlement),
      paymentMode: index % 4 === 0 ? 'Cheque' : 'Bank transfer',
    });
  }

  return records;
};

export const initialExitRecords: ExitRecord[] = buildExitRecords();

export const approvalDecisionOptions: DropdownOption[] = [
  { value: 'approve', label: 'Approve' },
  { value: 'reject', label: 'Reject' },
];

export const offboardingDepartmentOptions: DropdownOption[] = [
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Design', label: 'Design' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Sales', label: 'Sales' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Human Resources', label: 'Human Resources' },
  { value: 'Support', label: 'Support' },
];

export const offboardingReasonOptions: DropdownOption[] = [
  { value: 'Better opportunity', label: 'Better opportunity' },
  { value: 'Higher studies', label: 'Higher studies' },
  { value: 'Relocation', label: 'Relocation' },
  { value: 'Personal reasons', label: 'Personal reasons' },
  { value: 'Contract ended', label: 'Contract ended' },
  { value: 'Other', label: 'Other' },
];

export const assetIssueOptions: DropdownOption[] = [
  { value: 'not_working', label: 'It is not working' },
  { value: 'damaged', label: 'It is damaged' },
  { value: 'lost', label: 'It is lost or stolen' },
  { value: 'other', label: 'Something else' },
];

export const claimCategories = [
  { value: 'Travel', label: 'Travel' },
  { value: 'Utilities', label: 'Utilities' },
  { value: 'Medical', label: 'Medical' },
  { value: 'Meals', label: 'Meals' },
  { value: 'Other', label: 'Other' },
];
