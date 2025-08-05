// JavaScript for the Challenges Pages

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the challenges functionality
    initChallengeTabs();
    initCodeEditors();
});

// Initialize the challenge tabs functionality
function initChallengeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the target tab
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to current button and pane
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// Initialize the code editors
function initCodeEditors() {
    const editors = document.querySelectorAll('.code-editor');
    
    editors.forEach(editor => {
        const codeInput = editor.querySelector('.code-input');
        const runButton = editor.querySelector('.run-code');
        const resetButton = editor.querySelector('.reset-code');
        const outputDisplay = editor.querySelector('.output-display');
        const clearOutputButton = editor.querySelector('.clear-output');
        const testOutput = editor.querySelector('.test-output');
        
        // Store the original code for reset functionality
        const originalCode = codeInput.value;
        
        // Run code button
        if (runButton) {
            runButton.addEventListener('click', function() {
                runCode(codeInput.value, outputDisplay, testOutput);
            });
        }
        
        // Reset code button
        if (resetButton) {
            resetButton.addEventListener('click', function() {
                codeInput.value = originalCode;
                if (outputDisplay) outputDisplay.innerHTML = '';
                if (testOutput) testOutput.innerHTML = '';
            });
        }
        
        // Clear output button
        if (clearOutputButton) {
            clearOutputButton.addEventListener('click', function() {
                if (outputDisplay) outputDisplay.innerHTML = '';
            });
        }
        
        // Enable tab key in textarea
        if (codeInput) {
            codeInput.addEventListener('keydown', function(e) {
                if (e.key === 'Tab') {
                    e.preventDefault();
                    
                    // Insert a tab at the cursor position
                    const start = this.selectionStart;
                    const end = this.selectionEnd;
                    
                    this.value = this.value.substring(0, start) + '  ' + this.value.substring(end);
                    
                    // Move the cursor after the inserted tab
                    this.selectionStart = this.selectionEnd = start + 2;
                }
            });
        }
    });
}

// Function to run the code and display output
function runCode(code, outputDisplay, testOutput) {
    // Clear previous output
    outputDisplay.innerHTML = '';
    outputDisplay.classList.remove('error');
    
    if (testOutput) {
        testOutput.innerHTML = '';
    }
    
    try {
        // Create a sandbox for safer evaluation
        const sandbox = {
            console: {
                log: function(message) {
                    // Convert objects and arrays to strings for display
                    if (typeof message === 'object' && message !== null) {
                        if (Array.isArray(message)) {
                            return JSON.stringify(message);
                        } else {
                            return JSON.stringify(message);
                        }
                    }
                    return String(message);
                }
            },
            result: ''
        };
        
        // Replace console.log with our custom function
        const modifiedCode = code.replace(
            /console\.log\(([^)]*)\)/g, 
            'result += console.log($1) + "\\n"'
        );
        
        // Execute the code in the context of the sandbox
        Function('sandbox', `with(sandbox){${modifiedCode}}`)(sandbox);
        
        // Display the result
        outputDisplay.innerHTML = sandbox.result || 'Code executed successfully!';
        
        // Run tests based on the current puzzle
        runTests(code, testOutput);
        
    } catch (error) {
        // Display any errors
        outputDisplay.innerHTML = `Error: ${error.message}`;
        outputDisplay.classList.add('error');
    }
}

// Function to run tests for the current puzzle
function runTests(code, testOutput) {
    if (!testOutput) return;
    
    // Determine which puzzle we're testing based on the active tab
    const activeTab = document.querySelector('.tab-pane.active');
    if (!activeTab) return;
    
    const puzzleId = activeTab.id;
    
    switch (puzzleId) {
        case 'puzzle-1':
            testEvenOdd(code, testOutput);
            break;
        case 'puzzle-2':
            testFizzBuzz(code, testOutput);
            break;
        case 'puzzle-3':
            testPalindrome(code, testOutput);
            break;
    }
}

