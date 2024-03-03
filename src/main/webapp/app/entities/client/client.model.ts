import dayjs from 'dayjs/esm';

export interface IClient {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
}

export type NewClient = Omit<IClient, 'id'> & { id: null };
