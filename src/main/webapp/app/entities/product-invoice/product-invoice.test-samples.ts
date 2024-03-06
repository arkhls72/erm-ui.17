import dayjs from 'dayjs/esm';

import { ProductInvoice, NewProductInvoice } from './product-invoice.model';

export const sampleWithRequiredData: ProductInvoice = {
  id: 21044,
  invoiceId: 6627,
  myProductId: 13699,
  myProductFeeId: 12450,
  invoicePrice: 23582.22,
  quantity: 20609,
  status: 'gee failing phooey',
};

export const sampleWithPartialData: ProductInvoice = {
  id: 8010,
  invoiceId: 17566,
  myProductId: 29176,
  myProductFeeId: 30355,
  invoicePrice: 14884.4,
  quantity: 15433,
  status: 'past',
  createdDate: dayjs('2024-01-22T09:24'),
  lastModifiedBy: 'floozie rigidly',
  lastModifiedDate: dayjs('2024-01-22T15:55'),
};

export const sampleWithFullData: ProductInvoice = {
  id: 23908,
  invoiceId: 25244,
  myProductId: 31678,
  myProductFeeId: 10443,
  invoicePrice: 18031.41,
  quantity: 26751,
  status: 'outside irritably',
  createdBy: 'intent versus smear',
  createdDate: dayjs('2024-01-22T23:47'),
  lastModifiedBy: 'although consequently yuck',
  lastModifiedDate: dayjs('2024-01-22T18:39'),
};

export const sampleWithNewData: NewProductInvoice = {
  invoiceId: 27433,
  myProductId: 596,
  myProductFeeId: 28204,
  invoicePrice: 29644.13,
  quantity: 3062,
  status: 'queasily slick gee',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