// Test function for the Even or Odd puzzle
function testEvenOdd(code, testOutput) {
    try {
        // Create a function from the code
        const func = new Function(code + '\nreturn isEven;')();
        
        // Test cases
        const testCases = [
            { input: 2, expected: true },
            { input: 4, expected: true },
            { input: 7, expected: false },
            { input: 0, expected: true },
            { input: -1, expected: false },
            { input: -4, expected: true }
        ];
        
        let allPassed = true;
        let results = '';
        
        testCases.forEach((test, index) => {
            try {
                const result = func(test.input);
                const passed = result === test.expected;
                
                if (!passed) allPassed = false;
                
                results += `<div class="test-case ${passed ? 'test-pass' : 'test-fail'}">
                    Test ${index + 1}: isEven(${test.input}) ${passed ? 'PASSED ✓' : 'FAILED ✗'}
                    ${!passed ? `<br>Expected: ${test.expected}, Got: ${result}` : ''}
                </div>`;
            } catch (e) {
                allPassed = false;
                results += `<div class="test-case test-fail">
                    Test ${index + 1}: Error - ${e.message}
                </div>`;
            }
        });
        
        // Add summary
        if (allPassed) {
            results = `<div class="test-summary test-pass">All tests passed! Great job! 🎉</div>` + results;
            // Show congratulations message
            setTimeout(() => showCongratulations('puzzle-1'), 500);
        } else {
            results = `<div class="test-summary test-fail">Some tests failed. Keep trying!</div>` + results;
        }
        
        testOutput.innerHTML = results;
        
    } catch (error) {
        testOutput.innerHTML = `<div class="test-case test-fail">Error running tests: ${error.message}</div>`;
    }
}

// Test function for the FizzBuzz puzzle
function testFizzBuzz(code, testOutput) {
    try {
        // We need to capture the output of fizzBuzz function
        // Create a modified version of the code that returns the output
        let modifiedCode = code.replace(
            /function\s+fizzBuzz\s*\([^)]*\)\s*\{([^}]*)\}/s,
            function(match, body) {
                return `function fizzBuzz(n) {
                    let output = [];
                    const originalConsoleLog = console.log;
                    console.log = function(message) {
                        output.push(message);
                    };
                    ${body}
                    console.log = originalConsoleLog;
                    return output;
                }`;
            }
        );
        
        // Create a function from the modified code
        const func = new Function(modifiedCode + '\nreturn fizzBuzz;')();
        
        // Test cases
        const testCases = [
            { 
                input: 15, 
                expected: [
                    1, 2, 'Fizz', 4, 'Buzz', 'Fizz', 7, 8, 'Fizz', 'Buzz', 11, 'Fizz', 13, 14, 'FizzBuzz'
                ]
            }
        ];
        
        let allPassed = true;
        let results = '';
        
        testCases.forEach((test, index) => {
            try {
                const result = func(test.input);
                
                // Convert result items to strings for comparison
                const resultStrings = result.map(item => String(item));
                const expectedStrings = test.expected.map(item => String(item));
                
                // Check if arrays have the same length and content
                const lengthMatch = resultStrings.length === expectedStrings.length;
                const contentMatch = lengthMatch && resultStrings.every((item, i) => item === expectedStrings[i]);
                
                const passed = lengthMatch && contentMatch;
                
                if (!passed) allPassed = false;
                
                results += `<div class="test-case ${passed ? 'test-pass' : 'test-fail'}">
                    Test ${index + 1}: fizzBuzz(${test.input}) ${passed ? 'PASSED ✓' : 'FAILED ✗'}
                    ${!passed ? `<br>Expected: [${expectedStrings.join(', ')}]<br>Got: [${resultStrings.join(', ')}]` : ''}
                </div>`;
            } catch (e) {
                allPassed = false;
                results += `<div class="test-case test-fail">
                    Test ${index + 1}: Error - ${e.message}
                </div>`;
            }
        });
        
        // Add summary
        if (allPassed) {
            results = `<div class="test-summary test-pass">All tests passed! Great job! 🎉</div>` + results;
            // Show congratulations message
            setTimeout(() => showCongratulations('puzzle-2'), 500);
        } else {
            results = `<div class="test-summary test-fail">Some tests failed. Keep trying!</div>` + results;
        }
        
        testOutput.innerHTML = results;
        
    } catch (error) {
        testOutput.innerHTML = `<div class="test-case test-fail">Error running tests: ${error.message}</div>`;
    }
}

