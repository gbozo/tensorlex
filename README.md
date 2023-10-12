# tensorlex
Typescript package - Advanced Textual Analysis &amp; Matching using Deep Learning
<code>
// example with load
import {
    trainModel,
    predictMatches,
    saveModel,
    loadModel,
    TrainingData
} from'../dist/Tensorlex';  // Adjust path based on your setup
import {
    chainPreprocessors,
    bulkPreprocess,
    removeNonASCII,
    removeConsecutiveSpaces,
    convertToLowercase,
} from'../dist/Preprocessors';  // Adjust path based on your setup


// Define preprocessors
const preprocessors = [removeNonASCII, removeConsecutiveSpaces, convertToLowercase];

// Sample Training Data
const trainingData: TrainingData = {
    inputs: [
        'Microsoft', 'Microsfot', 'MS', 'Micro', 'Micorsoft Corp', 'Microsft',
        'Apple Inc.', 'Aple', 'Apple', 'Appl', 'AAPL', 'Apple Co',
        'Google', 'Googol', 'Googl', 'Alphabet', 'Gooogle',
        'Adidas', 'Addidas', 'Adiddas', 'Adi',
        'PepsiCo', 'Pepsi', 'Pepsico', 'Pepsi Company',
        'Hello', 'World', 'Tree', 'Ocean', 'Mountain'
    ],
    labels: [
        1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1,
        1, 1, 1, 1,
        1, 1, 1, 1,
        0, 0, 0, 0, 0
    ]
};

// Preprocess, Train, and Predict
async function main() {
    const preprocessedTrainingInputs = bulkPreprocess(trainingData.inputs, preprocessors);

    // Train the model
    await trainModel({ inputs: preprocessedTrainingInputs, labels: trainingData.labels });
    // After training
    await saveModel('./savedModel');

    // If you want to load an already trained model instead of training again
   // await loadModel('./savedModel');
    
    // Prepare sample queries and candidates
    const query = "Microsoft Corp";
    const candidates = ["Micosoft", "Microsft Co", "MSFT", "Mcrosoft Corporation", "Appl"];

    const preprocessedQuery = chainPreprocessors(query, preprocessors);
    const preprocessedCandidates = bulkPreprocess(candidates, preprocessors);

    // Get predictions
    const results = await predictMatches(preprocessedQuery, preprocessedCandidates);
    console.log("Matches:", results.matches);
    console.log("Non-matches:", results.nonMatches);
}

// Run the main function
main();
</code>
