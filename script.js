// Global variables
let animationSpeed = 1000;
let currentStep = 0;
let lastOperation = null;
let lastResult = '';

// Utility function for delays
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms / document.getElementById('speedSlider').value));
}

// Utility function for modular exponentiation
function modPow(base, exp, mod) {
    if (mod === 1) return 0;
    let result = 1;
    base = base % mod;
    while (exp > 0) {
        if (exp % 2 === 1) {
            result = (result * base) % mod;
        }
        exp = Math.floor(exp / 2);
        base = (base * base) % mod;
    }
    return result;
}

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    updateCipherInfo();
    
    // Speed slider event listener
    const speedSlider = document.getElementById('speedSlider');
    const speedValue = document.getElementById('speedValue');
    
    speedSlider.addEventListener('input', function() {
        speedValue.textContent = this.value + 'x';
    });
});

// Main cipher functions
async function startEncryption() {
    try {
        const text = document.getElementById('plainText').value.trim();
        const cipher = document.getElementById('cipherSelect').value;
        const key = document.getElementById('cipherKey').value.trim();
        
        if (!text) {
            throw new Error("Please enter text to encrypt");
        }
        
        currentStep = 0;
        document.getElementById('stepCount').textContent = currentStep;
        document.getElementById('visTitle').textContent = `Encrypting with ${getCipherName(cipher)}...`;
        
        const result = await processCipher(text, key, cipher, true);
        
        document.getElementById('resultText').textContent = result;
        document.getElementById('visTitle').textContent = `Encryption Complete - ${getCipherName(cipher)}`;
        document.getElementById('reverseBtn').style.display = 'inline-block';
        
        lastOperation = { text, key, cipher, isEncrypt: true };
        lastResult = result;
        
    } catch (error) {
        showError(error.message);
    }
}

async function startDecryption() {
    try {
        const text = document.getElementById('plainText').value.trim();
        const cipher = document.getElementById('cipherSelect').value;
        const key = document.getElementById('cipherKey').value.trim();
        
        if (!text) {
            throw new Error("Please enter text to decrypt");
        }
        
        currentStep = 0;
        document.getElementById('stepCount').textContent = currentStep;
        document.getElementById('visTitle').textContent = `Decrypting with ${getCipherName(cipher)}...`;
        
        const result = await processCipher(text, key, cipher, false);
        
        document.getElementById('resultText').textContent = result;
        document.getElementById('visTitle').textContent = `Decryption Complete - ${getCipherName(cipher)}`;
        document.getElementById('reverseBtn').style.display = 'inline-block';
        
        lastOperation = { text, key, cipher, isEncrypt: false };
        lastResult = result;
        
    } catch (error) {
        showError(error.message);
    }
}

async function processCipher(text, key, cipher, isEncrypt) {
    switch (cipher) {
        case 'caesar': return await animateCaesar(text, key, isEncrypt);
        case 'atbash': return await animateAtbash(text, key, isEncrypt);
        case 'substitution': return await animateSubstitution(text, key, isEncrypt);
        case 'affine': return await animateAffine(text, key, isEncrypt);
        case 'vigenere': return await animateVigenere(text, key, isEncrypt);
        case 'playfair': return await animatePlayfair(text, key, isEncrypt);
        case 'beaufort': return await animateBeaufort(text, key, isEncrypt);
        case 'hill': return await animateHill(text, key, isEncrypt);
        case 'columnar': return await animateColumnar(text, key, isEncrypt);
        case 'rail_fence': return await animateRailFence(text, key, isEncrypt);
        case 'scytale': return await animateScytale(text, key, isEncrypt);
        case 'route': return await animateRoute(text, key, isEncrypt);
        case 'des': return await animateDES(text, key, isEncrypt);
        case 'triple_des': return await animateTripleDES(text, key, isEncrypt);
        case 'aes': return await animateAES(text, key, isEncrypt);
        case 'feistel': return await animateFeistel(text, key, isEncrypt);
        case 'stream': return await animateStream(text, key, isEncrypt);
        case 'rsa': return await animateRSA(text, key, isEncrypt);
        case 'diffie_hellman': return await animateDiffieHellman(text, key, isEncrypt);
        case 'ecc': return await animateECC(text, key, isEncrypt);
        case 'one_time_pad': return await animateOneTimePad(text, key, isEncrypt);
        case 'xor': return await animateXOR(text, key, isEncrypt);
        case 'base64': return await animateBase64(text, key, isEncrypt);
        case 'morse': return await animateMorse(text, key, isEncrypt);
        default: throw new Error("Cipher not implemented");
    }
}

// Caesar Cipher Animation
async function animateCaesar(text, key, isEncrypt) {
    const shift = parseInt(key) || 0;
    if (shift === 0) throw new Error("Caesar cipher requires a numeric shift value");
    
    const container = document.getElementById('animationContainer');
    container.innerHTML = `
        <div class="process-info">
            <strong>Caesar Cipher:</strong> Each letter is shifted by ${shift} positions in the alphabet.
        </div>
        <div class="key-display">Shift: ${shift}</div>
    `;
    
    const inputRow = document.createElement('div');
    inputRow.className = 'character-row';
    
    const outputRow = document.createElement('div');
    outputRow.className = 'character-row';
    
    let result = '';
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const inputBox = document.createElement('div');
        inputBox.className = 'char-box';
        inputBox.textContent = char;
        inputRow.appendChild(inputBox);
        
        const outputBox = document.createElement('div');
        outputBox.className = 'char-box';
        outputBox.textContent = '?';
        outputRow.appendChild(outputBox);
    }
    
    container.appendChild(inputRow);
    container.appendChild(outputRow);
    
    await sleep(animationSpeed);
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        let newChar = char;
        
        if (char.match(/[A-Za-z]/)) {
            const isUpper = char === char.toUpperCase();
            const base = isUpper ? 65 : 97;
            const charCode = char.charCodeAt(0) - base;
            const shiftedCode = isEncrypt ? 
                (charCode + shift) % 26 : 
                (charCode - shift + 26) % 26;
            newChar = String.fromCharCode(shiftedCode + base);
        }
        
        inputRow.children[i].classList.add('processing');
        currentStep++;
        document.getElementById('stepCount').textContent = currentStep;
        
        await sleep(animationSpeed / 2);
        
        inputRow.children[i].classList.remove('processing');
        inputRow.children[i].classList.add('encrypted');
        outputRow.children[i].textContent = newChar;
        outputRow.children[i].classList.add('decrypted');
        
        result += newChar;
    }
    
    return result;
}

// Atbash Cipher Animation
async function animateAtbash(text, key, isEncrypt) {
    const container = document.getElementById('animationContainer');
    container.innerHTML = `
        <div class="process-info">
            <strong>Atbash Cipher:</strong> Each letter is replaced with its mirror position in the alphabet (A↔Z, B↔Y, etc.).
        </div>
        <div class="key-display">Alphabet: ABCDEFGHIJKLMNOPQRSTUVWXYZ<br>Mirror: ZYXWVUTSRQPONMLKJIHGFEDCBA</div>
    `;
    
    const inputRow = document.createElement('div');
    inputRow.className = 'character-row';
    
    const outputRow = document.createElement('div');
    outputRow.className = 'character-row';
    
    let result = '';
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const inputBox = document.createElement('div');
        inputBox.className = 'char-box';
        inputBox.textContent = char;
        inputRow.appendChild(inputBox);
        
        const outputBox = document.createElement('div');
        outputBox.className = 'char-box';
        outputBox.textContent = '?';
        outputRow.appendChild(outputBox);
    }
    
    container.appendChild(inputRow);
    container.appendChild(outputRow);
    
    await sleep(animationSpeed);
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        let newChar = char;
        
        if (char.match(/[A-Za-z]/)) {
            const isUpper = char === char.toUpperCase();
            const base = isUpper ? 65 : 97;
            const charCode = char.charCodeAt(0) - base;
            const mirrorCode = 25 - charCode;
            newChar = String.fromCharCode(mirrorCode + base);
        }
        
        inputRow.children[i].classList.add('processing');
        currentStep++;
        document.getElementById('stepCount').textContent = currentStep;
        
        await sleep(animationSpeed / 2);
        
        inputRow.children[i].classList.remove('processing');
        inputRow.children[i].classList.add('encrypted');
        outputRow.children[i].textContent = newChar;
        outputRow.children[i].classList.add('decrypted');
        
        result += newChar;
    }
    
    return result;
}

// Simple Substitution Cipher Animation
async function animateSubstitution(text, key, isEncrypt) {
    if (!key || key.length !== 26) {
        throw new Error("Substitution cipher requires a 26-character key (one for each letter of the alphabet)");
    }
    
    const container = document.getElementById('animationContainer');
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const upperKey = key.toUpperCase();
    
    container.innerHTML = `
        <div class="process-info">
            <strong>Simple Substitution:</strong> Each letter is replaced according to a substitution key.
        </div>
        <div class="key-display">
            Alphabet: ${alphabet}<br>
            Key: ${upperKey}
        </div>
    `;
    
    const inputRow = document.createElement('div');
    inputRow.className = 'character-row';
    
    const outputRow = document.createElement('div');
    outputRow.className = 'character-row';
    
    let result = '';
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const inputBox = document.createElement('div');
        inputBox.className = 'char-box';
        inputBox.textContent = char;
        inputRow.appendChild(inputBox);
        
        const outputBox = document.createElement('div');
        outputBox.className = 'char-box';
        outputBox.textContent = '?';
        outputRow.appendChild(outputBox);
    }
    
    container.appendChild(inputRow);
    container.appendChild(outputRow);
    
    await sleep(animationSpeed);
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        let newChar = char;
        
        if (char.match(/[A-Za-z]/)) {
            const isUpper = char === char.toUpperCase();
            const upperChar = char.toUpperCase();
            const index = alphabet.indexOf(upperChar);
            
            if (isEncrypt) {
                newChar = isUpper ? upperKey[index] : upperKey[index].toLowerCase();
            } else {
                const keyIndex = upperKey.indexOf(upperChar);
                newChar = isUpper ? alphabet[keyIndex] : alphabet[keyIndex].toLowerCase();
            }
        }
        
        inputRow.children[i].classList.add('processing');
        currentStep++;
        document.getElementById('stepCount').textContent = currentStep;
        
        await sleep(animationSpeed / 2);
        
        inputRow.children[i].classList.remove('processing');
        inputRow.children[i].classList.add('encrypted');
        outputRow.children[i].textContent = newChar;
        outputRow.children[i].classList.add('decrypted');
        
        result += newChar;
    }
    
    return result;
}

