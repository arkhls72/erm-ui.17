import dayjs from 'dayjs/esm';

import { Order, NewOrder } from './order.model';

export const sampleWithRequiredData: Order = {
  id: 15882,
  orderDate: dayjs('2024-01-22T05:46'),
  subTotal: 24266.59,
  taxTotal: 24293.83,
  status: 'regular disrupt',
};

export const sampleWithPartialData: Order = {
  id: 9810,
  orderDate: dayjs('2024-01-22T09:12'),
  subTotal: 28819.58,
  taxTotal: 20109.74,
  status: 'although period',
  createdBy: 'closet flawless',
};

export const sampleWithFullData: Order = {
  id: 21772,
  orderDate: dayjs('2024-01-22T11:44'),
  subTotal: 1198.57,
  taxTotal: 26384.67,
  status: 'well following ',
  note: 'infix',
  createdBy: 'uh-huh honesty rectangular',
  createdDate: dayjs('2024-01-21T17:37'),
  lastModifiedBy: 'ouch curiously',
  lastModifiedDate: dayjs('2024-01-22T02:14'),
};

export const sampleWithNewData: NewOrder = {
  orderDate: dayjs('2024-01-22T06:58'),
  subTotal: 21677.3,
  taxTotal: 22027.24,
  status: 'buoyant pro',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
