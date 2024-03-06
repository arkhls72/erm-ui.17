import dayjs from 'dayjs/esm';

import { PaymentInvoice, NewPaymentInvoice } from './payment-invoice.model';

export const sampleWithRequiredData: PaymentInvoice = {
  id: 13665,
  invoiceId: 10186,
  status: 'ouch consequently gah',
};

export const sampleWithPartialData: PaymentInvoice = {
  id: 9920,
  invoiceId: 15717,
  dueNow: 30317,
  status: 'although frankly valiantly',
  note: 'subdue contraindicate',
  lastModifiedBy: 'yet smooth prime',
};

export const sampleWithFullData: PaymentInvoice = {
  id: 25956,
  invoiceId: 24409,
  dueNow: 20590,
  status: 'anesthesiology',
  note: 'deafening lest pfft',
  createdBy: 'frightened failing wherever',
  createdDate: dayjs('2024-01-23T00:09'),
  lastModifiedBy: 'minus gah',
  lastModifiedDate: dayjs('2024-01-22T18:16'),
};

export const sampleWithNewData: NewPaymentInvoice = {
  invoiceId: 17819,
  status: 'hence boastfully grandparent',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
