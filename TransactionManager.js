// TransactionManager.js
export class TransactionManager {
  constructor(db, threshold = 500) {
    this.db = db;
    this.balance = 0;
    this.transactionsList = document.getElementById("transactions");
    this.balanceDisplay = document.getElementById("balance");
    this.notifications = document.getElementById("notifications");
    this.threshold = threshold;
  }

  async init() {
    await this.db.init();
    await this.loadTransactions();
  }

  async addTransaction(transaction) {
    await this.db.addTransaction(transaction);
    this.addTransactionToDOM(transaction);
    this.updateBalance(transaction.amount, transaction.type);
  }

  async deleteTransaction(id) {
    await this.db.deleteTransaction(id);
    const transactionItem = document.getElementById(`transaction-${id}`);
    const amount = parseFloat(transactionItem.dataset.amount);
    const type = transactionItem.dataset.type;
    transactionItem.remove();
    this.updateBalance(-amount, type);
  }

  async loadTransactions() {
    const transactions = await this.db.getAllTransactions();
    transactions.forEach((transaction) => {
      this.addTransactionToDOM(transaction);
      this.updateBalance(transaction.amount, transaction.type);
    });
  }

  addTransactionToDOM(transaction) {
    const transactionItem = document.createElement("li");
    transactionItem.classList.add(transaction.type);
    transactionItem.id = `transaction-${transaction.id}`;
    transactionItem.dataset.amount = transaction.amount;
    transactionItem.dataset.type = transaction.type;
    transactionItem.innerHTML = `${transaction.name} (${
      transaction.category
    }) - $${transaction.amount.toFixed(
      2
    )} <button class="delete-btn" data-id="${transaction.id}">X</button>`;

    const deleteBtn = transactionItem.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", async () => {
      await this.deleteTransaction(transaction.id);
    });

    this.transactionsList.appendChild(transactionItem);
  }

  updateBalance(amount, type) {
    if (type === "income") {
      this.balance += amount;
    } else if (type === "expense") {
      this.balance -= amount;
    }
    this.balanceDisplay.textContent = this.balance.toFixed(2);
    this.checkThreshold();
  }

  checkThreshold() {
    if (this.balance < this.threshold) {
      this.showNotification(
        `Alerta: Tu saldo está por debajo de $${
          this.threshold
        }. Saldo actual: $${this.balance.toFixed(2)}`
      );
    }
  }

  showNotification(message) {
    const notification = document.createElement("div");
    notification.classList.add("notification");
    notification.textContent = message;
    this.notifications.appendChild(notification);
    setTimeout(() => {
      notification.remove();
    }, 5000);
  }
}
