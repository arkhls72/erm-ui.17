import dayjs from 'dayjs/esm';

import { Exercise, NewExercise } from './exercise.model';

export const sampleWithRequiredData: Exercise = {
  id: 27508,
  name: 'restfully zowie',
  // bodyPartId: 8756,
  // muscle: 17132,
  // typeId: 11263,
  // positionId: 10608,
  // movementId: 6284,
  // toolId: 27611,
  // mediaId: 11887,
  description: 'afore openly beneath',
};

export const sampleWithPartialData: Exercise = {
  id: 18267,
  name: 'seemingly powerfully enthusiastically',
  // bodyPartId: 7389,
  // muscle: 12269,
  // typeId: 28733,
  // positionId: 2062,
  // movementId: 20232,
  // toolId: 19761,
  // mediaId: 2204,
  description: 'aha pocket',
  lastModifiedBy: 'spatula stamina until',
  lastModifiedDate: dayjs('2024-01-22T00:15'),
  createdBy: 'oof',
};

export const sampleWithFullData: Exercise = {
  id: 28429,
  name: 'corkscrew likely which',
  // bodyPartId: 8840,
  // muscle: 372,
  // typeId: 21687,
  // positionId: 13358,
  // movementId: 28241,
  // toolId: 21834,
  // mediaId: 20229,
  description: 'however',
  firstMediaId: 10308,
  secondMediaId: 27238,
  lastModifiedBy: 'zucchini when thoroughly',
  lastModifiedDate: dayjs('2024-01-21T19:56'),
  createdBy: 'which tremendously',
  createdDate: dayjs('2024-01-21T13:54'),
};

export const sampleWithNewData: NewExercise = {
  // name: 'opposite hm reassuringly',
  // bodyPartId: 13481,
  // muscle: 2413,
  // typeId: 31950,
  // positionId: 26403,
  // movementId: 15173,
  // toolId: 32154,
  // mediaId: 23216,
  description: 'experimentation excepting',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
