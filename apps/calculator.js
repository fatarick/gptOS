kernel.registerApp('calculator', 'Calculator', function () {
    return createCalculatorWindow();
});

function evaluateExpression(expr) {
    if (!/^[0-9+\-*/.]+$/.test(expr)) {
        throw new Error('Invalid characters');
    }

    const ops = [];
    const values = [];
    const precedence = { '+': 1, '-': 1, '*': 2, '/': 2 };

    const applyOp = () => {
        const b = values.pop();
        const a = values.pop();
        const op = ops.pop();
        let result;
        switch (op) {
            case '+':
                result = a + b;
                break;
            case '-':
                result = a - b;
                break;
            case '*':
                result = a * b;
                break;
            case '/':
                result = a / b;
                break;
            default:
                throw new Error('Unknown operator');
        }
        values.push(result);
    };

    let num = '';
    for (let i = 0; i < expr.length; i++) {
        const ch = expr[i];
        if (/\d|\./.test(ch)) {
            num += ch;
        } else if (precedence[ch]) {
            if (num === '' && ch === '-' && (i === 0 || precedence[expr[i - 1]])) {
                num = '-';
                continue;
            }
            if (num === '' || num === '-') {
                throw new Error('Invalid expression');
            }
            values.push(parseFloat(num));
            num = '';
            while (ops.length && precedence[ops[ops.length - 1]] >= precedence[ch]) {
                applyOp();
            }
            ops.push(ch);
        } else {
            throw new Error('Invalid character');
        }
    }

    if (num === '' || num === '-') {
        throw new Error('Invalid expression');
    }
    values.push(parseFloat(num));
    while (ops.length) {
        applyOp();
    }
    if (values.length !== 1 || isNaN(values[0])) {
        throw new Error('Invalid expression');
    }
    return values[0];
}

function createCalculatorWindow() {
    const w = createWindow("Calculator");

    w.element.style.resize = 'none'; // Disable resizing
    w.element.style.overflow = 'hidden'; // Prevent showing resize handles
    w.element.style.width = '500px';
    w.element.style.height = '420px';

    // Main Calculator Container
    const calculatorContainer = document.createElement('div');
    calculatorContainer.style.display = 'grid';
    calculatorContainer.style.gridTemplateColumns = 'repeat(4, 1fr)';
    calculatorContainer.style.gridGap = '5px';
    calculatorContainer.style.padding = '10px';
    calculatorContainer.style.boxSizing = 'border-box';

    // Display Area
    const display = document.createElement('input');
    display.type = 'text';
    display.readOnly = true;
    display.style.gridColumn = 'span 4';
    display.style.padding = '10px';
    display.style.textAlign = 'right';
    display.style.fontSize = '20px';
    display.style.marginBottom = '10px';
    display.style.width = '450px';
    display.value = '';

    // Append the display to the calculator
    w.content.appendChild(display);

    // Buttons Configuration
    const buttons = [
        '7', '8', '9', '/',
        '4', '5', '6', '*',
        '1', '2', '3', '-',
        '0', '.', '=', '+',
        'C'
    ];

    // Add Buttons
    buttons.forEach((btnText) => {
        const button = document.createElement('button');
        button.textContent = btnText;
        button.style.padding = '15px';
        button.style.fontSize = '18px';
        button.style.cursor = 'pointer';
        button.style.borderRadius = '5px';

        // Button Click Event
        button.onclick = () => {
            if (btnText === 'C') {
                // Clear the display
                display.value = '';
            } else if (btnText === '=') {
                // Evaluate the expression
                try {
                    display.value = evaluateExpression(display.value).toString();
                } catch {
                    display.value = 'Error';
                }
            } else if (/^[0-9+\-*/.]$/.test(btnText)) {
                // Append the button text to the display if valid
                display.value += btnText;
            }
        };

        // Append the button to the calculator container
        calculatorContainer.appendChild(button);
    });

    // Append the calculator container to the window
    w.content.appendChild(calculatorContainer);

    const id = 'calculator:' + Math.random().toString(36).substr(2, 5);
    return { id, element: w.element };
}
