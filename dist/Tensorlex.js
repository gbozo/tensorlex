var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as tf from '@tensorflow/tfjs';
const MAX_STRING_LENGTH = 20;
const VOCAB_SIZE = 128;
const EMBEDDING_DIM = 8;
let globalModel = null;
export function saveModel(path) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!globalModel) {
            console.error('No model to save!');
            return;
        }
        yield globalModel.save(`file://${path}`);
    });
}
export function loadModel(path) {
    return __awaiter(this, void 0, void 0, function* () {
        const model = yield tf.loadLayersModel(`file://${path}`);
        if (model instanceof tf.Sequential) {
            globalModel = model;
        }
        else {
            console.error('Loaded model is not a Sequential model.');
        }
    });
}
export function createEmbeddingModel() {
    const model = tf.sequential();
    model.add(tf.layers.embedding({
        inputDim: VOCAB_SIZE,
        outputDim: EMBEDDING_DIM,
        inputLength: MAX_STRING_LENGTH
    }));
    model.add(tf.layers.flatten());
    model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
    return model;
}
// export function cosineSimilarity(vectors: tf.Tensor[]): tf.Tensor {
//     const [a, b] = vectors;
//     const dotProduct = tf.sum(tf.mul(a, b));
//     const normA = tf.sqrt(tf.sum(tf.square(a)));
//     const normB = tf.sqrt(tf.sum(tf.square(b)));
//     return dotProduct.div(normA.mul(normB));
// }
export function cosineSimilarity(vectors) {
    const [a, b] = vectors;
    const dotProduct = tf.sum(tf.mul(a, b));
    const normA = tf.sqrt(tf.sum(tf.square(a)));
    const normB = tf.sqrt(tf.sum(tf.square(b)));
    return dotProduct.div(normA.mul(normB));
}
export function predictMatches(query, candidates, cutoffThreshold = 0.75) {
    return __awaiter(this, void 0, void 0, function* () {
        const embeddingModel = globalModel || createEmbeddingModel();
        const queryEmbedding = embeddingModel.predict(tf.tensor([stringToIntArray(query)]));
        let matches = [];
        let nonMatches = [];
        for (let i = 0; i < candidates.length; i++) {
            const candidate = candidates[i];
            const candidateEmbedding = embeddingModel.predict(tf.tensor([stringToIntArray(candidate)]));
            const similarity = cosineSimilarity([queryEmbedding, candidateEmbedding]).dataSync()[0];
            const result = {
                index: i,
                candidate: candidate,
                match: parseFloat(similarity.toFixed(2))
            };
            if (similarity >= cutoffThreshold) {
                matches.push(result);
            }
            else {
                nonMatches.push(result);
            }
        }
        matches.sort((a, b) => b.match - a.match);
        return { matches, nonMatches };
    });
}
function stringToIntArray(str) {
    const arr = [];
    for (let i = 0; i < str.length; i++) {
        arr.push(str.charCodeAt(i));
    }
    while (arr.length < MAX_STRING_LENGTH) {
        arr.push(0);
    }
    return arr;
}
export function trainModel(data, config = { epochs: 10, batchSize: 2 }) {
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
//# sourceMappingURL=Tensorlex.js.map