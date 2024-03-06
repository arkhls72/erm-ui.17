import dayjs from 'dayjs/esm';

import { ClientInvoice, NewClientInvoice } from './client-invoice.model';

export const sampleWithRequiredData: ClientInvoice = {
  id: 29219,
  invoiceId: 2552,
  invoicePrice: 21453.64,
  quantity: 11944,
  status: 'waiter reluctantly',
};

export const sampleWithPartialData: ClientInvoice = {
  id: 30775,
  invoiceId: 19389,
  invoicePrice: 6946.51,
  productId: 32605,
  quantity: 6488,
  status: 'aboard however ah',
  createdBy: 'cauterise annually',
  lastModifiedBy: 'kit',
};

export const sampleWithFullData: ClientInvoice = {
  id: 6644,
  invoiceId: 7218,
  invoicePrice: 3465.1,
  productId: 6039,
  myServiceId: 5261,
  quantity: 28946,
  status: 'on',
  createdBy: 'daunt than olive',
  createdDate: dayjs('2024-01-27T12:46'),
  lastModifiedBy: 'er hot aw',
  lastModifiedDate: dayjs('2024-01-27T05:15'),
};

export const sampleWithNewData: NewClientInvoice = {
  invoiceId: 6792,
  invoicePrice: 16922.9,
  quantity: 3480,
  status: 'an welcome lightly',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
