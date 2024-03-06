import dayjs from 'dayjs/esm';

import { ProgGroupInstruction, NewProgGroupInstruction } from './prog-group-instruction.model';

export const sampleWithRequiredData: ProgGroupInstruction = {
  id: 20692,
  exerciseId: 7048,
  progId: 3345,
  instructionId: 1842,
};

export const sampleWithPartialData: ProgGroupInstruction = {
  id: 20370,
  exerciseId: 30098,
  progId: 21404,
  instructionId: 29390,
  lastModifiedBy: 'fortunately instructive',
};

export const sampleWithFullData: ProgGroupInstruction = {
  id: 17241,
  exerciseId: 12559,
  progId: 25705,
  groupId: 2601,
  instructionId: 32505,
  createdBy: 'hm overconfidently',
  createdDate: dayjs('2024-01-20T07:00'),
  lastModifiedBy: 'adventurously gah',
  lastModifiedDate: dayjs('2024-01-21T04:20'),
};

export const sampleWithNewData: NewProgGroupInstruction = {
  exerciseId: 30773,
  progId: 3526,
  instructionId: 1097,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
