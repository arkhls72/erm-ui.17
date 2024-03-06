import dayjs from 'dayjs/esm';

import { Plan, NewPlan } from './plan.model';

export const sampleWithRequiredData: Plan = {
  id: 25801,
  name: 'swamp hie',
  status: 'yahoo',
  clientId: 23997,
  startDate: dayjs('2024-01-22T12:22'),
  endDate: dayjs('2024-01-22T20:40'),
  assessmentId: 29661,
  assessment: 3683,
  programs: 23138,
};

export const sampleWithPartialData: Plan = {
  id: 19222,
  name: 'unsung fax',
  status: 'sharply',
  clientId: 24775,
  startDate: dayjs('2024-01-22T19:21'),
  endDate: dayjs('2024-01-22T11:54'),
  assessmentId: 14450,
  assessment: 9612,
  programs: 4615,
  clinicalNote: 'meh worth liaise',
  lastModifiedDate: dayjs('2024-01-22T20:52'),
  lastmodifiedBy: 'for always midst',
};

export const sampleWithFullData: Plan = {
  id: 25239,
  name: 'finally winged phew',
  status: 'ick until',
  clientId: 21196,
  startDate: dayjs('2024-01-22T22:12'),
  endDate: dayjs('2024-01-22T20:34'),
  assessmentId: 31830,
  assessment: 915,
  programs: 24709,
  clinicalNote: 'mostly boohoo',
  createdDate: dayjs('2024-01-23T00:51'),
  createdBy: 'after vivaciously',
  lastModifiedDate: dayjs('2024-01-22T16:30'),
  lastmodifiedBy: 'blond',
};

export const sampleWithNewData: NewPlan = {
  name: 'oversee die stigmatize',
  status: 'when meanwhile',
  clientId: 15066,
  startDate: dayjs('2024-01-22T18:21'),
  endDate: dayjs('2024-01-23T00:01'),
  assessmentId: 6552,
  assessment: 29546,
  programs: 13676,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
