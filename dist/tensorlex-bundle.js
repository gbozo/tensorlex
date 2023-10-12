var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
System.register("Preprocessors", [], function (exports_1, context_1) {
    "use strict";
    var abbreviationMap;
    var __moduleName = context_1 && context_1.id;
    function chainPreprocessors(str, preprocessors) {
        for (let preprocessor of preprocessors) {
            str = preprocessor(str);
        }
        return str;
    }
    exports_1("chainPreprocessors", chainPreprocessors);
    function bulkPreprocess(strings, preprocessors) {
        return strings.map(s => chainPreprocessors(s, preprocessors));
    }
    exports_1("bulkPreprocess", bulkPreprocess);
    function removeNonASCII(str) {
        return str.replace(/[^\x00-\x7F]/g, "");
    }
    exports_1("removeNonASCII", removeNonASCII);
    function removeConsecutiveSpaces(str) {
        return str.replace(/\s+/g, ' ');
    }
    exports_1("removeConsecutiveSpaces", removeConsecutiveSpaces);
    function convertToLowercase(str) {
        return str.toLowerCase();
    }
    exports_1("convertToLowercase", convertToLowercase);
    function trimWhitespace(str) {
        return str.trim();
    }
    exports_1("trimWhitespace", trimWhitespace);
    function removeNumbers(str) {
        return str.replace(/[0-9]/g, '');
    }
    exports_1("removeNumbers", removeNumbers);
    function removeSpecialCharacters(str) {
        return str.replace(/[^a-zA-Z0-9\s]/g, '');
    }
    exports_1("removeSpecialCharacters", removeSpecialCharacters);
    function replaceAccentedChars(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
    exports_1("replaceAccentedChars", replaceAccentedChars);
    function shortenRepeatedChars(str) {
        return str.replace(/(\w)\1+/g, '$1');
    }
    exports_1("shortenRepeatedChars", shortenRepeatedChars);
    function urlToPlaceholder(str) {
        return str.replace(/https?:\/\/[^\s]+/g, '[URL]');
    }
    exports_1("urlToPlaceholder", urlToPlaceholder);
    function removeEmails(str) {
        return str.replace(/[\w.-]+@[\w.-]+\.\w+/g, '');
    }
    exports_1("removeEmails", removeEmails);
    function expandAbbreviations(str) {
        const regex = new RegExp(Object.keys(abbreviationMap).join("|"), "gi");
        return str.replace(regex, (match) => abbreviationMap[match.toLowerCase()]);
    }
    exports_1("expandAbbreviations", expandAbbreviations);
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
    exports_1("numberToWords", numberToWords);
    function expandNumbers(str) {
        const regex = /\b\d+\b/g; // Find standalone numbers
        return str.replace(regex, (match) => numberToWords(parseInt(match)));
    }
    exports_1("expandNumbers", expandNumbers);
    function separateLetterFromNumber(str) {
        // Insert space between letter and number if they are adjacent
        let result = str.replace(/([a-zA-Z])(\d)/g, '$1 $2');
        // Handle the reverse case, where a number is followed by a letter
        result = result.replace(/(\d)([a-zA-Z])/g, '$1 $2');
        return result;
    }
    exports_1("separateLetterFromNumber", separateLetterFromNumber);
    return {
        setters: [],
        execute: function () {
            abbreviationMap = {
                "dr.": "doctor",
                "mr.": "mister",
                "mrs.": "missus",
                "ms.": "miss",
                // Add more as needed
            };
        }
    };
});
System.register("Tensorlex", ["@tensorflow/tfjs"], function (exports_2, context_2) {
    "use strict";
    var tf, MAX_STRING_LENGTH, VOCAB_SIZE, EMBEDDING_DIM, globalModel;
    var __moduleName = context_2 && context_2.id;
    function saveModel(path) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!globalModel) {
                console.error('No model to save!');
                return;
            }
            yield globalModel.save(`file://${path}`);
        });
    }
    exports_2("saveModel", saveModel);
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
    exports_2("loadModel", loadModel);
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
    exports_2("createEmbeddingModel", createEmbeddingModel);
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
    exports_2("cosineSimilarity", cosineSimilarity);
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
    exports_2("predictMatches", predictMatches);
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
    exports_2("trainModel", trainModel);
    return {
        setters: [
            function (tf_1) {
                tf = tf_1;
            }
        ],
        execute: function () {
            MAX_STRING_LENGTH = 20;
            VOCAB_SIZE = 128;
            EMBEDDING_DIM = 8;
            globalModel = null;
        }
    };
});
//# sourceMappingURL=tensorlex-bundle.js.map