// Affine Cipher Animation
async function animateAffine(text, key, isEncrypt) {
    const params = key.split(',').map(x => parseInt(x.trim()));
    if (params.length !== 2 || isNaN(params[0]) || isNaN(params[1])) {
        throw new Error("Affine cipher requires two comma-separated numbers (a,b)");
    }
    
    const [a, b] = params;
    
    // Check if 'a' is coprime with 26
    function gcd(a, b) {
        return b === 0 ? a : gcd(b, a % b);
    }
    
    if (gcd(a, 26) !== 1) {
        throw new Error("Parameter 'a' must be coprime with 26");
    }
    
    const container = document.getElementById('animationContainer');
    container.innerHTML = `
        <div class="process-info">
            <strong>Affine Cipher:</strong> Each letter x is transformed using the formula ${isEncrypt ? '(ax + b) mod 26' : 'a⁻¹(x - b) mod 26'}.
        </div>
        <div class="key-display">a = ${a}, b = ${b}</div>
    `;
    
    const inputRow = document.createElement('div');
    inputRow.className = 'character-row';
    
    const outputRow = document.createElement('div');
    outputRow.className = 'character-row';
    
    let result = '';
    
    // Calculate modular inverse of a
    function modInverse(a, m) {
        for (let i = 1; i < m; i++) {
            if ((a * i) % m === 1) return i;
        }
        return 1;
    }
    
    const aInverse = modInverse(a, 26);
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const inputBox = document.createElement('div');
        inputBox.className = 'char-box';
        inputBox.textContent = char;
        inputRow.appendChild(inputBox);
        
        const outputBox = document.createElement('div');
        outputBox.className = 'char-box';
        outputBox.textContent = '?';
        outputRow.appendChild(outputBox);
    }
    
    container.appendChild(inputRow);
    container.appendChild(outputRow);
    
    await sleep(animationSpeed);
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        let newChar = char;
        
        if (char.match(/[A-Za-z]/)) {
            const isUpper = char === char.toUpperCase();
            const base = isUpper ? 65 : 97;
            const x = char.charCodeAt(0) - base;
            
            let newX;
            if (isEncrypt) {
                newX = (a * x + b) % 26;
            } else {
                newX = (aInverse * (x - b + 26)) % 26;
            }
            
            newChar = String.fromCharCode(newX + base);
        }
        
        inputRow.children[i].classList.add('processing');
        currentStep++;
        document.getElementById('stepCount').textContent = currentStep;
        
        await sleep(animationSpeed / 2);
        
        inputRow.children[i].classList.remove('processing');
        inputRow.children[i].classList.add('encrypted');
        outputRow.children[i].textContent = newChar;
        outputRow.children[i].classList.add('decrypted');
        
        result += newChar;
    }
    
    return result;
}

// Vigenère Cipher Animation
async function animateVigenere(text, key, isEncrypt) {
    if (!key) throw new Error("Vigenère cipher requires a keyword");
    
    const container = document.getElementById('animationContainer');
    const upperKey = key.toUpperCase().replace(/[^A-Z]/g, '');
    
    container.innerHTML = `
        <div class="process-info">
            <strong>Vigenère Cipher:</strong> Uses a keyword to shift each letter by different amounts.
        </div>
        <div class="key-display">Keyword: ${upperKey}</div>
    `;
    
    const inputRow = document.createElement('div');
    inputRow.className = 'character-row';
    
    const keyRow = document.createElement('div');
    keyRow.className = 'character-row';
    
    const outputRow = document.createElement('div');
    outputRow.className = 'character-row';
    
    let result = '';
    let keyIndex = 0;
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const inputBox = document.createElement('div');
        inputBox.className = 'char-box';
        inputBox.textContent = char;
        inputRow.appendChild(inputBox);
        
        const keyBox = document.createElement('div');
        keyBox.className = 'char-box';
        keyBox.style.backgroundColor = '#444';
        if (char.match(/[A-Za-z]/)) {
            keyBox.textContent = upperKey[keyIndex % upperKey.length];
        } else {
            keyBox.textContent = '-';
        }
        keyRow.appendChild(keyBox);
        
        const outputBox = document.createElement('div');
        outputBox.className = 'char-box';
        outputBox.textContent = '?';
        outputRow.appendChild(outputBox);
    }
    
    container.appendChild(inputRow);
    container.appendChild(keyRow);
    container.appendChild(outputRow);
    
    await sleep(animationSpeed);
    
    keyIndex = 0;
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        let newChar = char;
        
        if (char.match(/[A-Za-z]/)) {
            const isUpper = char === char.toUpperCase();
            const base = isUpper ? 65 : 97;
            const charCode = char.charCodeAt(0) - base;
            const keyChar = upperKey[keyIndex % upperKey.length];
            const keyShift = keyChar.charCodeAt(0) - 65;
            
            const shiftedCode = isEncrypt ? 
                (charCode + keyShift) % 26 : 
                (charCode - keyShift + 26) % 26;
            newChar = String.fromCharCode(shiftedCode + base);
            keyIndex++;
        }
        
        inputRow.children[i].classList.add('processing');
        keyRow.children[i].classList.add('processing');
        currentStep++;
        document.getElementById('stepCount').textContent = currentStep;
        
        await sleep(animationSpeed / 2);
        
        inputRow.children[i].classList.remove('processing');
        inputRow.children[i].classList.add('encrypted');
        keyRow.children[i].classList.remove('processing');
        outputRow.children[i].textContent = newChar;
        outputRow.children[i].classList.add('decrypted');
        
        result += newChar;
    }
    
    return result;
}

// Playfair Cipher Animation
async function animatePlayfair(text, key, isEncrypt) {
    if (!key) throw new Error("Playfair cipher requires a keyword");
    
    const container = document.getElementById('animationContainer');
    const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
    
    // Create 5x5 matrix
    const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'; // J is omitted
    const usedChars = new Set();
    let matrix = [];
    let currentRow = [];
    
    // Add key characters first
    for (const char of cleanKey) {
        if (!usedChars.has(char)) {
            usedChars.add(char);
            currentRow.push(char);
            if (currentRow.length === 5) {
                matrix.push(currentRow);
                currentRow = [];
            }
        }
    }
    
    // Add remaining alphabet
    for (const char of alphabet) {
        if (!usedChars.has(char)) {
            currentRow.push(char);
            if (currentRow.length === 5) {
                matrix.push(currentRow);
                currentRow = [];
            }
        }
    }
    
    container.innerHTML = `
        <div class="process-info">
            <strong>Playfair Cipher:</strong> Uses a 5×5 matrix and processes pairs of letters.
        </div>
        <div class="key-display">Keyword: ${cleanKey}</div>
    `;
    
    // Display matrix
    const matrixContainer = document.createElement('div');
    matrixContainer.className = 'matrix-display';
    matrixContainer.style.gridTemplateColumns = 'repeat(5, 40px)';
    
    for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
            const cell = document.createElement('div');
            cell.className = 'matrix-cell';
            cell.textContent = matrix[r][c];
            matrixContainer.appendChild(cell);
        }
    }
    
    container.appendChild(matrixContainer);
    
    // Prepare text (replace J with I, add X for duplicate pairs)
    let cleanText = text.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
    let preparedText = '';
    
    for (let i = 0; i < cleanText.length; i += 2) {
        let pair = cleanText.substring(i, i + 2);
        if (pair.length === 1) {
            pair += 'X';
        } else if (pair[0] === pair[1]) {
            pair = pair[0] + 'X';
            i--; // Reprocess the second character
        }
        preparedText += pair;
    }
    
    const pairsInfo = document.createElement('div');
    pairsInfo.className = 'process-info';
    pairsInfo.innerHTML = `<strong>Text pairs:</strong> ${preparedText.match(/.{2}/g).join(' ')}`;
    container.appendChild(pairsInfo);
    
    await sleep(animationSpeed);
    
    let result = '';
    const pairs = preparedText.match(/.{2}/g) || [];
    
    for (const pair of pairs) {
        const [char1, char2] = pair;
        
        // Find positions in matrix
        let pos1 = null, pos2 = null;
        for (let r = 0; r < 5; r++) {
            for (let c = 0; c < 5; c++) {
                if (matrix[r][c] === char1) pos1 = [r, c];
                if (matrix[r][c] === char2) pos2 = [r, c];
            }
        }
        
        let newChar1, newChar2;
        
        if (pos1[0] === pos2[0]) {
            // Same row
            if (isEncrypt) {
                newChar1 = matrix[pos1[0]][(pos1[1] + 1) % 5];
                newChar2 = matrix[pos2[0]][(pos2[1] + 1) % 5];
            } else {
                newChar1 = matrix[pos1[0]][(pos1[1] + 4) % 5];
                newChar2 = matrix[pos2[0]][(pos2[1] + 4) % 5];
            }
        } else if (pos1[1] === pos2[1]) {
            // Same column
            if (isEncrypt) {
                newChar1 = matrix[(pos1[0] + 1) % 5][pos1[1]];
                newChar2 = matrix[(pos2[0] + 1) % 5][pos2[1]];
            } else {
                newChar1 = matrix[(pos1[0] + 4) % 5][pos1[1]];
                newChar2 = matrix[(pos2[0] + 4) % 5][pos2[1]];
            }
        } else {
            // Rectangle
            newChar1 = matrix[pos1[0]][pos2[1]];
            newChar2 = matrix[pos2[0]][pos1[1]];
        }
        
        const pairResult = document.createElement('div');
        pairResult.className = 'process-info';
        pairResult.innerHTML = `<strong>${pair}</strong> → <strong>${newChar1}${newChar2}</strong>`;
        container.appendChild(pairResult);
        
        result += newChar1 + newChar2;
        
        currentStep++;
        document.getElementById('stepCount').textContent = currentStep;
        await sleep(animationSpeed / 2);
    }
    
    return result;
}

