import dayjs from 'dayjs/esm';

import { PaymentInvoiceDetails, NewPaymentInvoiceDetails } from './payment-invoice-details.model';

export const sampleWithRequiredData: PaymentInvoiceDetails = {
  id: 15529,
  paymentInvoiceId: 4071,
  paymentAmount: 15598.42,
  paymentMethod: 'exactly psychia',
  cardNumber: 'annuallyXXXXXXXX',
};

export const sampleWithPartialData: PaymentInvoiceDetails = {
  id: 32219,
  paymentInvoiceId: 3799,
  paymentAmount: 4299.21,
  paymentMethod: 'spare winding f',
  cardNumber: 'boastfully imper',
  note: 'granular',
  createdBy: 'entangle hydrocarbon beep',
};

export const sampleWithFullData: PaymentInvoiceDetails = {
  id: 20709,
  paymentInvoiceId: 16039,
  paymentAmount: 10654.81,
  paymentMethod: 'yowza',
  cardNumber: 'source meh almos',
  note: 'prestige',
  createdBy: 'besides amidst',
  createdDate: dayjs('2024-01-22T06:04'),
  lastModifiedBy: 'prime',
  lastModifiedDate: dayjs('2024-01-22T15:16'),
};

export const sampleWithNewData: NewPaymentInvoiceDetails = {
  paymentInvoiceId: 25019,
  paymentAmount: 23.58,
  paymentMethod: 'length truthful',
  cardNumber: 'insideXXXXXXXXXX',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
