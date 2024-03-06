import dayjs from 'dayjs/esm';

import { OrderPayment, NewOrderPayment } from './order-payment.model';

export const sampleWithRequiredData: OrderPayment = {
  id: 8602,
  orderId: 4190,
  totalPrice: 9846.87,
};

export const sampleWithPartialData: OrderPayment = {
  id: 25686,
  orderId: 17290,
  totalPrice: 20659.39,
  credit: 25212.34,
  debit: 22558.22,
  eTransfer: 31861.39,
  moneyEmail: 8017.06,
  cash: 20953.16,
  cheque: 30948.19,
  createdBy: 'hidden unnaturally what',
  lastModifiedBy: 'where serious blah',
  lastModifiedDate: dayjs('2024-01-24T04:59'),
};

export const sampleWithFullData: OrderPayment = {
  id: 25980,
  orderId: 17231,
  totalPrice: 31436.31,
  credit: 8839.15,
  debit: 974.6,
  eTransfer: 16150.15,
  moneyEmail: 12191.21,
  directDeposit: 6755.98,
  cash: 4991.36,
  cheque: 12902.99,
  createdBy: 'credenza consequently',
  createdDate: dayjs('2024-01-24T20:21'),
  lastModifiedBy: 'athwart sans deck',
  lastModifiedDate: dayjs('2024-01-24T00:04'),
};

export const sampleWithNewData: NewOrderPayment = {
  orderId: 23672,
  totalPrice: 23478.17,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
