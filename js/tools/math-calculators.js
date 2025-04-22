document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('calculator-form');
    const calculatorRadios = document.querySelectorAll('input[name="calculator"]');
    const results = document.getElementById('results');
    const calculatorSections = document.querySelectorAll('.calculator-section');

    // Tool selection handler
    calculatorRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            calculatorSections.forEach(section => {
                section.classList.add('d-none');
            });
            document.getElementById(`${radio.value}-calc`).classList.remove('d-none');
        });
    });

    // Form submission handler
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const selectedCalculator = document.querySelector('input[name="calculator"]:checked').value;

        try {
            switch (selectedCalculator) {
                case 'percentage':
                    calculatePercentage();
                    break;
                case 'age':
                    calculateAge();
                    break;
                case 'bmi':
                    calculateBMI();
                    break;
                case 'loan':
                    calculateLoanEMI();
                    break;
                case 'scientific':
                    // Scientific calculator is handled by button clicks
                    break;
                case 'discount':
                    calculateDiscount();
                    break;
                case 'currency':
                    convertCurrency();
                    break;
                case 'timezone':
                    convertTimezone();
                    break;
                case 'binary':
                    convertBinaryToDecimal();
                    break;
                case 'tip':
                    calculateTip();
                    break;
            }
        } catch (error) {
            results.innerHTML = `
                <div class="alert alert-danger">
                    <strong>Error:</strong> ${error.message}
                </div>
            `;
        }
    });

    // Scientific Calculator handlers
    const scientificDisplay = document.getElementById('scientific-display');
    const scientificButtons = document.querySelectorAll('#scientific-calc button');
    let currentValue = '0';
    let previousValue = '0';
    let operation = null;
    let shouldResetDisplay = false;

    scientificButtons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.dataset.action;

            switch (action) {
                case 'clear':
                    currentValue = '0';
                    previousValue = '0';
                    operation = null;
                    break;
                case 'backspace':
                    currentValue = currentValue.slice(0, -1) || '0';
                    break;
                case 'percent':
                    currentValue = (parseFloat(currentValue) / 100).toString();
                    break;
                case 'divide':
                case 'multiply':
                case 'subtract':
                case 'add':
                    if (operation) {
                        currentValue = calculate(previousValue, currentValue, operation);
                    }
                    previousValue = currentValue;
                    operation = action;
                    shouldResetDisplay = true;
                    break;
                case 'equals':
                    if (operation) {
                        currentValue = calculate(previousValue, currentValue, operation);
                        operation = null;
                    }
                    break;
                case 'decimal':
                    if (!currentValue.includes('.')) {
                        currentValue += '.';
                    }
                    break;
                default:
                    if (shouldResetDisplay) {
                        currentValue = '0';
                        shouldResetDisplay = false;
                    }
                    if (currentValue === '0') {
                        currentValue = action;
                    } else {
                        currentValue += action;
                    }
            }

            scientificDisplay.value = currentValue;
        });
    });

    function calculate(a, b, operation) {
        const numA = parseFloat(a);
        const numB = parseFloat(b);

        switch (operation) {
            case 'add':
                return (numA + numB).toString();
            case 'subtract':
                return (numA - numB).toString();
            case 'multiply':
                return (numA * numB).toString();
            case 'divide':
                if (numB === 0) {
                    throw new Error('Division by zero');
                }
                return (numA / numB).toString();
        }
    }

    function calculatePercentage() {
        const value = parseFloat(document.getElementById('percentage-value').value);
        const percent = parseFloat(document.getElementById('percentage-percent').value);

        if (isNaN(value) || isNaN(percent)) {
            throw new Error('Please enter valid numbers');
        }

        const result = (value * percent) / 100;
        const total = value + result;

        results.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <h6>Calculation</h6>
                    <ul class="list-unstyled">
                        <li><strong>Value:</strong> ${value}</li>
                        <li><strong>Percentage:</strong> ${percent}%</li>
                        <li><strong>Result:</strong> ${result}</li>
                    </ul>
                </div>
                <div class="col-md-6">
                    <h6>Total</h6>
                    <p class="h4">${total}</p>
                </div>
            </div>
        `;
    }

    function calculateAge() {
        const birthDate = new Date(document.getElementById('birth-date').value);
        const today = new Date();

        if (isNaN(birthDate.getTime())) {
            throw new Error('Please enter a valid birth date');
        }

        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
        if (nextBirthday < today) {
            nextBirthday.setFullYear(today.getFullYear() + 1);
        }
        const daysUntilBirthday = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));

        results.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <h6>Age Information</h6>
                    <ul class="list-unstyled">
                        <li><strong>Age:</strong> ${age} years</li>
                        <li><strong>Birth Date:</strong> ${birthDate.toLocaleDateString()}</li>
                        <li><strong>Days until next birthday:</strong> ${daysUntilBirthday}</li>
                    </ul>
                </div>
            </div>
        `;
    }

    function calculateBMI() {
        const weight = parseFloat(document.getElementById('weight').value);
        const height = parseFloat(document.getElementById('height').value) / 100; // Convert cm to m

        if (isNaN(weight) || isNaN(height)) {
            throw new Error('Please enter valid weight and height');
        }

        const bmi = weight / (height * height);
        let category = '';

        if (bmi < 18.5) {
            category = 'Underweight';
        } else if (bmi < 25) {
            category = 'Normal weight';
        } else if (bmi < 30) {
            category = 'Overweight';
        } else {
            category = 'Obese';
        }

        results.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <h6>BMI Information</h6>
                    <ul class="list-unstyled">
                        <li><strong>Weight:</strong> ${weight} kg</li>
                        <li><strong>Height:</strong> ${height * 100} cm</li>
                        <li><strong>BMI:</strong> ${bmi.toFixed(2)}</li>
                        <li><strong>Category:</strong> ${category}</li>
                    </ul>
                </div>
            </div>
        `;
    }

    function calculateLoanEMI() {
        const principal = parseFloat(document.getElementById('loan-amount').value);
        const rate = parseFloat(document.getElementById('interest-rate').value) / 100 / 12; // Monthly interest rate
        const time = parseFloat(document.getElementById('loan-term').value) * 12; // Convert years to months

        if (isNaN(principal) || isNaN(rate) || isNaN(time)) {
            throw new Error('Please enter valid loan details');
        }

        const emi = principal * rate * Math.pow(1 + rate, time) / (Math.pow(1 + rate, time) - 1);
        const totalPayment = emi * time;
        const totalInterest = totalPayment - principal;

        results.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <h6>Loan Details</h6>
                    <ul class="list-unstyled">
                        <li><strong>Loan Amount:</strong> $${principal.toFixed(2)}</li>
                        <li><strong>Interest Rate:</strong> ${(rate * 12 * 100).toFixed(2)}%</li>
                        <li><strong>Loan Term:</strong> ${time / 12} years</li>
                    </ul>
                </div>
                <div class="col-md-6">
                    <h6>Payment Information</h6>
                    <ul class="list-unstyled">
                        <li><strong>Monthly EMI:</strong> $${emi.toFixed(2)}</li>
                        <li><strong>Total Payment:</strong> $${totalPayment.toFixed(2)}</li>
                        <li><strong>Total Interest:</strong> $${totalInterest.toFixed(2)}</li>
                    </ul>
                </div>
            </div>
        `;
    }

    function calculateDiscount() {
        const originalPrice = parseFloat(document.getElementById('original-price').value);
        const discountPercent = parseFloat(document.getElementById('discount-percent').value);

        if (isNaN(originalPrice) || isNaN(discountPercent)) {
            throw new Error('Please enter valid numbers');
        }

        const discountAmount = (originalPrice * discountPercent) / 100;
        const finalPrice = originalPrice - discountAmount;

        results.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <h6>Discount Details</h6>
                    <ul class="list-unstyled">
                        <li><strong>Original Price:</strong> $${originalPrice.toFixed(2)}</li>
                        <li><strong>Discount Percentage:</strong> ${discountPercent}%</li>
                        <li><strong>Discount Amount:</strong> $${discountAmount.toFixed(2)}</li>
                    </ul>
                </div>
                <div class="col-md-6">
                    <h6>Final Price</h6>
                    <p class="h4">$${finalPrice.toFixed(2)}</p>
                </div>
            </div>
        `;
    }

    async function convertCurrency() {
        const amount = parseFloat(document.getElementById('amount').value);
        const fromCurrency = document.getElementById('from-currency').value;
        const toCurrency = document.getElementById('to-currency').value;

        if (isNaN(amount)) {
            throw new Error('Please enter a valid amount');
        }

        try {
            const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
            const data = await response.json();
            const rate = data.rates[toCurrency];
            const convertedAmount = amount * rate;

            results.innerHTML = `
                <div class="row">
                    <div class="col-md-6">
                        <h6>Conversion Details</h6>
                        <ul class="list-unstyled">
                            <li><strong>Amount:</strong> ${amount} ${fromCurrency}</li>
                            <li><strong>Exchange Rate:</strong> 1 ${fromCurrency} = ${rate} ${toCurrency}</li>
                        </ul>
                    </div>
                    <div class="col-md-6">
                        <h6>Converted Amount</h6>
                        <p class="h4">${convertedAmount.toFixed(2)} ${toCurrency}</p>
                    </div>
                </div>
            `;
        } catch (error) {
            throw new Error('Failed to fetch exchange rates');
        }
    }

    function convertTimezone() {
        const dateTime = new Date(document.getElementById('date-time').value);
        const fromTimezone = document.getElementById('from-timezone').value;
        const toTimezone = document.getElementById('to-timezone').value;

        if (isNaN(dateTime.getTime())) {
            throw new Error('Please enter a valid date and time');
        }

        const timezoneOffsets = {
            'UTC': 0,
            'EST': -5,
            'PST': -8,
            'GMT': 0,
            'IST': 5.5
        };

        const fromOffset = timezoneOffsets[fromTimezone];
        const toOffset = timezoneOffsets[toTimezone];
        const offsetDiff = toOffset - fromOffset;

        const convertedDate = new Date(dateTime.getTime() + offsetDiff * 60 * 60 * 1000);

        results.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <h6>Original Time</h6>
                    <ul class="list-unstyled">
                        <li><strong>Date & Time:</strong> ${dateTime.toLocaleString()}</li>
                        <li><strong>Timezone:</strong> ${fromTimezone}</li>
                    </ul>
                </div>
                <div class="col-md-6">
                    <h6>Converted Time</h6>
                    <ul class="list-unstyled">
                        <li><strong>Date & Time:</strong> ${convertedDate.toLocaleString()}</li>
                        <li><strong>Timezone:</strong> ${toTimezone}</li>
                    </ul>
                </div>
            </div>
        `;
    }

    function convertBinaryToDecimal() {
        const binary = document.getElementById('binary-input').value;

        if (!/^[01]+$/.test(binary)) {
            throw new Error('Please enter a valid binary number');
        }

        const decimal = parseInt(binary, 2);

        results.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <h6>Conversion</h6>
                    <ul class="list-unstyled">
                        <li><strong>Binary:</strong> ${binary}</li>
                        <li><strong>Decimal:</strong> ${decimal}</li>
                    </ul>
                </div>
            </div>
        `;
    }

    function calculateTip() {
        const billAmount = parseFloat(document.getElementById('bill-amount').value);
        const tipPercent = parseFloat(document.getElementById('tip-percent').value);
        const peopleCount = parseInt(document.getElementById('people-count').value);

        if (isNaN(billAmount) || isNaN(tipPercent) || isNaN(peopleCount)) {
            throw new Error('Please enter valid numbers');
        }

        const tipAmount = (billAmount * tipPercent) / 100;
        const totalAmount = billAmount + tipAmount;
        const perPersonAmount = totalAmount / peopleCount;

        results.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <h6>Bill Details</h6>
                    <ul class="list-unstyled">
                        <li><strong>Bill Amount:</strong> $${billAmount.toFixed(2)}</li>
                        <li><strong>Tip Percentage:</strong> ${tipPercent}%</li>
                        <li><strong>Number of People:</strong> ${peopleCount}</li>
                    </ul>
                </div>
                <div class="col-md-6">
                    <h6>Payment Information</h6>
                    <ul class="list-unstyled">
                        <li><strong>Tip Amount:</strong> $${tipAmount.toFixed(2)}</li>
                        <li><strong>Total Amount:</strong> $${totalAmount.toFixed(2)}</li>
                        <li><strong>Amount per Person:</strong> $${perPersonAmount.toFixed(2)}</li>
                    </ul>
                </div>
            </div>
        `;
    }

    // Form reset handler
    form.addEventListener('reset', () => {
        setTimeout(() => {
            results.innerHTML = '<p class="text-center text-muted">Select a calculator and enter values to see results</p>';
            currentValue = '0';
            previousValue = '0';
            operation = null;
            scientificDisplay.value = '0';
        }, 0);
    });
}); 