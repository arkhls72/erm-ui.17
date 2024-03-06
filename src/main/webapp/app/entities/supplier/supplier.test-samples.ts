import dayjs from 'dayjs/esm';

import { Supplier, NewSupplier } from './supplier.model';

export const sampleWithRequiredData: Supplier = {
  id: 25330,
  name: 'special staid criticise',
  contactName: 'mysteriously yowza unpack',
};

export const sampleWithPartialData: Supplier = {
  id: 12406,
  name: 'shoddy',
  contactName: 'stickybeak micronutrient distract',
  phone: '(514) 434-2510 ',
  addressId: 7294,
  lastModifiedBy: 'worse',
  lastModifiedDate: dayjs('2024-01-20T21:09'),
};

export const sampleWithFullData: Supplier = {
  id: 10576,
  name: 'furthermore',
  contactName: 'be epoch',
  phone: '(863) 848-6758 ',
  addressId: 30623,
  email: 'Michael37@gmail.com',
  lastModifiedBy: 'better blah an',
  lastModifiedDate: dayjs('2024-01-20T05:56'),
};

export const sampleWithNewData: NewSupplier = {
  name: 'solemnly',
  contactName: 'ouch truly',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
