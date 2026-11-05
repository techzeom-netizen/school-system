// Company Types
export const COMPANY_TYPES = [
  { value: 'bank', label: 'Bank' },
  { value: 'credit_union', label: 'Credit Union' },
  { value: 'cooperative', label: 'Cooperative Society' },
  { value: 'nbfc', label: 'Non-Banking Financial Company' },
  { value: 'fintech', label: 'Fintech Company' },
] as const;

// Business Types
export const BUSINESS_TYPES = [
  { value: 'private_limited', label: 'Private Limited' },
  { value: 'public_limited', label: 'Public Limited' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'llp', label: 'Limited Liability Partnership' },
  { value: 'sole_proprietorship', label: 'Sole Proprietorship' },
  { value: 'trust', label: 'Trust' },
  { value: 'society', label: 'Society' },
] as const;

// Industries
export const INDUSTRIES = [
  { value: 'banking', label: 'Banking & Financial Services' },
  { value: 'agriculture', label: 'Agriculture & Rural Development' },
  { value: 'microfinance', label: 'Microfinance' },
  { value: 'cooperative', label: 'Cooperative Banking' },
  { value: 'credit_union', label: 'Credit Union' },
  { value: 'fintech', label: 'Financial Technology' },
] as const;

// Company Status
export const COMPANY_STATUS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'pending_verification', label: 'Pending Verification' },
] as const;

// Admin Roles
export const ADMIN_ROLES = [{ value: 'admin', label: 'Admin' }] as const;

// Admin Status
export const ADMIN_STATUS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'pending_activation', label: 'Pending Activation' },
] as const;

// Countries
export const COUNTRIES = [{ value: 'IN', label: 'India' }] as const;

// Indian States
export const INDIAN_STATES = [
  { value: 'AN', label: 'Andaman and Nicobar Islands' },
  { value: 'AP', label: 'Andhra Pradesh' },
  { value: 'AR', label: 'Arunachal Pradesh' },
  { value: 'AS', label: 'Assam' },
  { value: 'BR', label: 'Bihar' },
  { value: 'CH', label: 'Chandigarh' },
  { value: 'CT', label: 'Chhattisgarh' },
  { value: 'DN', label: 'Dadra and Nagar Haveli' },
  { value: 'DD', label: 'Daman and Diu' },
  { value: 'DL', label: 'Delhi' },
  { value: 'GA', label: 'Goa' },
  { value: 'GJ', label: 'Gujarat' },
  { value: 'HR', label: 'Haryana' },
  { value: 'HP', label: 'Himachal Pradesh' },
  { value: 'JK', label: 'Jammu and Kashmir' },
  { value: 'JH', label: 'Jharkhand' },
  { value: 'KA', label: 'Karnataka' },
  { value: 'KL', label: 'Kerala' },
  { value: 'LD', label: 'Lakshadweep' },
  { value: 'MP', label: 'Madhya Pradesh' },
  { value: 'MH', label: 'Maharashtra' },
  { value: 'MN', label: 'Manipur' },
  { value: 'ML', label: 'Meghalaya' },
  { value: 'MZ', label: 'Mizoram' },
  { value: 'NL', label: 'Nagaland' },
  { value: 'OR', label: 'Odisha' },
  { value: 'PY', label: 'Puducherry' },
  { value: 'PB', label: 'Punjab' },
  { value: 'RJ', label: 'Rajasthan' },
  { value: 'SK', label: 'Sikkim' },
  { value: 'TN', label: 'Tamil Nadu' },
  { value: 'TG', label: 'Telangana' },
  { value: 'TR', label: 'Tripura' },
  { value: 'UP', label: 'Uttar Pradesh' },
  { value: 'UT', label: 'Uttarakhand' },
  { value: 'WB', label: 'West Bengal' },
] as const;

// Theme Options
export const THEME_OPTIONS = [
  { value: 'blue', label: 'Blue', color: '#3b82f6' },
  { value: 'green', label: 'Green', color: '#10b981' },
  { value: 'purple', label: 'Purple', color: '#8b5cf6' },
  { value: 'red', label: 'Red', color: '#ef4444' },
  { value: 'orange', label: 'Orange', color: '#f97316' },
  { value: 'teal', label: 'Teal', color: '#14b8a6' },
] as const;

