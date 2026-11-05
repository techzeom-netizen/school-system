/**
 * Account Types and Related Constants
 * Centralized configuration for account-related dropdowns and options
 */

// Saving Account Types
export const SAVING_ACCOUNT_TYPES = [
  { value: 'saving_plus', label: 'Saving Plus Account' },
  { value: 'saving', label: 'Saving Account' },
] as const;

// Account Types
export const ACCOUNT_TYPES = [
  { value: 'individual', label: 'Individual' },
  { value: 'joint', label: 'Joint' },
] as const;

// Nominee Relations
export const NOMINEE_RELATIONS = [
  { value: 'spouse', label: 'Spouse' },
  { value: 'father', label: 'Father' },
  { value: 'mother', label: 'Mother' },
  { value: 'son', label: 'Son' },
  { value: 'daughter', label: 'Daughter' },
  { value: 'brother', label: 'Brother' },
  { value: 'sister', label: 'Sister' },
  { value: 'other', label: 'Other' },
] as const;

// Guardian Relations (for minors)
export const GUARDIAN_RELATIONS = [
  { value: 'father', label: 'Father' },
  { value: 'mother', label: 'Mother' },
  { value: 'grandfather', label: 'Grandfather' },
  { value: 'grandmother', label: 'Grandmother' },
  { value: 'uncle', label: 'Uncle' },
  { value: 'aunt', label: 'Aunt' },
  { value: 'legal_guardian', label: 'Legal Guardian' },
] as const;

// Document Types
export const DOCUMENT_TYPES = [
  { value: 'aadhar', label: 'Aadhar Card' },
  { value: 'pan', label: 'PAN Card' },
  { value: 'passport', label: 'Passport' },
  { value: 'voter_id', label: 'Voter ID' },
  { value: 'driving_license', label: 'Driving License' },
  { value: 'ration_card', label: 'Ration Card' },
] as const;

// Occupation Types
export const OCCUPATION_TYPES = [
  { value: 'salaried', label: 'Salaried' },
  { value: 'business', label: 'Business' },
  { value: 'professional', label: 'Professional' },
  { value: 'self_employed', label: 'Self Employed' },
  { value: 'retired', label: 'Retired' },
  { value: 'student', label: 'Student' },
  { value: 'homemaker', label: 'Homemaker' },
  { value: 'unemployed', label: 'Unemployed' },
] as const;

// Income Ranges
export const INCOME_RANGES = [
  { value: '0-100000', label: '₹0 - ₹1,00,000' },
  { value: '100001-250000', label: '₹1,00,001 - ₹2,50,000' },
  { value: '250001-500000', label: '₹2,50,001 - ₹5,00,000' },
  { value: '500001-1000000', label: '₹5,00,001 - ₹10,00,000' },
  { value: '1000001-2500000', label: '₹10,00,001 - ₹25,00,000' },
  { value: '2500001+', label: '₹25,00,001+' },
] as const;

// Education Qualifications
export const EDUCATION_QUALIFICATIONS = [
  { value: 'illiterate', label: 'Illiterate' },
  { value: 'primary', label: 'Primary' },
  { value: 'secondary', label: 'Secondary' },
  { value: 'higher_secondary', label: 'Higher Secondary' },
  { value: 'graduate', label: 'Graduate' },
  { value: 'post_graduate', label: 'Post Graduate' },
  { value: 'professional', label: 'Professional' },
] as const;

// Marital Status
export const MARITAL_STATUS = [
  { value: 'single', label: 'Single' },
  { value: 'married', label: 'Married' },
  { value: 'divorced', label: 'Divorced' },
  { value: 'widowed', label: 'Widowed' },
] as const;

// Type definitions for better TypeScript support
export type SavingAccountType = (typeof SAVING_ACCOUNT_TYPES)[number]['value'];
export type AccountType = (typeof ACCOUNT_TYPES)[number]['value'];
export type NomineeRelation = (typeof NOMINEE_RELATIONS)[number]['value'];
export type GuardianRelation = (typeof GUARDIAN_RELATIONS)[number]['value'];
export type DocumentType = (typeof DOCUMENT_TYPES)[number]['value'];
export type OccupationType = (typeof OCCUPATION_TYPES)[number]['value'];
export type IncomeRange = (typeof INCOME_RANGES)[number]['value'];
export type EducationQualification =
  (typeof EDUCATION_QUALIFICATIONS)[number]['value'];
export type MaritalStatus = (typeof MARITAL_STATUS)[number]['value'];
