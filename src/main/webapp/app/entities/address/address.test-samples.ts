import dayjs from 'dayjs/esm';

import { Address, NewAddress } from './address.model';
import { Province } from '../province/province.model';
import { Countries } from '../countries/countries.model';

export const sampleWithRequiredData: Address = {
  id: 22994,
  streetNumber: 'wildly pro',
  streetName: 'Gutmann Squares',
  postalCode: 'afore ',
  city: 'East Hunter',
  province: new Province(1, 'powerfully pine'),
};

export const sampleWithPartialData: Address = {
  id: 5735,
  streetNumber: 'interval y',
  streetName: 'Glebe Close',
  postalCode: 'finall',
  city: 'Baileystead',
  province: new Province(1, 'tour'),
  countries: new Countries(1, 'wend where however'),
  lastModifiedDate: dayjs('2024-01-27T19:23'),
  createdDate: dayjs('2024-01-27T22:25'),
};

export const sampleWithFullData: Address = {
  id: 20600,
  streetNumber: 'aha',
  streetName: 'Moses Track',
  unitNumber: 'black skin',
  postalCode: 'aw rou',
  city: 'Mertzboro',
  province: new Province(1, 'yahoo coolly ne'),
  countries: new Countries(1, 'reorganisation daikon earnest'),
  poBox: 'since',
  lastModifiedBy: 'ah industrialise',
  lastModifiedDate: dayjs('2024-01-28T08:27'),
  createdDate: dayjs('2024-01-27T17:39'),
  createdBy: 'avaricious',
};

export const sampleWithNewData: NewAddress = {
  streetNumber: 'whenever g',
  streetName: 'Horacio Court',
  postalCode: 'yowza ',
  city: 'Barrowsstad',
  province: new Province(1, 'daily supposing'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
