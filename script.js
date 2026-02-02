document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const memoryIndicator = document.getElementById('memory-indicator');

    let currentValue = '0';
    let previousValue = null;
    let operator = null;
    let memoryValue = 0;
    let waitingForSecondOperand = false;
    let mrcClickedOnce = false;

    // Update display
    function updateDisplay() {
        display.value = currentValue;
        // Show memory indicator if memory is not 0
        if (memoryValue !== 0) {
            memoryIndicator.style.visibility = 'visible';
        } else {
            memoryIndicator.style.visibility = 'hidden';
        }
    }

    // Handle number clicks
    function handleNumber(numStr) {
        if (waitingForSecondOperand) {
            currentValue = numStr;
            waitingForSecondOperand = false;
        } else {
            if (currentValue === '0') {
                currentValue = numStr;
            } else {
                currentValue += numStr;
            }
        }
        // Handle max length to fit screen if needed, but for now just update
        updateDisplay();
        mrcClickedOnce = false;
    }

    // Handle decimal
    function handleDecimal() {
        if (waitingForSecondOperand) {
            currentValue = '0.';
            waitingForSecondOperand = false;
        } else if (!currentValue.includes('.')) {
            currentValue += '.';
        }
        updateDisplay();
        mrcClickedOnce = false;
    }

    // Handle operators
    function handleOperator(nextOperator) {
        const inputValue = parseFloat(currentValue);

        if (operator && waitingForSecondOperand) {
            operator = nextOperator;
            return;
        }

        if (previousValue === null) {
            previousValue = inputValue;
        } else if (operator) {
            const result = calculate(previousValue, inputValue, operator);
            currentValue = String(result);
            previousValue = result;
            updateDisplay();
        }

        waitingForSecondOperand = true;
        operator = nextOperator;
        mrcClickedOnce = false;
    }

    // Calculate
    function calculate(first, second, op) {
        if (op === 'add') return first + second;
        if (op === 'subtract') return first - second;
        if (op === 'multiply') return first * second;
        if (op === 'divide') {
            if (second === 0) return 'Error'; // Or Infinity
            return first / second;
        }
        return second;
    }

    // Handle Equals
    function handleEquals() {
        if (operator === null) return;

        const inputValue = parseFloat(currentValue);
        const result = calculate(previousValue, inputValue, operator);
        currentValue = String(result);
        previousValue = null;
        operator = null;
        waitingForSecondOperand = true; // So next number starts new
        updateDisplay();
        mrcClickedOnce = false;
    }

    // Handle Special Functions
    function handleSpecial(action) {
        if (action === 'ac') {
            currentValue = '0';
            previousValue = null;
            operator = null;
            waitingForSecondOperand = false;
        } else if (action === 'ce') {
            currentValue = '0';
        } else if (action === 'backspace') {
            if (waitingForSecondOperand) return; // Can't backspace result
            currentValue = currentValue.length > 1 ? currentValue.slice(0, -1) : '0';
        } else if (action === 'sqrt') {
            const val = parseFloat(currentValue);
            if (val < 0) {
                currentValue = 'Error';
            } else {
                currentValue = String(Math.sqrt(val));
            }
            waitingForSecondOperand = true;
        } else if (action === 'percent') {
            const val = parseFloat(currentValue);
            currentValue = String(val / 100);
            waitingForSecondOperand = true;
        } else if (action === 'm-plus') {
            memoryValue += parseFloat(currentValue || '0');
            waitingForSecondOperand = true; // Usually after M+ you can type new number
        } else if (action === 'm-minus') {
            memoryValue -= parseFloat(currentValue || '0');
            waitingForSecondOperand = true;
        } else if (action === 'mrc') {
            if (mrcClickedOnce) {
                // Second click: Clear Memory
                memoryValue = 0;
                mrcClickedOnce = false;
            } else {
                // First click: Recall Memory
                currentValue = String(memoryValue);
                waitingForSecondOperand = true;
                mrcClickedOnce = true;
                // Important: Update display now to show recalled value
                updateDisplay();
                return; // Return so we don't reset mrcClickedOnce at end of function
            }
        }

        // Reset mrcClickedOnce for other actions (except MRC handling above)
        if (action !== 'mrc') {
            mrcClickedOnce = false;
        }
        updateDisplay();
    }

    // Event Listener
    document.querySelector('.buttons').addEventListener('click', (event) => {
        const target = event.target;
        if (!target.matches('button')) return;

        if (target.hasAttribute('data-num')) {
            handleNumber(target.getAttribute('data-num'));
        } else if (target.hasAttribute('data-action')) {
            const action = target.getAttribute('data-action');
            if (action === 'add' || action === 'subtract' || action === 'multiply' || action === 'divide') {
                handleOperator(action);
            } else if (action === 'equals') {
                handleEquals();
            } else if (action === 'decimal') {
                handleDecimal();
            } else {
                handleSpecial(action);
            }
        }
    });
});
