import { Province, NewProvince } from './province.model';

export const sampleWithRequiredData: Province = {
  id: 28762,
  name: 'bubbly whether spit',
};

export const sampleWithPartialData: Province = {
  id: 11215,
  name: 'grudge',
};

export const sampleWithFullData: Province = {
  id: 4247,
  name: 'turbulent for whenever',
};

export const sampleWithNewData: NewProvince = {
  name: 'energize',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