// Beaufort Cipher Animation
async function animateBeaufort(text, key, isEncrypt) {
    if (!key) throw new Error("Beaufort cipher requires a keyword");
    
    const container = document.getElementById('animationContainer');
    const upperKey = key.toUpperCase().replace(/[^A-Z]/g, '');
    
    container.innerHTML = `
        <div class="process-info">
            <strong>Beaufort Cipher:</strong> Similar to Vigenère but uses subtraction: key - plaintext.
        </div>
        <div class="key-display">Keyword: ${upperKey}</div>
    `;
    
    const inputRow = document.createElement('div');
    inputRow.className = 'character-row';
    
    const keyRow = document.createElement('div');
    keyRow.className = 'character-row';
    
    const outputRow = document.createElement('div');
    outputRow.className = 'character-row';
    
    let result = '';
    let keyIndex = 0;
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const inputBox = document.createElement('div');
        inputBox.className = 'char-box';
        inputBox.textContent = char;
        inputRow.appendChild(inputBox);
        
        const keyBox = document.createElement('div');
        keyBox.className = 'char-box';
        keyBox.style.backgroundColor = '#444';
        if (char.match(/[A-Za-z]/)) {
            keyBox.textContent = upperKey[keyIndex % upperKey.length];
        } else {
            keyBox.textContent = '-';
        }
        keyRow.appendChild(keyBox);
        
        const outputBox = document.createElement('div');
        outputBox.className = 'char-box';
        outputBox.textContent = '?';
        outputRow.appendChild(outputBox);
    }
    
    container.appendChild(inputRow);
    container.appendChild(keyRow);
    container.appendChild(outputRow);
    
    await sleep(animationSpeed);
    
    keyIndex = 0;
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        let newChar = char;
        
        if (char.match(/[A-Za-z]/)) {
            const isUpper = char === char.toUpperCase();
            const base = isUpper ? 65 : 97;
            const charCode = char.charCodeAt(0) - base;
            const keyChar = upperKey[keyIndex % upperKey.length];
            const keyCode = keyChar.charCodeAt(0) - 65;
            
            let shiftedCode;
            if (isEncrypt) {
                shiftedCode = (keyCode - charCode + 26) % 26;
            } else {
                shiftedCode = (keyCode - charCode + 26) % 26;
            }
            
            newChar = String.fromCharCode(shiftedCode + base);
            keyIndex++;
        }
        
        inputRow.children[i].classList.add('processing');
        keyRow.children[i].classList.add('processing');
        currentStep++;
        document.getElementById('stepCount').textContent = currentStep;
        
        await sleep(animationSpeed / 2);
        
        inputRow.children[i].classList.remove('processing');
        inputRow.children[i].classList.add('encrypted');
        keyRow.children[i].classList.remove('processing');
        outputRow.children[i].textContent = newChar;
        outputRow.children[i].classList.add('decrypted');
        
        result += newChar;
    }
    
    return result;
}

// Hill Cipher Animation (2x2 matrix)
async function animateHill(text, key, isEncrypt) {
    const keyNumbers = key.split(',').map(x => parseInt(x.trim()));
    if (keyNumbers.length !== 4 || keyNumbers.some(isNaN)) {
        throw new Error("Hill cipher requires 4 comma-separated numbers for 2x2 matrix (a,b,c,d)");
    }
    
    const [a, b, c, d] = keyNumbers;
    const det = (a * d - b * c) % 26;
    
    // Check if determinant is coprime with 26
    function gcd(a, b) {
        return b === 0 ? a : gcd(b, a % b);
    }
    
    if (gcd(det, 26) !== 1) {
        throw new Error("Matrix determinant must be coprime with 26");
    }
    
    const container = document.getElementById('animationContainer');
    container.innerHTML = `
        <div class="process-info">
            <strong>Hill Cipher:</strong> Uses matrix multiplication with a 2×2 key matrix.
        </div>
        <div class="key-display">Matrix: [${a} ${b}]<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[${c} ${d}]</div>
    `;
    
    // Prepare text (pairs)
    let cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
    if (cleanText.length % 2 !== 0) cleanText += 'X';
    
    const pairs = cleanText.match(/.{2}/g) || [];
    let result = '';
    
    for (const pair of pairs) {
        const [char1, char2] = pair;
        const x1 = char1.charCodeAt(0) - 65;
        const x2 = char2.charCodeAt(0) - 65;
        
        let y1, y2;
        if (isEncrypt) {
            y1 = (a * x1 + b * x2) % 26;
            y2 = (c * x1 + d * x2) % 26;
        } else {
            // Calculate inverse matrix
            function modInverse(a, m) {
                for (let i = 1; i < m; i++) {
                    if ((a * i) % m === 1) return i;
                }
                return 1;
            }
            
            const detInv = modInverse(det, 26);
            const invA = (d * detInv) % 26;
            const invB = (-b * detInv + 26) % 26;
            const invC = (-c * detInv + 26) % 26;
            const invD = (a * detInv) % 26;
            
            y1 = (invA * x1 + invB * x2) % 26;
            y2 = (invC * x1 + invD * x2) % 26;
        }
        
        const newChar1 = String.fromCharCode(y1 + 65);
        const newChar2 = String.fromCharCode(y2 + 65);
        
        const pairInfo = document.createElement('div');
        pairInfo.className = 'process-info';
        pairInfo.innerHTML = `<strong>${pair}</strong> → <strong>${newChar1}${newChar2}</strong>`;
        container.appendChild(pairInfo);
        
        result += newChar1 + newChar2;
        
        currentStep++;
        document.getElementById('stepCount').textContent = currentStep;
        await sleep(animationSpeed / 2);
    }
    
    return result;
}

// Columnar Transposition Animation
async function animateColumnar(text, key, isEncrypt) {
    if (!key) throw new Error("Columnar transposition requires a keyword");
    
    const container = document.getElementById('animationContainer');
    const upperKey = key.toUpperCase().replace(/[^A-Z]/g, '');
    const cols = upperKey.length;
    const rows = Math.ceil(text.length / cols);
    
    // Create column order based on alphabetical sorting of key
    const keyOrder = upperKey.split('').map((char, index) => ({ char, index }))
        .sort((a, b) => a.char.localeCompare(b.char))
        .map((item, sortedIndex) => ({ ...item, order: sortedIndex }))
        .sort((a, b) => a.index - b.index)
        .map(item => item.order);
    
    container.innerHTML = `
        <div class="process-info">
            <strong>Columnar Transposition:</strong> Text is written in rows and read in columns based on key order.
        </div>
        <div class="key-display">Keyword: ${upperKey}<br>Column Order: ${keyOrder.join(' ')}</div>
    `;
    
    // Create grid visualization
    const grid = [];
    const gridContainer = document.createElement('div');
    gridContainer.style.cssText = `
        display: grid;
        grid-template-columns: repeat(${cols}, 50px);
        gap: 5px;
        justify-content: center;
        margin: 20px 0;
    `;
    
    // Fill grid with text
    for (let r = 0; r < rows; r++) {
        const rowData = [];
        for (let c = 0; c < cols; c++) {
            const index = r * cols + c;
            const char = index < text.length ? text[index] : '';
            
            const cell = document.createElement('div');
            cell.className = 'char-box';
            cell.textContent = char || '·';
            if (!char) cell.style.opacity = '0.3';
            
            gridContainer.appendChild(cell);
            rowData.push({ cell, char });
        }
        grid.push(rowData);
    }
    
    container.appendChild(gridContainer);
    
    await sleep(animationSpeed);
    
    let result = '';
    
    if (isEncrypt) {
        // Read columns in key order
        for (let orderIndex = 0; orderIndex < cols; orderIndex++) {
            const colIndex = keyOrder.indexOf(orderIndex);
            for (let r = 0; r < rows; r++) {
                if (grid[r][colIndex].char) {
                    await sleep(animationSpeed / 4);
                    grid[r][colIndex].cell.classList.add('processing');
                    currentStep++;
                    document.getElementById('stepCount').textContent = currentStep;
                    await sleep(animationSpeed / 4);
                    grid[r][colIndex].cell.classList.remove('processing');
                    grid[r][colIndex].cell.classList.add('encrypted');
                    result += grid[r][colIndex].char;
                }
            }
        }
    } else {
        // For decryption, read row by row (simplified)
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (grid[r][c].char) {
                    await sleep(animationSpeed / 2);
                    grid[r][c].cell.classList.add('processing');
                    currentStep++;
                    document.getElementById('stepCount').textContent = currentStep;
                    await sleep(animationSpeed / 2);
                    grid[r][c].cell.classList.remove('processing');
                    grid[r][c].cell.classList.add('decrypted');
                    result += grid[r][c].char;
                }
            }
        }
    }
    
    return result;
}

// Rail Fence Cipher Animation
async function animateRailFence(text, key, isEncrypt) {
    const rails = parseInt(key) || 3;
    if (rails < 2) throw new Error("Rail fence cipher requires at least 2 rails");
    
    // Remove spaces from text for proper rail fence processing
    const cleanText = text.replace(/\s/g, '');
    
    const container = document.getElementById('animationContainer');
    container.innerHTML = `
        <div class="process-info">
            <strong>Rail Fence Cipher:</strong> Text is written in a zigzag pattern across ${rails} rails.
        </div>
        <div class="key-display">Number of Rails: ${rails} | Text (spaces removed): "${cleanText}"</div>
    `;
    
    // Create rail visualization
    const railsContainer = document.createElement('div');
    railsContainer.style.cssText = 'display: flex; flex-direction: column; gap: 10px; margin: 20px 0;';
    
    const railArrays = [];
    for (let i = 0; i < rails; i++) {
        const railRow = document.createElement('div');
        railRow.className = 'character-row';
        railRow.style.minHeight = '60px';
        railsContainer.appendChild(railRow);
        railArrays.push([]);
    }
    
    container.appendChild(railsContainer);
    
    let result = '';
    
    if (isEncrypt) {
        // Write in zigzag pattern
        let rail = 0;
        let direction = 1;
        
        for (let i = 0; i < cleanText.length; i++) {
            const char = cleanText[i];
            
            // Add placeholder boxes to other rails
            for (let r = 0; r < rails; r++) {
                const box = document.createElement('div');
                box.className = 'char-box';
                if (r === rail) {
                    box.textContent = char;
                    railArrays[r].push(char);
                } else {
                    box.textContent = '·';
                    box.style.opacity = '0.2';
                    railArrays[r].push('');
                }
                railsContainer.children[r].appendChild(box);
            }
            
            await sleep(animationSpeed / 2);
            railsContainer.children[rail].lastChild.classList.add('processing');
            currentStep++;
            document.getElementById('stepCount').textContent = currentStep;
            
            await sleep(animationSpeed / 2);
            railsContainer.children[rail].lastChild.classList.remove('processing');
            railsContainer.children[rail].lastChild.classList.add('encrypted');
            
            // Move to next rail
            rail += direction;
            if (rail === rails - 1 || rail === 0) {
                direction = -direction;
            }
        }
        
        // Read rails top to bottom
        for (let r = 0; r < rails; r++) {
            for (const char of railArrays[r]) {
                if (char) result += char;
            }
        }
    } else {
        // Decryption logic would be more complex
        result = text; // Simplified for demo
    }
    
    return result;
}

