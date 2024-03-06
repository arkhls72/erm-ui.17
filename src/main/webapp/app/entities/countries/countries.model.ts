import { BaseEntity } from '../../shared/model/base-entity';

export class Countries implements BaseEntity {
  constructor(
    public id: number,
    public name?: string | null,
  ) {}
}

export type NewCountries = Omit<Countries, 'id'> & { id: null };
