import dayjs from 'dayjs/esm';

import { SoapNote, NewSoapNote } from './soap-note.model';

export const sampleWithRequiredData: SoapNote = {
  id: 14674,
  name: 'woeful whose',
  subjective: 'playfully north',
  objective: 'gee',
  clientId: 17877,
};

export const sampleWithPartialData: SoapNote = {
  id: 19332,
  name: 'instead terribly',
  subjective: 'gee mastermind yet',
  objective: 'quixotic past',
  analysis: 'yearly indeed incapacitate',
  clientId: 26333,
  // assessments: 6221,
  createdBy: 'yippee mope lavish',
  lastModifiedBy: 'pro thoughtfully',
  lastModifiedDate: dayjs('2024-01-20T15:30'),
};

export const sampleWithFullData: SoapNote = {
  id: 2324,
  name: 'psst ouch',
  subjective: 'times dragster wise',
  objective: 'supposing blur',
  analysis: 'extremely ideate forenenst',
  evaluation: 'lake loyally',
  intervention: 'underneath before reskill',
  clientId: 9369,
  // assessments: 23275,
  createdBy: 'cenotaph hastily individuate',
  createdDate: dayjs('2024-01-20T09:40'),
  lastModifiedBy: 'inside',
  lastModifiedDate: dayjs('2024-01-20T10:28'),
};

export const sampleWithNewData: NewSoapNote = {
  name: 'adventurously with for',
  subjective: 'grasp',
  objective: 'choke',
  clientId: 2537,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