// Scytale Cipher Animation
async function animateScytale(text, key, isEncrypt) {
    const diameter = parseInt(key) || 3;
    if (diameter < 2) throw new Error("Scytale cipher requires a diameter of at least 2");
    
    const container = document.getElementById('animationContainer');
    container.innerHTML = `
        <div class="process-info">
            <strong>Scytale Cipher:</strong> Text is wrapped around a cylinder with diameter ${diameter}.
        </div>
        <div class="key-display">Diameter: ${diameter}</div>
    `;
    
    const rows = Math.ceil(text.length / diameter);
    
    // Create grid
    const gridContainer = document.createElement('div');
    gridContainer.style.cssText = `
        display: grid;
        grid-template-columns: repeat(${diameter}, 50px);
        gap: 5px;
        justify-content: center;
        margin: 20px 0;
    `;
    
    const grid = [];
    for (let r = 0; r < rows; r++) {
        const rowData = [];
        for (let c = 0; c < diameter; c++) {
            const index = r * diameter + c;
            const char = index < text.length ? text[index] : '';
            
            const cell = document.createElement('div');
            cell.className = 'char-box';
            cell.textContent = char || '·';
            if (!char) cell.style.opacity = '0.3';
            
            gridContainer.appendChild(cell);
            rowData.push({ cell, char });
        }
        grid.push(rowData);
    }
    
    container.appendChild(gridContainer);
    
    await sleep(animationSpeed);
    
    let result = '';
    
    if (isEncrypt) {
        // Read columns
        for (let c = 0; c < diameter; c++) {
            for (let r = 0; r < rows; r++) {
                if (grid[r][c].char) {
                    await sleep(animationSpeed / 4);
                    grid[r][c].cell.classList.add('processing');
                    currentStep++;
                    document.getElementById('stepCount').textContent = currentStep;
                    await sleep(animationSpeed / 4);
                    grid[r][c].cell.classList.remove('processing');
                    grid[r][c].cell.classList.add('encrypted');
                    result += grid[r][c].char;
                }
            }
        }
    } else {
        // Read rows
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < diameter; c++) {
                if (grid[r][c].char) {
                    await sleep(animationSpeed / 4);
                    grid[r][c].cell.classList.add('processing');
                    currentStep++;
                    document.getElementById('stepCount').textContent = currentStep;
                    await sleep(animationSpeed / 4);
                    grid[r][c].cell.classList.remove('processing');
                    grid[r][c].cell.classList.add('decrypted');
                    result += grid[r][c].char;
                }
            }
        }
    }
    
    return result;
}

// Route Cipher Animation
async function animateRoute(text, key, isEncrypt) {
    if (!key) throw new Error("Route cipher requires a keyword");
    
    const container = document.getElementById('animationContainer');
    const upperKey = key.toUpperCase().replace(/[^A-Z]/g, '');
    const cols = upperKey.length;
    const rows = Math.ceil(text.length / cols);
    
    container.innerHTML = `
        <div class="process-info">
            <strong>Route Cipher:</strong> Writing text in a grid and reading in a specific route pattern.
        </div>
        <div class="key-display">Keyword: ${upperKey} | Grid: ${rows}x${cols}</div>
    `;
    
    // Create grid visualization
    const grid = [];
    const gridContainer = document.createElement('div');
    gridContainer.style.cssText = `
        display: grid;
        grid-template-columns: repeat(${cols}, 50px);
        gap: 5px;
        justify-content: center;
        margin: 20px 0;
    `;
    
    // Fill grid with text
    for (let r = 0; r < rows; r++) {
        const rowData = [];
        for (let c = 0; c < cols; c++) {
            const index = r * cols + c;
            const char = index < text.length ? text[index] : '';
            
            const cell = document.createElement('div');
            cell.className = 'char-box';
            cell.textContent = char || '·';
            if (!char) cell.style.opacity = '0.3';
            
            gridContainer.appendChild(cell);
            rowData.push({ cell, char, index });
        }
        grid.push(rowData);
    }
    
    container.appendChild(gridContainer);
    
    await sleep(animationSpeed);
    
    let result = '';
    
    if (isEncrypt) {
        // Read in spiral pattern (clockwise from outside)
        const visited = Array(rows).fill().map(() => Array(cols).fill(false));
        let top = 0, bottom = rows - 1, left = 0, right = cols - 1;
        
        while (top <= bottom && left <= right) {
            // Right
            for (let c = left; c <= right && grid[top] && grid[top][c]; c++) {
                await sleep(animationSpeed / 4);
                if (grid[top][c].char) {
                    grid[top][c].cell.classList.add('processing');
                    currentStep++;
                    document.getElementById('stepCount').textContent = currentStep;
                    await sleep(animationSpeed / 4);
                    grid[top][c].cell.classList.remove('processing');
                    grid[top][c].cell.classList.add('encrypted');
                    result += grid[top][c].char;
                }
            }
            top++;
            
            // Down
            for (let r = top; r <= bottom && grid[r] && grid[r][right]; r++) {
                await sleep(animationSpeed / 4);
                if (grid[r][right].char) {
                    grid[r][right].cell.classList.add('processing');
                    currentStep++;
                    document.getElementById('stepCount').textContent = currentStep;
                    await sleep(animationSpeed / 4);
                    grid[r][right].cell.classList.remove('processing');
                    grid[r][right].cell.classList.add('encrypted');
                    result += grid[r][right].char;
                }
            }
            right--;
            
            // Left
            if (top <= bottom) {
                for (let c = right; c >= left && grid[bottom] && grid[bottom][c]; c--) {
                    await sleep(animationSpeed / 4);
                    if (grid[bottom][c].char) {
                        grid[bottom][c].cell.classList.add('processing');
                        currentStep++;
                        document.getElementById('stepCount').textContent = currentStep;
                        await sleep(animationSpeed / 4);
                        grid[bottom][c].cell.classList.remove('processing');
                        grid[bottom][c].cell.classList.add('encrypted');
                        result += grid[bottom][c].char;
                    }
                }
                bottom--;
            }
            
            // Up
            if (left <= right) {
                for (let r = bottom; r >= top && grid[r] && grid[r][left]; r--) {
                    await sleep(animationSpeed / 4);
                    if (grid[r][left].char) {
                        grid[r][left].cell.classList.add('processing');
                        currentStep++;
                        document.getElementById('stepCount').textContent = currentStep;
                        await sleep(animationSpeed / 4);
                        grid[r][left].cell.classList.remove('processing');
                        grid[r][left].cell.classList.add('encrypted');
                        result += grid[r][left].char;
                    }
                }
                left++;
            }
        }
    } else {
        // For decryption, read row by row (simplified)
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (grid[r][c].char) {
                    await sleep(animationSpeed / 2);
                    grid[r][c].cell.classList.add('processing');
                    currentStep++;
                    document.getElementById('stepCount').textContent = currentStep;
                    await sleep(animationSpeed / 2);
                    grid[r][c].cell.classList.remove('processing');
                    grid[r][c].cell.classList.add('decrypted');
                    result += grid[r][c].char;
                }
            }
        }
    }
    
    return result;
}

// DES Animation (Simplified representation)
async function animateDES(text, key, isEncrypt) {
    if (!key || key.length < 8) throw new Error("DES requires an 8-character key");
    
    const container = document.getElementById('animationContainer');
    const desKey = key.substring(0, 8);
    
    container.innerHTML = `
        <div class="process-info">
            <strong>DES (Data Encryption Standard):</strong> 64-bit block cipher with 16 rounds of processing.
        </div>
        <div class="key-display">Key: ${desKey} | Mode: ${isEncrypt ? 'Encryption' : 'Decryption'}</div>
    `;
    
    // Pad text to 8-byte blocks
    let paddedText = text;
    while (paddedText.length % 8 !== 0) {
        paddedText += '\0';
    }
    
    const blocks = [];
    for (let i = 0; i < paddedText.length; i += 8) {
        blocks.push(paddedText.substring(i, i + 8));
    }
    
    let result = '';
    
    for (let blockIndex = 0; blockIndex < blocks.length; blockIndex++) {
        const block = blocks[blockIndex];
        
        // Show current block
        const blockInfo = document.createElement('div');
        blockInfo.className = 'process-info';
        blockInfo.innerHTML = `<strong>Processing Block ${blockIndex + 1}:</strong> [8 bytes]`;
        container.appendChild(blockInfo);
        
        // Show initial permutation
        const ipInfo = document.createElement('div');
        ipInfo.className = 'process-info';
        ipInfo.innerHTML = '<strong>Initial Permutation:</strong> Rearranging 64 bits';
        container.appendChild(ipInfo);
        
        await sleep(animationSpeed / 2);
        currentStep++;
        document.getElementById('stepCount').textContent = currentStep;
        
        // Create round visualization
        const roundsContainer = document.createElement('div');
        roundsContainer.style.cssText = 'display: flex; flex-wrap: wrap; gap: 5px; justify-content: center; margin: 20px 0; max-width: 400px;';
        
        for (let round = 1; round <= 16; round++) {
            const roundBox = document.createElement('div');
            roundBox.className = 'char-box';
            roundBox.textContent = round;
            roundBox.style.width = '35px';
            roundBox.style.height = '35px';
            roundBox.style.fontSize = '12px';
            roundsContainer.appendChild(roundBox);
        }
        container.appendChild(roundsContainer);
        
        // Animate each round
        for (let round = 1; round <= 16; round++) {
            await sleep(animationSpeed / 16);
            const roundBox = roundsContainer.children[round - 1];
            roundBox.classList.add('processing');
            
            // Show round details
            const roundDetails = document.createElement('div');
            roundDetails.style.cssText = 'text-align: center; color: #888; font-size: 12px; margin: 5px 0;';
            roundDetails.textContent = `Round ${round}: Feistel function + Key mixing`;
            
            await sleep(animationSpeed / 32);
            roundBox.classList.remove('processing');
            roundBox.classList.add(isEncrypt ? 'encrypted' : 'decrypted');
            
            currentStep++;
            document.getElementById('stepCount').textContent = currentStep;
        }
        
        // Final permutation
        const fpInfo = document.createElement('div');
        fpInfo.className = 'process-info';
        fpInfo.innerHTML = '<strong>Final Permutation:</strong> Inverse of initial permutation';
        container.appendChild(fpInfo);
        
        await sleep(animationSpeed / 2);
        
        // Enhanced transformation using multiple XOR operations with shifted keys
        let blockResult = '';
        for (let i = 0; i < block.length; i++) {
            let char = block.charCodeAt(i);
            
            // Apply multiple transformations to simulate DES complexity
            for (let round = 0; round < 4; round++) {
                const keyChar = desKey[(i + round) % desKey.length];
                const keyShift = (keyChar.charCodeAt(0) + round * 7) % 256;
                char = char ^ keyShift;
                
                // Add some bit rotation simulation
                char = ((char << 1) | (char >> 7)) & 0xFF;
            }
            
            blockResult += String.fromCharCode(char);
        }
        
        result += blockResult;
    }
    
    // Remove null padding for display
    result = result.replace(/\0/g, '');
    
    return result;
}

