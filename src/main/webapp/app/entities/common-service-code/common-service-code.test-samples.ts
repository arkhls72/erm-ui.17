import { CommonServiceCode, NewCommonServiceCode } from './common-service-code.model';

export const sampleWithRequiredData: CommonServiceCode = {
  id: 11813,
  serviceCode: 'zowie hungry fr',
  description: 'although contribute poem',
};

export const sampleWithPartialData: CommonServiceCode = {
  id: 5035,
  serviceCode: 'amortize swell ',
  description: 'ew',
};

export const sampleWithFullData: CommonServiceCode = {
  id: 14871,
  serviceCode: 'edger actually ',
  description: 'syndicate beside',
  serviceType: 22641,
  category: 'provided',
  note: 'how notwithstanding',
};

export const sampleWithNewData: NewCommonServiceCode = {
  serviceCode: 'poorly sedately',
  description: 'um to',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