// Test function for the Palindrome puzzle
function testPalindrome(code, testOutput) {
    try {
        // Create a function from the code
        const func = new Function(code + '\nreturn isPalindrome;')();
        
        // Test cases
        const testCases = [
            { input: 'racecar', expected: true },
            { input: 'hello', expected: false },
            { input: 'A man, a plan, a canal, Panama', expected: true },
            { input: 'Was it a car or a cat I saw?', expected: true },
            { input: 'No lemon, no melon', expected: true },
            { input: 'coding is fun', expected: false }
        ];
        
        let allPassed = true;
        let results = '';
        
        testCases.forEach((test, index) => {
            try {
                const result = func(test.input);
                const passed = result === test.expected;
                
                if (!passed) allPassed = false;
                
                results += `<div class="test-case ${passed ? 'test-pass' : 'test-fail'}">
                    Test ${index + 1}: isPalindrome("${test.input}") ${passed ? 'PASSED ✓' : 'FAILED ✗'}
                    ${!passed ? `<br>Expected: ${test.expected}, Got: ${result}` : ''}
                </div>`;
            } catch (e) {
                allPassed = false;
                results += `<div class="test-case test-fail">
                    Test ${index + 1}: Error - ${e.message}
                </div>`;
            }
        });
        
        // Add summary
        if (allPassed) {
            results = `<div class="test-summary test-pass">All tests passed! Great job! 🎉</div>` + results;
            // Show congratulations message
            setTimeout(() => showCongratulations('puzzle-3'), 500);
        } else {
            results = `<div class="test-summary test-fail">Some tests failed. Keep trying!</div>` + results;
        }
        
        testOutput.innerHTML = results;
        
    } catch (error) {
        testOutput.innerHTML = `<div class="test-case test-fail">Error running tests: ${error.message}</div>`;
    }
}

// Function to show a congratulations message
function showCongratulations(puzzleId) {
    // Points for each puzzle
    const points = {
        'puzzle-1': 100,
        'puzzle-2': 150,
        'puzzle-3': 200
    };
    
    const congratsModal = document.createElement('div');
    congratsModal.className = 'congrats-modal';
    
    congratsModal.innerHTML = `
        <div class="congrats-content">
            <h2>Congratulations! 🎉</h2>
            <p>You've successfully completed the challenge!</p>
            <p>You earned <span class="points">${points[puzzleId]}</span> points!</p>
            <button class="btn btn-primary close-modal">Continue</button>
        </div>
    `;
    
    document.body.appendChild(congratsModal);
    
    // Add animation class after a small delay to trigger the animation
    setTimeout(() => {
        congratsModal.classList.add('show');
    }, 10);
    
    // Add event listener to close button
    const closeButton = congratsModal.querySelector('.close-modal');
    closeButton.addEventListener('click', function() {
        congratsModal.classList.remove('show');
        
        // Remove the modal after the animation completes
        setTimeout(() => {
            document.body.removeChild(congratsModal);
        }, 300);
        
        // Track progress
        trackProgress(puzzleId, true);
    });
    
    // Also track progress when the modal is shown
    trackProgress(puzzleId, true);
}

// Function to track user progress
function trackProgress(puzzleId, completed) {
    // In a real application, this would send data to a server
    // For now, we'll just store it in localStorage
    
    let userProgress = JSON.parse(localStorage.getItem('userProgress')) || {};
    
    if (!userProgress.challenges) {
        userProgress.challenges = {};
    }
    
    userProgress.challenges[puzzleId] = {
        completed: completed,
        completedAt: new Date().toISOString()
    };
    
    localStorage.setItem('userProgress', JSON.stringify(userProgress));
}