// Triple DES Animation
async function animateTripleDES(text, key, isEncrypt) {
    if (!key || key.length < 16) throw new Error("Triple DES requires a 16-character key");
    
    const container = document.getElementById('animationContainer');
    const key1 = key.substring(0, 8);
    const key2 = key.substring(8, 16);
    
    container.innerHTML = `
        <div class="process-info">
            <strong>Triple DES:</strong> Applying DES three times with different keys (Encrypt-Decrypt-Encrypt or Decrypt-Encrypt-Decrypt).
        </div>
        <div class="key-display">Key1: ${key1} | Key2: ${key2}</div>
    `;
    
    if (isEncrypt) {
        // EDE: Encrypt with key1, Decrypt with key2, Encrypt with key1
        const step1 = await animateDESStep(text, key1, true, "Step 1: Encrypt with Key1", container);
        const step2 = await animateDESStep(step1, key2, false, "Step 2: Decrypt with Key2", container);
        const result = await animateDESStep(step2, key1, true, "Step 3: Encrypt with Key1", container);
        return result;
    } else {
        // DED: Decrypt with key1, Encrypt with key2, Decrypt with key1
        const step1 = await animateDESStep(text, key1, false, "Step 1: Decrypt with Key1", container);
        const step2 = await animateDESStep(step1, key2, true, "Step 2: Encrypt with Key2", container);
        const result = await animateDESStep(step2, key1, false, "Step 3: Decrypt with Key1", container);
        return result;
    }
}

async function animateDESStep(text, key, encrypt, stepName, container) {
    const stepInfo = document.createElement('div');
    stepInfo.className = 'process-info';
    stepInfo.innerHTML = `<strong>${stepName}</strong>`;
    container.appendChild(stepInfo);
    
    await sleep(animationSpeed);
    
    let result = '';
    for (let i = 0; i < text.length; i++) {
        const keyChar = key[i % key.length];
        result += String.fromCharCode(text.charCodeAt(i) ^ keyChar.charCodeAt(0));
    }
    
    return result;
}

// AES Animation (Simplified)
async function animateAES(text, key, isEncrypt) {
    if (!key || (key.length !== 16 && key.length !== 24 && key.length !== 32)) {
        throw new Error("AES requires a 16, 24, or 32 character key");
    }
    
    const keySize = key.length * 8; // 128, 192, or 256 bits
    const rounds = keySize === 128 ? 10 : keySize === 192 ? 12 : 14;
    
    const container = document.getElementById('animationContainer');
    container.innerHTML = `
        <div class="process-info">
            <strong>AES (Advanced Encryption Standard):</strong> ${keySize}-bit key with ${rounds} rounds of transformation.
        </div>
        <div class="key-display">Key: ${key} | Rounds: ${rounds}</div>
    `;
    
    // Pad to 16-byte blocks
    while (text.length % 16 !== 0) {
        text += ' ';
    }
    
    const blocks = [];
    for (let i = 0; i < text.length; i += 16) {
        blocks.push(text.substring(i, i + 16));
    }
    
    let result = '';
    
    for (let blockIndex = 0; blockIndex < blocks.length; blockIndex++) {
        const block = blocks[blockIndex];
        
        // Show 4x4 state matrix
        const matrixContainer = document.createElement('div');
        matrixContainer.style.cssText = `
            display: grid;
            grid-template-columns: repeat(4, 50px);
            gap: 5px;
            justify-content: center;
            margin: 20px 0;
        `;
        
        const stateMatrix = [];
        for (let i = 0; i < 16; i++) {
            const cell = document.createElement('div');
            cell.className = 'char-box';
            cell.textContent = block[i] || '·';
            cell.style.fontSize = '12px';
            matrixContainer.appendChild(cell);
            stateMatrix.push(cell);
        }
        
        container.appendChild(matrixContainer);
        
        // Animate rounds
        for (let round = 0; round < rounds; round++) {
            await sleep(animationSpeed / 2);
            
            const roundInfo = document.createElement('div');
            roundInfo.style.cssText = 'text-align: center; color: #00ff41; margin: 10px 0;';
            roundInfo.textContent = `Round ${round + 1}`;
            container.appendChild(roundInfo);
            
            // Animate state changes
            for (let i = 0; i < 16; i++) {
                await sleep(animationSpeed / 32);
                stateMatrix[i].classList.add('processing');
                currentStep++;
                document.getElementById('stepCount').textContent = currentStep;
                
                await sleep(animationSpeed / 32);
                stateMatrix[i].classList.remove('processing');
                stateMatrix[i].classList.add(isEncrypt ? 'encrypted' : 'decrypted');
            }
        }
        
        // Simple transformation (not real AES)
        let blockResult = '';
        for (let i = 0; i < block.length; i++) {
            const keyChar = key[i % key.length];
            blockResult += String.fromCharCode(block.charCodeAt(i) ^ keyChar.charCodeAt(0));
        }
        
        result += blockResult;
    }
    
    return result;
}

// Continue with remaining cipher implementations...
// Feistel Network Animation
async function animateFeistel(text, key, isEncrypt) {
    if (!key) throw new Error("Feistel network requires a key");
    
    const container = document.getElementById('animationContainer');
    const rounds = 8; // Standard number of rounds
    
    container.innerHTML = `
        <div class="process-info">
            <strong>Feistel Network:</strong> Generic construction with ${rounds} rounds, splitting data into left and right halves.
        </div>
        <div class="key-display">Key: ${key} | Rounds: ${rounds}</div>
    `;
    
    // Pad to even length
    if (text.length % 2 !== 0) text += ' ';
    
    const blocks = [];
    for (let i = 0; i < text.length; i += 8) {
        blocks.push(text.substring(i, i + 8));
    }
    
    let result = '';
    
    for (let block of blocks) {
        // Pad block to 8 characters
        while (block.length < 8) block += ' ';
        
        let left = block.substring(0, 4);
        let right = block.substring(4, 8);
        
        // Show initial split
        const splitContainer = document.createElement('div');
        splitContainer.style.cssText = 'display: flex; gap: 20px; justify-content: center; margin: 20px 0;';
        
        const leftBox = document.createElement('div');
        leftBox.className = 'process-info';
        leftBox.innerHTML = `<strong>Left:</strong> ${left}`;
        
        const rightBox = document.createElement('div');
        rightBox.className = 'process-info';
        rightBox.innerHTML = `<strong>Right:</strong> ${right}`;
        
        splitContainer.appendChild(leftBox);
        splitContainer.appendChild(rightBox);
        container.appendChild(splitContainer);
        
        // Perform Feistel rounds
        for (let round = 1; round <= rounds; round++) {
            await sleep(animationSpeed);
            
            const roundInfo = document.createElement('div');
            roundInfo.style.cssText = 'text-align: center; color: #00ff41; margin: 15px 0;';
            roundInfo.textContent = `Round ${round}`;
            container.appendChild(roundInfo);
            
            // F function (simple XOR with key)
            let fOutput = '';
            for (let i = 0; i < right.length; i++) {
                const keyChar = key[(round + i) % key.length];
                fOutput += String.fromCharCode(right.charCodeAt(i) ^ keyChar.charCodeAt(0));
            }
            
            // XOR left with F output
            let newLeft = '';
            for (let i = 0; i < left.length; i++) {
                newLeft += String.fromCharCode(left.charCodeAt(i) ^ fOutput.charCodeAt(i));
            }
            
            // Swap for next round (except last round)
            const temp = left;
            left = right;
            right = round === rounds ? newLeft : newLeft;
            
            if (round !== rounds) {
                left = newLeft;
                right = temp;
            }
            
            currentStep++;
            document.getElementById('stepCount').textContent = currentStep;
        }
        
        result += left + right;
    }
    
    return result;
}

// Stream Cipher Animation
async function animateStream(text, key, isEncrypt) {
    if (!key) throw new Error("Stream cipher requires a key");
    
    const container = document.getElementById('animationContainer');
    container.innerHTML = `
        <div class="process-info">
            <strong>Stream Cipher (RC4-like):</strong> Generates a keystream and XORs it with the plaintext.
        </div>
        <div class="key-display">Key: ${key}</div>
    `;
    
    // Initialize S-box (simplified)
    const S = [];
    for (let i = 0; i < 256; i++) {
        S[i] = i;
    }
    
    // Key scheduling (simplified)
    let j = 0;
    for (let i = 0; i < 256; i++) {
        j = (j + S[i] + key.charCodeAt(i % key.length)) % 256;
        [S[i], S[j]] = [S[j], S[i]]; // Swap
    }
    
    // Show keystream generation
    const keystreamInfo = document.createElement('div');
    keystreamInfo.className = 'process-info';
    keystreamInfo.innerHTML = '<strong>Generating keystream...</strong>';
    container.appendChild(keystreamInfo);
    
    // Generate keystream and encrypt/decrypt
    let result = '';
    let i = 0;
    j = 0;
    
    const textRow = document.createElement('div');
    textRow.className = 'character-row';
    
    const keystreamRow = document.createElement('div');
    keystreamRow.className = 'character-row';
    
    const resultRow = document.createElement('div');
    resultRow.className = 'character-row';
    
    // Create visualization
    for (let k = 0; k < text.length; k++) {
        const textBox = document.createElement('div');
        textBox.className = 'char-box';
        textBox.textContent = text[k];
        textRow.appendChild(textBox);
        
        const keystreamBox = document.createElement('div');
        keystreamBox.className = 'char-box';
        keystreamBox.textContent = '?';
        keystreamRow.appendChild(keystreamBox);
        
        const resultBox = document.createElement('div');
        resultBox.className = 'char-box';
        resultBox.textContent = '?';
        resultRow.appendChild(resultBox);
    }
    
    container.appendChild(textRow);
    container.appendChild(keystreamRow);
    container.appendChild(resultRow);
    
    // Animate encryption/decryption
    for (let k = 0; k < text.length; k++) {
        await sleep(animationSpeed / 2);
        
        // Generate keystream byte
        i = (i + 1) % 256;
        j = (j + S[i]) % 256;
        [S[i], S[j]] = [S[j], S[i]];
        const keyByte = S[(S[i] + S[j]) % 256];
        
        const keystreamChar = String.fromCharCode(keyByte % 128); // Keep printable
        keystreamRow.children[k].textContent = keystreamChar;
        keystreamRow.children[k].classList.add('processing');
        
        await sleep(animationSpeed / 2);
        
        // XOR with text
        const resultChar = String.fromCharCode(text.charCodeAt(k) ^ keyByte);
        resultRow.children[k].textContent = resultChar;
        resultRow.children[k].classList.add(isEncrypt ? 'encrypted' : 'decrypted');
        
        keystreamRow.children[k].classList.remove('processing');
        result += resultChar;
        
        currentStep++;
        document.getElementById('stepCount').textContent = currentStep;
    }
    
    return result;
}

