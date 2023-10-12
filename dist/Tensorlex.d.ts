declare module "Preprocessors" {
    export interface Preprocessor {
        (input: string): string;
    }
    export function chainPreprocessors(str: string, preprocessors: Function[]): string;
    export function bulkPreprocess(strings: string[], preprocessors: Function[]): string[];
    export function removeNonASCII(str: string): string;
    export function removeConsecutiveSpaces(str: string): string;
    export function convertToLowercase(str: string): string;
    export function trimWhitespace(str: string): string;
    export function removeNumbers(str: string): string;
    export function removeSpecialCharacters(str: string): string;
    export function replaceAccentedChars(str: string): string;
    export function shortenRepeatedChars(str: string): string;
    export function urlToPlaceholder(str: string): string;
    export function removeEmails(str: string): string;
    export function expandAbbreviations(str: string): string;
    export function numberToWords(num: number): string;
    export function expandNumbers(str: string): string;
    export function separateLetterFromNumber(str: string): string;
}
declare module "Tensorlex" {
    import * as tf from '@tensorflow/tfjs';
    export function saveModel(path: string): Promise<void>;
    export function loadModel(path: string): Promise<void>;
    export function createEmbeddingModel(): tf.Sequential;
    export function cosineSimilarity(vectors: [tf.Tensor, tf.Tensor]): tf.Tensor;
    export function predictMatches(query: string, candidates: string[], cutoffThreshold?: number): Promise<{
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
    export function trainModel(data: TrainingData, config?: TrainConfig): Promise<tf.History>;
}
//# sourceMappingURL=tensorlex.d.ts.map