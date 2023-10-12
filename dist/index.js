var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define("Preprocessors", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.separateLetterFromNumber = exports.expandNumbers = exports.numberToWords = exports.expandAbbreviations = exports.removeEmails = exports.urlToPlaceholder = exports.shortenRepeatedChars = exports.replaceAccentedChars = exports.removeSpecialCharacters = exports.removeNumbers = exports.trimWhitespace = exports.convertToLowercase = exports.removeConsecutiveSpaces = exports.removeNonASCII = exports.bulkPreprocess = exports.chainPreprocessors = void 0;
    function chainPreprocessors(str, preprocessors) {
        for (let preprocessor of preprocessors) {
            str = preprocessor(str);
        }
        return str;
    }
    exports.chainPreprocessors = chainPreprocessors;
    function bulkPreprocess(strings, preprocessors) {
        return strings.map(s => chainPreprocessors(s, preprocessors));
    }
    exports.bulkPreprocess = bulkPreprocess;
    function removeNonASCII(str) {
        return str.replace(/[^\x00-\x7F]/g, "");
    }
    exports.removeNonASCII = removeNonASCII;
    function removeConsecutiveSpaces(str) {
        return str.replace(/\s+/g, ' ');
    }
    exports.removeConsecutiveSpaces = removeConsecutiveSpaces;
    function convertToLowercase(str) {
        return str.toLowerCase();
    }
    exports.convertToLowercase = convertToLowercase;
    function trimWhitespace(str) {
        return str.trim();
    }
    exports.trimWhitespace = trimWhitespace;
    function removeNumbers(str) {
        return str.replace(/[0-9]/g, '');
    }
    exports.removeNumbers = removeNumbers;
    function removeSpecialCharacters(str) {
        return str.replace(/[^a-zA-Z0-9\s]/g, '');
    }
    exports.removeSpecialCharacters = removeSpecialCharacters;
    function replaceAccentedChars(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
    exports.replaceAccentedChars = replaceAccentedChars;
    function shortenRepeatedChars(str) {
        return str.replace(/(\w)\1+/g, '$1');
    }
    exports.shortenRepeatedChars = shortenRepeatedChars;
    function urlToPlaceholder(str) {
        return str.replace(/https?:\/\/[^\s]+/g, '[URL]');
    }
    exports.urlToPlaceholder = urlToPlaceholder;
    function removeEmails(str) {
        return str.replace(/[\w.-]+@[\w.-]+\.\w+/g, '');
    }
    exports.removeEmails = removeEmails;
    const abbreviationMap = {
        "dr.": "doctor",
        "mr.": "mister",
        "mrs.": "missus",
        "ms.": "miss",
        // Add more as needed
    };
    function expandAbbreviations(str) {
        const regex = new RegExp(Object.keys(abbreviationMap).join("|"), "gi");
        return str.replace(regex, (match) => abbreviationMap[match.toLowerCase()]);
    }
    exports.expandAbbreviations = expandAbbreviations;
    function numberToWords(num) {
        if (num === 0)
            return 'zero';
        const lessThan20 = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
        const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
        const thousands = ["", "thousand"];
        function helper(num) {
            if (num === 0)
                return "";
            else if (num < 20)
                return lessThan20[num] + " ";
            else if (num < 100)
                return tens[Math.floor(num / 10)] + " " + helper(num % 10);
            else if (num < 1000)
                return lessThan20[Math.floor(num / 100)] + " hundred " + helper(num % 100);
            else
                return lessThan20[Math.floor(num / 1000)] + " thousand " + helper(num % 1000);
        }
        return helper(num).trim();
    }
    exports.numberToWords = numberToWords;
    function expandNumbers(str) {
        const regex = /\b\d+\b/g; // Find standalone numbers
        return str.replace(regex, (match) => numberToWords(parseInt(match)));
    }
    exports.expandNumbers = expandNumbers;
    function separateLetterFromNumber(str) {
        // Insert space between letter and number if they are adjacent
        let result = str.replace(/([a-zA-Z])(\d)/g, '$1 $2');
        // Handle the reverse case, where a number is followed by a letter
        result = result.replace(/(\d)([a-zA-Z])/g, '$1 $2');
        return result;
    }
    exports.separateLetterFromNumber = separateLetterFromNumber;
});
define("Tensorlex", ["require", "exports", "@tensorflow/tfjs"], function (require, exports, tf) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.trainModel = exports.predictMatches = exports.cosineSimilarity = exports.createEmbeddingModel = exports.loadModel = exports.saveModel = void 0;
    tf = __importStar(tf);
    const MAX_STRING_LENGTH = 20;
    const VOCAB_SIZE = 128;
    const EMBEDDING_DIM = 8;
    let globalModel = null;
    function saveModel(path) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!globalModel) {
                console.error('No model to save!');
                return;
            }
            yield globalModel.save(`file://${path}`);
        });
    }
    exports.saveModel = saveModel;
    function loadModel(path) {
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
    exports.loadModel = loadModel;
    function createEmbeddingModel() {
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
    exports.createEmbeddingModel = createEmbeddingModel;
    // export function cosineSimilarity(vectors: tf.Tensor[]): tf.Tensor {
    //     const [a, b] = vectors;
    //     const dotProduct = tf.sum(tf.mul(a, b));
    //     const normA = tf.sqrt(tf.sum(tf.square(a)));
    //     const normB = tf.sqrt(tf.sum(tf.square(b)));
    //     return dotProduct.div(normA.mul(normB));
    // }
    function cosineSimilarity(vectors) {
        const [a, b] = vectors;
        const dotProduct = tf.sum(tf.mul(a, b));
        const normA = tf.sqrt(tf.sum(tf.square(a)));
        const normB = tf.sqrt(tf.sum(tf.square(b)));
        return dotProduct.div(normA.mul(normB));
    }
    exports.cosineSimilarity = cosineSimilarity;
    function predictMatches(query, candidates, cutoffThreshold = 0.75) {
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
    exports.predictMatches = predictMatches;
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
    function trainModel(data, config = { epochs: 10, batchSize: 2 }) {
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
    exports.trainModel = trainModel;
});
define("index", ["require", "exports", "Tensorlex", "Preprocessors"], function (require, exports, Tensorlex_1, Preprocessors_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.urlToPlaceholder = exports.trimWhitespace = exports.shortenRepeatedChars = exports.separateLetterFromNumber = exports.replaceAccentedChars = exports.removeSpecialCharacters = exports.removeNumbers = exports.removeNonASCII = exports.removeEmails = exports.removeConsecutiveSpaces = exports.numberToWords = exports.expandNumbers = exports.expandAbbreviations = exports.convertToLowercase = exports.chainPreprocessors = exports.bulkPreprocess = exports.trainModel = exports.saveModel = exports.predictMatches = exports.loadModel = exports.createEmbeddingModel = exports.cosineSimilarity = void 0;
    Object.defineProperty(exports, "cosineSimilarity", { enumerable: true, get: function () { return Tensorlex_1.cosineSimilarity; } });
    Object.defineProperty(exports, "createEmbeddingModel", { enumerable: true, get: function () { return Tensorlex_1.createEmbeddingModel; } });
    Object.defineProperty(exports, "loadModel", { enumerable: true, get: function () { return Tensorlex_1.loadModel; } });
    Object.defineProperty(exports, "predictMatches", { enumerable: true, get: function () { return Tensorlex_1.predictMatches; } });
    Object.defineProperty(exports, "saveModel", { enumerable: true, get: function () { return Tensorlex_1.saveModel; } });
    Object.defineProperty(exports, "trainModel", { enumerable: true, get: function () { return Tensorlex_1.trainModel; } });
    Object.defineProperty(exports, "bulkPreprocess", { enumerable: true, get: function () { return Preprocessors_1.bulkPreprocess; } });
    Object.defineProperty(exports, "chainPreprocessors", { enumerable: true, get: function () { return Preprocessors_1.chainPreprocessors; } });
    Object.defineProperty(exports, "convertToLowercase", { enumerable: true, get: function () { return Preprocessors_1.convertToLowercase; } });
    Object.defineProperty(exports, "expandAbbreviations", { enumerable: true, get: function () { return Preprocessors_1.expandAbbreviations; } });
    Object.defineProperty(exports, "expandNumbers", { enumerable: true, get: function () { return Preprocessors_1.expandNumbers; } });
    Object.defineProperty(exports, "numberToWords", { enumerable: true, get: function () { return Preprocessors_1.numberToWords; } });
    Object.defineProperty(exports, "removeConsecutiveSpaces", { enumerable: true, get: function () { return Preprocessors_1.removeConsecutiveSpaces; } });
    Object.defineProperty(exports, "removeEmails", { enumerable: true, get: function () { return Preprocessors_1.removeEmails; } });
    Object.defineProperty(exports, "removeNonASCII", { enumerable: true, get: function () { return Preprocessors_1.removeNonASCII; } });
    Object.defineProperty(exports, "removeNumbers", { enumerable: true, get: function () { return Preprocessors_1.removeNumbers; } });
    Object.defineProperty(exports, "removeSpecialCharacters", { enumerable: true, get: function () { return Preprocessors_1.removeSpecialCharacters; } });
    Object.defineProperty(exports, "replaceAccentedChars", { enumerable: true, get: function () { return Preprocessors_1.replaceAccentedChars; } });
    Object.defineProperty(exports, "separateLetterFromNumber", { enumerable: true, get: function () { return Preprocessors_1.separateLetterFromNumber; } });
    Object.defineProperty(exports, "shortenRepeatedChars", { enumerable: true, get: function () { return Preprocessors_1.shortenRepeatedChars; } });
    Object.defineProperty(exports, "trimWhitespace", { enumerable: true, get: function () { return Preprocessors_1.trimWhitespace; } });
    Object.defineProperty(exports, "urlToPlaceholder", { enumerable: true, get: function () { return Preprocessors_1.urlToPlaceholder; } });
});
//# sourceMappingURL=index.js.map