// RSA Animation (Simplified)
async function animateRSA(text, key, isEncrypt) {
    const container = document.getElementById('animationContainer');
    
    // Parse key (simplified - in real RSA, keys are much larger)
    const keyParts = key.split(',').map(x => parseInt(x.trim()));
    if (keyParts.length !== 2 || keyParts.some(isNaN)) {
        throw new Error("RSA requires two numbers separated by comma (e.g., 7,33 for public key)");
    }
    
    const [e_or_d, n] = keyParts;
    
    container.innerHTML = `
        <div class="process-info">
            <strong>RSA ${isEncrypt ? 'Encryption' : 'Decryption'}:</strong> Using ${isEncrypt ? 'public' : 'private'} key (${e_or_d}, ${n})
        </div>
        <div class="key-display">${isEncrypt ? 'Public' : 'Private'} Key: (${e_or_d}, ${n})</div>
        <div class="process-info">
            <strong>Formula:</strong> c = m^${e_or_d} mod ${n}
        </div>
    `;
    
    let result = '';
    
    // Create character visualization
    const inputRow = document.createElement('div');
    inputRow.className = 'character-row';
    
    const processRow = document.createElement('div');
    processRow.className = 'character-row';
    
    const outputRow = document.createElement('div');
    outputRow.className = 'character-row';
    
    for (let i = 0; i < text.length; i++) {
        const inputBox = document.createElement('div');
        inputBox.className = 'char-box';
        inputBox.textContent = text[i];
        inputRow.appendChild(inputBox);
        
        const processBox = document.createElement('div');
        processBox.className = 'char-box';
        processBox.style.fontSize = '10px';
        processBox.textContent = '...';
        processRow.appendChild(processBox);
        
        const outputBox = document.createElement('div');
        outputBox.className = 'char-box';
        outputBox.textContent = '?';
        outputRow.appendChild(outputBox);
    }
    
    container.appendChild(inputRow);
    container.appendChild(processRow);
    container.appendChild(outputRow);
    
    // Process each character
    for (let i = 0; i < text.length; i++) {
        await sleep(animationSpeed);
        
        inputRow.children[i].classList.add('processing');
        
        const m = text.charCodeAt(i);
        processRow.children[i].textContent = `${m}^${e_or_d}`;
        
        await sleep(animationSpeed / 2);
        
        // Modular exponentiation (simplified)
        let c = modPow(m, e_or_d, n);
        
        // Convert back to character (with bounds checking)
        if (c > 255) c = c % 128 + 32; // Keep in printable range
        const resultChar = String.fromCharCode(c);
        
        outputRow.children[i].textContent = resultChar;
        outputRow.children[i].classList.add(isEncrypt ? 'encrypted' : 'decrypted');
        
        inputRow.children[i].classList.remove('processing');
        result += resultChar;
        
        currentStep++;
        document.getElementById('stepCount').textContent = currentStep;
    }
    
    return result;
}

// Diffie-Hellman Key Exchange Animation
async function animateDiffieHellman(text, key, isEncrypt) {
    const container = document.getElementById('animationContainer');
    
    // Parse parameters (p, g, private_key)
    const params = key.split(',').map(x => parseInt(x.trim()));
    if (params.length !== 3 || params.some(isNaN)) {
        throw new Error("Diffie-Hellman requires three numbers: p,g,private_key (e.g., 23,5,6)");
    }
    
    const [p, g, privateKey] = params;
    
    container.innerHTML = `
        <div class="process-info">
            <strong>Diffie-Hellman Key Exchange Simulation:</strong> Using shared parameters and private key to derive shared secret.
        </div>
        <div class="key-display">p=${p}, g=${g}, private_key=${privateKey}</div>
    `;
    
    // Step 1: Calculate public key
    const publicKey = modPow(g, privateKey, p);
    
    const step1Info = document.createElement('div');
    step1Info.className = 'process-info';
    step1Info.innerHTML = `<strong>Step 1:</strong> Public Key = g^private mod p = ${g}^${privateKey} mod ${p} = ${publicKey}`;
    container.appendChild(step1Info);
    
    await sleep(animationSpeed);
    currentStep++;
    document.getElementById('stepCount').textContent = currentStep;
    
    // Step 2: Simulate shared secret (using public key as other party's public key for demo)
    const sharedSecret = modPow(publicKey, privateKey, p);
    
    const step2Info = document.createElement('div');
    step2Info.className = 'process-info';
    step2Info.innerHTML = `<strong>Step 2:</strong> Shared Secret = public_key^private mod p = ${publicKey}^${privateKey} mod ${p} = ${sharedSecret}`;
    container.appendChild(step2Info);
    
    await sleep(animationSpeed);
    currentStep++;
    document.getElementById('stepCount').textContent = currentStep;
    
    // Step 3: Use shared secret to encrypt/decrypt (XOR)
    const step3Info = document.createElement('div');
    step3Info.className = 'process-info';
    step3Info.innerHTML = `<strong>Step 3:</strong> Using shared secret ${sharedSecret} to ${isEncrypt ? 'encrypt' : 'decrypt'} message`;
    container.appendChild(step3Info);
    
    let result = '';
    for (let i = 0; i < text.length; i++) {
        await sleep(animationSpeed / 4);
        const transformedChar = String.fromCharCode(text.charCodeAt(i) ^ (sharedSecret + i) % 256);
        result += transformedChar;
        
        currentStep++;
        document.getElementById('stepCount').textContent = currentStep;
    }
    
    return result;
}

// Elliptic Curve Cryptography Animation (Simplified)
async function animateECC(text, key, isEncrypt) {
    const container = document.getElementById('animationContainer');
    
    // Parse parameters (a, b, p for curve y^2 = x^3 + ax + b mod p)
    const params = key.split(',').map(x => parseInt(x.trim()));
    if (params.length !== 3 || params.some(isNaN)) {
        throw new Error("ECC requires curve parameters a,b,p (e.g., 2,3,17)");
    }
    
    const [a, b, p] = params;
    
    container.innerHTML = `
        <div class="process-info">
            <strong>Elliptic Curve Cryptography:</strong> Using curve y² = x³ + ${a}x + ${b} mod ${p}
        </div>
        <div class="key-display">Curve: y² = x³ + ${a}x + ${b} (mod ${p})</div>
    `;
    
    // Show some points on the curve
    const pointsInfo = document.createElement('div');
    pointsInfo.className = 'process-info';
    pointsInfo.innerHTML = '<strong>Finding points on curve...</strong>';
    container.appendChild(pointsInfo);
    
    await sleep(animationSpeed);
    
    const curvePoints = [];
    for (let x = 0; x < p; x++) {
        const rightSide = (x * x * x + a * x + b) % p;
        for (let y = 0; y < p; y++) {
            if ((y * y) % p === rightSide) {
                curvePoints.push([x, y]);
                if (curvePoints.length >= 5) break; // Limit for display
            }
        }
        if (curvePoints.length >= 5) break;
    }
    
    const pointsDisplay = document.createElement('div');
    pointsDisplay.className = 'key-display';
    pointsDisplay.innerHTML = `Points: ${curvePoints.map(p => `(${p[0]},${p[1]})`).join(', ')}`;
    container.appendChild(pointsDisplay);
    
    await sleep(animationSpeed);
    
    // Use first point as generator point
    const G = curvePoints[0] || [1, 1];
    
    const generatorInfo = document.createElement('div');
    generatorInfo.className = 'process-info';
    generatorInfo.innerHTML = `<strong>Generator Point G:</strong> (${G[0]}, ${G[1]})`;
    container.appendChild(generatorInfo);
    
    await sleep(animationSpeed);
    
    // Simple transformation using point coordinates
    let result = '';
    for (let i = 0; i < text.length; i++) {
        const transformedChar = String.fromCharCode(text.charCodeAt(i) ^ (G[0] + G[1] + i) % 256);
        result += transformedChar;
        
        currentStep++;
        document.getElementById('stepCount').textContent = currentStep;
        await sleep(animationSpeed / 4);
    }
    
    return result;
}

