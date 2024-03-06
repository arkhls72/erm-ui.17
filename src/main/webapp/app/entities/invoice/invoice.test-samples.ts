import dayjs from 'dayjs/esm';

import { Invoice, NewInvoice } from './invoice.model';

export const sampleWithRequiredData: Invoice = {
  id: 21370,
  clientId: 18775,
  invoiceNumber: 'impairment for mediocre',
  clinicId: 1686,
  status: 'upward meh until',
  taxTotal: 15843.82,
  grandTotal: 18630.65,
};

export const sampleWithPartialData: Invoice = {
  id: 11903,
  clientId: 6724,
  invoiceNumber: 'exciting protocol ouch',
  clinicId: 27532,
  status: 'deeply elated unethically',
  taxTotal: 1993.88,
  subTotal: 32627.66,
  grandTotal: 11106.21,
  createdBy: 'yum',
  createdDate: dayjs('2024-01-22T03:11'),
  lastModifiedBy: 'yieldingly',
};

export const sampleWithFullData: Invoice = {
  id: 16230,
  clientId: 23784,
  invoiceNumber: 'which sow shampoo',
  clinicId: 344,
  status: 'vacantly',
  taxTotal: 19275.84,
  subTotal: 664.53,
  note: 'physically hm',
  fullName: 'seemingly',
  grandTotal: 19244.37,
  createdBy: 'potentially',
  createdDate: dayjs('2024-01-22T10:17'),
  lastModifiedBy: 'or',
  lastModifiedDate: dayjs('2024-01-22T03:42'),
};

export const sampleWithNewData: NewInvoice = {
  clientId: 4460,
  invoiceNumber: 'milky failing',
  clinicId: 27888,
  status: 'thrifty',
  taxTotal: 18338.79,
  grandTotal: 1785.86,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
