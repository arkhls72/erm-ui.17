import { ExerciseLevel, NewExerciseLevel } from './exercise-level.model';

export const sampleWithRequiredData: ExerciseLevel = {
  id: 7585,
  name: 'honeymoon silly icky',
};

export const sampleWithPartialData: ExerciseLevel = {
  id: 31884,
  name: 'loftily',
};

export const sampleWithFullData: ExerciseLevel = {
  id: 29593,
  name: 'meh household',
};

export const sampleWithNewData: NewExerciseLevel = {
  name: 'accidentally loftily',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