// One-Time Pad Animation
async function animateOneTimePad(text, key, isEncrypt) {
    if (!key || key.length < text.length) {
        throw new Error("One-Time Pad requires a key at least as long as the text");
    }
    
    const container = document.getElementById('animationContainer');
    container.innerHTML = `
        <div class="process-info">
            <strong>One-Time Pad:</strong> Perfect encryption when key is truly random and used only once.
        </div>
        <div class="key-display">Key length: ${key.length} | Text length: ${text.length}</div>
    `;
    
    const textRow = document.createElement('div');
    textRow.className = 'character-row';
    
    const keyRow = document.createElement('div');
    keyRow.className = 'character-row';
    
    const resultRow = document.createElement('div');
    resultRow.className = 'character-row';
    
    // Create visualization
    for (let i = 0; i < text.length; i++) {
        const textBox = document.createElement('div');
        textBox.className = 'char-box';
        textBox.textContent = text[i];
        textRow.appendChild(textBox);
        
        const keyBox = document.createElement('div');
        keyBox.className = 'char-box';
        keyBox.style.backgroundColor = '#444';
        keyBox.textContent = key[i];
        keyRow.appendChild(keyBox);
        
        const resultBox = document.createElement('div');
        resultBox.className = 'char-box';
        resultBox.textContent = '?';
        resultRow.appendChild(resultBox);
    }
    
    container.appendChild(textRow);
    container.appendChild(keyRow);
    container.appendChild(resultRow);
    
    await sleep(animationSpeed);
    
    let result = '';
    for (let i = 0; i < text.length; i++) {
        await sleep(animationSpeed / 2);
        
        textRow.children[i].classList.add('processing');
        keyRow.children[i].classList.add('processing');
        
        // XOR operation
        const resultChar = String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i));
        
        await sleep(animationSpeed / 2);
        
        resultRow.children[i].textContent = resultChar;
        resultRow.children[i].classList.add(isEncrypt ? 'encrypted' : 'decrypted');
        
        textRow.children[i].classList.remove('processing');
        keyRow.children[i].classList.remove('processing');
        
        result += resultChar;
        
        currentStep++;
        document.getElementById('stepCount').textContent = currentStep;
    }
    
    return result;
}

// XOR Cipher Animation
async function animateXOR(text, key, isEncrypt) {
    if (!key) throw new Error("XOR cipher requires a key");
    
    const container = document.getElementById('animationContainer');
    container.innerHTML = `
        <div class="process-info">
            <strong>XOR Cipher:</strong> Simple encryption using XOR operation with repeating key.
        </div>
        <div class="key-display">Key: ${key}</div>
    `;
    
    const textRow = document.createElement('div');
    textRow.className = 'character-row';
    
    const keyRow = document.createElement('div');
    keyRow.className = 'character-row';
    
    const resultRow = document.createElement('div');
    resultRow.className = 'character-row';
    
    // Create visualization
    for (let i = 0; i < text.length; i++) {
        const textBox = document.createElement('div');
        textBox.className = 'char-box';
        textBox.textContent = text[i];
        textRow.appendChild(textBox);
        
        const keyBox = document.createElement('div');
        keyBox.className = 'char-box';
        keyBox.style.backgroundColor = '#444';
        keyBox.textContent = key[i % key.length];
        keyRow.appendChild(keyBox);
        
        const resultBox = document.createElement('div');
        resultBox.className = 'char-box';
        resultBox.textContent = '?';
        resultRow.appendChild(resultBox);
    }
    
    container.appendChild(textRow);
    container.appendChild(keyRow);
    container.appendChild(resultRow);
    
    await sleep(animationSpeed);
    
    let result = '';
    for (let i = 0; i < text.length; i++) {
        await sleep(animationSpeed / 2);
        
        textRow.children[i].classList.add('processing');
        keyRow.children[i].classList.add('processing');
        
        // XOR operation
        const keyChar = key[i % key.length];
        const resultChar = String.fromCharCode(text.charCodeAt(i) ^ keyChar.charCodeAt(0));
        
        await sleep(animationSpeed / 2);
        
        resultRow.children[i].textContent = resultChar;
        resultRow.children[i].classList.add(isEncrypt ? 'encrypted' : 'decrypted');
        
        textRow.children[i].classList.remove('processing');
        keyRow.children[i].classList.remove('processing');
        
        result += resultChar;
        
        currentStep++;
        document.getElementById('stepCount').textContent = currentStep;
    }
    
    return result;
}

// Base64 Animation
async function animateBase64(text, key, isEncrypt) {
    const container = document.getElementById('animationContainer');
    container.innerHTML = `
        <div class="process-info">
            <strong>Base64 ${isEncrypt ? 'Encoding' : 'Decoding'}:</strong> Converts binary data to ASCII text using 64 characters.
        </div>
        <div class="key-display">Character Set: A-Z, a-z, 0-9, +, /</div>
    `;
    
    const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    
    if (isEncrypt) {
        // Encode to Base64
        let result = '';
        const inputRow = document.createElement('div');
        inputRow.className = 'character-row';
        
        const binaryRow = document.createElement('div');
        binaryRow.className = 'character-row';
        
        const outputRow = document.createElement('div');
        outputRow.className = 'character-row';
        
        // Process in groups of 3 characters
        for (let i = 0; i < text.length; i += 3) {
            const group = text.substring(i, i + 3);
            
            // Show input characters
            for (let j = 0; j < 3; j++) {
                const char = group[j] || '';
                const inputBox = document.createElement('div');
                inputBox.className = 'char-box';
                inputBox.textContent = char || '·';
                if (!char) inputBox.style.opacity = '0.3';
                inputRow.appendChild(inputBox);
            }
            
            // Convert to binary
            let binary = '';
            for (let j = 0; j < group.length; j++) {
                binary += group.charCodeAt(j).toString(2).padStart(8, '0');
            }
            while (binary.length < 24) binary += '0';
            
            // Show binary representation
            const binaryBox = document.createElement('div');
            binaryBox.className = 'char-box';
            binaryBox.style.fontSize = '8px';
            binaryBox.textContent = binary;
            binaryRow.appendChild(binaryBox);
            
            // Convert to base64
            const padding = group.length < 3 ? 3 - group.length : 0;
            let encoded = '';
            
            for (let j = 0; j < 24; j += 6) {
                const sixBits = binary.substring(j, j + 6);
                const index = parseInt(sixBits, 2);
                encoded += base64Chars[index];
            }
            
            // Add padding
            for (let j = 0; j < padding; j++) {
                encoded = encoded.slice(0, -1) + '=';
            }
            
            const outputBox = document.createElement('div');
            outputBox.className = 'char-box';
            outputBox.textContent = encoded;
            outputRow.appendChild(outputBox);
            
            result += encoded;
            
            currentStep++;
            document.getElementById('stepCount').textContent = currentStep;
            await sleep(animationSpeed / 2);
        }
        
        container.appendChild(inputRow);
        container.appendChild(binaryRow);
        container.appendChild(outputRow);
        
        return result;
    } else {
        // Decode from Base64
        let result = '';
        
        try {
            // Show decoding process
            const decodeInfo = document.createElement('div');
            decodeInfo.className = 'process-info';
            decodeInfo.innerHTML = '<strong>Decoding Base64:</strong> Converting back to original text...';
            container.appendChild(decodeInfo);
            
            await sleep(animationSpeed / 2);
            
            result = atob(text);
            
            const resultInfo = document.createElement('div');
            resultInfo.className = 'process-info';
            resultInfo.innerHTML = `<strong>Decoded Result:</strong> ${result}`;
            container.appendChild(resultInfo);
            
            currentStep++;
            document.getElementById('stepCount').textContent = currentStep;
            
        } catch (e) {
            throw new Error("Invalid Base64 input");
        }
        
        return result;
    }
}

// Morse Code Animation
async function animateMorse(text, key, isEncrypt) {
    const container = document.getElementById('animationContainer');
    
    const morseCode = {
        'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
        'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
        'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
        'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
        'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
        '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
        '8': '---..', '9': '----.', ' ': '/'
    };
    
    const reverseMorse = Object.fromEntries(
        Object.entries(morseCode).map(([key, value]) => [value, key])
    );
    
    container.innerHTML = `
        <div class="process-info">
            <strong>Morse Code ${isEncrypt ? 'Encoding' : 'Decoding'}:</strong> International Morse code using dots and dashes.
        </div>
        <div class="key-display">. = dot (short), - = dash (long), / = space</div>
    `;
    
    if (isEncrypt) {
        // Encode to Morse
        let result = '';
        const upperText = text.toUpperCase();
        
        const inputRow = document.createElement('div');
        inputRow.className = 'character-row';
        
        const outputRow = document.createElement('div');
        outputRow.className = 'character-row';
        
        for (let i = 0; i < upperText.length; i++) {
            const char = upperText[i];
            const morse = morseCode[char] || char;
            
            const inputBox = document.createElement('div');
            inputBox.className = 'char-box';
            inputBox.textContent = char;
            inputRow.appendChild(inputBox);
            
            const outputBox = document.createElement('div');
            outputBox.className = 'char-box';
            outputBox.style.width = 'auto';
            outputBox.style.minWidth = '50px';
            outputBox.style.fontSize = '14px';
            outputBox.textContent = morse;
            outputRow.appendChild(outputBox);
            
            if (i < upperText.length - 1) result += morse + ' ';
            else result += morse;
            
            await sleep(animationSpeed / 2);
            inputBox.classList.add('processing');
            outputBox.classList.add('encrypted');
            
            currentStep++;
            document.getElementById('stepCount').textContent = currentStep;
        }
        
        container.appendChild(inputRow);
        container.appendChild(outputRow);
        
        return result;
    } else {
        // Decode from Morse
        const morseWords = text.split('/');
        let result = '';
        
        for (const word of morseWords) {
            const morseChars = word.trim().split(' ');
            for (const morseChar of morseChars) {
                const char = reverseMorse[morseChar.trim()] || morseChar;
                result += char;
                
                await sleep(animationSpeed / 4);
                currentStep++;
                document.getElementById('stepCount').textContent = currentStep;
            }
            result += ' ';
        }
        
        const resultInfo = document.createElement('div');
        resultInfo.className = 'process-info';
        resultInfo.innerHTML = `<strong>Decoded:</strong> ${result.trim()}`;
        container.appendChild(resultInfo);
        
        return result.trim();
    }
}

// Utility functions
function getCipherName(cipher) {
    const names = {
        'caesar': 'Caesar Cipher',
        'atbash': 'Atbash Cipher',
        'substitution': 'Simple Substitution',
        'affine': 'Affine Cipher',
        'vigenere': 'Vigenère Cipher',
        'playfair': 'Playfair Cipher',
        'beaufort': 'Beaufort Cipher',
        'hill': 'Hill Cipher',
        'columnar': 'Columnar Transposition',
        'rail_fence': 'Rail Fence Cipher',
        'scytale': 'Scytale Cipher',
        'route': 'Route Cipher',
        'des': 'DES',
        'triple_des': 'Triple DES',
        'aes': 'AES',
        'feistel': 'Feistel Network',
        'stream': 'Stream Cipher (RC4)',
        'rsa': 'RSA',
        'diffie_hellman': 'Diffie-Hellman',
        'ecc': 'Elliptic Curve Cryptography',
        'one_time_pad': 'One-Time Pad',
        'xor': 'XOR Cipher',
        'base64': 'Base64',
        'morse': 'Morse Code'
    };
    return names[cipher] || cipher;
}

