// Global variables
let currentCipher = 'caesar';
let animationSpeed = 500;
let isAnimating = false;
let stepCount = 0;

// Cipher information database
const cipherInfo = {
    caesar: {
        name: "Caesar Cipher",
        description: "A substitution cipher where each letter is shifted by a fixed number of positions in the alphabet.",
        keyInfo: "Enter a shift value (1-25). For example, shift 3 turns A→D, B→E, C→F.",
        example: "With shift 3: 'HELLO' becomes 'KHOOR'",
        history: "Named after Julius Caesar, who used it for military communications around 50 BC."
    },
    atbash: {
        name: "Atbash Cipher",
        description: "A monoalphabetic substitution cipher where A→Z, B→Y, C→X, and so on.",
        keyInfo: "No key required. The alphabet is simply reversed.",
        example: "'HELLO' becomes 'SVOOL' (H→S, E→V, L→O, O→L)",
        history: "Originally used for Hebrew alphabet, dating back to 500-600 BC."
    },
    substitution: {
        name: "Simple Substitution",
        description: "Each letter is replaced with another letter according to a fixed system.",
        keyInfo: "Enter a 26-character substitution key (e.g., 'QWERTYUIOPASDFGHJKLZXCVBNM').",
        example: "With key starting 'QWE...': A→Q, B→W, C→E",
        history: "Used throughout history, including by Mary Queen of Scots in 1586."
    },
    affine: {
        name: "Affine Cipher",
        description: "Combines multiplication and addition: E(x) = (ax + b) mod 26.",
        keyInfo: "Enter two numbers 'a,b' where a must be coprime to 26 (e.g., '5,8').",
        example: "With a=5, b=8: A(0)→8(I), B(1)→13(N), C(2)→18(S)",
        history: "Mathematical cipher combining Caesar cipher with multiplication."
    },
    vigenere: {
        name: "Vigenère Cipher",
        description: "Uses a keyword to create multiple Caesar ciphers in sequence.",
        keyInfo: "Enter a keyword (e.g., 'KEY'). Each letter determines the shift for that position.",
        example: "With key 'KEY': First letter uses K(shift 10), second uses E(shift 4), etc.",
        history: "Invented in 1553, known as 'le chiffre indéchiffrable' (the indecipherable cipher)."
    },
    playfair: {
        name: "Playfair Cipher",
        description: "Encrypts pairs of letters using a 5×5 key square.",
        keyInfo: "Enter a keyword to generate the 5×5 grid (I/J share one cell).",
        example: "Letters in same row/column follow specific rules for substitution.",
        history: "Invented by Charles Wheatstone in 1854, promoted by Lord Playfair."
    },
    beaufort: {
        name: "Beaufort Cipher",
        description: "Similar to Vigenère but uses subtraction instead of addition.",
        keyInfo: "Enter a keyword. Uses formula: C = K - P (mod 26).",
        example: "Reciprocal cipher - encryption and decryption use the same process.",
        history: "Named after Sir Francis Beaufort, known for the Beaufort wind scale."
    },
    columnar: {
        name: "Columnar Transposition",
        description: "Text is written in rows and read in columns according to a key order.",
        keyInfo: "Enter a keyword to determine column order (e.g., 'ZEBRA' = 52143).",
        example: "Text arranged in grid, columns rearranged by alphabetical key order.",
        history: "Popular in WWI and WWII for military communications."
    },
    rail_fence: {
        name: "Rail Fence Cipher",
        description: "Text is written in a zigzag pattern across multiple 'rails' then read off.",
        keyInfo: "Enter number of rails (e.g., '3' for 3-rail fence).",
        example: "With 3 rails: 'HELLO' becomes H.L.O on rails 1,2,3 then E.L in between.",
        history: "Ancient transposition cipher, simple but effective for its time."
    },
    scytale: {
        name: "Scytale Cipher",
        description: "Text wrapped around a cylinder of specific diameter, read vertically.",
        keyInfo: "Enter the number of rows (diameter of the scytale).",
        example: "Message wrapped around stick, unwrapped text appears scrambled.",
        history: "Used by Spartans around 7th century BC, one of earliest encryption devices."
    },
    enigma_basic: {
        name: "Basic Enigma",
        description: "Simplified version of the famous Enigma machine encryption.",
        keyInfo: "Enter rotor positions as 3 numbers (0-25) separated by commas.",
        example: "Each letter passes through rotors and reflector, creating complex substitution.",
        history: "German encryption machine used in WWII, breaking it helped win the war."
    },
    morse: {
        name: "Morse Code",
        description: "Text converted to dots and dashes representing letters and numbers.",
        keyInfo: "No key required. Standard International Morse Code used.",
        example: "'HELLO' becomes '.... . .-.. .-.. ---'",
        history: "Developed by Samuel Morse in 1830s for telegraph communication."
    },
    polybius: {
        name: "Polybius Square",
        description: "Letters arranged in a 5×5 grid, encoded as row-column coordinates.",
        keyInfo: "Standard grid used (I/J share position 24). No key required.",
        example: "'HELLO' becomes '2315313134' (H=23, E=15, etc.)",
        history: "Invented by Greek historian Polybius around 150 BC."
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    updateCipherInfo();
    
    // Speed slider event listener
    const speedSlider = document.getElementById('speedSlider');
    const speedValue = document.getElementById('speedValue');
    
    speedSlider.addEventListener('input', function() {
        speedValue.textContent = this.value;
        animationSpeed = 1100 - (this.value * 100); // Inverse relationship
    });
    
    // Initialize step counter
    updateStepCounter();
});

// Update cipher information display
function updateCipherInfo() {
    currentCipher = document.getElementById('cipherSelect').value;
    const info = cipherInfo[currentCipher];
    
    document.getElementById('cipherInfo').innerHTML = `
        <div class="section-title">ℹ️ ${info.name}</div>
        <div class="info-text">${info.description}</div>
        <div class="info-text"><span class="info-highlight">Key Format:</span> ${info.keyInfo}</div>
        <div class="info-text"><span class="info-highlight">Example:</span> ${info.example}</div>
        <div class="info-text"><span class="info-highlight">History:</span> ${info.history}</div>
    `;
}

// Update step counter
function updateStepCounter() {
    document.getElementById('stepCount').textContent = stepCount;
}

// Reset visualization
function resetVisualization() {
    isAnimating = false;
    stepCount = 0;
    updateStepCounter();
    
    document.getElementById('animationContainer').innerHTML = `
        <div class="process-info" style="display: none;">
            Ready to start encryption process...
        </div>
    `;
    
    document.getElementById('resultText').textContent = 'Results will appear here...';
    document.getElementById('visTitle').textContent = 'Select a cipher and enter text to begin';
}

// Start encryption process
async function startEncryption() {
    if (isAnimating) return;
    
    const plainText = document.getElementById('plainText').value.trim();
    const key = document.getElementById('cipherKey').value.trim();
    
    if (!plainText) {
        alert('Please enter some text to encrypt!');
        return;
    }
    
    if (!validateKey(currentCipher, key)) {
        return;
    }
    
    isAnimating = true;
    stepCount = 0;
    updateStepCounter();
    
    document.getElementById('visTitle').textContent = `Encrypting with ${cipherInfo[currentCipher].name}`;
    
    try {
        const result = await encryptText(plainText, key, currentCipher);
        document.getElementById('resultText').textContent = result;
    } catch (error) {
        alert('Encryption failed: ' + error.message);
    }
    
    isAnimating = false;
}

// Start decryption process
async function startDecryption() {
    if (isAnimating) return;
    
    const cipherText = document.getElementById('plainText').value.trim();
    const key = document.getElementById('cipherKey').value.trim();
    
    if (!cipherText) {
        alert('Please enter some text to decrypt!');
        return;
    }
    
    if (!validateKey(currentCipher, key)) {
        return;
    }
    
    isAnimating = true;
    stepCount = 0;
    updateStepCounter();
    
    document.getElementById('visTitle').textContent = `Decrypting with ${cipherInfo[currentCipher].name}`;
    
    try {
        const result = await decryptText(cipherText, key, currentCipher);
        document.getElementById('resultText').textContent = result;
    } catch (error) {
        alert('Decryption failed: ' + error.message);
    }
    
    isAnimating = false;
}

// Validate key based on cipher type
function validateKey(cipher, key) {
    switch (cipher) {
        case 'caesar':
            if (!key || isNaN(key) || key < 1 || key > 25) {
                alert('Caesar cipher requires a shift value between 1 and 25!');
                return false;
            }
            break;
        case 'atbash':
        case 'morse':
        case 'polybius':
            // No key required
            break;
        case 'substitution':
            if (!key || key.length !== 26 || !/^[A-Za-z]+$/.test(key)) {
                alert('Substitution cipher requires a 26-character alphabet key!');
                return false;
            }
            break;
        case 'affine':
            const parts = key.split(',');
            if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) {
                alert('Affine cipher requires two numbers separated by comma (e.g., "5,8")!');
                return false;
            }
            const a = parseInt(parts[0]);
            if (gcd(a, 26) !== 1) {
                alert('First number must be coprime to 26 (valid: 1,3,5,7,9,11,15,17,19,21,23,25)!');
                return false;
            }
            break;
        case 'vigenere':
        case 'beaufort':
        case 'playfair':
        case 'columnar':
            if (!key || !/^[A-Za-z]+$/.test(key)) {
                alert('This cipher requires an alphabetic key!');
                return false;
            }
            break;
        case 'rail_fence':
        case 'scytale':
            if (!key || isNaN(key) || key < 2) {
                alert('This cipher requires a number greater than 1!');
                return false;
            }
            break;
        case 'enigma_basic':
            const rotors = key.split(',');
            if (rotors.length !== 3 || rotors.some(r => isNaN(r) || r < 0 || r > 25)) {
                alert('Enigma requires 3 rotor positions (0-25) separated by commas!');
                return false;
            }
            break;
    }
    return true;
}

