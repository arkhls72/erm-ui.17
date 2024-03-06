import { NewPosition, Position } from './position.model';

export const sampleWithRequiredData: Position = {
  id: 29943,
  name: 'now',
};

export const sampleWithPartialData: Position = {
  id: 26492,
  name: 'ick',
};

export const sampleWithFullData: Position = {
  id: 4717,
  name: 'boo excepting',
};

export const sampleWithNewData: NewPosition = {
  name: 'sparkle anti sunny',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
