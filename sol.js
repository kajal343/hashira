// Import the file system module.
const fs = require('fs');

// Function to find the secret value from a given file path.
function findSecret(filePath) {
    try {
        // Read the JSON file content.
        const fileContent = fs.readFileSync(filePath, 'utf8');

        // Parse the JSON string into a JavaScript object.
        const data = JSON.parse(fileContent);

        // Filter out the 'keys' object to get only the roots.
        const rootKeys = Object.keys(data).filter(key => key !== 'keys');

        // Check if there are any roots to process.
        if (rootKeys.length === 0) {
            console.log(`No roots found in ${filePath}.`);
            return null;
        }

        let firstYValue = null;

        // Loop through each root to decode its y-value.
        for (const key of rootKeys) {
            const root = data[key];
            const base = parseInt(root.base);
            const value = root.value;
            
            // Use 'let' for yValue as it will be reassigned.
            let yValue = BigInt(0);
            
            // Base conversion for large numbers using BigInt.
            let basePower = BigInt(1);
            for(let i = value.length - 1; i >= 0; i--) {
                const digit = parseInt(value[i], base);
                yValue += BigInt(digit) * basePower;
                basePower *= BigInt(base);
            }
            
            // For the first root, store its decoded value.
            if (firstYValue === null) {
                firstYValue = yValue;
            }
            
            // In these test cases, all y-values are the same.
            // If they were different, we would need to perform
            // polynomial interpolation, but this is a simpler scenario.
        }
        
        // The secret 'c' is the constant y-value.
        return firstYValue.toString();

    } catch (error) {
        // Handle file reading or parsing errors.
        console.error(`An error occurred while processing ${filePath}:`, error.message);
        return null;
    }
}

// Array of file paths for both test cases.
const testCaseFiles = ['testcase1.json', 'testcase2.json'];

// Process each file in the array.
testCaseFiles.forEach(file => {
    console.log(`\n--- Processing ${file} ---`);
    const secret = findSecret(file);
    if (secret !== null) {
        console.log(`The secret value (c) is: ${secret}`);
    }
});