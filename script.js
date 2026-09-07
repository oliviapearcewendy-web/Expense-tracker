const expenseForm = document.getElementById("expenseForm");
const incomeForm = document.getElementById("incomeForm");
const budgetForm = document.getElementById("budgetForm");

const expenseList = document.getElementById("expenseList");
const emptyState = document.getElementById("emptyState");

const categoryFilter = document.getElementById("categoryFilter");

const totalIncome = document.getElementById("totalIncome");
const totalExpenses = document.getElementById("totalExpenses");
const balance = document.getElementById("balance");
const budgetDisplay = document.getElementById("budgetDisplay");

const budgetPercentage = document.getElementById("budgetPercentage");
const progressFill = document.getElementById("progressFill");

const categorySummary = document.getElementById("categorySummary");

const themeToggle = document.getElementById("themeToggle");

const editModal = document.getElementById("editModal");
const closeModal = document.getElementById("closeModal");
const editExpenseForm = document.getElementById("editExpenseForm");




let expenses = JSON.parse(
    localStorage.getItem("expenses")
) || [];

let incomes = JSON.parse(
    localStorage.getItem("incomes")
) || [];

let budget = Number(
    localStorage.getItem("budget")
) || 0;

let editingExpenseId = null;

let categoryChart = null;


// ================================
// SAVE DATA
// ================================

function saveData() {

    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );

    localStorage.setItem(
        "incomes",
        JSON.stringify(incomes)
    );

    localStorage.setItem(
        "budget",
        budget
    );
}


// ================================
// FORMAT MONEY
// ================================

function formatMoney(amount) {

    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN"
    }).format(amount);
}


// ================================
// GET TODAY'S DATE
// ================================

function getToday() {

    const today = new Date();

    const year = today.getFullYear();

    const month = String(
        today.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        today.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// ================================
// DEFAULT DATES
// ================================

function setDefaultDates() {

    const today = getToday();

    const expenseDate =
        document.getElementById("expenseDate");

    const incomeDate =
        document.getElementById("incomeDate");

    if (expenseDate) {
        expenseDate.value = today;
    }

    if (incomeDate) {
        incomeDate.value = today;
    }
}




function generateId() {

    return Date.now().toString() +
        Math.random().toString(36).substring(2);
}


if (expenseForm) {

    expenseForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const nameInput =
                document.getElementById("expenseName");

            const amountInput =
                document.getElementById("expenseAmount");

            const categoryInput =
                document.getElementById("expenseCategory");

            const dateInput =
                document.getElementById("expenseDate");


            const name =
                nameInput.value.trim();

            const amount =
                Number(amountInput.value);

            const category =
                categoryInput.value;

            const date =
                dateInput.value;



            if (!name) {

                alert("Please enter an expense name.");

                nameInput.focus();

                return;
            }


            if (!amount || amount <= 0) {

                alert("Please enter a valid amount.");

                amountInput.focus();

                return;
            }


            if (!category) {

                alert("Please select a category.");

                categoryInput.focus();

                return;
            }


            if (!date) {

                alert("Please select a date.");

                dateInput.focus();

                return;
            }


            

            const expense = {

                id: generateId(),

                name: name,

                amount: amount,

                category: category,

                date: date

            };


            expenses.push(expense);


         

            saveData();


      

            renderExpenses();

            updateDashboard();


       

            expenseForm.reset();

            setDefaultDates();

        }
    );

}



if (incomeForm) {

    incomeForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const nameInput =
                document.getElementById("incomeName");

            const amountInput =
                document.getElementById("incomeAmount");

            const dateInput =
                document.getElementById("incomeDate");


            const name =
                nameInput.value.trim();

            const amount =
                Number(amountInput.value);

            const date =
                dateInput.value;


            if (!name) {

                alert("Please enter an income source.");

                nameInput.focus();

                return;
            }


            if (!amount || amount <= 0) {

                alert("Please enter a valid income amount.");

                amountInput.focus();

                return;
            }


            if (!date) {

                alert("Please select a date.");

                dateInput.focus();

                return;
            }


            const income = {

                id: generateId(),

                name: name,

                amount: amount,

                date: date

            };


            incomes.push(income);


            saveData();

            updateDashboard();


            incomeForm.reset();

            setDefaultDates();

        }
    );

}




