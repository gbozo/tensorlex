import { predictMatches, trainModel , bulkPreprocess, chainPreprocessors, convertToLowercase, removeConsecutiveSpaces, removeNonASCII } from "../dist/Tensorlex";

// Training
const trainingData = {
    inputs: ['hello', 'world', 'foo', 'bar'],
    labels: [1, 0, 1, 0] // 1 if match, 0 otherwise
};

trainModel(trainingData).then(history => {
    console.log('Training complete.');
    const preprocessors = [removeNonASCII, removeConsecutiveSpaces, convertToLowercase];
    // Predicting
    const preprocessedQuery = chainPreprocessors("Hello  World!", preprocessors);
    const preprocessedCandidates = bulkPreprocess(["world", "hella", "HeLiCopTer", "Hello", "hELLo  World!!"], preprocessors);

    predictMatches(preprocessedQuery, preprocessedCandidates).then(results => {
        console.log("Matches:", results.matches);
        console.log("Non-matches:", results.nonMatches);
    });
});