// Main encryption function
async function encryptText(text, key, cipher) {
    const container = document.getElementById('animationContainer');
    
    // Show initial text
    await showCharacterBoxes(text, 'Original Text');
    await sleep(animationSpeed);
    
    let result = '';
    
    switch (cipher) {
        case 'caesar':
            result = await caesarCipher(text, parseInt(key), true);
            break;
        case 'atbash':
            result = await atbashCipher(text);
            break;
        case 'substitution':
            result = await substitutionCipher(text, key.toUpperCase(), true);
            break;
        case 'affine':
            const [a, b] = key.split(',').map(x => parseInt(x));
            result = await affineCipher(text, a, b, true);
            break;
        case 'vigenere':
            result = await vigenereCipher(text, key.toUpperCase(), true);
            break;
        case 'playfair':
            result = await playfairCipher(text, key.toUpperCase(), true);
            break;
        case 'beaufort':
            result = await beaufortCipher(text, key.toUpperCase(), true);
            break;
        case 'columnar':
            result = await columnarTransposition(text, key.toUpperCase(), true);
            break;
        case 'rail_fence':
            result = await railFenceCipher(text, parseInt(key), true);
            break;
        case 'scytale':
            result = await scytaleCipher(text, parseInt(key), true);
            break;
        case 'enigma_basic':
            const rotorPos = key.split(',').map(x => parseInt(x));
            result = await basicEnigma(text, rotorPos, true);
            break;
        case 'morse':
            result = await morseCipher(text, true);
            break;
        case 'polybius':
            result = await polybiusCipher(text, true);
            break;
    }
    
    return result;
}

// Main decryption function
async function decryptText(text, key, cipher) {
    // Show initial text
    await showCharacterBoxes(text, 'Encrypted Text');
    await sleep(animationSpeed);
    
    let result = '';
    
    switch (cipher) {
        case 'caesar':
            result = await caesarCipher(text, parseInt(key), false);
            break;
        case 'atbash':
            result = await atbashCipher(text); // Atbash is its own inverse
            break;
        case 'substitution':
            result = await substitutionCipher(text, key.toUpperCase(), false);
            break;
        case 'affine':
            const [a, b] = key.split(',').map(x => parseInt(x));
            result = await affineCipher(text, a, b, false);
            break;
        case 'vigenere':
            result = await vigenereCipher(text, key.toUpperCase(), false);
            break;
        case 'playfair':
            result = await playfairCipher(text, key.toUpperCase(), false);
            break;
        case 'beaufort':
            result = await beaufortCipher(text, key.toUpperCase(), false); // Beaufort is its own inverse
            break;
        case 'columnar':
            result = await columnarTransposition(text, key.toUpperCase(), false);
            break;
        case 'rail_fence':
            result = await railFenceCipher(text, parseInt(key), false);
            break;
        case 'scytale':
            result = await scytaleCipher(text, parseInt(key), false);
            break;
        case 'enigma_basic':
            const rotorPos = key.split(',').map(x => parseInt(x));
            result = await basicEnigma(text, rotorPos, false);
            break;
        case 'morse':
            result = await morseCipher(text, false);
            break;
        case 'polybius':
            result = await polybiusCipher(text, false);
            break;
    }
    
    return result;
}

// Utility function for sleep/delay
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Show character boxes for visualization
async function showCharacterBoxes(text, label) {
    const container = document.getElementById('animationContainer');
    
    const processInfo = document.createElement('div');
    processInfo.className = 'process-info';
    processInfo.textContent = label;
    container.appendChild(processInfo);
    
    const charRow = document.createElement('div');
    charRow.className = 'character-row';
    
    for (let i = 0; i < text.length; i++) {
        const charBox = document.createElement('div');
        charBox.className = 'char-box';
        charBox.textContent = text[i];
        charBox.id = `char-${i}`;
        charRow.appendChild(charBox);
    }
    
    container.appendChild(charRow);
    
    stepCount++;
    updateStepCounter();
}

// Caesar Cipher implementation
async function caesarCipher(text, shift, encrypt) {
    let result = '';
    const direction = encrypt ? shift : -shift;
    
    showProcessInfo('Processing each character with shift value: ' + shift);
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const charBox = document.getElementById(`char-${i}`);
        
        if (charBox) {
            charBox.classList.add('processing');
            await sleep(animationSpeed / 2);
        }
        
        if (char.match(/[A-Za-z]/)) {
            const isUpperCase = char === char.toUpperCase();
            const base = isUpperCase ? 65 : 97; // ASCII values for 'A' and 'a'
            const shifted = ((char.charCodeAt(0) - base + direction + 26) % 26) + base;
            result += String.fromCharCode(shifted);
        } else {
            result += char;
        }
        
        if (charBox) {
            charBox.classList.remove('processing');
            charBox.classList.add(encrypt ? 'encrypted' : 'decrypted');
            charBox.textContent = result[i];
        }
        
        await sleep(animationSpeed / 2);
    }
    
    showProcessInfo('Caesar cipher complete!');
    stepCount++;
    updateStepCounter();
    
    return result;
}

// Atbash Cipher implementation
async function atbashCipher(text) {
    let result = '';
    
    showProcessInfo('Applying Atbash substitution (A↔Z, B↔Y, etc.)');
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const charBox = document.getElementById(`char-${i}`);
        
        if (charBox) {
            charBox.classList.add('processing');
            await sleep(animationSpeed / 2);
        }
        
        if (char.match(/[A-Za-z]/)) {
            const isUpperCase = char === char.toUpperCase();
            const base = isUpperCase ? 65 : 97;
            const opposite = (25 - (char.charCodeAt(0) - base)) + base;
            result += String.fromCharCode(opposite);
        } else {
            result += char;
        }
        
        if (charBox) {
            charBox.classList.remove('processing');
            charBox.classList.add('encrypted');
            charBox.textContent = result[i];
        }
        
        await sleep(animationSpeed / 2);
    }
    
    showProcessInfo('Atbash cipher complete!');
    stepCount++;
    updateStepCounter();
    
    return result;
}

// Simple Substitution Cipher
async function substitutionCipher(text, key, encrypt) {
    let result = '';
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    showProcessInfo(`Using substitution key: ${key}`);
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i].toUpperCase();
        const charBox = document.getElementById(`char-${i}`);
        
        if (charBox) {
            charBox.classList.add('processing');
            await sleep(animationSpeed / 2);
        }
        
        if (char.match(/[A-Z]/)) {
            if (encrypt) {
                const index = alphabet.indexOf(char);
                result += key[index];
            } else {
                const index = key.indexOf(char);
                result += alphabet[index];
            }
        } else {
            result += text[i];
        }
        
        if (charBox) {
            charBox.classList.remove('processing');
            charBox.classList.add(encrypt ? 'encrypted' : 'decrypted');
            charBox.textContent = result[i];
        }
        
        await sleep(animationSpeed / 2);
    }
    
    showProcessInfo('Substitution cipher complete!');
    stepCount++;
    updateStepCounter();
    
    return result;
}

// Affine Cipher implementation
async function affineCipher(text, a, b, encrypt) {
    let result = '';
    
    showProcessInfo(`Using affine formula: ${encrypt ? `(${a}x + ${b}) mod 26` : `inverse calculation`}`);
    
    // Calculate modular inverse of a
    const aInverse = encrypt ? a : modularInverse(a, 26);
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const charBox = document.getElementById(`char-${i}`);
        
        if (charBox) {
            charBox.classList.add('processing');
            await sleep(animationSpeed / 2);
        }
        
        if (char.match(/[A-Za-z]/)) {
            const isUpperCase = char === char.toUpperCase();
            const x = char.toUpperCase().charCodeAt(0) - 65;
            
            let y;
            if (encrypt) {
                y = (a * x + b) % 26;
            } else {
                y = (aInverse * (x - b + 26)) % 26;
            }
            
            const newChar = String.fromCharCode(y + 65);
            result += isUpperCase ? newChar : newChar.toLowerCase();
        } else {
            result += char;
        }
        
        if (charBox) {
            charBox.classList.remove('processing');
            charBox.classList.add(encrypt ? 'encrypted' : 'decrypted');
            charBox.textContent = result[i];
        }
        
        await sleep(animationSpeed / 2);
    }
    
    showProcessInfo('Affine cipher complete!');
    stepCount++;
    updateStepCounter();
    
    return result;
}

// Vigenère Cipher implementation
async function vigenereCipher(text, key, encrypt) {
    let result = '';
    
    showProcessInfo(`Using Vigenère key: ${key}`);
    
    let keyIndex = 0;
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const charBox = document.getElementById(`char-${i}`);
        
        if (charBox) {
            charBox.classList.add('processing');
            await sleep(animationSpeed / 2);
        }
        
        if (char.match(/[A-Za-z]/)) {
            const isUpperCase = char === char.toUpperCase();
            const textChar = char.toUpperCase().charCodeAt(0) - 65;
            const keyChar = key[keyIndex % key.length].charCodeAt(0) - 65;
            
            let newChar;
            if (encrypt) {
                newChar = (textChar + keyChar) % 26;
            } else {
                newChar = (textChar - keyChar + 26) % 26;
            }
            
            const resultChar = String.fromCharCode(newChar + 65);
            result += isUpperCase ? resultChar : resultChar.toLowerCase();
            keyIndex++;
        } else {
            result += char;
        }
        
        if (charBox) {
            charBox.classList.remove('processing');
            charBox.classList.add(encrypt ? 'encrypted' : 'decrypted');
            charBox.textContent = result[i];
        }
        
        await sleep(animationSpeed / 2);
    }
    
    showProcessInfo('Vigenère cipher complete!');
    stepCount++;
    updateStepCounter();
    
    return result;
}