if (budgetForm) {

    budgetForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const budgetInput =
                document.getElementById("budgetAmount");

            const amount =
                Number(budgetInput.value);


            if (!amount || amount <= 0) {

                alert("Please enter a valid budget.");

                budgetInput.focus();

                return;
            }


            budget = amount;


            saveData();

            updateDashboard();


            budgetInput.value = "";

        }
    );

}



function renderExpenses() {

    if (!expenseList) {
        return;
    }


    expenseList.innerHTML = "";


    let filteredExpenses = [...expenses];




    if ( categoryFilter &&  categoryFilter.value !== "All"){
          filteredExpenses =
            filteredExpenses.filter(
                function (expense) {

                    return (
                        expense.category ===
                        categoryFilter.value
                    );

                }
            );

    }


    // Sort newest first

    filteredExpenses.sort(
        function (a, b) {

            return new Date(b.date) -
                new Date(a.date);

        }
    );


    // No expenses

    if (filteredExpenses.length === 0) {

        if (emptyState) {

            emptyState.style.display = "block";

        }

        return;

    }


    if (emptyState) {

        emptyState.style.display = "none";

    }


    // Create table rows

    filteredExpenses.forEach(
        function (expense) {

            const row =
                document.createElement("tr");


            // Name

            const nameCell =
                document.createElement("td");

            nameCell.textContent =
                expense.name;


            // Category

            const categoryCell =
                document.createElement("td");

            categoryCell.textContent =
                expense.category;


            // Amount

            const amountCell =
                document.createElement("td");

            amountCell.textContent =
                formatMoney(expense.amount);


            // Date

            const dateCell =
                document.createElement("td");

            dateCell.textContent =
                formatDate(expense.date);


            // Actions

            const actionCell =
                document.createElement("td");


            const editButton =
                document.createElement("button");

            editButton.textContent = "Edit";

            editButton.type = "button";

            editButton.className = "edit-btn";

            editButton.dataset.id =
                expense.id;


            const deleteButton =
                document.createElement("button");

            deleteButton.textContent = "Delete";

            deleteButton.type = "button";

            deleteButton.className = "delete-btn";

            deleteButton.dataset.id =
                expense.id;


            actionCell.appendChild(editButton);

            actionCell.appendChild(deleteButton);


            // Add cells to row

            row.appendChild(nameCell);

            row.appendChild(categoryCell);

            row.appendChild(amountCell);

            row.appendChild(dateCell);

            row.appendChild(actionCell);


            // Add row to table

            expenseList.appendChild(row);

        }
    );

}


// ================================
// FORMAT DATE
// ================================

function formatDate(dateString) {

    if (!dateString) {
        return "—";
    }


    const date =
        new Date(dateString + "T00:00:00");


    if (isNaN(date.getTime())) {
        return "Invalid date";
    }


    return date.toLocaleDateString(
        "en-NG",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}


// ================================
// EXPENSE BUTTONS
// ================================

if (expenseList) {

    expenseList.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest("button");


            if (!button) {
                return;
            }


            const id =
                button.dataset.id;


            if (button.classList.contains("delete-btn")) {

                deleteExpense(id);

            }


            if (button.classList.contains("edit-btn")) {

                openEditModal(id);

            }

        }
    );

}


// ================================
// DELETE EXPENSE
// ================================

function deleteExpense(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this expense?"
        );


    if (!confirmed) {
        return;
    }


    expenses =
        expenses.filter(
            function (expense) {

                return String(expense.id) !==
                    String(id);

            }
        );


    saveData();

    renderExpenses();

    updateDashboard();

}


// ================================
// OPEN EDIT MODAL
// ================================

