import dayjs from 'dayjs/esm';

import { Instruction, NewInstruction } from './instruction.model';

export const sampleWithRequiredData: Instruction = {
  id: 16440,
  note: 'generously',
};

export const sampleWithPartialData: Instruction = {
  id: 8426,
  hold: 30797,
  complete: 13648,
  note: 'force ouch dual',
  durationNumber: 3596,
  name: 'snap',
  createdDate: dayjs('2024-01-20T09:58'),
};

export const sampleWithFullData: Instruction = {
  id: 1681,
  repeat: 31596,
  hold: 19026,
  complete: 6788,
  perform: 12631,
  note: 'lender',
  durationNumber: 14049,
  name: 'that purple',
  exerciseId: 15162,
  createdDate: dayjs('2024-01-20T08:18'),
  createdBy: 'candid woefully',
  lastModifiedDate: dayjs('2024-01-20T08:54'),
  lastModifiedBy: 'geez pfft unimpressively',
};

export const sampleWithNewData: NewInstruction = {
  note: 'accustom huzzah',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
