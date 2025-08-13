// Global variables
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
        description: "Spaces are removed, then text is written in a zigzag pattern across multiple 'rails' and read off in rows.",
        keyFormat: "Number of rails (2-10)",
        example: "3 rails: HELLO WORLD → HLOOL / ELWR / LOD",
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

// Utility function for delays
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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
        
        currentStep++;
        document.getElementById('stepCount').textContent = currentStep;
        
        inputBoxes[i].classList.add('processing');
        
        const char = chars[i];
        let newChar = char;
        
        if (char.match(/[A-Z]/)) {
            const charCode = char.charCodeAt(0) - 65;
            const shiftedCode = (charCode + actualShift) % 26;
            newChar = String.fromCharCode(shiftedCode + 65);
        }
        
        await sleep(animationSpeed / 2);
        
        inputBoxes[i].classList.remove('processing');
        inputBoxes[i].classList.add(isEncrypt ? 'encrypted' : 'decrypted');
        
        outputBoxes[i].textContent = newChar;
        outputBoxes[i].classList.add(isEncrypt ? 'encrypted' : 'decrypted');
        
        result += newChar;
    }
    
    return result;
}

// Atbash Cipher Animation
async function animateAtbash(text) {
    const container = document.getElementById('animationContainer');
    container.innerHTML = `
        <div class="process-info">
            <strong>Atbash Cipher:</strong> Replacing each letter with its mirror position in the alphabet (A↔Z, B↔Y, etc.).
        </div>
    `;
    
    // Create character boxes
    const inputRow = document.createElement('div');
    inputRow.className = 'character-row';
    
    const outputRow = document.createElement('div');
    outputRow.className = 'character-row';
    
    const chars = text.split('');
    const inputBoxes = [];
    const outputBoxes = [];
    
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
        
        currentStep++;
        document.getElementById('stepCount').textContent = currentStep;
        
        inputBoxes[i].classList.add('processing');
        
        const char = chars[i];
        let newChar = char;
        
        if (char.match(/[A-Z]/)) {
            const charCode = char.charCodeAt(0) - 65;
            const mirrorCode = 25 - charCode;
            newChar = String.fromCharCode(mirrorCode + 65);
        }
        
        await sleep(animationSpeed / 2);
        
        inputBoxes[i].classList.remove('processing');
        inputBoxes[i].classList.add('encrypted');
        
        outputBoxes[i].textContent = newChar;
        outputBoxes[i].classList.add('encrypted');
        
        result += newChar;
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

// Vigenère Cipher Animation (simplified version)
async function animateVigenere(text, key, isEncrypt) {
    const container = document.getElementById('animationContainer');
    container.innerHTML = `
        <div class="process-info">
            <strong>Vigenère Cipher:</strong> Using keyword "${key}" to shift each letter by different amounts.
        </div>
        <div class="key-display">Keyword: ${key}</div>
    `;
    
    const inputRow = document.createElement('div');
    inputRow.className = 'character-row';
    
    const keyRow = document.createElement('div');
    keyRow.className = 'character-row';
    
    const outputRow = document.createElement('div');
    outputRow.className = 'character-row';
    
    const chars = text.split('');
    const inputBoxes = [];
    const keyBoxes = [];
    const outputBoxes = [];
    
    // Create boxes
    chars.forEach((char, i) => {
        const textBox = document.createElement('div');
        textBox.className = 'char-box';
        textBox.textContent = char;
        inputBoxes.push(textBox);
        inputRow.appendChild(textBox);
        
        const keyBox = document.createElement('div');
        keyBox.className = 'char-box';
        keyBox.style.background = 'linear-gradient(45deg, #ff8800, #ff6600)';
        keyBox.textContent = key[i % key.length];
        keyBoxes.push(keyBox);
        keyRow.appendChild(keyBox);
        
        const outputBox = document.createElement('div');
        outputBox.className = 'char-box';
        outputBox.textContent = '?';
        outputBoxes.push(outputBox);
        outputRow.appendChild(outputBox);
    });
    
    container.appendChild(inputRow);
    container.appendChild(keyRow);
    
    const arrow = document.createElement('div');
    arrow.className = 'arrow';
    arrow.textContent = '↓';
    container.appendChild(arrow);
    
    container.appendChild(outputRow);
    
    let result = '';
    
    // Animate each character
    for (let i = 0; i < chars.length; i++) {
        await sleep(animationSpeed);
        
        currentStep++;
        document.getElementById('stepCount').textContent = currentStep;
        
        inputBoxes[i].classList.add('processing');
        keyBoxes[i].classList.add('processing');
        
        const char = chars[i];
        let newChar = char;
        
        if (char.match(/[A-Z]/)) {
            const charCode = char.charCodeAt(0) - 65;
            const keyChar = key[i % key.length];
            const keyShift = keyChar.charCodeAt(0) - 65;
            
            const newCharCode = isEncrypt ? 
                (charCode + keyShift) % 26 : 
                (charCode - keyShift + 26) % 26;
            newChar = String.fromCharCode(newCharCode + 65);
        }
        
        await sleep(animationSpeed / 2);
        
        outputBoxes[i].textContent = newChar;
        outputBoxes[i].classList.add(isEncrypt ? 'encrypted' : 'decrypted');
        result += newChar;
        
        inputBoxes[i].classList.remove('processing');
        keyBoxes[i].classList.remove('processing');
    }
    
    return result;
}

// Simple implementations for other ciphers
async function animateXOR(text, key) {
    const container = document.getElementById('animationContainer');
    container.innerHTML = `
        <div class="process-info">
            <strong>XOR Cipher:</strong> XORing each character with repeating key "${key}".
        </div>
    `;
    
    let result = '';
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const keyChar = key[i % key.length];
        const newChar = String.fromCharCode(char.charCodeAt(0) ^ keyChar.charCodeAt(0));
        result += newChar;
    }
    
    await sleep(animationSpeed * 2);
    return result;
}