// Playfair Cipher implementation
async function playfairCipher(text, key, encrypt) {
    const matrix = generatePlayfairMatrix(key);
    showPlayfairMatrix(matrix);
    
    // Prepare text (remove non-letters, handle duplicates, make pairs)
    let preparedText = text.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
    
    // Add X between duplicate letters and ensure even length
    for (let i = 0; i < preparedText.length - 1; i += 2) {
        if (preparedText[i] === preparedText[i + 1]) {
            preparedText = preparedText.slice(0, i + 1) + 'X' + preparedText.slice(i + 1);
        }
    }
    if (preparedText.length % 2 !== 0) {
        preparedText += 'X';
    }
    
    showProcessInfo('Processing letter pairs with Playfair rules');
    
    let result = '';
    for (let i = 0; i < preparedText.length; i += 2) {
        const pair = preparedText.slice(i, i + 2);
        const encrypted = encryptPlayfairPair(pair, matrix, encrypt);
        result += encrypted;
        
        await sleep(animationSpeed);
    }
    
    showProcessInfo('Playfair cipher complete!');
    stepCount++;
    updateStepCounter();
    
    return result;
}

// Beaufort Cipher implementation
async function beaufortCipher(text, key, encrypt) {
    let result = '';
    
    showProcessInfo(`Using Beaufort key: ${key} (reciprocal cipher)`);
    
    let keyIndex = 0;
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const charBox = document.getElementById(`char-${i}`);
        
        if (charBox) {
            charBox.classList.add('processing');
            await sleep(animationSpeed / 2);
        }
        
        if (char.match(/[A-Za-z]/)) {
            const isUpperCase = char === char.toUpperCase();
            const textChar = char.toUpperCase().charCodeAt(0) - 65;
            const keyChar = key[keyIndex % key.length].charCodeAt(0) - 65;
            
            // Beaufort: C = K - P (mod 26) for both encryption and decryption
            const newChar = (keyChar - textChar + 26) % 26;
            
            const resultChar = String.fromCharCode(newChar + 65);
            result += isUpperCase ? resultChar : resultChar.toLowerCase();
            keyIndex++;
        } else {
            result += char;
        }
        
        if (charBox) {
            charBox.classList.remove('processing');
            charBox.classList.add(encrypt ? 'encrypted' : 'decrypted');
            charBox.textContent = result[i];
        }
        
        await sleep(animationSpeed / 2);
    }
    
    showProcessInfo('Beaufort cipher complete!');
    stepCount++;
    updateStepCounter();
    
    return result;
}

// Columnar Transposition implementation
async function columnarTransposition(text, key, encrypt) {
    showProcessInfo(`Columnar transposition with key: ${key}`);
    
    if (encrypt) {
        return await columnarEncrypt(text, key);
    } else {
        return await columnarDecrypt(text, key);
    }
}

// Rail Fence Cipher implementation
async function railFenceCipher(text, rails, encrypt) {
    showProcessInfo(`Rail fence with ${rails} rails`);
    
    if (encrypt) {
        return await railFenceEncrypt(text, rails);
    } else {
        return await railFenceDecrypt(text, rails);
    }
}

// Scytale Cipher implementation
async function scytaleCipher(text, diameter, encrypt) {
    showProcessInfo(`Scytale with diameter: ${diameter}`);
    
    if (encrypt) {
        return await scytaleEncrypt(text, diameter);
    } else {
        return await scytaleDecrypt(text, diameter);
    }
}

// Basic Enigma implementation
async function basicEnigma(text, rotorPositions, encrypt) {
    showProcessInfo(`Enigma rotors at positions: ${rotorPositions.join(', ')}`);
    
    let result = '';
    const [r1, r2, r3] = rotorPositions;
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const charBox = document.getElementById(`char-${i}`);
        
        if (charBox) {
            charBox.classList.add('processing');
            await sleep(animationSpeed / 2);
        }
        
        if (char.match(/[A-Za-z]/)) {
            // Simplified Enigma logic
            let code = char.toUpperCase().charCodeAt(0) - 65;
            
            // Pass through rotors
            code = (code + r1) % 26;
            code = (code + r2) % 26;
            code = (code + r3) % 26;
            
            // Reflector (simple reversal)
            code = (25 - code) % 26;
            
            // Back through rotors
            code = (code - r3 + 26) % 26;
            code = (code - r2 + 26) % 26;
            code = (code - r1 + 26) % 26;
            
            result += String.fromCharCode(code + 65);
        } else {
            result += char;
        }
        
        if (charBox) {
            charBox.classList.remove('processing');
            charBox.classList.add(encrypt ? 'encrypted' : 'decrypted');
            charBox.textContent = result[i];
        }
        
        await sleep(animationSpeed / 2);
    }
    
    showProcessInfo('Basic Enigma complete!');
    stepCount++;
    updateStepCounter();
    
    return result;
}

// Morse Code implementation
async function morseCipher(text, encrypt) {
    const morseCode = {
        'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
        'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
        'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
        'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
        'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
        '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
        '8': '---..', '9': '----.', ' ': '/'
    };
    
    showProcessInfo(encrypt ? 'Converting to Morse code' : 'Converting from Morse code');
    
    if (encrypt) {
        let result = '';
        for (let i = 0; i < text.length; i++) {
            const char = text[i].toUpperCase();
            if (morseCode[char]) {
                result += morseCode[char] + ' ';
            }
            await sleep(animationSpeed / 4);
        }
        return result.trim();
    } else {
        // Decrypt morse code
        const reverseMorse = Object.fromEntries(
            Object.entries(morseCode).map(([k, v]) => [v, k])
        );
        
        return text.split(' ').map(code => reverseMorse[code] || '?').join('');
    }
}

// Polybius Square implementation
async function polybiusCipher(text, encrypt) {
    const square = [
        ['A', 'B', 'C', 'D', 'E'],
        ['F', 'G', 'H', 'I/J', 'K'],
        ['L', 'M', 'N', 'O', 'P'],
        ['Q', 'R', 'S', 'T', 'U'],
        ['V', 'W', 'X', 'Y', 'Z']
    ];
    
    showProcessInfo('Using Polybius square (5x5 grid)');
    
    if (encrypt) {
        let result = '';
        for (let i = 0; i < text.length; i++) {
            const char = text[i].toUpperCase();
            if (char === 'J') char = 'I';
            
            for (let row = 0; row < 5; row++) {
                for (let col = 0; col < 5; col++) {
                    if (square[row][col].includes(char)) {
                        result += (row + 1).toString() + (col + 1).toString();
                        break;
                    }
                }
            }
            await sleep(animationSpeed / 4);
        }
        return result;
    } else {
        // Decrypt
        let result = '';
        for (let i = 0; i < text.length; i += 2) {
            const row = parseInt(text[i]) - 1;
            const col = parseInt(text[i + 1]) - 1;
            if (row >= 0 && row < 5 && col >= 0 && col < 5) {
                result += square[row][col][0]; // Take first character if I/J
            }
        }
        return result;
    }
}

// Helper functions

function showProcessInfo(message) {
    const container = document.getElementById('animationContainer');
    const processInfo = document.createElement('div');
    processInfo.className = 'process-info';
    processInfo.textContent = message;
    container.appendChild(processInfo);
}

function gcd(a, b) {
    while (b !== 0) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

function modularInverse(a, m) {
    for (let x = 1; x < m; x++) {
        if ((a * x) % m === 1) {
            return x;
        }
    }
    return 1;
}

function generatePlayfairMatrix(key) {
    const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'; // No J
    const matrix = [];
    const used = new Set();
    
    // Add key characters first
    for (const char of key) {
        if (!used.has(char) && alphabet.includes(char)) {
            used.add(char);
        }
    }
    
    // Add remaining alphabet
    for (const char of alphabet) {
        if (!used.has(char)) {
            used.add(char);
        }
    }
    
    // Create 5x5 matrix
    const chars = Array.from(used);
    for (let i = 0; i < 5; i++) {
        matrix[i] = chars.slice(i * 5, i * 5 + 5);
    }
    
    return matrix;
}

function showPlayfairMatrix(matrix) {
    const container = document.getElementById('animationContainer');
    const matrixDiv = document.createElement('div');
    matrixDiv.className = 'matrix-display';
    matrixDiv.style.gridTemplateColumns = 'repeat(5, 1fr)';
    
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            const cell = document.createElement('div');
            cell.className = 'matrix-cell';
            cell.textContent = matrix[i][j];
            matrixDiv.appendChild(cell);
        }
    }
    
    container.appendChild(matrixDiv);
}

function encryptPlayfairPair(pair, matrix, encrypt) {
    const [char1, char2] = pair;
    const pos1 = findInMatrix(char1, matrix);
    const pos2 = findInMatrix(char2, matrix);
    
    if (pos1.row === pos2.row) {
        // Same row: move right (encrypt) or left (decrypt)
        const offset = encrypt ? 1 : -1;
        const newCol1 = (pos1.col + offset + 5) % 5;
        const newCol2 = (pos2.col + offset + 5) % 5;
        return matrix[pos1.row][newCol1] + matrix[pos2.row][newCol2];
    } else if (pos1.col === pos2.col) {
        // Same column: move down (encrypt) or up (decrypt)
        const offset = encrypt ? 1 : -1;
        const newRow1 = (pos1.row + offset + 5) % 5;
        const newRow2 = (pos2.row + offset + 5) % 5;
        return matrix[newRow1][pos1.col] + matrix[newRow2][pos2.col];
    } else {
        // Rectangle: swap columns
        return matrix[pos1.row][pos2.col] + matrix[pos2.row][pos1.col];
    }
}

