document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('converter-form');
    const converterRadios = document.querySelectorAll('input[name="converter"]');
    const results = document.getElementById('results');
    const converterSections = document.querySelectorAll('.converter-section');

    // Tool selection handler
    converterRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            converterSections.forEach(section => {
                section.classList.add('d-none');
            });
            document.getElementById(`${radio.value}-converter`).classList.remove('d-none');
        });
    });

    // Form submission handler
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const selectedConverter = document.querySelector('input[name="converter"]:checked').value;

        try {
            switch (selectedConverter) {
                case 'length':
                    convertLength();
                    break;
                case 'weight':
                    convertWeight();
                    break;
                case 'speed':
                    convertSpeed();
                    break;
                case 'temperature':
                    convertTemperature();
                    break;
                case 'volume':
                    convertVolume();
                    break;
                case 'data':
                    convertData();
                    break;
                case 'energy':
                    convertEnergy();
                    break;
                case 'pressure':
                    convertPressure();
                    break;
                case 'fuel':
                    convertFuel();
                    break;
                case 'angle':
                    convertAngle();
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

    // Length Converter
    function convertLength() {
        const value = parseFloat(document.getElementById('length-value').value);
        const fromUnit = document.getElementById('length-from').value;
        const toUnit = document.getElementById('length-to').value;

        if (isNaN(value)) {
            throw new Error('Please enter a valid number');
        }

        // Convert to meters first
        let meters;
        switch (fromUnit) {
            case 'mm':
                meters = value / 1000;
                break;
            case 'cm':
                meters = value / 100;
                break;
            case 'm':
                meters = value;
                break;
            case 'km':
                meters = value * 1000;
                break;
            case 'in':
                meters = value * 0.0254;
                break;
            case 'ft':
                meters = value * 0.3048;
                break;
            case 'yd':
                meters = value * 0.9144;
                break;
            case 'mi':
                meters = value * 1609.344;
                break;
        }

        // Convert from meters to target unit
        let result;
        switch (toUnit) {
            case 'mm':
                result = meters * 1000;
                break;
            case 'cm':
                result = meters * 100;
                break;
            case 'm':
                result = meters;
                break;
            case 'km':
                result = meters / 1000;
                break;
            case 'in':
                result = meters / 0.0254;
                break;
            case 'ft':
                result = meters / 0.3048;
                break;
            case 'yd':
                result = meters / 0.9144;
                break;
            case 'mi':
                result = meters / 1609.344;
                break;
        }

        showResults(value, fromUnit, result, toUnit);
    }

    // Weight Converter
    function convertWeight() {
        const value = parseFloat(document.getElementById('weight-value').value);
        const fromUnit = document.getElementById('weight-from').value;
        const toUnit = document.getElementById('weight-to').value;

        if (isNaN(value)) {
            throw new Error('Please enter a valid number');
        }

        // Convert to grams first
        let grams;
        switch (fromUnit) {
            case 'mg':
                grams = value / 1000;
                break;
            case 'g':
                grams = value;
                break;
            case 'kg':
                grams = value * 1000;
                break;
            case 't':
                grams = value * 1000000;
                break;
            case 'oz':
                grams = value * 28.3495;
                break;
            case 'lb':
                grams = value * 453.592;
                break;
            case 'st':
                grams = value * 6350.29;
                break;
        }

        // Convert from grams to target unit
        let result;
        switch (toUnit) {
            case 'mg':
                result = grams * 1000;
                break;
            case 'g':
                result = grams;
                break;
            case 'kg':
                result = grams / 1000;
                break;
            case 't':
                result = grams / 1000000;
                break;
            case 'oz':
                result = grams / 28.3495;
                break;
            case 'lb':
                result = grams / 453.592;
                break;
            case 'st':
                result = grams / 6350.29;
                break;
        }

        showResults(value, fromUnit, result, toUnit);
    }

    // Speed Converter
    function convertSpeed() {
        const value = parseFloat(document.getElementById('speed-value').value);
        const fromUnit = document.getElementById('speed-from').value;
        const toUnit = document.getElementById('speed-to').value;

        if (isNaN(value)) {
            throw new Error('Please enter a valid number');
        }

        // Convert to m/s first
        let mps;
        switch (fromUnit) {
            case 'mps':
                mps = value;
                break;
            case 'kph':
                mps = value / 3.6;
                break;
            case 'mph':
                mps = value * 0.44704;
                break;
            case 'knot':
                mps = value * 0.514444;
                break;
        }

        // Convert from m/s to target unit
        let result;
        switch (toUnit) {
            case 'mps':
                result = mps;
                break;
            case 'kph':
                result = mps * 3.6;
                break;
            case 'mph':
                result = mps / 0.44704;
                break;
            case 'knot':
                result = mps / 0.514444;
                break;
        }

        showResults(value, fromUnit, result, toUnit);
    }

    // Temperature Converter
    function convertTemperature() {
        const value = parseFloat(document.getElementById('temperature-value').value);
        const fromUnit = document.getElementById('temperature-from').value;
        const toUnit = document.getElementById('temperature-to').value;

        if (isNaN(value)) {
            throw new Error('Please enter a valid number');
        }

        // Convert to Celsius first
        let celsius;
        switch (fromUnit) {
            case 'c':
                celsius = value;
                break;
            case 'f':
                celsius = (value - 32) * 5/9;
                break;
            case 'k':
                celsius = value - 273.15;
                break;
        }

        // Convert from Celsius to target unit
        let result;
        switch (toUnit) {
            case 'c':
                result = celsius;
                break;
            case 'f':
                result = (celsius * 9/5) + 32;
                break;
            case 'k':
                result = celsius + 273.15;
                break;
        }

        showResults(value, fromUnit, result, toUnit);
    }

    // Volume Converter
    function convertVolume() {
        const value = parseFloat(document.getElementById('volume-value').value);
        const fromUnit = document.getElementById('volume-from').value;
        const toUnit = document.getElementById('volume-to').value;

        if (isNaN(value)) {
            throw new Error('Please enter a valid number');
        }

        // Convert to liters first
        let liters;
        switch (fromUnit) {
            case 'ml':
                liters = value / 1000;
                break;
            case 'l':
                liters = value;
                break;
            case 'm3':
                liters = value * 1000;
                break;
            case 'floz':
                liters = value * 0.0295735;
                break;
            case 'cup':
                liters = value * 0.236588;
                break;
            case 'pt':
                liters = value * 0.473176;
                break;
            case 'gal':
                liters = value * 3.78541;
                break;
        }

        // Convert from liters to target unit
        let result;
        switch (toUnit) {
            case 'ml':
                result = liters * 1000;
                break;
            case 'l':
                result = liters;
                break;
            case 'm3':
                result = liters / 1000;
                break;
            case 'floz':
                result = liters / 0.0295735;
                break;
            case 'cup':
                result = liters / 0.236588;
                break;
            case 'pt':
                result = liters / 0.473176;
                break;
            case 'gal':
                result = liters / 3.78541;
                break;
        }

        showResults(value, fromUnit, result, toUnit);
    }

    // Data Storage Converter
    function convertData() {
        const value = parseFloat(document.getElementById('data-value').value);
        const fromUnit = document.getElementById('data-from').value;
        const toUnit = document.getElementById('data-to').value;

        if (isNaN(value)) {
            throw new Error('Please enter a valid number');
        }

        // Convert to bytes first
        let bytes;
        switch (fromUnit) {
            case 'b':
                bytes = value / 8;
                break;
            case 'B':
                bytes = value;
                break;
            case 'KB':
                bytes = value * 1024;
                break;
            case 'MB':
                bytes = value * 1024 * 1024;
                break;
            case 'GB':
                bytes = value * 1024 * 1024 * 1024;
                break;
            case 'TB':
                bytes = value * 1024 * 1024 * 1024 * 1024;
                break;
            case 'PB':
                bytes = value * 1024 * 1024 * 1024 * 1024 * 1024;
                break;
        }

        // Convert from bytes to target unit
        let result;
        switch (toUnit) {
            case 'b':
                result = bytes * 8;
                break;
            case 'B':
                result = bytes;
                break;
            case 'KB':
                result = bytes / 1024;
                break;
            case 'MB':
                result = bytes / (1024 * 1024);
                break;
            case 'GB':
                result = bytes / (1024 * 1024 * 1024);
                break;
            case 'TB':
                result = bytes / (1024 * 1024 * 1024 * 1024);
                break;
            case 'PB':
                result = bytes / (1024 * 1024 * 1024 * 1024 * 1024);
                break;
        }

        showResults(value, fromUnit, result, toUnit);
    }

    // Energy Converter
    function convertEnergy() {
        const value = parseFloat(document.getElementById('energy-value').value);
        const fromUnit = document.getElementById('energy-from').value;
        const toUnit = document.getElementById('energy-to').value;

        if (isNaN(value)) {
            throw new Error('Please enter a valid number');
        }

        // Convert to joules first
        let joules;
        switch (fromUnit) {
            case 'j':
                joules = value;
                break;
            case 'kj':
                joules = value * 1000;
                break;
            case 'cal':
                joules = value * 4.184;
                break;
            case 'kcal':
                joules = value * 4184;
                break;
            case 'wh':
                joules = value * 3600;
                break;
            case 'kwh':
                joules = value * 3600000;
                break;
        }

        // Convert from joules to target unit
        let result;
        switch (toUnit) {
            case 'j':
                result = joules;
                break;
            case 'kj':
                result = joules / 1000;
                break;
            case 'cal':
                result = joules / 4.184;
                break;
            case 'kcal':
                result = joules / 4184;
                break;
            case 'wh':
                result = joules / 3600;
                break;
            case 'kwh':
                result = joules / 3600000;
                break;
        }

        showResults(value, fromUnit, result, toUnit);
    }

    // Pressure Converter
    function convertPressure() {
        const value = parseFloat(document.getElementById('pressure-value').value);
        const fromUnit = document.getElementById('pressure-from').value;
        const toUnit = document.getElementById('pressure-to').value;

        if (isNaN(value)) {
            throw new Error('Please enter a valid number');
        }

        // Convert to pascals first
        let pascals;
        switch (fromUnit) {
            case 'pa':
                pascals = value;
                break;
            case 'kpa':
                pascals = value * 1000;
                break;
            case 'bar':
                pascals = value * 100000;
                break;
            case 'psi':
                pascals = value * 6894.76;
                break;
            case 'atm':
                pascals = value * 101325;
                break;
        }

        // Convert from pascals to target unit
        let result;
        switch (toUnit) {
            case 'pa':
                result = pascals;
                break;
            case 'kpa':
                result = pascals / 1000;
                break;
            case 'bar':
                result = pascals / 100000;
                break;
            case 'psi':
                result = pascals / 6894.76;
                break;
            case 'atm':
                result = pascals / 101325;
                break;
        }

        showResults(value, fromUnit, result, toUnit);
    }

    // Fuel Efficiency Converter
    function convertFuel() {
        const value = parseFloat(document.getElementById('fuel-value').value);
        const fromUnit = document.getElementById('fuel-from').value;
        const toUnit = document.getElementById('fuel-to').value;

        if (isNaN(value)) {
            throw new Error('Please enter a valid number');
        }

        // Convert to L/100km first
        let l100km;
        switch (fromUnit) {
            case 'mpg':
                l100km = 235.215 / value;
                break;
            case 'l100km':
                l100km = value;
                break;
            case 'kmpl':
                l100km = 100 / value;
                break;
        }

        // Convert from L/100km to target unit
        let result;
        switch (toUnit) {
            case 'mpg':
                result = 235.215 / l100km;
                break;
            case 'l100km':
                result = l100km;
                break;
            case 'kmpl':
                result = 100 / l100km;
                break;
        }

        showResults(value, fromUnit, result, toUnit);
    }

    // Angle Converter
    function convertAngle() {
        const value = parseFloat(document.getElementById('angle-value').value);
        const fromUnit = document.getElementById('angle-from').value;
        const toUnit = document.getElementById('angle-to').value;

        if (isNaN(value)) {
            throw new Error('Please enter a valid number');
        }

        // Convert to degrees first
        let degrees;
        switch (fromUnit) {
            case 'deg':
                degrees = value;
                break;
            case 'rad':
                degrees = value * (180 / Math.PI);
                break;
            case 'grad':
                degrees = value * 0.9;
                break;
        }

        // Convert from degrees to target unit
        let result;
        switch (toUnit) {
            case 'deg':
                result = degrees;
                break;
            case 'rad':
                result = degrees * (Math.PI / 180);
                break;
            case 'grad':
                result = degrees / 0.9;
                break;
        }

        showResults(value, fromUnit, result, toUnit);
    }

    // Helper function to display results
    function showResults(value, fromUnit, result, toUnit) {
        const fromUnitName = document.querySelector(`#${fromUnit}-from option[value="${fromUnit}"]`).textContent;
        const toUnitName = document.querySelector(`#${toUnit}-to option[value="${toUnit}"]`).textContent;

        results.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <h6>Original Value</h6>
                    <p class="h4">${value} ${fromUnitName}</p>
                </div>
                <div class="col-md-6">
                    <h6>Converted Value</h6>
                    <p class="h4">${result.toFixed(6)} ${toUnitName}</p>
                </div>
            </div>
        `;
    }

    // Form reset handler
    form.addEventListener('reset', () => {
        setTimeout(() => {
            results.innerHTML = '<p class="text-center text-muted">Select a converter and enter values to see results</p>';
        }, 0);
    });
}); 