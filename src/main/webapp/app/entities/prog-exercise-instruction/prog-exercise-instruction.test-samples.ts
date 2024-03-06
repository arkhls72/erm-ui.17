import dayjs from 'dayjs/esm';

import { ProgExerciseInstruction, NewProgExerciseInstruction } from './prog-exercise-instruction.model';

export const sampleWithRequiredData: ProgExerciseInstruction = {
  id: 32428,
  exerciseId: 2963,
  progId: 26534,
};

export const sampleWithPartialData: ProgExerciseInstruction = {
  id: 21620,
  exerciseId: 113,
  progId: 6272,
  createdBy: 'inventory weaponise bin',
  createdDate: dayjs('2024-01-28T09:06'),
};

export const sampleWithFullData: ProgExerciseInstruction = {
  id: 14153,
  exerciseId: 20888,
  progId: 4297,
  instruction: 'enumerate publicise',
  createdBy: 'teeter nearly rose',
  createdDate: dayjs('2024-01-28T18:43'),
  lastModifiedBy: 'meanwhile',
  lastModifiedDate: dayjs('2024-01-27T22:06'),
};

export const sampleWithNewData: NewProgExerciseInstruction = {
  exerciseId: 17198,
  progId: 25653,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