function updateCipherInfo() {
    const cipher = document.getElementById('cipherSelect').value;
    const infoDiv = document.getElementById('cipherInfoContent');
    const keyInput = document.getElementById('cipherKey');
    
    // Update placeholder based on selected cipher
    const placeholders = {
        'caesar': 'Enter shift value (e.g. 3)',
        'atbash': 'No key required',
        'substitution': 'Enter 26 letters (e.g. QWERTYUIOPASDFGHJKLZXCVBNM)',
        'affine': 'Enter a,b values (e.g. 5,8)',
        'vigenere': 'Enter keyword (e.g. SECRET)',
        'playfair': 'Enter keyword (e.g. MONARCHY)',
        'beaufort': 'Enter keyword (e.g. CIPHER)',
        'hill': 'Enter 2x2 matrix (e.g. 3,2,5,7)',
        'columnar': 'Enter keyword (e.g. ZEBRAS)',
        'rail_fence': 'Enter number of rails (e.g. 3)',
        'scytale': 'Enter diameter (e.g. 4)',
        'route': 'Enter keyword (e.g. ROUTE)',
        'des': 'Enter 8-character key (e.g. SECRETKY)',
        'triple_des': 'Enter 16-character key (e.g. SECRETKY12345678)',
        'aes': 'Enter 16/24/32 char key (e.g. MYSECRETKEY12345)',
        'feistel': 'Enter key (e.g. MYKEY)',
        'stream': 'Enter variable key (e.g. STREAMKEY)',
        'rsa': 'Enter exponent,modulus (e.g. 7,33)',
        'diffie_hellman': 'Enter p,g,private (e.g. 23,5,6)',
        'ecc': 'Enter a,b,p curve params (e.g. 2,3,17)',
        'one_time_pad': 'Enter key same length as text',
        'xor': 'Enter any key (e.g. PASSWORD)',
        'base64': 'No key required',
        'morse': 'No key required'
    };
    
    keyInput.placeholder = placeholders[cipher] || 'Enter key or parameters...';
    
    // Disable key input for ciphers that don't need keys
    const noKeyRequired = ['atbash', 'base64', 'morse'];
    keyInput.disabled = noKeyRequired.includes(cipher);
    if (noKeyRequired.includes(cipher)) {
        keyInput.value = '';
        keyInput.style.opacity = '0.5';
    } else {
        keyInput.style.opacity = '1';
    }
    
    const cipherInfo = {
        'caesar': {
            description: 'A substitution cipher where each letter is shifted by a fixed number of positions in the alphabet.',
            keyFormat: 'Enter a number (e.g., 3)',
            example: 'With shift 3: A→D, B→E, C→F'
        },
        'atbash': {
            description: 'A simple substitution cipher where each letter is replaced by its mirror in the alphabet.',
            keyFormat: 'No key required',
            example: 'A↔Z, B↔Y, C↔X, etc.'
        },
        'substitution': {
            description: 'Each letter of the alphabet is replaced by another letter according to a fixed substitution.',
            keyFormat: 'Enter 26 unique letters (e.g., QWERTYUIOPASDFGHJKLZXCVBNM)',
            example: 'A→Q, B→W, C→E, etc.'
        },
        'affine': {
            description: 'A type of monoalphabetic substitution cipher using mathematical formula (ax + b) mod 26.',
            keyFormat: 'Enter two numbers separated by comma (e.g., 5,8)',
            example: 'Parameters a=5, b=8 where a is coprime with 26'
        },
        'vigenere': {
            description: 'A polyalphabetic substitution cipher using a keyword to shift letters by different amounts.',
            keyFormat: 'Enter a keyword (e.g., SECRET)',
            example: 'Each letter uses different shift based on keyword position'
        },
        'playfair': {
            description: 'A digraph substitution cipher using a 5×5 matrix of letters based on a keyword.',
            keyFormat: 'Enter a keyword (e.g., MONARCHY)',
            example: 'Processes pairs of letters using matrix rules'
        },
        'beaufort': {
            description: 'Similar to Vigenère but uses subtraction: key - plaintext.',
            keyFormat: 'Enter a keyword (e.g., CIPHER)',
            example: 'Uses reciprocal cipher principle'
        },
        'hill': {
            description: 'A polygraphic substitution cipher using linear algebra and matrix multiplication.',
            keyFormat: 'Enter 4 numbers for 2×2 matrix (e.g., 3,2,5,7)',
            example: 'Matrix must have determinant coprime with 26'
        },
        'columnar': {
            description: 'A transposition cipher where text is written in rows and read in columns based on key order.',
            keyFormat: 'Enter a keyword (e.g., ZEBRAS)',
            example: 'Columns are read in alphabetical order of keyword letters'
        },
        'rail_fence': {
            description: 'A transposition cipher where text is written in a zigzag pattern across multiple rails.',
            keyFormat: 'Enter number of rails (e.g., 3)',
            example: 'Text zigzags down and up across the rails'
        },
        'scytale': {
            description: 'An ancient transposition cipher using a cylinder where text is wrapped around it.',
            keyFormat: 'Enter cylinder diameter (e.g., 4)',
            example: 'Text is written around cylinder and read vertically'
        },
        'route': {
            description: 'A transposition cipher where text is written in a grid and read following a specific route.',
            keyFormat: 'Enter a keyword for grid dimensions (e.g., ROUTE)',
            example: 'Text is read in spiral or other geometric pattern'
        },
        'des': {
            description: 'Data Encryption Standard - a symmetric block cipher using 64-bit blocks and 56-bit keys.',
            keyFormat: 'Enter 8-character key (e.g., SECRETKY)',
            example: 'Uses 16 rounds of Feistel network structure'
        },
        'triple_des': {
            description: 'Applies DES encryption three times with different keys for enhanced security.',
            keyFormat: 'Enter 16-character key (e.g., SECRETKY12345678)',
            example: 'Encrypt-Decrypt-Encrypt sequence with two keys'
        },
        'aes': {
            description: 'Advanced Encryption Standard - modern symmetric cipher with 128, 192, or 256-bit keys.',
            keyFormat: 'Enter 16, 24, or 32 character key',
            example: 'Uses substitution-permutation network with 10-14 rounds'
        },
        'feistel': {
            description: 'A cipher structure that divides data into halves and applies round functions alternately.',
            keyFormat: 'Enter a key (e.g., MYKEY)',
            example: 'Generic construction used in many block ciphers'
        },
        'stream': {
            description: 'RC4-like stream cipher that generates a keystream to XOR with plaintext.',
            keyFormat: 'Enter a variable-length key (e.g., STREAMKEY)',
            example: 'Produces pseudo-random keystream from key'
        },
        'rsa': {
            description: 'Asymmetric cipher using modular exponentiation with public/private key pairs.',
            keyFormat: 'Enter exponent,modulus (e.g., 7,33)',
            example: 'Based on difficulty of factoring large numbers'
        },
        'diffie_hellman': {
            description: 'Key exchange protocol allowing secure key agreement over insecure channels.',
            keyFormat: 'Enter p,g,private_key (e.g., 23,5,6)',
            example: 'Uses discrete logarithm problem for security'
        },
        'ecc': {
            description: 'Elliptic Curve Cryptography using mathematical properties of elliptic curves.',
            keyFormat: 'Enter curve parameters a,b,p (e.g., 2,3,17)',
            example: 'Provides strong security with smaller key sizes'
        },
        'one_time_pad': {
            description: 'Theoretically unbreakable cipher using a random key as long as the message.',
            keyFormat: 'Enter key at least as long as text',
            example: 'Perfect secrecy when key is truly random and used once'
        },
        'xor': {
            description: 'Simple cipher using XOR operation between plaintext and repeating key.',
            keyFormat: 'Enter any key (e.g., PASSWORD)',
            example: 'Key repeats cyclically across the message'
        },
        'base64': {
            description: 'Encoding scheme that converts binary data to ASCII text using 64 characters.',
            keyFormat: 'No key required',
            example: 'Uses A-Z, a-z, 0-9, +, / characters with padding'
        },
        'morse': {
            description: 'International Morse code using dots and dashes to represent letters and numbers.',
            keyFormat: 'No key required',
            example: 'A=.-, B=-..., SOS=...---...'
        }
    };
    
    const info = cipherInfo[cipher] || {
        description: 'Select a cipher to see information',
        keyFormat: '',
        example: ''
    };
    
    infoDiv.innerHTML = `
        <div class="info-text"><span class="info-highlight">Description:</span> ${info.description}</div>
        <div class="info-text"><span class="info-highlight">Key Format:</span> ${info.keyFormat}</div>
        <div class="info-text"><span class="info-highlight">Example:</span> ${info.example}</div>
    `;
}

function resetVisualization() {
    document.getElementById('animationContainer').innerHTML = `
        <div class="process-info">
            <strong>Instructions:</strong> Choose a cipher technique, enter your text and key/parameters, then click Encrypt or Decrypt to see the step-by-step animation of how the algorithm works.
        </div>
    `;
    document.getElementById('resultText').textContent = 'Result will appear here...';
    document.getElementById('visTitle').textContent = 'Select a cipher and enter text to begin';
    document.getElementById('reverseBtn').style.display = 'none';
    document.getElementById('stepCount').textContent = '0';
    currentStep = 0;
}

function copyResult() {
    const resultText = document.getElementById('resultText').textContent;
    if (resultText !== 'Result will appear here...') {
        navigator.clipboard.writeText(resultText).then(() => {
            // Briefly change button text to show success
            const btn = event.target;
            const originalText = btn.textContent;
            btn.textContent = '✓ Copied!';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 1000);
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = resultText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        });
    }
}

function reverseOperation() {
    if (lastOperation) {
        // Swap encrypt/decrypt and use result as input
        document.getElementById('plainText').value = lastResult;
        
        // Toggle operation
        if (lastOperation.isEncrypt) {
            startDecryption();
        } else {
            startEncryption();
        }
    }
}

function showError(message) {
    const container = document.getElementById('animationContainer');
    container.innerHTML = `
        <div class="process-info" style="border-left-color: #ff4444; background: rgba(255, 68, 68, 0.1);">
            <strong>Error:</strong> ${message}
        </div>
    `;
    document.getElementById('visTitle').textContent = 'Error occurred';
    document.getElementById('resultText').textContent = 'Error: ' + message;
}
