import { CanvasModel } from "@/models/canvas";
import { Canvas } from "@repo/shared/schema";

 class CanvasService {
    
    constructor(private readonly model: typeof CanvasModel) {}

    async createCanvas(canvas: Omit<Canvas, 'id'>): Promise<Canvas> {
        const newCanvas = await this.model.create(canvas);
        return newCanvas;
    }
    
    async getCanvasById(id: string): Promise<Canvas | null> {
        const canvas = await this.model.findById(id);
        return canvas;
    }
    
    async updateCanvas(id: string, canvas: Omit<Canvas, 'id'>): Promise<Canvas | null> {
        const updatedCanvas = await this.model.findByIdAndUpdate(id, canvas, { new: true });
        return updatedCanvas;
    }
    
    async deleteCanvas(id: string): Promise<Canvas | null> {
        const deletedCanvas = await this.model.findByIdAndDelete(id);
        return deletedCanvas;
    }
}

export const canvasService = new CanvasService(CanvasModel);