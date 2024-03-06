import dayjs from 'dayjs/esm';

import { ProductOrder, NewProductOrder } from './product-order.model';

export const sampleWithRequiredData: ProductOrder = {
  id: 11267,
  myProductId: 2334,
  orderId: 3750,
  orderPrice: 489.69,
  quantity: 6132,
  status: 'swoop zowie uh-huh',
};

export const sampleWithPartialData: ProductOrder = {
  id: 314,
  myProductId: 15593,
  orderId: 358,
  orderPrice: 4014.42,
  quantity: 8087,
  status: 'rapidly',
  createdDate: dayjs('2024-01-22T17:22'),
};

export const sampleWithFullData: ProductOrder = {
  id: 16477,
  myProductId: 31789,
  orderId: 3465,
  orderPrice: 19986.79,
  quantity: 15483,
  status: 'meek fast thankful',
  createdBy: 'soon',
  createdDate: dayjs('2024-01-22T03:56'),
  lastModifiedBy: 'extinction ox',
  lastModifiedDate: dayjs('2024-01-22T16:08'),
};

export const sampleWithNewData: NewProductOrder = {
  myProductId: 17547,
  orderId: 24689,
  orderPrice: 24232.48,
  quantity: 2101,
  status: 'zowie alongside beyond',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
