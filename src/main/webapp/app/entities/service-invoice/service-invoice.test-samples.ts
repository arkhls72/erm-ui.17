import dayjs from 'dayjs/esm';

import { ServiceInvoice, NewServiceInvoice } from './service-invoice.model';

export const sampleWithRequiredData: ServiceInvoice = {
  id: 31559,
  invoiceId: 23785,
  invoicePrice: 20003.6,
  myServiceId: 1803,
  myServiceFeeId: 25188,
  quantity: 14266,
  status: 'residue frantically',
};

export const sampleWithPartialData: ServiceInvoice = {
  id: 23908,
  invoiceId: 26660,
  invoicePrice: 24082.36,
  myServiceId: 8476,
  myServiceFeeId: 12379,
  quantity: 1546,
  status: 'hmph although ack',
  lastModifiedBy: 'replica disconcert',
};

export const sampleWithFullData: ServiceInvoice = {
  id: 32717,
  invoiceId: 27299,
  invoicePrice: 18908.44,
  myServiceId: 29771,
  myServiceFeeId: 18504,
  quantity: 19515,
  status: 'anxiously sleepily',
  createdDate: dayjs('2024-01-20T10:29'),
  createdBy: 'gosh',
  lastModifiedDate: dayjs('2024-01-20T20:59'),
  lastModifiedBy: 'gadzooks debug shadow',
};

export const sampleWithNewData: NewServiceInvoice = {
  invoiceId: 7928,
  invoicePrice: 9122.84,
  myServiceId: 6055,
  myServiceFeeId: 25641,
  quantity: 12222,
  status: 'interchange vicious',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