// Font Family Options
export const FONT_FAMILIES = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Montserrat', label: 'Montserrat' },
] as const;

// Type definitions for better TypeScript support
export type CompanyType = (typeof COMPANY_TYPES)[number]['value'];
export type BusinessType = (typeof BUSINESS_TYPES)[number]['value'];
export type Industry = (typeof INDUSTRIES)[number]['value'];
export type CompanyStatus = (typeof COMPANY_STATUS)[number]['value'];
export type AdminRole = (typeof ADMIN_ROLES)[number]['value'];
export type AdminStatus = (typeof ADMIN_STATUS)[number]['value'];
export type Country = (typeof COUNTRIES)[number]['value'];
export type IndianState = (typeof INDIAN_STATES)[number]['value'];
export type ThemeOption = (typeof THEME_OPTIONS)[number]['value'];
export type FontFamily = (typeof FONT_FAMILIES)[number]['value'];

// {
//     "id": 746,
//     "branch_id": null,
//     "branch_code": "SWMC-006",
//     "emp_id": null,
//     "company_code": "COM-002",
//     "name": "PUNE",
//     "email": "SWMC-006",
//     "member_id": null,
//     "society_id": null,
//     "email_verified_at": null,
//     "password": "$2y$12$EALiXOM2mIUAuKwWzt4TduVxxFVfEawn/AYJWbsMImjS2Tbp5Zwtm",
//     "vaccount": null,
//     "vaccountifsc": null,
//     "wallet": "0.00",
//     "created_at": "2025-07-29T09:18:20.000000Z",
//     "updated_at": "2025-07-29T09:18:20.000000Z",
//     "login_time": "2025-07-29 14:48:20",
//     "logout_time": "2025-07-29 14:48:20",
//     "role_id": "2",
//     "lock": "active",
//     "date_lock": "lock",
//     "company": {
//         "id": 2,
//         "company_name": "SANGAMAM WOMEN S MULTIPURPOSE THRIFT AND CREDIT COOPERATIVE SOCIETY LTD",
//         "company_code": "COM-002",
//         "short_name": "SANGAMAM COOP SOCIETY",
//         "about_company": "SANGAMAM WOMEN S MULTIPURPOSE THRIFT AND CREDIT COOPERATIVE SOCIETY",
//         "address_line1": "K K NAGAR",
//         "address_line2": "80 ft ROAD",
//         "city": "MADURAI",
//         "state": "TAMILNADU",
//         "pincode": "625020",
//         "country": "India",
//         "mobile_no": "8951299954",
//         "cin_no": "U70109DL2021PTC123456",
//         "landline_no": "04522962",
//         "email": "info@sangmamcoop.com",
//         "pan_no": "AAFTS1506E",
//         "tan_no": "GHUE443219",
//         "gst_no": "GHUIOWNNEU",
//         "company_category": "Public",
//         "company_class": "Limited",
//         "ifsc_code": "SBIN0014203",
//         "micr_code": null,
//         "incorporation_date": "2004-09-23",
//         "authorized_capital": "5000000.00",
//         "promoter_count": 7,
//         "paid_up_capital": "10000000.00",
//         "added_capital": "0.00",
//         "min_members": 50000,
//         "share_operation_type": "New",
//         "net_owned_funds_ratio": "50000.00",
//         "unencumbered_deposits_percentage": "2.00",
//         "website": "app.sangamamcoop.com",
//         "status": "1",
//         "sender_id": "101010100",
//         "sms_pass": "Pass@123",
//         "sms_user": null,
//         "sms_company_url": "https://www.sangamam.co.in",
//         "mail_host": "Pass@123",
//         "mail_username": "sangamam",
//         "mail_pass": "Pass@123",
//         "uti_code": "Pass@123",
//         "neft_alert": "Yes",
//         "profile_id": "2",
//         "color_code": "#2614ad",
//         "login_page": "login2",
//         "total_branch_allow": 10,
//         "created_at": "2025-05-29T10:12:17.000000Z",
//         "updated_at": "2025-06-27T20:19:11.000000Z",
//         "company_logo": "CompanyLogo/COM-002_WhatsApp_Image_2025-01-27_at_9.17.16_PM.jpeg"
//     }
// }