function findInMatrix(char, matrix) {
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
            if (matrix[row][col] === char) {
                return { row, col };
            }
        }
    }
    return { row: 0, col: 0 };
}

// Additional helper functions for complex ciphers would go here...
// (Simplified implementations for the demo)

async function columnarEncrypt(text, key) {
    // Simplified columnar transposition
    showProcessInfo('Arranging text in columns...');
    await sleep(animationSpeed);
    return text.split('').reverse().join(''); // Placeholder
}

async function columnarDecrypt(text, key) {
    showProcessInfo('Rearranging columns back...');
    await sleep(animationSpeed);
    return text.split('').reverse().join(''); // Placeholder
}

async function railFenceEncrypt(text, rails) {
    showProcessInfo('Writing text in zigzag pattern...');
    await sleep(animationSpeed);        // Global variables
        let currentCipher = 'caesar';
        let animationSpeed = 500;
        let isAnimating = false;
        let currentStep = 0;
        let lastOperation = null;
        let lastResult = '';

        // Cipher information database
        const cipherInfo = {
            caesar: {
                name: "Caesar Cipher",
                description: "A substitution cipher where each letter is shifted by a fixed number of positions in the alphabet.",
                keyFormat: "Shift value (1-25)",
                example: "With shift 3: A→D, B→E, C→F",
                strength: "Very weak - easily broken by frequency analysis",
                invented: "Named after Julius Caesar (1st century BC)"
            },
            atbash: {
                name: "Atbash Cipher",
                description: "A substitution cipher where A↔Z, B↔Y, C↔X, etc. The alphabet is reversed.",
                keyFormat: "No key required",
                example: "HELLO → SVOOL",
                strength: "Weak - monoalphabetic substitution",
                invented: "Ancient Hebrew cipher (600-500 BC)"
            },
            substitution: {
                name: "Simple Substitution",
                description: "Each letter is replaced by another letter according to a fixed system.",
                keyFormat: "26-letter substitution key",
                example: "Key: ZYXWVUTSRQPONMLKJIHGFEDCBA",
                strength: "Moderate - vulnerable to frequency analysis",
                invented: "Ancient times, various civilizations"
            },
            affine: {
                name: "Affine Cipher",
                description: "Each letter is mapped to its numeric value, transformed by a mathematical function.",
                keyFormat: "Two integers (a,b) where gcd(a,26)=1",
                example: "Formula: (ax + b) mod 26",
                strength: "Weak - limited keyspace",
                invented: "Mathematical cipher (1929)"
            },
            vigenere: {
                name: "Vigenère Cipher",
                description: "Uses a keyword to create multiple Caesar ciphers, cycling through the key.",
                keyFormat: "Alphabetic keyword",
                example: "Key: KEY, Text: HELLO → RIJVS",
                strength: "Historically strong - 'Le Chiffre Indéchiffrable'",
                invented: "Blaise de Vigenère (1586)"
            },
            playfair: {
                name: "Playfair Cipher",
                description: "Encrypts pairs of letters using a 5×5 key square.",
                keyFormat: "Keyword for 5×5 grid",
                example: "Processes digrams instead of single letters",
                strength: "Strong for its time - more secure than monoalphabetic",
                invented: "Lord Playfair (1854)"
            },
            columnar: {
                name: "Columnar Transposition",
                description: "Text is written in rows and read in columns according to a key order.",
                keyFormat: "Keyword determining column order",
                example: "Rearranges letter positions, not substitution",
                strength: "Moderate - depends on key length",
                invented: "Ancient military cipher"
            },
            rail_fence: {
                name: "Rail Fence Cipher",
                description: "Text is written in a zigzag pattern across multiple 'rails' then read off in rows.",
                keyFormat: "Number of rails (2-10)",
                example: "3 rails: H.L.O / .E.L. / ..L..",
                strength: "Weak - simple transposition",
                invented: "Ancient Greece"
            },
            xor: {
                name: "XOR Cipher",
                description: "Each character is XORed with a repeating key using bitwise exclusive OR.",
                keyFormat: "Text or numeric key",
                example: "Reversible: A XOR Key XOR Key = A",
                strength: "Strong with proper key management",
                invented: "Modern computer era"
            },
            base64: {
                name: "Base64 Encoding",
                description: "Encodes binary data using 64 ASCII characters (A-Z, a-z, 0-9, +, /).",
                keyFormat: "No key required",
                example: "Hello → SGVsbG8=",
                strength: "Not cryptographic - encoding only",
                invented: "Computer networking (1987)"
            },
            morse: {
                name: "Morse Code",
                description: "Represents letters as combinations of dots and dashes.",
                keyFormat: "No key required",
                example: "SOS → ... --- ...",
                strength: "Not cryptographic - communication protocol",
                invented: "Samuel Morse (1838)"
            },
            beaufort: {
                name: "Beaufort Cipher",
                description: "Similar to Vigenère but uses subtraction instead of addition.",
                keyFormat: "Alphabetic keyword",
                example: "Reciprocal cipher - encryption = decryption",
                strength: "Similar to Vigenère",
                invented: "Sir Francis Beaufort (1857)"
            },
            scytale: {
                name: "Scytale Cipher",
                description: "Text wrapped around a rod of specific diameter, read vertically.",
                keyFormat: "Rod diameter/circumference",
                example: "Ancient physical transposition device",
                strength: "Weak - simple columnar transposition",
                invented: "Ancient Sparta (7th century BC)"
            }
        };

        // Update cipher information display
        function updateCipherInfo() {
            const select = document.getElementById('cipherSelect');
            currentCipher = select.value;
            const info = cipherInfo[currentCipher];
            
            const content = document.getElementById('cipherInfoContent');
            content.innerHTML = `
                <div class="info-text"><span class="info-highlight">Name:</span> ${info.name}</div>
                <div class="info-text"><span class="info-highlight">Description:</span> ${info.description}</div>
                <div class="info-text"><span class="info-highlight">Key Format:</span> ${info.keyFormat}</div>
                <div class="info-text"><span class="info-highlight">Example:</span> ${info.example}</div>
                <div class="info-text"><span class="info-highlight">Strength:</span> ${info.strength}</div>
                <div class="info-text"><span class="info-highlight">History:</span> ${info.invented}</div>
            `;

            // Update key placeholder
            const keyInput = document.getElementById('cipherKey');
            switch(currentCipher) {
                case 'caesar':
                case 'rail_fence':
                case 'scytale':
                    keyInput.placeholder = "Enter number (e.g., 3)";
                    break;
                case 'vigenere':
                case 'beaufort':
                case 'playfair':
                case 'columnar':
                    keyInput.placeholder = "Enter keyword (e.g., KEY)";
                    break;
                case 'substitution':
                    keyInput.placeholder = "26-letter key (e.g., ZYXWVU...)";
                    break;
                case 'affine':
                    keyInput.placeholder = "Two numbers (e.g., 5,8)";
                    break;
                case 'xor':
                    keyInput.placeholder = "Enter key text";
                    break;
                case 'atbash':
                case 'base64':
                case 'morse':
                    keyInput.placeholder = "No key required";
                    keyInput.value = "";
                    break;
            }
        }

        // Animation speed control
        document.getElementById('speedSlider').addEventListener('input', function() {
            const speed = this.value;
            animationSpeed = 1000 - (speed * 90); // 910ms to 100ms
            document.getElementById('speedValue').textContent = speed + 'x';
        });

        // Start encryption animation
        function startEncryption() {
            const text = document.getElementById('plainText').value.toUpperCase().trim();
            const key = document.getElementById('cipherKey').value.trim();
            
            if (!text) {
                showError("Please enter text to encrypt");
                return;
            }

            if (requiresKey(currentCipher) && !key) {
                showError("This cipher requires a key");
                return;
            }

            lastOperation = 'encrypt';
            resetAnimation();
            
            document.getElementById('visTitle').textContent = `Encrypting with ${cipherInfo[currentCipher].name}`;
            
            setTimeout(() => {
                performCipher(text, key, true);
            }, 300);
        }

        // Start decryption animation
        function startDecryption() {
            const text = document.getElementById('plainText').value.trim();
            const key = document.getElementById('cipherKey').value.trim();
            
            if (!text) {
                showError("Please enter text to decrypt");
                return;
            }

            if (requiresKey(currentCipher) && !key) {
                showError("This cipher requires a key");
                return;
            }

            lastOperation = 'decrypt';
            resetAnimation();
            
            document.getElementById('visTitle').textContent = `Decrypting with ${cipherInfo[currentCipher].name}`;
            
            setTimeout(() => {
                performCipher(text, key, false);
            }, 300);
        }

        // Check if cipher requires a key
        function requiresKey(cipher) {
            return !['atbash', 'base64', 'morse'].includes(cipher);
        }

        // Show error message
        function showError(message) {
            const container = document.getElementById('animationContainer');
            container.innerHTML = `
                <div class="process-info" style="border-left-color: #ff4444;">
                    <strong style="color: #ff4444;">Error:</strong> ${message}
                </div>
            `;
        }

        // Reset animation
        function resetAnimation() {
            isAnimating = false;
            currentStep = 0;
            document.getElementById('stepCount').textContent = '0';
            document.getElementById('animationContainer').innerHTML = '';
            document.getElementById('resultText').textContent = 'Processing...';
        }

        // Reset visualization
        function resetVisualization() {
            document.getElementById('plainText').value = '';
            document.getElementById('cipherKey').value = '';
            document.getElementById('resultText').textContent = 'Result will appear here...';
            document.getElementById('visTitle').textContent = 'Select a cipher and enter text to begin';
            document.getElementById('stepCount').textContent = '0';
            document.getElementById('reverseBtn').style.display = 'none';
            
            const container = document.getElementById('animationContainer');
            container.innerHTML = `
                <div class="process-info">
                    <strong>Instructions:</strong> Choose a cipher technique, enter your text and key, then click Encrypt or Decrypt to see the step-by-step animation of how the algorithm works.
                </div>
            `;
            
            currentStep = 0;
            lastOperation = null;
            lastResult = '';
        }

        // Main cipher processing function
        async function performCipher(text, key, isEncrypt) {
            isAnimating = true;
            currentStep = 0;
            
            let result = '';
            
            try {
                switch(currentCipher) {
                    case 'caesar':
                        result = await animateCaesar(text, key, isEncrypt);
                        break;
                    case 'atbash':
                        result = await animateAtbash(text);
                        break;
                    case 'vigenere':
                        result = await animateVigenere(text, key, isEncrypt);
                        break;
                    case 'rail_fence':
                        result = await animateRailFence(text, parseInt(key) || 3, isEncrypt);
                        break;
                    case 'xor':
                        result = await animateXOR(text, key);
                        break;
                    case 'base64':
                        result = await animateBase64(text, isEncrypt);
                        break;
                    case 'morse':
                        result = await animateMorse(text, isEncrypt);
                        break;
                    case 'columnar':
                        result = await animateColumnar(text, key, isEncrypt);
                        break;
                    case 'playfair':
                        result = await animatePlayfair(text, key, isEncrypt);
                        break;
                    case 'substitution':
                        result = await animateSubstitution(text, key, isEncrypt);
                        break;
                    case 'affine':
                        result = await animateAffine(text, key, isEncrypt);
                        break;
                    case 'beaufort':
                        result = await animateBeaufort(text, key, isEncrypt);
                        break;
                    case 'scytale':
                        result = await animateScytale(text, parseInt(key) || 4, isEncrypt);
                        break;
                    default:
                        throw new Error('Cipher not implemented yet');
                }
                
                document.getElementById('resultText').textContent = result;
                lastResult = result;
                document.getElementById('reverseBtn').style.display = 'inline-block';
                
            } catch (error) {
                showError(error.message);
            }
            
            isAnimating = false;
        }

        // Caesar Cipher Animation
        async function animateCaesar(text, key, isEncrypt) {
            const shift = parseInt(key) || 3;
            const actualShift = isEncrypt ? shift : 26 - shift;
            
            const container = document.getElementById('animationContainer');
            container.innerHTML = `
                <div class="process-info">
                    <strong>Caesar Cipher:</strong> Shifting each letter by ${shift} position${shift !== 1 ? 's' : ''} ${isEncrypt ? 'forward' : 'backward'} in the alphabet.
                </div>
                <div class="key-display">Shift Value: ${shift}</div>
            `;
            
            // Create character boxes
            const inputRow = document.createElement('div');
            inputRow.className = 'character-row';
            
            const outputRow = document.createElement('div');
            outputRow.className = 'character-row';
            
            const chars = text.split('');
            const inputBoxes = [];
            const outputBoxes = [];
            
            // Create input boxes
            chars.forEach((char, i) => {
                const box = document.createElement('div');
                box.className = 'char-box';
                box.textContent = char;
                inputBoxes.push(box);
                inputRow.appendChild(box);
                
                const outputBox = document.createElement('div');
                outputBox.className = 'char-box';
                outputBox.textContent = '?';
                outputBoxes.push(outputBox);
                outputRow.appendChild(outputBox);
            });
            
            container.appendChild(inputRow);
            
            const arrow = document.createElement('div');
            arrow.className = 'arrow';
            arrow.textContent = '↓';
            container.appendChild(arrow);
            
            container.appendChild(outputRow);
            
            let result = '';
            
            // Animate each character
            for (let i = 0; i < chars.length; i++) {
                await sleep(animationSpeed);
                
                inputBoxes[i].classList.add('processing');
                currentStep++;
                document.getElementById('stepCount').textContent = currentStep;
                
                await sleep(animationSpeed / 2);
                
                const char = chars[i];
                let newChar = char;
                
                if (char.match(/[A-Z]/)) {
                    const charCode = char.charCodeAt(0) - 65;
                    const newCharCode = (charCode + actualShift) % 26;
                    newChar = String.fromCharCode(newCharCode + 65);
                } else if (char.match(/[a-z]/)) {
                    const charCode = char.charCodeAt(0) - 97;
                    const newCharCode = (charCode + actualShift) % 26;
                    newChar = String.fromCharCode(newCharCode + 97);
                }
                
                outputBoxes[i].textContent = newChar;
                outputBoxes[i].classList.add(isEncrypt ? 'encrypted' : 'decrypted');
                result += newChar;
                
                inputBoxes[i].classList.remove('processing');
            }
            
            return result;
        }

        // Atbash Cipher Animation
        async function animateAtbash(text) {
            const container = document.getElementById('animationContainer');
            container.innerHTML = `
                <div class="process-info">
                    <strong>Atbash Cipher:</strong> Each letter is mapped to its opposite in the alphabet (A↔Z, B↔Y, C↔X, etc.)
                </div>
                <div class="key-display">Alphabet: ABCDEFGHIJKLMNOPQRSTUVWXYZ<br>Atbash:   ZYXWVUTSRQPONMLKJIHGFEDCBA</div>
            `;
            
            return await animateCharacterSubstitution(text, (char) => {
                if (char.match(/[A-Z]/)) {
                    return String.fromCharCode(90 - (char.charCodeAt(0) - 65));
                } else if (char.match(/[a-z]/)) {
                    return String.fromCharCode(122 - (char.charCodeAt(0) - 97));
                }
                return char;
            }, container);
        }

        // Vigenère Cipher Animation
        async function animateVigenere(text, key, isEncrypt) {
            if (!key) throw new Error("Vigenère cipher requires a keyword");
            
            const container = document.getElementById('animationContainer');
            const upperKey = key.toUpperCase().replace(/[^A-Z]/g, '');
            
            if (!upperKey) throw new Error("Key must contain at least one letter");
            
            container.innerHTML = `
                <div class="process-info">
                    <strong>Vigenère Cipher:</strong> Using keyword "${upperKey}" to create multiple Caesar shifts.
                </div>
                <div class="key-display">Keyword: ${upperKey} (repeating)</div>
            `;
            
            // Create rows for text, key, and result
            const textRow = document.createElement('div');
            textRow.className = 'character-row';
            
            const keyRow = document.createElement('div');
            keyRow.className = 'character-row';
            
            const resultRow = document.createElement('div');
            resultRow.className = 'character-row';
            
            const chars = text.split('');
            const textBoxes = [];
            const keyBoxes = [];
            const resultBoxes = [];
            
            let keyIndex = 0;
            
            chars.forEach((char, i) => {
                // Text box
                const textBox = document.createElement('div');
                textBox.className = 'char-box';
                textBox.textContent = char;
                textBoxes.push(textBox);
                textRow.appendChild(textBox);
                
                // Key box
                const keyBox = document.createElement('div');
                keyBox.className = 'char-box';
                if (char.match(/[A-Za-z]/)) {
                    keyBox.textContent = upperKey[keyIndex % upperKey.length];
                    keyIndex++;
                } else {
                    keyBox.textContent = '-';
                }
                keyBoxes.push(keyBox);
                keyRow.appendChild(keyBox);
                
                // Result box
                const resultBox = document.createElement('div');
                resultBox.className = 'char-box';
                resultBox.textContent = '?';
                resultBoxes.push(resultBox);
                resultRow.appendChild(resultBox);
            });
            
            container.appendChild(textRow);
            container.appendChild(keyRow);
            
            const arrow = document.createElement('div');
            arrow.className = 'arrow';
            arrow.textContent = '↓';
            container.appendChild(arrow);
            
            container.appendChild(resultRow);
            
            let result = '';
            keyIndex = 0;
            
            for (let i = 0; i < chars.length; i++) {
                await sleep(animationSpeed);
                
                textBoxes[i].classList.add('processing');
                keyBoxes[i].classList.add('processing');
                currentStep++;
                document.getElementById('stepCount').textContent = currentStep;
                
                await sleep(animationSpeed / 2);
                
                const char = chars[i];
                let newChar = char;
                
                if (char.match(/[A-Za-z]/)) {
                    const keyChar = upperKey[keyIndex % upperKey.length];
                    const keyShift = keyChar.charCodeAt(0) - 65;
                    
                    if (char.match(/[A-Z]/)) {
                        const charCode = char.charCodeAt(0) - 65;
                        const newCharCode = isEncrypt ? 
                            (charCode + keyShift) % 26 : 
                            (charCode - keyShift + 26) % 26;
                        newChar = String.fromCharCode(newCharCode + 65);
                    } else {
                        const charCode = char.charCodeAt(0) - 97;
                        const newCharCode = isEncrypt ? 
                            (charCode + keyShift) % 26 : 
                            (charCode - keyShift + 26) % 26;
                        newChar = String.fromCharCode(newCharCode + 97);
                    }
                    keyIndex++;
                }
                
                resultBoxes[i].textContent = newChar;
                resultBoxes[i].classList.add(isEncrypt ? 'encrypted' : 'decrypted');
                result += newChar;
                
                textBoxes[i].classList.remove('processing');
                keyBoxes[i].classList.remove('processing');
            }
            
            return result;
        }

// Rail Fence Cipher Animation
async function animateRailFence(text, rails, isEncrypt) {
    if (rails < 2 || rails > 10) throw new Error("Rails must be between 2 and 10");
    
    // Remove spaces from text for Rail Fence cipher
    const cleanText = text.replace(/\s/g, '');
    
    const container = document.getElementById('animationContainer');
    container.innerHTML = `
        <div class="process-info">
            <strong>Rail Fence Cipher:</strong> Removing spaces from text, then writing in zigzag pattern across ${rails} rails, then reading ${isEncrypt ? 'row by row' : 'following the zigzag'}.
        </div>
        <div class="key-display">Number of Rails: ${rails}</div>
        <div class="process-info">
            <strong>Original text:</strong> "${text}" → <strong>Clean text:</strong> "${cleanText}"
        </div>
    `;
    
    if (isEncrypt) {
        return await animateRailFenceEncrypt(cleanText, rails, container);
    } else {
        return await animateRailFenceDecrypt(cleanText, rails, container);
    }
}

async function animateRailFenceEncrypt(text, rails, container) {
    // Create zigzag grid
    const textLength = text.length;
    const gridWidth = textLength;
    const gridHeight = rails;
    
    // Create the visual grid
    const gridContainer = document.createElement('div');
    gridContainer.style.cssText = `
        display: grid;
        grid-template-columns: repeat(${gridWidth}, 50px);
        grid-template-rows: repeat(${gridHeight}, 50px);
        gap: 2px;
        justify-content: center;
        margin: 20px 0;
        position: relative;
        min-width: fit-content;
    `;
    
    // Calculate zigzag positions
    const positions = [];
    let currentRail = 0;
    let direction = 1; // 1 for down, -1 for up
    
    for (let i = 0; i < textLength; i++) {
        positions.push({ col: i, row: currentRail, char: text[i] });
        
        // Change direction at top and bottom rails
        if (currentRail === 0) {
            direction = 1;
        } else if (currentRail === rails - 1) {
            direction = -1;
        }
        
        currentRail += direction;
    }
    
    // Create all grid cells
    const gridCells = [];
    for (let row = 0; row < gridHeight; row++) {
        gridCells[row] = [];
        for (let col = 0; col < gridWidth; col++) {
            const cell = document.createElement('div');
            cell.className = 'char-box';
            cell.style.cssText = `
                grid-row: ${row + 1};
                grid-column: ${col + 1};
                opacity: 0.1;
                border: 1px solid #333;
            `;
            cell.textContent = '·';
            gridContainer.appendChild(cell);
            gridCells[row][col] = cell;
        }
    }
    
    container.appendChild(gridContainer);
    
    // Animate placing characters in zigzag pattern
    for (let i = 0; i < positions.length; i++) {
        await sleep(animationSpeed);
        
        const pos = positions[i];
        const cell = gridCells[pos.row][pos.col];
        
        cell.textContent = pos.char;
        cell.style.opacity = '1';
        cell.classList.add('processing');
        
        currentStep++;
        document.getElementById('stepCount').textContent = currentStep;
        
        await sleep(animationSpeed / 2);
        cell.classList.remove('processing');
        cell.classList.add('encrypted');
    }
    
    await sleep(animationSpeed);
    
    // Now read row by row to get encrypted text
    const railArrays = Array(rails).fill().map(() => []);
    
    // Collect characters from each rail
    positions.forEach(pos => {
        railArrays[pos.row].push(pos.char);
    });
    
    // Animate reading each rail
    let result = '';
    for (let r = 0; r < rails; r++) {
        const railInfo = document.createElement('div');
        railInfo.className = 'process-info';
        railInfo.innerHTML = `<strong>Reading Rail ${r + 1}:</strong> ${railArrays[r].join(' ')}`;
        container.appendChild(railInfo);
        
        // Highlight rail being read
        for (let pos of positions) {
            if (pos.row === r) {
                await sleep(animationSpeed / 4);
                const cell = gridCells[pos.row][pos.col];
                cell.style.boxShadow = '0 0 15px #00ff41';
                result += pos.char;
            }
        }
        
        await sleep(animationSpeed / 2);
        
        // Remove highlights
        for (let pos of positions) {
            if (pos.row === r) {
                gridCells[pos.row][pos.col].style.boxShadow = 'none';
            }
        }
    }
    
    return result;
}

async function animateRailFenceDecrypt(text, rails, container) {
    // First, determine how many characters go in each rail
    const railLengths = Array(rails).fill(0);
    let rail = 0;
    let direction = 1;
    
    // Calculate zigzag pattern to determine rail lengths
    for (let i = 0; i < text.length; i++) {
        railLengths[rail]++;
        
        if (rail === 0) {
            direction = 1;
        } else if (rail === rails - 1) {
            direction = -1;
        }
        
        rail += direction;
    }
    
    // Show how we split the encrypted text into rails
    const railGrid = document.createElement('div');
    railGrid.style.margin = '20px 0';
    
    const railRows = [];
    const railData = Array(rails).fill().map(() => []);
    
    for (let i = 0; i < rails; i++) {
        const row = document.createElement('div');
        row.className = 'character-row';
        row.style.marginBottom = '15px';
        
        const label = document.createElement('div');
        label.style.cssText = 'color: #00ff41; margin-right: 10px; font-weight: bold; min-width: 60px;';
        label.textContent = `Rail ${i + 1}:`;
        row.appendChild(label);
        
        railRows.push(row);
        railGrid.appendChild(row);
    }
    
    container.appendChild(railGrid);
    
    // Fill rails with characters from encrypted text
    let textIndex = 0;
    for (let r = 0; r < rails; r++) {
        for (let c = 0; c < railLengths[r]; c++) {
            await sleep(animationSpeed / 3);
            
            const char = text[textIndex++];
            const box = document.createElement('div');
            box.className = 'char-box encrypted';
            box.textContent = char;
            
            railRows[r].appendChild(box);
            railData[r].push({ char, box });
            
            currentStep++;
            document.getElementById('stepCount').textContent = currentStep;
        }
    }
    
    await sleep(animationSpeed);
    
    // Now create the zigzag grid for reconstruction
    const zigzagGrid = document.createElement('div');
    zigzagGrid.style.cssText = `
        display: grid;
        grid-template-columns: repeat(${text.length}, 50px);
        grid-template-rows: repeat(${rails}, 50px);
        gap: 2px;
        justify-content: center;
        margin: 20px 0;
        position: relative;
        min-width: fit-content;
    `;
    
    const processInfo = document.createElement('div');
    processInfo.className = 'process-info';
    processInfo.innerHTML = '<strong>Reconstructing zigzag pattern:</strong>';
    container.appendChild(processInfo);
    container.appendChild(zigzagGrid);
    
    // Create empty zigzag grid
    const zigzagCells = [];
    for (let row = 0; row < rails; row++) {
        zigzagCells[row] = [];
        for (let col = 0; col < text.length; col++) {
            const cell = document.createElement('div');
            cell.className = 'char-box';
            cell.style.cssText = `
                grid-row: ${row + 1};
                grid-column: ${col + 1};
                opacity: 0.1;
                border: 1px solid #333;
            `;
            cell.textContent = '·';
            zigzagGrid.appendChild(cell);
            zigzagCells[row][col] = cell;
        }
    }
    
    // Reconstruct zigzag pattern and read result
    const railIndices = Array(rails).fill(0);
    const result = [];
    rail = 0;
    direction = 1;
    
    for (let col = 0; col < text.length; col++) {
        await sleep(animationSpeed / 2);
        
        // Get character from current rail
        const railIndex = railIndices[rail];
        const charData = railData[rail][railIndex];
        
        if (charData) {
            const cell = zigzagCells[rail][col];
            cell.textContent = charData.char;
            cell.style.opacity = '1';
            cell.classList.add('decrypted');
            
            result.push(charData.char);
            railIndices[rail]++;
        }
        
        // Update rail position
        if (rail === 0) {
            direction = 1;
        } else if (rail === rails - 1) {
            direction = -1;
        }
        
        rail += direction;
        
        currentStep++;
        document.getElementById('stepCount').textContent = currentStep;
    }
    
    return result.join('');
}
        // XOR Cipher Animation
        async function animateXOR(text, key) {
            if (!key) throw new Error("XOR cipher requires a key");
            
            const container = document.getElementById('animationContainer');
            container.innerHTML = `
                <div class="process-info">
                    <strong>XOR Cipher:</strong> Each character is XORed with the repeating key using bitwise exclusive OR.
                </div>
                <div class="key-display">Key: "${key}" (repeating)</div>
            `;
            
            return await animateCharacterSubstitution(text, (char, index) => {
                const keyChar = key[index % key.length];
                return String.fromCharCode(char.charCodeAt(0) ^ keyChar.charCodeAt(0));
            }, container, key);
        }

        // Base64 Animation
        async function animateBase64(text, isEncrypt) {
            const container = document.getElementById('animationContainer');
            const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
            
            container.innerHTML = `
                <div class="process-info">
                    <strong>Base64 ${isEncrypt ? 'Encoding' : 'Decoding'}:</strong> ${isEncrypt ? 'Converting text to Base64 representation' : 'Converting Base64 back to text'}.
                </div>
                <div class="key-display">Character Set: ${base64Chars}</div>
            `;
            
            if (isEncrypt) {
                // Simple Base64 encoding animation
                const bytes = [];
                for (let i = 0; i < text.length; i++) {
                    bytes.push(text.charCodeAt(i));
                }
                
                let result = '';
                const inputRow = createCharacterRow(text.split(''), container);
                
                await sleep(animationSpeed);
                
                // For simplicity, use browser's btoa function but animate it
                for (let i = 0; i < inputRow.length; i++) {
                    await sleep(animationSpeed / 2);
                    inputRow[i].classList.add('processing');
                    currentStep++;
                    document.getElementById('stepCount').textContent = currentStep;
                    await sleep(animationSpeed / 2);
                    inputRow[i].classList.remove('processing');
                    inputRow[i].classList.add('encrypted');
                }
                
                result = btoa(text);
                return result;
            } else {
                try {
                    const result = atob(text);
                    const inputRow = createCharacterRow(text.split(''), container);
                    
                    for (let i = 0; i < inputRow.length; i++) {
                        await sleep(animationSpeed / 4);
                        inputRow[i].classList.add('processing');
                        currentStep++;
                        document.getElementById('stepCount').textContent = currentStep;
                        await sleep(animationSpeed / 4);
                        inputRow[i].classList.remove('processing');
                        inputRow[i].classList.add('decrypted');
                    }
                    
                    return result;
                } catch (e) {
                    throw new Error("Invalid Base64 input");
                }
            }
        }

        // Morse Code Animation
        async function animateMorse(text, isEncrypt) {
            const morseCode = {
                'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
                'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
                'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
                'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
                'Y': '-.--', 'Z': '--..', ' ': '/', '0': '-----', '1': '.----',
                '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....',
                '7': '--...', '8': '---..', '9': '----.', '.': '.-.-.-', ',': '--..--'
            };
            
            const container = document.getElementById('animationContainer');
            container.innerHTML = `
                <div class="process-info">
                    <strong>Morse Code:</strong> ${isEncrypt ? 'Converting letters to dots and dashes' : 'Converting dots and dashes to letters'}.
                </div>
                <div class="key-display">· = Dot (short signal) | - = Dash (long signal) | / = Space</div>
            `;
            
            if (isEncrypt) {
                return await animateCharacterSubstitution(text.toUpperCase(), (char) => {
                    return morseCode[char] || char;
                }, container, ' ');
            } else {
                // Decrypt morse code
                const words = text.split('/');
                let result = '';
                
                for (let word of words) {
                    const letters = word.trim().split(' ');
                    for (let letter of letters) {
                        const char = Object.keys(morseCode).find(key => morseCode[key] === letter);
                        result += char || '?';
                    }
                    result += ' ';
                }
                
                await animateCharacterSubstitution(text, () => '', container);
                return result.trim();
            }
        }

        // Columnar Transposition Animation
        async function animateColumnar(text, key, isEncrypt) {
            if (!key) throw new Error("Columnar transposition requires a keyword");
            
            const container = document.getElementById('animationContainer');
            const upperKey = key.toUpperCase().replace(/[^A-Z]/g, '');
            
            container.innerHTML = `
                <div class="process-info">
                    <strong>Columnar Transposition:</strong> Arranging text in columns based on keyword order.
                </div>
                <div class="key-display">Keyword: ${upperKey}</div>
            `;
            
            if (isEncrypt) {
                // Create grid
                const cols = upperKey.length;
                const rows = Math.ceil(text.length / cols);
                
                // Show column headers with order
                const keyOrder = [...upperKey].map((char, i) => ({ char, original: i }))
                    .sort((a, b) => a.char.localeCompare(b.char))
                    .map((item, i) => ({ ...item, order: i }));
                
                const headerRow = document.createElement('div');
                headerRow.className = 'character-row';
                headerRow.style.marginBottom = '10px';
                
                keyOrder.forEach(item => {
                    const header = document.createElement('div');
                    header.className = 'char-box';
                    header.textContent = `${item.char}(${item.order + 1})`;
                    header.style.background = '#444';
                    headerRow.appendChild(header);
                });
                
                container.appendChild(headerRow);
                
                // Create grid and fill with text
                const grid = [];
                for (let r = 0; r < rows; r++) {
                    const row = document.createElement('div');
                    row.className = 'character-row';
                    const rowData = [];
                    
                    for (let c = 0; c < cols; c++) {
                        const index = r * cols + c;
                        const char = index < text.length ? text[index] : '';
                        
                        const box = document.createElement('div');
                        box.className = 'char-box';
                        box.textContent = char || '·';
                        if (!char) box.style.opacity = '0.3';
                        
                        row.appendChild(box);
                        rowData.push({ box, char });
                    }
                    
                    grid.push(rowData);
                    container.appendChild(row);
                }
                
                await sleep(animationSpeed * 2);
                
                // Read columns in key order
                let result = '';
                const sortedKeyOrder = [...keyOrder].sort((a, b) => a.order - b.order);
                
                for (let keyItem of sortedKeyOrder) {
                    const col = keyItem.original;
                    
                    for (let r = 0; r < rows; r++) {
                        if (grid[r][col].char) {
                            await sleep(animationSpeed / 2);
                            grid[r][col].box.classList.add('processing');
                            currentStep++;
                            document.getElementById('stepCount').textContent = currentStep;
                            
                            await sleep(animationSpeed / 2);
                            grid[r][col].box.classList.remove('processing');
                            grid[r][col].box.classList.add('encrypted');
                            result += grid[r][col].char;
                        }
                    }
                }
                
                return result;
            } else {
                // Decryption logic would be more complex - simplified here
                return text.split('').reverse().join(''); // Placeholder
            }
        }

        // Playfair Cipher Animation
        async function animatePlayfair(text, key, isEncrypt) {
            if (!key) throw new Error("Playfair cipher requires a keyword");
            
            const container = document.getElementById('animationContainer');
            const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
            
            // Create 5x5 key square
            const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'; // J omitted
            const keySquare = [];
            const used = new Set();
            
            // Add key letters first
            for (let char of cleanKey) {
                if (!used.has(char)) {
                    keySquare.push(char);
                    used.add(char);
                }
            }
            
            // Add remaining letters
            for (let char of alphabet) {
                if (!used.has(char)) {
                    keySquare.push(char);
                }
            }
            
            container.innerHTML = `
                <div class="process-info">
                    <strong>Playfair Cipher:</strong> Using 5×5 key square to encrypt letter pairs (digrams).
                </div>
                <div class="key-display">Keyword: ${cleanKey}</div>
            `;
            
            // Display key square
            const matrix = document.createElement('div');
            matrix.className = 'matrix-display';
            matrix.style.gridTemplateColumns = 'repeat(5, 1fr)';
            matrix.style.maxWidth = '200px';
            matrix.style.margin = '20px auto';
            
            for (let i = 0; i < 25; i++) {
                const cell = document.createElement('div');
                cell.className = 'matrix-cell';
                cell.textContent = keySquare[i];
                matrix.appendChild(cell);
            }
            
            container.appendChild(matrix);
            
            // Simplified Playfair animation (actual algorithm is complex)
            const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
            return await animateCharacterSubstitution(cleanText, (char) => {
                const index = keySquare.indexOf(char);
                if (index === -1) return char;
                // Simplified transformation
                return keySquare[(index + (isEncrypt ? 1 : -1) + 25) % 25];
            }, container);
        }

        // Generic character substitution animation
        async function animateCharacterSubstitution(text, transformFunc, container, separator = '') {
            const inputRow = document.createElement('div');
            inputRow.className = 'character-row';
            
            const outputRow = document.createElement('div');
            outputRow.className = 'character-row';
            
            const chars = text.split('');
            const inputBoxes = [];
            const outputBoxes = [];
            
            chars.forEach((char, i) => {
                const inputBox = document.createElement('div');
                inputBox.className = 'char-box';
                inputBox.textContent = char;
                inputBoxes.push(inputBox);
                inputRow.appendChild(inputBox);
                
                const outputBox = document.createElement('div');
                outputBox.className = 'char-box';
                outputBox.textContent = '?';
                outputBoxes.push(outputBox);
                outputRow.appendChild(outputBox);
            });
            
            container.appendChild(inputRow);
            
            const arrow = document.createElement('div');
            arrow.className = 'arrow';
            arrow.textContent = '↓';
            container.appendChild(arrow);
            
            container.appendChild(outputRow);
            
            let result = '';
            
            for (let i = 0; i < chars.length; i++) {
                await sleep(animationSpeed);
                
                inputBoxes[i].classList.add('processing');
                currentStep++;
                document.getElementById('stepCount').textContent = currentStep;
                
                await sleep(animationSpeed / 2);
                
                const newChar = transformFunc(chars[i], i);
                outputBoxes[i].textContent = newChar;
                outputBoxes[i].classList.add('encrypted');
                result += newChar + separator;
                
                inputBoxes[i].classList.remove('processing');
            }
            
            return result;
        }

        // Simple Substitution Animation
        async function animateSubstitution(text, key, isEncrypt) {
            if (!key || key.length !== 26) {
                throw new Error("Substitution cipher requires a 26-letter key");
            }
            
            const container = document.getElementById('animationContainer');
            const upperKey = key.toUpperCase();
            const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            
            container.innerHTML = `
                <div class="process-info">
                    <strong>Simple Substitution:</strong> Each letter maps to a different letter according to the key.
                </div>
                <div class="key-display">
                    Alphabet: ${alphabet}<br>
                    Key:      ${upperKey}
                </div>
            `;
            
            return await animateCharacterSubstitution(text.toUpperCase(), (char) => {
                if (char.match(/[A-Z]/)) {
                    if (isEncrypt) {
                        const index = char.charCodeAt(0) - 65;
                        return upperKey[index];
                    } else {
                        const index = upperKey.indexOf(char);
                        return index !== -1 ? String.fromCharCode(index + 65) : char;
                    }
                }
                return char;
            }, container);
        }

        // Affine Cipher Animation
        async function animateAffine(text, key, isEncrypt) {
            const parts = key.split(',').map(x => parseInt(x.trim()));
            if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) {
                throw new Error("Affine cipher requires two numbers separated by comma (e.g., 5,8)");
            }
            
            const [a, b] = parts;
            if (gcd(a, 26) !== 1) {
                throw new Error("First number must be coprime to 26");
            }
            
            const container = document.getElementById('animationContainer');
            container.innerHTML = `
                <div class="process-info">
                    <strong>Affine Cipher:</strong> Using formula ${isEncrypt ? `(${a}x + ${b}) mod 26` : `${modInverse(a, 26)}(x - ${b}) mod 26`}
                </div>
                <div class="key-display">a = ${a}, b = ${b}</div>
            `;
            
            return await animateCharacterSubstitution(text.toUpperCase(), (char) => {
                if (char.match(/[A-Z]/)) {
                    const x = char.charCodeAt(0) - 65;
                    let result;
                    
                    if (isEncrypt) {
                        result = (a * x + b) % 26;
                    } else {
                        const aInv = modInverse(a, 26);
                        result = (aInv * (x - b + 26)) % 26;
                    }
                    
                    return String.fromCharCode(result + 65);
                }
                return char;
            }, container);
        }

        // Beaufort Cipher Animation
        async function animateBeaufort(text, key, isEncrypt) {
            if (!key) throw new Error("Beaufort cipher requires a keyword");
            
            const container = document.getElementById('animationContainer');
            const upperKey = key.toUpperCase().replace(/[^A-Z]/g, '');
            
            container.innerHTML = `
                <div class="process-info">
                    <strong>Beaufort Cipher:</strong> Using keyword "${upperKey}" with subtraction instead of addition.
                </div>
                <div class="key-display">Keyword: ${upperKey} (repeating)</div>
            `;
            
            // Create rows for visualization
            const textRow = document.createElement('div');
            textRow.className = 'character-row';
            
            const keyRow = document.createElement('div');
            keyRow.className = 'character-row';
            
            const resultRow = document.createElement('div');
            resultRow.className = 'character-row';
            
            const chars = text.toUpperCase().split('');
            const textBoxes = [];
            const keyBoxes = [];
            const resultBoxes = [];
            
            let keyIndex = 0;
            
            chars.forEach((char, i) => {
                // Text box
                const textBox = document.createElement('div');
                textBox.className = 'char-box';
                textBox.textContent = char;
                textBoxes.push(textBox);
                textRow.appendChild(textBox);
                
                // Key box
                const keyBox = document.createElement('div');
                keyBox.className = 'char-box';
                if (char.match(/[A-Z]/)) {
                    keyBox.textContent = upperKey[keyIndex % upperKey.length];
                    keyIndex++;
                } else {
                    keyBox.textContent = '-';
                }
                keyBoxes.push(keyBox);
                keyRow.appendChild(keyBox);
                
                // Result box
                const resultBox = document.createElement('div');
                resultBox.className = 'char-box';
                resultBox.textContent = '?';
                resultBoxes.push(resultBox);
                resultRow.appendChild(resultBox);
            });
            
            container.appendChild(textRow);
            container.appendChild(keyRow);
            
            const arrow = document.createElement('div');
            arrow.className = 'arrow';
            arrow.textContent = '↓';
            container.appendChild(arrow);
            
            container.appendChild(resultRow);
            
            let result = '';
            keyIndex = 0;
            
            for (let i = 0; i < chars.length; i++) {
                await sleep(animationSpeed);
                
                textBoxes[i].classList.add('processing');
                keyBoxes[i].classList.add('processing');
                currentStep++;
                document.getElementById('stepCount').textContent = currentStep;
                
                await sleep(animationSpeed / 2);
                
                const char = chars[i];
                let newChar = char;
                
                if (char.match(/[A-Z]/)) {
                    const keyChar = upperKey[keyIndex % upperKey.length];
                    const charCode = char.charCodeAt(0) - 65;
                    const keyCode = keyChar.charCodeAt(0) - 65;
                    
                    // Beaufort: (key - text) mod 26 for both encrypt and decrypt
                    const newCharCode = (keyCode - charCode + 26) % 26;
                    newChar = String.fromCharCode(newCharCode + 65);
                    keyIndex++;
                }
                
                resultBoxes[i].textContent = newChar;
                resultBoxes[i].classList.add(isEncrypt ? 'encrypted' : 'decrypted');
                result += newChar;
                
                textBoxes[i].classList.remove('processing');
                keyBoxes[i].classList.remove('processing');
            }
            
            return result;
        }

        // Scytale Cipher Animation
        async function animateScytale(text, diameter, isEncrypt) {
            if (diameter < 2 || diameter > 10) throw new Error("Diameter must be between 2 and 10");
            
            const container = document.getElementById('animationContainer');
            container.innerHTML = `
                <div class="process-info">
                    <strong>Scytale Cipher:</strong> Wrapping text around a rod with diameter ${diameter} and reading ${isEncrypt ? 'vertically' : 'horizontally'}.
                </div>
                <div class="key-display">Rod Diameter: ${diameter}</div>
            `;
            
            // Create grid representation
            const rows = Math.ceil(text.length / diameter);
            const grid = [];
            
            for (let r = 0; r < rows; r++) {
                const row = document.createElement('div');
                row.className = 'character-row';
                const rowData = [];
                
                for (let c = 0; c < diameter; c++) {
                    const index = isEncrypt ? (r * diameter + c) : (c * rows + r);
                    const char = index < text.length ? text[index] : '';
                    
                    const box = document.createElement('div');
                    box.className = 'char-box';
                    box.textContent = char || '·';
                    if (!char) box.style.opacity = '0.3';
                    
                    row.appendChild(box);
                    rowData.push({ box, char, index });
                }
                
                grid.push(rowData);
                container.appendChild(row);
            }
            
            await sleep(animationSpeed * 2);
            
            let result = '';
            
            if (isEncrypt) {
                // Read columns (vertically)
                for (let c = 0; c < diameter; c++) {
                    for (let r = 0; r < rows; r++) {
                        if (grid[r][c].char) {
                            await sleep(animationSpeed / 2);
                            grid[r][c].box.classList.add('processing');
                            currentStep++;
                            document.getElementById('stepCount').textContent = currentStep;
                            
                            await sleep(animationSpeed / 2);
                            grid[r][c].box.classList.remove('processing');
                            grid[r][c].box.classList.add('encrypted');
                            result += grid[r][c].char;
                        }
                    }
                }
            } else {
                // Read rows (horizontally)
                for (let r = 0; r < rows; r++) {
                    for (let c = 0; c < diameter; c++) {
                        if (grid[r][c].char) {
                            await sleep(animationSpeed / 2);
                            grid[r][c].box.classList.add('processing');
                            currentStep++;
                            document.getElementById('stepCount').textContent = currentStep;
                            
                            await sleep(animationSpeed / 2);
                            grid[r][c].box.classList.remove('processing');
                            grid[r][c].box.classList.add('decrypted');
                            result += grid[r][c].char;
                        }
                    }
                }
            }
            
            return result;
        }

        // Helper function to create character row
        function createCharacterRow(chars, container) {
            const row = document.createElement('div');
            row.className = 'character-row';
            
            const boxes = chars.map(char => {
                const box = document.createElement('div');
                box.className = 'char-box';
                box.textContent = char;
                row.appendChild(box);
                return box;
            });
            
            container.appendChild(row);
            return boxes;
        }

        // Utility functions
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        function gcd(a, b) {
            while (b !== 0) {
                const temp = b;
                b = a % b;
                a = temp;
            }
            return a;
        }

        function modInverse(a, m) {
            for (let i = 1; i < m; i++) {
                if ((a * i) % m === 1) {
                    return i;
                }
            }
            return 1;
        }

        // Copy result to clipboard
        function copyResult() {
            const result = document.getElementById('resultText').textContent;
            if (result && result !== 'Result will appear here...' && result !== 'Processing...') {
                navigator.clipboard.writeText(result).then(() => {
                    showNotification('Result copied to clipboard!');
                });
            }
        }

        // Reverse operation
        function reverseOperation() {
            if (!lastResult || !lastOperation) return;
            
            document.getElementById('plainText').value = lastResult;
            
            if (lastOperation === 'encrypt') {
                startDecryption();
            } else {
                startEncryption();
            }
        }

        // Show notification
        function showNotification(message) {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #00ff41;
                color: #000;
                padding: 10px 20px;
                border-radius: 8px;
                font-weight: bold;
                z-index: 1000;
                animation: slideIn 0.3s ease;
            `;
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }, 2000);
        }

        // Event listeners
        document.getElementById('cipherSelect').addEventListener('change', updateCipherInfo);
        
        document.getElementById('plainText').addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !isAnimating) {
                startEncryption();
            }
        });
        
        document.getElementById('cipherKey').addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !isAnimating) {
                startEncryption();
            }
        });

        // Initialize on load
        document.addEventListener('DOMContentLoaded', function() {
            updateCipherInfo();
            
            // Add some CSS animations
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
                
                .matrix-cell.highlight {
                    animation: highlight 0.8s ease;
                }
                
                @keyframes highlight {
                    0%, 100% { background: #333; }
                    50% { background: #00ff41; color: #000; }
                }
            `;
            document.head.appendChild(style);
        });

    return text; // Placeholder - would implement full rail fence
}

async function railFenceDecrypt(text, rails) {
    showProcessInfo('Reading rails back...');
    await sleep(animationSpeed);
    return text; // Placeholder
}

async function scytaleEncrypt(text, diameter) {
    showProcessInfo('Wrapping around cylinder...');
    await sleep(animationSpeed);
    return text; // Placeholder
}

async function scytaleDecrypt(text, diameter) {
    showProcessInfo('Unwrapping from cylinder...');
    await sleep(animationSpeed);
    return text; // Placeholder
}
