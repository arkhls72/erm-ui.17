import dayjs from 'dayjs/esm';

import { Injury, NewInjury } from './injury.model';

export const sampleWithRequiredData: Injury = {
  id: 28067,
  nameType: 'quirkily plus typeset',
  happenDate: dayjs('2024-01-26T03:45'),
};

export const sampleWithPartialData: Injury = {
  id: 3488,
  nameType: 'instruction',
  happenDate: dayjs('2024-01-26T21:56'),
  createdDate: dayjs('2024-01-26T20:55'),
  lastModifiedBy: 'haversack considering per',
  lastModifiedDate: dayjs('2024-01-26T15:28'),
};

export const sampleWithFullData: Injury = {
  id: 26850,
  nameType: 'than',
  happenDate: dayjs('2024-01-26T05:08'),
  note: 'longingly carefully toward',
  createdDate: dayjs('2024-01-26T10:00'),
  createdBy: 'where gadzooks defensive',
  lastModifiedBy: 'aching an dreamily',
  lastModifiedDate: dayjs('2024-01-26T12:51'),
};

export const sampleWithNewData: NewInjury = {
  nameType: 'laryngitis save lesson',
  happenDate: dayjs('2024-01-26T11:53'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
