import Dexie, { type Table } from 'dexie';

export interface OfflineTicketTask {
    local_id?: number;
    action: 'insert' | 'update';
    table: string;
    payload: any;
    status: 'pending' | 'syncing' | 'failed';
    created_at: number;
}

export class TCEMSLocalDB extends Dexie {
    syncQueue!: Table<OfflineTicketTask, number>;

    constructor() {
        super('tcems_offline_db');
        this.version(1).stores({
            syncQueue: '++local_id, action, table, status, created_at'
        });
    }
}

export const localDB = new TCEMSLocalDB();
