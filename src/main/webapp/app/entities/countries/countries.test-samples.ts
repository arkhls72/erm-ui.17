import { Countries, NewCountries } from './countries.model';

export const sampleWithRequiredData: Countries = {
  id: 5114,
  name: 'identical if',
};

export const sampleWithPartialData: Countries = {
  id: 28350,
  name: 'bespatter intensely cough',
};

export const sampleWithFullData: Countries = {
  id: 24221,
  name: 'specialist eek',
};

export const sampleWithNewData: NewCountries = {
  name: 'esteemed',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
