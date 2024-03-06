import { BodyPart, NewBodyPart } from './body-part.model';

export const sampleWithRequiredData: BodyPart = {
  id: 13527,
  name: 'loose round',
};

export const sampleWithPartialData: BodyPart = {
  id: 18284,
  name: 'swarm dense',
};

export const sampleWithFullData: BodyPart = {
  id: 31352,
  name: 'mid dead',
};

export const sampleWithNewData: NewBodyPart = {
  name: 'armor',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
