kernel.registerApp('calculator', 'Calculator', function () {
    return createCalculatorWindow();
}, 'assets/icons/calculator.svg');

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
                    display.value = eval(display.value) || '';
                } catch {
                    display.value = 'Error';
                }
            } else {
                // Append the button text to the display
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