const trainingData = {
    inputs: [
        'Microsoft', 'Microsfot', 'MS', 'Micro', 'Micorsoft Corp', 'Microsft', // Variations of "Microsoft"
        'Apple Inc.', 'Aple', 'Apple', 'Appl', 'AAPL', 'Apple Co', // Variations of "Apple Inc."
        'Google', 'Googol', 'Googl', 'Alphabet', 'Gooogle', // Variations of "Google"
        'Adidas', 'Addidas', 'Adiddas', 'Adi', // Variations of "Adidas"
        'PepsiCo', 'Pepsi', 'Pepsico', 'Pepsi Company', // Variations of "PepsiCo"
        'Hello', 'World', 'Tree', 'Ocean', 'Mountain' // Random words as negative examples
    ],
    labels: [
        1, 1, 1, 1, 1, 1, // Matches for "Microsoft"
        1, 1, 1, 1, 1, 1, // Matches for "Apple Inc."
        1, 1, 1, 1, 1, // Matches for "Google"
        1, 1, 1, 1, // Matches for "Adidas"
        1, 1, 1, 1, // Matches for "PepsiCo"
        0, 0, 0, 0, 0 // Non-matches
    ]
};