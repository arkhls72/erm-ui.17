import { BaseEntity } from '../../shared/model/base-entity';

export class Therapy implements BaseEntity {
  constructor(
    public id?: number,
    public name?: string,
  ) {}
}
export type NewTherapy = Omit<Therapy, 'id'> & { id: null };
