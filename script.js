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
    await sleep(animationSpeed);
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
