// app.js
import { Database } from "./Database.js";
import { TransactionManager } from "./TransactionManager.js";

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("transaction-form");
  const transactionNameInput = document.getElementById("transaction-name");
  const transactionAmountInput = document.getElementById("transaction-amount");
  const transactionTypeSelect = document.getElementById("transaction-type");
  const transactionCategorySelect = document.getElementById(
    "transaction-category"
  );

  const db = new Database("expenseTrackerDB", "transactions");
  const transactionManager = new TransactionManager(db, 500); // Set threshold to 500 for example
  await transactionManager.init();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = transactionNameInput.value;
    const amount = parseFloat(transactionAmountInput.value);
    const type = transactionTypeSelect.value;
    const category = transactionCategorySelect.value;

    if (name && amount && category) {
      const transaction = { name, amount, type, category };
      await transactionManager.addTransaction(transaction);
      form.reset();
    }
  });
});
