import dayjs from 'dayjs/esm';

import { IClient, NewClient } from './client.model';

export const sampleWithRequiredData: IClient = {
  id: 8660,
  firstName: 'Wilhelm',
};

export const sampleWithPartialData: IClient = {
  id: 4964,
  firstName: 'Merritt',
  lastName: 'Luettgen',
  lastModifiedDate: dayjs('2024-03-02T05:12'),
};

export const sampleWithFullData: IClient = {
  id: 27359,
  firstName: 'Tremaine',
  lastName: 'Homenick',
  lastModifiedDate: dayjs('2024-03-02T06:53'),
};

export const sampleWithNewData: NewClient = {
  firstName: 'Alvena',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
