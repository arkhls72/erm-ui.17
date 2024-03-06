import { ServiceType, NewServiceType } from './service-type.model';

export const sampleWithRequiredData: ServiceType = {
  id: 6345,
  name: 'unripe',
};

export const sampleWithPartialData: ServiceType = {
  id: 17281,
  name: 'pfft cheetah meanwhile',
};

export const sampleWithFullData: ServiceType = {
  id: 19986,
  name: 'or yellow duh',
};

export const sampleWithNewData: NewServiceType = {
  name: 'oppress',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
