const role: string[] = ['seller', 'buyer'];

const userFilterableFields: string[] = [
  'query',
  'phoneNumber',
  'role',
  'minBudget',
  'maxBudget',
];

const userSearchableFields: string[] = [
  'name.firstName',
  'name.lastName',
  'phoneNumber',
  'address',
  // 'budget',
  // 'income',
];

export const UserConstant = {
  role,
  userFilterableFields,
  userSearchableFields,
};
