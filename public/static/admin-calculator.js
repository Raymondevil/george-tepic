// Admin Calculator JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const calcDate = document.getElementById('calc-date');
    const totalSales = document.getElementById('total-sales');
    const totalExpenses = document.getElementById('total-expenses');
    const totalProfit = document.getElementById('total-profit');
    const calcNotes = document.getElementById('calc-notes');
    const saveButton = document.getElementById('save-calculation');
    
    // Calculator elements
    const display = document.getElementById('calculator-display');
    const calcButtons = document.querySelectorAll('.calc-btn');
    
    let calculatorValue = '0';
    let operator = null;
    let previousValue = null;
    let waitingForOperand = false;

    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    calcDate.value = today;

    // Check authentication
    const token = localStorage.getItem('admin_token');
    if (!token) {
        window.location.href = '/admin/login';
        return;
    }

    // Load existing calculation for today
    loadCalculationForDate(today);

    // Auto-calculate profit when sales or expenses change
    totalSales.addEventListener('input', calculateProfit);
    totalExpenses.addEventListener('input', calculateProfit);

    // Load calculation when date changes
    calcDate.addEventListener('change', function() {
        loadCalculationForDate(this.value);
    });

    // Save calculation
    saveButton.addEventListener('click', async function() {
        await saveCalculation();
    });

    // Calculator functionality
    calcButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.dataset.action;
            const value = this.dataset.value;

            if (action) {
                handleAction(action);
            } else if (value) {
                inputValue(value);
            }
        });
    });

    function calculateProfit() {
        const sales = parseFloat(totalSales.value) || 0;
        const expenses = parseFloat(totalExpenses.value) || 0;
        const profit = sales - expenses;
        totalProfit.value = profit.toFixed(2);
    }

    async function loadCalculationForDate(date) {
        const token = localStorage.getItem('admin_token');
        try {
            const response = await fetch(`/api/admin/calculations/${date}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                
                totalSales.value = data.total_sales || '';
                totalExpenses.value = data.expenses || '';
                totalProfit.value = data.profit || '';
                calcNotes.value = data.notes || '';
                
                calculateProfit();
            } else if (response.status === 401) {
                handleAuthError();
                return;
            } else {
                // Clear form for new date
                totalSales.value = '';
                totalExpenses.value = '';
                totalProfit.value = '';
                calcNotes.value = '';
            }
        } catch (error) {
            console.error('Error loading calculation:', error);
        }
    }

    async function saveCalculation() {
        const date = calcDate.value;
        const sales = parseFloat(totalSales.value) || 0;
        const expenses = parseFloat(totalExpenses.value) || 0;
        const profit = parseFloat(totalProfit.value) || 0;
        const notes = calcNotes.value.trim();

        if (!date) {
            alert('Por favor selecciona una fecha');
            return;
        }

        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch('/api/admin/calculations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    date,
                    calculation_data: JSON.stringify({
                        sales,
                        expenses,
                        profit,
                        timestamp: new Date().toISOString()
                    }),
                    total_sales: sales,
                    expenses,
                    profit,
                    notes
                })
            });

            if (response.ok) {
                showNotification('✅ Cálculo guardado exitosamente', 'success');
            } else if (response.status === 401) {
                handleAuthError();
                return;
            } else {
                const error = await response.json();
                showNotification('❌ Error al guardar: ' + (error.message || 'Error desconocido'), 'error');
            }
        } catch (error) {
            console.error('Error saving calculation:', error);
            showNotification('❌ Error de conexión al guardar', 'error');
        }
    }

    // Calculator functions
    function inputValue(value) {
        if (waitingForOperand) {
            calculatorValue = value;
            waitingForOperand = false;
        } else {
            calculatorValue = calculatorValue === '0' ? value : calculatorValue + value;
        }
        updateDisplay();
    }

    function handleAction(action) {
        const inputValue = parseFloat(calculatorValue);

        if (previousValue === null) {
            previousValue = inputValue;
        } else if (operator) {
            const currentValue = previousValue || 0;
            const result = calculate(currentValue, inputValue, operator);

            calculatorValue = String(result);
            previousValue = result;
        }

        switch (action) {
            case 'clear':
                calculatorValue = '0';
                previousValue = null;
                operator = null;
                waitingForOperand = false;
                break;
            case 'delete':
                calculatorValue = calculatorValue.slice(0, -1) || '0';
                break;
            case 'equals':
                waitingForOperand = true;
                operator = null;
                previousValue = null;
                break;
            default:
                operator = action;
                waitingForOperand = true;
                break;
        }

        updateDisplay();
    }

    function calculate(firstValue, secondValue, operator) {
        switch (operator) {
            case '+':
                return firstValue + secondValue;
            case '-':
                return firstValue - secondValue;
            case '*':
                return firstValue * secondValue;
            case '/':
                return firstValue / secondValue;
            default:
                return secondValue;
        }
    }

    function updateDisplay() {
        display.value = calculatorValue;
    }

    // Initialize calculator display
    updateDisplay();

    // Handle 401 errors (token expired/invalid)
    function handleAuthError() {
        localStorage.removeItem('admin_token');
        window.location.href = '/admin/login';
    }

    // Add logout functionality
    function addLogoutButton() {
        const navButtons = document.querySelector('.space-x-4');
        if (navButtons) {
            const logoutBtn = document.createElement('a');
            logoutBtn.href = '#';
            logoutBtn.className = 'bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700';
            logoutBtn.textContent = '🚪 Salir';
            logoutBtn.onclick = function(e) {
                e.preventDefault();
                localStorage.removeItem('admin_token');
                window.location.href = '/admin/login';
            };
            navButtons.appendChild(logoutBtn);
        }
    }

    // Add logout button to navigation
    addLogoutButton();

    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            type === 'success' ? 'bg-green-600' : 
            type === 'error' ? 'bg-red-600' : 'bg-blue-600'
        } text-white`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    // Keyboard support for calculator
    document.addEventListener('keydown', function(e) {
        if (e.target.tagName === 'INPUT' && e.target.id !== 'calculator-display') {
            return; // Don't interfere with form inputs
        }

        const key = e.key;
        
        if ('0123456789'.includes(key) || key === '.') {
            inputValue(key);
        } else if ('+-*/'.includes(key)) {
            handleAction(key);
        } else if (key === 'Enter' || key === '=') {
            handleAction('equals');
        } else if (key === 'Escape' || key === 'c' || key === 'C') {
            handleAction('clear');
        } else if (key === 'Backspace') {
            handleAction('delete');
        }
    });
});