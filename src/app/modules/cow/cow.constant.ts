const location: string[] = [
  'Dhaka',
  'Chattogram',
  'Barishal',
  'Rajshahi',
  'Sylhet',
  'Comilla',
  'Rangpur',
  'Mymensingh',
];

const breed: string[] = [
  'Brahman',
  'Nellore',
  'Sahiwal',
  'Gir',
  'Indigenous',
  'Tharparkar',
  'Kankrej',
];

const category: string[] = ['Dairy', 'Beef', 'Dual Purpose'];

const label: string[] = ['for sale', 'sold out'];

const cowFilterableFields = [
  'query',
  'minPrice',
  'maxPrice',
  'location',
  'breed',
];

const cowSearchableFields: string[] = [
  'name',
  'breed',
  'location',
  'label',
  'category',
];

export const CowConstant = {
  location,
  breed,
  label,
  category,
  cowFilterableFields,
  cowSearchableFields,
};
