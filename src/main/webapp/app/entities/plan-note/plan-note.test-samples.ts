import dayjs from 'dayjs/esm';

import { PlanNote, NewPlanNote } from './plan-note.model';

export const sampleWithRequiredData: PlanNote = {
  id: 13935,
  planId: 10601,
};

export const sampleWithPartialData: PlanNote = {
  id: 13675,
  planId: 19563,
  note: 'kindly',
  createdBy: 'inside',
  lastModifiedBy: 'aha bogus cleverly',
  lastModfiedDate: dayjs('2024-01-22T19:58'),
};

export const sampleWithFullData: PlanNote = {
  id: 8019,
  planId: 26449,
  note: 'cherish',
  createdDate: dayjs('2024-01-22T14:46'),
  createdBy: 'incomplete',
  lastModifiedBy: 'strictly biff blah',
  lastModfiedDate: dayjs('2024-01-22T03:33'),
};

export const sampleWithNewData: NewPlanNote = {
  planId: 16656,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
