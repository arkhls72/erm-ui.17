import dayjs from 'dayjs/esm';

import { Assessment, NewAssessment } from './assessment.model';

export const sampleWithRequiredData: Assessment = {
  id: 15982,
  name: 'so',
  painIntensity: 15303,
  clientId: 19508,
};

export const sampleWithPartialData: Assessment = {
  id: 17095,
  name: 'finally',
  painIntensity: 27704,
  aggravationPain: 'pea knife',
  clientId: 29997,
  plans: 'minty shakily boo',
  isBack: false,
  soapNote: 'off psst',
  createdBy: 'degradation doubtfully',
};

export const sampleWithFullData: Assessment = {
  id: 20669,
  name: 'metallic nobody grand',
  painIntensity: 7751,
  sourcePain: 'jewel',
  painOnSet: 'truly',
  aggravationPain: 'concerning',
  note: 'even smoothly',
  clientId: 9509,
  plans: 'inasmuch into',
  isBack: false,
  soapNote: 'whereas',
  createdBy: 'tricky',
  lastModifiedBy: 'recommendation',
  lastModifiedDate: dayjs('2024-01-28T00:31'),
};

export const sampleWithNewData: NewAssessment = {
  name: 'fire',
  painIntensity: 25399,
  clientId: 9815,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
