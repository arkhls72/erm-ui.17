import { Insurance, NewInsurance } from './insurance.model';

export const sampleWithRequiredData: Insurance = {
  id: 28280,
  clientId: 29600,
};

export const sampleWithPartialData: Insurance = {
  id: 16138,
  clientId: 28738,
  ehcId: 11896,
  coveragerId: 378,
};

export const sampleWithFullData: Insurance = {
  id: 26917,
  clientId: 27122,
  ehcId: 20791,
  coveragerId: 23515,
  mvaId: 10178,
  wsibId: 15660,
};

export const sampleWithNewData: NewInsurance = {
  clientId: 20869,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