function openEditModal(id) {

    const expense =
        expenses.find(
            function (item) {

                return String(item.id) ===
                    String(id);

            }
        );


    if (!expense) {
        return;
    }


    editingExpenseId = id;


    const idInput =
        document.getElementById("editExpenseId");

    const nameInput =
        document.getElementById("editExpenseName");

    const amountInput =
        document.getElementById("editExpenseAmount");

    const categoryInput =
        document.getElementById("editExpenseCategory");

    const dateInput =
        document.getElementById("editExpenseDate");


    if (idInput) {
        idInput.value = expense.id;
    }

    if (nameInput) {
        nameInput.value = expense.name;
    }

    if (amountInput) {
        amountInput.value = expense.amount;
    }

    if (categoryInput) {
        categoryInput.value = expense.category;
    }

    if (dateInput) {
        dateInput.value = expense.date;
    }


    if (editModal) {

        editModal.classList.add("active");

    }

}


// ================================
// CLOSE EDIT MODAL
// ================================

function closeEditModal() {

    if (editModal) {

        editModal.classList.remove("active");

    }

    editingExpenseId = null;

}


// Close button

if (closeModal) {

    closeModal.addEventListener(
        "click",
        closeEditModal
    );

}


// Click outside modal

if (editModal) {

    editModal.addEventListener(
        "click",
        function (event) {

            if (event.target === editModal) {

                closeEditModal();

            }

        }
    );

}


// ================================
// EDIT EXPENSE
// ================================

if (editExpenseForm) {

    editExpenseForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            if (!editingExpenseId) {

                return;

            }


            const name =
                document.getElementById(
                    "editExpenseName"
                ).value.trim();


            const amount =
                Number(
                    document.getElementById(
                        "editExpenseAmount"
                    ).value
                );


            const category =
                document.getElementById(
                    "editExpenseCategory"
                ).value;


            const date =
                document.getElementById(
                    "editExpenseDate"
                ).value;


            if (!name || !amount || amount <= 0 || !category || !date) {

                alert("Please fill in all fields correctly.");

                return;

            }


            const expense =
                expenses.find(
                    function (item) {

                        return String(item.id) ===
                            String(editingExpenseId);

                    }
                );


            if (!expense) {

                alert("Expense not found.");

                closeEditModal();

                return;

            }


            expense.name = name;

            expense.amount = amount;

            expense.category = category;

            expense.date = date;


            saveData();

            renderExpenses();

            updateDashboard();

            closeEditModal();

        }
    );

}


// ================================
// CATEGORY FILTER
// ================================

if (categoryFilter) {

    categoryFilter.addEventListener(
        "change",
        renderExpenses
    );

}


// ================================
// CALCULATE INCOME
// ================================

function calculateIncome() {

    return incomes.reduce(
        function (total, income) {

            return total +
                Number(income.amount || 0);

        },
        0
    );

}


// ================================
// CALCULATE EXPENSES
// ================================

function calculateExpenses() {

    return expenses.reduce(
        function (total, expense) {

            return total +
                Number(expense.amount || 0);

        },
        0
    );

}


// ================================
// UPDATE DASHBOARD
// ================================

function updateDashboard() {

    const income =
        calculateIncome();

    const spending =
        calculateExpenses();

    const currentBalance =
        income - spending;


    if (totalIncome) {

        totalIncome.textContent =
            formatMoney(income);

    }


    if (totalExpenses) {

        totalExpenses.textContent =
            formatMoney(spending);

    }


    if (balance) {

        balance.textContent =
            formatMoney(currentBalance);

    }


    if (budgetDisplay) {

        budgetDisplay.textContent =
            formatMoney(budget);

    }


    updateBudget();

    renderCategorySummary();

    updateChart();

}


// ================================
// UPDATE BUDGET
// ================================

