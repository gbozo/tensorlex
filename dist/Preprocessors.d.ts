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
//# sourceMappingURL=Preprocessors.d.ts.map