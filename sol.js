const fs = require('fs');

function findSecret(filePath) {
    try {
        
        const fileContent = fs.readFileSync(filePath, 'utf8');

        const data = JSON.parse(fileContent);

        const rootKeys = Object.keys(data).filter(key => key !== 'keys');

        if (rootKeys.length === 0) {
            console.log(`No roots found in ${filePath}.`);
            return null;
        }

        let firstYValue = null;

        for (const key of rootKeys) {
            const root = data[key];
            const base = parseInt(root.base);
            const value = root.value;
            
            let yValue = BigInt(0);
            
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
            
            
        }
        
        return firstYValue.toString();

    } catch (error) {
        console.error(`An error occurred while processing ${filePath}:`, error.message);
        return null;
    }
}

const testCaseFiles = ['testcase1.json', 'testcase2.json'];

testCaseFiles.forEach(file => {
    console.log(`\n--- Processing ${file} ---`);
    const secret = findSecret(file);
    if (secret !== null) {
        console.log(`The secret value c: ${secret}`);
    }
});