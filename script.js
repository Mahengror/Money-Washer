const expenseForm = document.getElementById('expense-form');
const expenseList = document.getElementById('expense-list');
const expenseTable = document.getElementById('expense-table');
const emptyState = document.getElementById('empty-state');
const totalAmountDisplay = document.getElementById('total-amount');

// Persist data locally so users do not lose their records on page refresh.
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(amount);
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

function renderExpenses() {
    expenseList.innerHTML = '';
    let total = 0;
    
    if (expenses.length === 0) {
        emptyState.classList.remove('hidden');
        expenseTable.classList.add('hidden');
        totalAmountDisplay.textContent = formatCurrency(0);
        return;
    }

    emptyState.classList.add('hidden');
    expenseTable.classList.remove('hidden');

    // Force newest transactions to appear at the top of the table.
    const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedExpenses.forEach(expense => {
        total += expense.amount;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(expense.date)}</td>
            <td>${expense.description}</td>
            <td><span class="category-badge">${expense.category}</span></td>
            <td class="amount-cell">${formatCurrency(expense.amount)}</td>
            <td class="action-col">
                <button type="button" class="btn-delete" data-id="${expense.id}" aria-label="Hapus transaksi ini">Hapus</button>
            </td>
        `;
        expenseList.appendChild(row);
    });

    totalAmountDisplay.textContent = formatCurrency(total);
}

expenseForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const newExpense = {
        id: crypto.randomUUID(),
        date: document.getElementById('date-input').value,
        category: document.getElementById('category-input').value,
        description: document.getElementById('desc-input').value,
        amount: Number(document.getElementById('amount-input').value)
    };

    expenses.push(newExpense);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    
    expenseForm.reset();
    renderExpenses();
});

expenseList.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-delete')) {
        const idToRemove = e.target.getAttribute('data-id');
        expenses = expenses.filter(expense => expense.id !== idToRemove);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        renderExpenses();
    }
});

renderExpenses();