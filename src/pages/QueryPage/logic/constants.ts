import type { KeyConfig } from '../../../lib/QueryLanguage/types';

export const pageName = 'query-language';

export const keyConfigs: KeyConfig[] = [
  {
    name: 'name',
    description: 'User full name',
    valueType: 'string',
    values: [
      { value: 'John Doe', description: 'Software Engineer' },
      { value: 'Jane Smith', description: 'Product Manager' },
      { value: 'Mike Johnson', description: 'UI/UX Designer' },
      { value: 'Sarah Wilson', description: 'Data Scientist' },
      { value: 'Alex Chen', description: 'DevOps Engineer' },
    ],
  },
  {
    name: 'email',
    description: 'User email address',
    valueType: 'string',
    // values: [
    //   { value: 'john.doe@company.com', description: "John Doe's email" },
    //   { value: 'jane.smith@company.com', description: "Jane Smith's email" },
    //   { value: 'mike.johnson@company.com', description: "Mike Johnson's email" },
    //   { value: 'sarah.wilson@company.com', description: "Sarah Wilson's email" },
    //   { value: 'alex.chen@company.com', description: "Alex Chen's email" },
    // ],
  },
  {
    name: 'status',
    description: 'Account status',
    valueType: 'enum',
    values: [
      { value: 'active', description: 'User is currently active' },
      { value: 'inactive', description: 'User account is inactive' },
      { value: 'pending', description: 'Account pending approval' },
      { value: 'suspended', description: 'Account is suspended' },
      { value: 'archived', description: 'Account is archived' },
    ],
  },
  {
    name: 'category',
    description: 'Task or item category',
    valueType: 'enum',
    values: [
      { value: 'urgent', description: 'Requires immediate attention' },
      { value: 'normal', description: 'Standard priority' },
      { value: 'low', description: 'Can be addressed later' },
      { value: 'feature', description: 'New feature request' },
      { value: 'bug', description: 'Bug report or issue' },
    ],
  },
  {
    name: 'department',
    description: 'Department or team',
    valueType: 'enum',
    values: [
      { value: 'engineering', description: 'Software Engineering team' },
      { value: 'design', description: 'UI/UX Design team' },
      { value: 'product', description: 'Product Management team' },
      { value: 'marketing', description: 'Marketing team' },
      { value: 'sales', description: 'Sales team' },
      { value: 'support', description: 'Customer Support team' },
    ],
  },
  {
    name: 'role',
    description: 'Job role or position',
    valueType: 'enum',
    values: [
      { value: 'manager', description: 'Team manager' },
      { value: 'senior', description: 'Senior level position' },
      { value: 'mid', description: 'Mid-level position' },
      { value: 'junior', description: 'Junior level position' },
      { value: 'intern', description: 'Internship position' },
      { value: 'contractor', description: 'Contract worker' },
    ],
  },
  {
    name: 'location',
    description: 'Office location or region',
    valueType: 'enum',
    values: [
      { value: 'san-francisco', description: 'San Francisco, CA' },
      { value: 'new-york', description: 'New York, NY' },
      { value: 'austin', description: 'Austin, TX' },
      { value: 'seattle', description: 'Seattle, WA' },
      { value: 'remote', description: 'Remote worker' },
      { value: 'london', description: 'London, UK' },
    ],
  },
  {
    name: 'priority',
    description: 'Task priority level',
    valueType: 'enum',
    values: [
      { value: 'critical', description: 'Critical - fix immediately' },
      { value: 'high', description: 'High priority' },
      { value: 'medium', description: 'Medium priority' },
      { value: 'low', description: 'Low priority' },
    ],
  },
  {
    name: 'assignee',
    description: 'Person assigned to task',
    valueType: 'string',
    values: [
      { value: 'john@company.com', description: 'John Doe' },
      { value: 'jane@company.com', description: 'Jane Smith' },
      { value: 'mike@company.com', description: 'Mike Johnson' },
      { value: 'sarah@company.com', description: 'Sarah Wilson' },
      { value: 'alex@company.com', description: 'Alex Chen' },
    ],
  },
  {
    name: 'created',
    description: 'Creation date',
    valueType: 'date',
    values: [
      { value: '2024-01-01', description: 'January 1st, 2024' },
      { value: '2024-06-01', description: 'June 1st, 2024' },
      { value: '2024-12-01', description: 'December 1st, 2024' },
    ],
  },
  {
    name: 'updated',
    description: 'Last update date',
    valueType: 'date',
    values: [
      { value: '2024-08-01', description: 'August 1st, 2024' },
      { value: '2024-08-15', description: 'August 15th, 2024' },
      { value: '2024-08-25', description: 'August 25th, 2024' },
    ],
  },
];
