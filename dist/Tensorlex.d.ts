import * as tf from '@tensorflow/tfjs';
export declare function saveModel(path: string): Promise<void>;
export declare function loadModel(path: string): Promise<void>;
export declare function createEmbeddingModel(): tf.Sequential;
export declare function cosineSimilarity(vectors: [tf.Tensor, tf.Tensor]): tf.Tensor;
export declare function predictMatches(query: string, candidates: string[], cutoffThreshold?: number): Promise<{
    matches: {
        index: number;
        candidate: string;
        match: number;
    }[];
    nonMatches: {
        index: number;
        candidate: string;
        match: number;
    }[];
}>;
export interface TensorLexResult {
    index: number;
    candidate: string;
    match: number;
}
export interface TrainingData {
    inputs: string[];
    labels: number[];
}
export interface TrainConfig {
    epochs?: number;
    batchSize?: number;
}
export declare function trainModel(data: TrainingData, config?: TrainConfig): Promise<tf.History>;
//# sourceMappingURL=Tensorlex.d.ts.map