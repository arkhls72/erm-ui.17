import { Media, NewMedia } from './media.model';

export const sampleWithRequiredData: Media = {
  id: 25174,
  name: 'urgently',
};

export const sampleWithPartialData: Media = {
  id: 224,
  value: '../fake-data/blob/hipster.png',
  valueContentType: 'unknown',
  name: 'reversal',
};

export const sampleWithFullData: Media = {
  id: 19675,
  contentType: 'fang',
  valueContentType: 'brother strap kindhearted',
  value: '../fake-data/blob/hipster.png',
  name: 'oof even alongside',
};

export const sampleWithNewData: NewMedia = {
  name: 'dictator',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
