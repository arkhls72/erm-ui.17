import { Therapy, NewTherapy } from './therapy.model';

export const sampleWithRequiredData: Therapy = {
  id: 20547,
  name: 'unto mmm',
};

export const sampleWithPartialData: Therapy = {
  id: 25301,
  name: 'officially',
};

export const sampleWithFullData: Therapy = {
  id: 3515,
  name: 'pish',
};

export const sampleWithNewData: NewTherapy = {
  name: 'memorable lumpy',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
