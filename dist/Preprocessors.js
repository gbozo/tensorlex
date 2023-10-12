export function chainPreprocessors(str, preprocessors) {
    for (let preprocessor of preprocessors) {
        str = preprocessor(str);
    }
    return str;
}
export function bulkPreprocess(strings, preprocessors) {
    return strings.map(s => chainPreprocessors(s, preprocessors));
}
export function removeNonASCII(str) {
    return str.replace(/[^\x00-\x7F]/g, "");
}
export function removeConsecutiveSpaces(str) {
    return str.replace(/\s+/g, ' ');
}
export function convertToLowercase(str) {
    return str.toLowerCase();
}
export function trimWhitespace(str) {
    return str.trim();
}
export function removeNumbers(str) {
    return str.replace(/[0-9]/g, '');
}
export function removeSpecialCharacters(str) {
    return str.replace(/[^a-zA-Z0-9\s]/g, '');
}
export function replaceAccentedChars(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
export function shortenRepeatedChars(str) {
    return str.replace(/(\w)\1+/g, '$1');
}
export function urlToPlaceholder(str) {
    return str.replace(/https?:\/\/[^\s]+/g, '[URL]');
}
export function removeEmails(str) {
    return str.replace(/[\w.-]+@[\w.-]+\.\w+/g, '');
}
const abbreviationMap = {
    "dr.": "doctor",
    "mr.": "mister",
    "mrs.": "missus",
    "ms.": "miss",
    // Add more as needed
};
export function expandAbbreviations(str) {
    const regex = new RegExp(Object.keys(abbreviationMap).join("|"), "gi");
    return str.replace(regex, (match) => abbreviationMap[match.toLowerCase()]);
}
export function numberToWords(num) {
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
export function expandNumbers(str) {
    const regex = /\b\d+\b/g; // Find standalone numbers
    return str.replace(regex, (match) => numberToWords(parseInt(match)));
}
export function separateLetterFromNumber(str) {
    // Insert space between letter and number if they are adjacent
    let result = str.replace(/([a-zA-Z])(\d)/g, '$1 $2');
    // Handle the reverse case, where a number is followed by a letter
    result = result.replace(/(\d)([a-zA-Z])/g, '$1 $2');
    return result;
}
//# sourceMappingURL=Preprocessors.js.map