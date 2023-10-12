import * as tf from '@tensorflow/tfjs';

const MAX_STRING_LENGTH = 20;
const VOCAB_SIZE = 128; 
const EMBEDDING_DIM = 8; 
let globalModel: tf.Sequential | null = null;

export async function saveModel(path: string): Promise<void> {
    if (!globalModel) {
        console.error('No model to save!');
        return;
    }

    await globalModel.save(`file://${path}`);
}

export async function loadModel(path: string): Promise<void> {
    const model = await tf.loadLayersModel(`file://${path}`);
    if (model instanceof tf.Sequential) {
        globalModel = model;
    } else {
        console.error('Loaded model is not a Sequential model.');
    }
}

export function createEmbeddingModel() {
    const model = tf.sequential();

    model.add(tf.layers.embedding({
        inputDim: VOCAB_SIZE,
        outputDim: EMBEDDING_DIM,
        inputLength: MAX_STRING_LENGTH
    }));
    
    model.add(tf.layers.flatten());
    model.add(tf.layers.dense({units: 32, activation: 'relu'}));

    return model;
}

// export function cosineSimilarity(vectors: tf.Tensor[]): tf.Tensor {
//     const [a, b] = vectors;
//     const dotProduct = tf.sum(tf.mul(a, b));
//     const normA = tf.sqrt(tf.sum(tf.square(a)));
//     const normB = tf.sqrt(tf.sum(tf.square(b)));
//     return dotProduct.div(normA.mul(normB));
// }
export function cosineSimilarity(vectors: [tf.Tensor, tf.Tensor]): tf.Tensor {
    const [a, b] = vectors;
    const dotProduct = tf.sum(tf.mul(a, b));
    const normA = tf.sqrt(tf.sum(tf.square(a)));
    const normB = tf.sqrt(tf.sum(tf.square(b)));
    return dotProduct.div(normA.mul(normB));
}

export async function predictMatches(query: string, candidates: string[], cutoffThreshold: number = 0.75) {
    const embeddingModel = globalModel || createEmbeddingModel();    
    const queryEmbedding: tf.Tensor = embeddingModel.predict(tf.tensor([stringToIntArray(query)])) as tf.Tensor;
    
    let matches: {index: number, candidate: string, match: number}[] = [];
    let nonMatches: {index: number, candidate: string, match: number}[] = [];
    
    for (let i = 0; i < candidates.length; i++) {
        const candidate = candidates[i];
        const candidateEmbedding: tf.Tensor = embeddingModel.predict(tf.tensor([stringToIntArray(candidate)])) as tf.Tensor;
        const similarity = cosineSimilarity([queryEmbedding, candidateEmbedding]).dataSync()[0];
        const result = {
            index: i,
            candidate: candidate,
            match: parseFloat(similarity.toFixed(2))
        };
        
        if (similarity >= cutoffThreshold) {
            matches.push(result);
        } else {
            nonMatches.push(result);
        }
    }
    
    matches.sort((a, b) => b.match - a.match);
    return {matches, nonMatches};
}

function stringToIntArray(str: string): number[] {
    const arr: number[] = [];
    for (let i = 0; i < str.length; i++) {
        arr.push(str.charCodeAt(i));
    }
    while (arr.length < MAX_STRING_LENGTH) {
        arr.push(0);
    }
    return arr;
}
export interface TensorLexResult {
    index: number;
    candidate: string;
    match: number;
}

export interface TrainingData {
    inputs: string[];
    labels: number[]; // 1 for a match, 0 for a non-match
}

export interface TrainConfig {
    epochs?: number;
    batchSize?: number;
}




export function trainModel(data: TrainingData, config: TrainConfig = {epochs: 10, batchSize: 2}): Promise<tf.History> {
    const model = createEmbeddingModel();
    globalModel = model;

    const x = data.inputs.map(stringToIntArray);
    const y = data.labels.map(label => [label === 1 ? 1 : 0, label === 1 ? 0 : 1]);

    const xs = tf.tensor(x, [x.length, MAX_STRING_LENGTH]);
    const ys = tf.tensor(y, [y.length, 2]);

    model.compile({
        optimizer: 'adam',
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
    });

    return model.fit(xs, ys, {
        epochs: config.epochs,
        batchSize: config.batchSize
    });
}

export interface Preprocessor {
    (input: string): string;
}

export function chainPreprocessors(str: string, preprocessors: Function[]): string {
    for (let preprocessor of preprocessors) {
        str = preprocessor(str);
    }
    return str;
}

export function bulkPreprocess(strings: string[], preprocessors: Function[]): string[] {
    return strings.map(s => chainPreprocessors(s, preprocessors));
}

export function removeNonASCII(str: string): string {
    return str.replace(/[^\x00-\x7F]/g, "");
}

export function removeConsecutiveSpaces(str: string): string {
    return str.replace(/\s+/g, ' ');
}

export function convertToLowercase(str: string): string {
    return str.toLowerCase();
}
export function trimWhitespace(str: string): string {
    return str.trim();
}
export function removeNumbers(str: string): string {
    return str.replace(/[0-9]/g, '');
}
export function removeSpecialCharacters(str: string): string {
    return str.replace(/[^a-zA-Z0-9\s]/g, '');
}
export function replaceAccentedChars(str: string): string {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
export function shortenRepeatedChars(str: string): string {
    return str.replace(/(\w)\1+/g, '$1');
}
export function urlToPlaceholder(str: string): string {
    return str.replace(/https?:\/\/[^\s]+/g, '[URL]');
}
export function removeEmails(str: string): string {
    return str.replace(/[\w.-]+@[\w.-]+\.\w+/g, '');
}
const abbreviationMap: { [key: string]: string } = {
    "dr.": "doctor",
    "mr.": "mister",
    "mrs.": "missus",
    "ms.": "miss",
    // Add more as needed
};

export function expandAbbreviations(str: string): string {
    const regex = new RegExp(Object.keys(abbreviationMap).join("|"), "gi");
    return str.replace(regex, (match) => abbreviationMap[match.toLowerCase()]);
}
export function numberToWords(num: number): string {
    if (num === 0) return 'zero';

    const lessThan20 = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
    const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
    const thousands = ["", "thousand"];

    function helper(num: number): string {
        if (num === 0) return "";
        else if (num < 20) return lessThan20[num] + " ";
        else if (num < 100) return tens[Math.floor(num / 10)] + " " + helper(num % 10);
        else if (num < 1000) return lessThan20[Math.floor(num / 100)] + " hundred " + helper(num % 100);
        else return lessThan20[Math.floor(num / 1000)] + " thousand " + helper(num % 1000);
    }

    return helper(num).trim();
}

export function expandNumbers(str: string): string {
    const regex = /\b\d+\b/g; // Find standalone numbers
    return str.replace(regex, (match) => numberToWords(parseInt(match)));
}
export function separateLetterFromNumber(str: string): string {
    // Insert space between letter and number if they are adjacent
    let result = str.replace(/([a-zA-Z])(\d)/g, '$1 $2'); 
    // Handle the reverse case, where a number is followed by a letter
    result = result.replace(/(\d)([a-zA-Z])/g, '$1 $2');
    return result;
}