function updateBudget() {

    if (!budgetPercentage || !progressFill) {
        return;
    }


    if (budget <= 0) {

        budgetPercentage.textContent = "0%";

        progressFill.style.width = "0%";

        return;

    }


    const spending =
        calculateExpenses();


    const percentage =
        (spending / budget) * 100;


    budgetPercentage.textContent =
        Math.round(percentage) + "%";


    progressFill.style.width =
        Math.min(percentage, 100) + "%";


    if (percentage >= 100) {

        progressFill.style.background =
            "var(--danger)";

    }

    else if (percentage >= 80) {

        progressFill.style.background =
            "var(--warning)";

    }

    else {

        progressFill.style.background =
            "var(--primary)";

    }

}


// ================================
// CATEGORY TOTALS
// ================================

function getCategoryTotals() {

    const totals = {};


    expenses.forEach(
        function (expense) {

            const category =
                expense.category || "Other";


            const amount =
                Number(expense.amount || 0);


            if (!totals[category]) {

                totals[category] = 0;

            }


            totals[category] += amount;

        }
    );


    return totals;

}


// ================================
// CATEGORY SUMMARY
// ================================

function renderCategorySummary() {

    if (!categorySummary) {
        return;
    }


    categorySummary.innerHTML = "";


    const totals =
        getCategoryTotals();


    const categories =
        Object.entries(totals);


    if (categories.length === 0) {

        const message =
            document.createElement("p");

        message.textContent =
            "No spending data yet.";

        categorySummary.appendChild(message);

        return;

    }


    categories.sort(
        function (a, b) {

            return b[1] - a[1];

        }
    );


    categories.forEach(
        function ([category, amount]) {

            const item =
                document.createElement("div");

            item.className =
                "category-item";


            const name =
                document.createElement("div");

            name.className =
                "category-name";

            name.textContent =
                category;


            const value =
                document.createElement("div");

            value.className =
                "category-amount";

            value.textContent =
                formatMoney(amount);


            item.appendChild(name);

            item.appendChild(value);


            categorySummary.appendChild(item);

        }
    );

}


// ================================
// CHART
// ================================

function updateChart() {

    const canvas =
        document.getElementById("categoryChart");


    if (!canvas) {
        return;
    }


    const totals =
        getCategoryTotals();


    const labels =
        Object.keys(totals);


    const values =
        Object.values(totals);


    // Remove previous chart

    if (categoryChart) {

        categoryChart.destroy();

        categoryChart = null;

    }


    if (labels.length === 0) {
        return;
    }


    // Make sure Chart.js exists

    if (typeof Chart === "undefined") {

        console.log(
            "Chart.js is not loaded."
        );

        return;

    }


    categoryChart =
        new Chart(
            canvas,
            {
                type: "doughnut",

                data: {

                    labels: labels,

                    datasets: [
                        {
                            data: values,

                            borderWidth: 0
                        }
                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {

                            position: "bottom"

                        },

                        tooltip: {

                            callbacks: {

                                label: function (context) {

                                    return `${context.label}: ${formatMoney(context.raw)}`;

                                }

                            }

                        }

                    }

                }

            }
        );

}


// ================================
// DARK / LIGHT MODE
// ================================

function initializeTheme() {

    const savedTheme =
        localStorage.getItem("theme");


    if (savedTheme === "dark") {

        document.body.classList.add("dark");

        if (themeToggle) {

            themeToggle.textContent = "☀️";

        }

    }

    else {

        document.body.classList.remove("dark");

        if (themeToggle) {

            themeToggle.textContent = "🌙";

        }

    }

}


// Theme button

if (themeToggle) {

    themeToggle.addEventListener(
        "click",
        function () {

            document.body.classList.toggle("dark");


            const darkMode =
                document.body.classList.contains("dark");


            localStorage.setItem(
                "theme",
                darkMode ? "dark" : "light"
            );


            themeToggle.textContent =
                darkMode ? "☀️" : "🌙";

        }
    );

}


// ================================
// ESC KEY CLOSES MODAL
// ================================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            editModal &&
            editModal.classList.contains("active")
        ) {

            closeEditModal();

        }

    }
);


// ================================
// START APP
// ================================

setDefaultDates();

initializeTheme();

renderExpenses();

updateDashboard();