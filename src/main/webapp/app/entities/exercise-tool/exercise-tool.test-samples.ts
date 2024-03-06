import { ExerciseTool, NewExerciseTool } from './exercise-tool.model';

export const sampleWithRequiredData: ExerciseTool = {
  id: 993,
  name: 'whoa',
};

export const sampleWithPartialData: ExerciseTool = {
  id: 7256,
  name: 'speculation far coddle',
};

export const sampleWithFullData: ExerciseTool = {
  id: 9785,
  name: 'eel spawn oh',
};

export const sampleWithNewData: NewExerciseTool = {
  name: 'indeed morbidity gadzooks',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
