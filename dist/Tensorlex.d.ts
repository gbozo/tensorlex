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
export interface Preprocessor {
    (input: string): string;
}
export declare function chainPreprocessors(str: string, preprocessors: Function[]): string;
export declare function bulkPreprocess(strings: string[], preprocessors: Function[]): string[];
export declare function removeNonASCII(str: string): string;
export declare function removeConsecutiveSpaces(str: string): string;
export declare function convertToLowercase(str: string): string;
export declare function trimWhitespace(str: string): string;
export declare function removeNumbers(str: string): string;
export declare function removeSpecialCharacters(str: string): string;
export declare function replaceAccentedChars(str: string): string;
export declare function shortenRepeatedChars(str: string): string;
export declare function urlToPlaceholder(str: string): string;
export declare function removeEmails(str: string): string;
export declare function expandAbbreviations(str: string): string;
export declare function numberToWords(num: number): string;
export declare function expandNumbers(str: string): string;
export declare function separateLetterFromNumber(str: string): string;
//# sourceMappingURL=Tensorlex.d.ts.map