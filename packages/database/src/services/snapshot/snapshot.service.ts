import { SnapshotModel } from "@/models/snapshot";
import { Snapshot } from "@repo/shared/schema";
import { Types } from 'mongoose';

class SnapshotService {
    
    constructor(private readonly model: typeof SnapshotModel) {}

    async createSnapshot(snapshot: Omit<Snapshot, 'id'>): Promise<Snapshot> {
        const newSnapshot = await this.model.create(snapshot);
        return newSnapshot;
    }
    
    async getSnapshotById(id: string): Promise<Snapshot | null> {
        const snapshot = await this.model.findById(id);
        return snapshot;
    }

    async getLatestSnapshotByCanvasId(canvasId: string): Promise<Snapshot | null> {
        const snapshot = await this.model.findOne({ canvasId: new Types.ObjectId(canvasId) })
            .sort({ createdAt: -1 });
        return snapshot;
    }
    
    async updateSnapshot(id: string, data: Uint8Array): Promise<Snapshot | null> {
        const updatedSnapshot = await this.model.findByIdAndUpdate(
            id, 
            { data }, 
            { new: true }
        );
        return updatedSnapshot;
    }
    
    async deleteSnapshot(id: string): Promise<Snapshot | null> {
        const deletedSnapshot = await this.model.findByIdAndDelete(id);
        return deletedSnapshot;
    }

    async deleteSnapshotsByCanvasId(canvasId: string): Promise<void> {
        await this.model.deleteMany({ canvasId: new Types.ObjectId(canvasId) });
    }
}

export const snapshotService = new SnapshotService(SnapshotModel);