async function animateBase64(text, isEncrypt) {
    const container = document.getElementById('animationContainer');
    container.innerHTML = `
        <div class="process-info">
            <strong>Base64 ${isEncrypt ? 'Encoding' : 'Decoding'}:</strong> Converting text to/from Base64 format.
        </div>
    `;
    
    await sleep(animationSpeed * 2);
    
    if (isEncrypt) {
        return btoa(text);
    } else {
        try {
            return atob(text);
        } catch (e) {
            throw new Error("Invalid Base64 input");
        }
    }
}

async function animateMorse(text, isEncrypt) {
    const morseCode = {
        'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
        'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
        'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
        'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
        'Y': '-.--', 'Z': '--..', ' ': '/'
    };
    
    const container = document.getElementById('animationContainer');
    container.innerHTML = `
        <div class="process-info">
            <strong>Morse Code:</strong> Converting between text and dots/dashes.
        </div>
    `;
    
    await sleep(animationSpeed * 2);
    
    if (isEncrypt) {
        return text.split('').map(char => morseCode[char] || char).join(' ');
    } else {
        const reverseMorse = Object.fromEntries(Object.entries(morseCode).map(([k, v]) => [v, k]));
        return text.split(' ').map(code => reverseMorse[code] || code).join('');
    }
}

// Placeholder implementations for other ciphers
async function animateColumnar(text, key, isEncrypt) {
    const container = document.getElementById('animationContainer');
    container.innerHTML = `
        <div class="process-info">
            <strong>Columnar Transposition:</strong> Feature coming soon...
        </div>
    `;
    await sleep(animationSpeed * 2);
    return text; // Placeholder
}

async function animatePlayfair(text, key, isEncrypt) {
    const container = document.getElementById('animationContainer');
    container.innerHTML = `
        <div class="process-info">
            <strong>Playfair Cipher:</strong> Feature coming soon...
        </div>
    `;
    await sleep(animationSpeed * 2);
    return text; // Placeholder
}

async function animateSubstitution(text, key, isEncrypt) {
    const container = document.getElementById('animationContainer');
    container.innerHTML = `
        <div class="process-info">
            <strong>Simple Substitution:</strong> Feature coming soon...
        </div>
    `;
    await sleep(animationSpeed * 2);
    return text; // Placeholder
}

async function animateAffine(text, key, isEncrypt) {
    const container = document.getElementById('animationContainer');
    container.innerHTML = `
        <div class="process-info">
            <strong>Affine Cipher:</strong> Feature coming soon...
        </div>
    `;
    await sleep(animationSpeed * 2);
    return text; // Placeholder
}

async function animateBeaufort(text, key, isEncrypt) {
    const container = document.getElementById('animationContainer');
    container.innerHTML = `
        <div class="process-info">
            <strong>Beaufort Cipher:</strong> Feature coming soon...
        </div>
    `;
    await sleep(animationSpeed * 2);
    return text; // Placeholder
}

async function animateScytale(text, circumference, isEncrypt) {
    const container = document.getElementById('animationContainer');
    container.innerHTML = `
        <div class="process-info">
            <strong>Scytale Cipher:</strong> Feature coming soon...
        </div>
    `;
    await sleep(animationSpeed * 2);
    return text; // Placeholder
}

// Copy result to clipboard
function copyResult() {
    const resultText = document.getElementById('resultText').textContent;
    if (resultText && resultText !== 'Result will appear here...') {
        navigator.clipboard.writeText(resultText).then(() => {
            alert('Result copied to clipboard!');
        }).catch(() => {
            alert('Failed to copy to clipboard');
        });
    }
}

// Reverse the last operation
function reverseOperation() {
    if (lastOperation && lastResult) {
        document.getElementById('plainText').value = lastResult;
        if (lastOperation === 'encrypt') {
            startDecryption();
        } else {
            startEncryption();
        }
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
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