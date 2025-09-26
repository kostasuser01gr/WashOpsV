import Dexie, { Table } from 'dexie';

export interface OfflineMutation {
  id: string;
  endpoint: string;
  payload: unknown;
  idempotencyKey: string;
  createdAt: number;
}

export class WashOpsDb extends Dexie {
  mutations!: Table<OfflineMutation, string>;
  constructor() {
    super('washopsv');
    this.version(1).stores({
      mutations: 'id, endpoint, idempotencyKey, createdAt',
    });
  }
}

export const idb = new WashOpsDb();
