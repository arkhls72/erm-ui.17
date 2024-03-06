import dayjs from 'dayjs/esm';

import { ProgNote, NewProgNote } from './prog-note.model';

export const sampleWithRequiredData: ProgNote = {
  id: 27555,
  progId: 26384,
  note: 'ugh',
};

export const sampleWithPartialData: ProgNote = {
  id: 31373,
  progId: 12769,
  note: 'qua',
  lastModifiedBy: 'warmly while',
};

export const sampleWithFullData: ProgNote = {
  id: 13182,
  progId: 11446,
  note: 'highly kaleidoscopic',
  createdBy: 'enthusiastically',
  createdDate: dayjs('2024-01-20T14:31'),
  lastModifiedBy: 'needily cameo pfft',
  lastModifiedDate: dayjs('2024-01-20T09:29'),
};

export const sampleWithNewData: NewProgNote = {
  progId: 418,
  note: 'without',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
