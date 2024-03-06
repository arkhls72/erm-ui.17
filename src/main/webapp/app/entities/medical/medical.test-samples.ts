import { Medical, NewMedical } from './medical.model';

export const sampleWithRequiredData: Medical = {
  id: 17045,
  clientId: 22721,
};

export const sampleWithPartialData: Medical = {
  id: 32455,
  clientId: 24569,
};

export const sampleWithFullData: Medical = {
  id: 3916,
  clientId: 9398,
  injuryId: 27643,
  medicationId: 5600,
  conditionId: 15209,
  operationId: 28972,
};

export const sampleWithNewData: NewMedical = {
  clientId: 15162,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
