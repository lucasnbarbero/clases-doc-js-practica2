// Database.js
export class Database {
  constructor(dbName, storeName, version = 1) {
    this.dbName = dbName;
    this.storeName = storeName;
    this.version = version;
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = (event) => {
        console.error("Database error:", event.target.errorCode);
        reject(event.target.errorCode);
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        this.db = event.target.result;
        const objectStore = this.db.createObjectStore(this.storeName, {
          keyPath: "id",
          autoIncrement: true,
        });
        objectStore.createIndex("name", "name", { unique: false });
        objectStore.createIndex("amount", "amount", { unique: false });
        objectStore.createIndex("type", "type", { unique: false });
        objectStore.createIndex("category", "category", { unique: false });
      };
    });
  }

  async addTransaction(transaction) {
    return new Promise((resolve, reject) => {
      const transactionRequest = this.db
        .transaction([this.storeName], "readwrite")
        .objectStore(this.storeName)
        .add(transaction);

      transactionRequest.onsuccess = () => {
        console.log("Transaction added to the database.");
        resolve();
      };

      transactionRequest.onerror = (event) => {
        console.error(
          "Error adding transaction to the database:",
          event.target.errorCode
        );
        reject(event.target.errorCode);
      };
    });
  }

  async deleteTransaction(id) {
    return new Promise((resolve, reject) => {
      const transactionRequest = this.db
        .transaction([this.storeName], "readwrite")
        .objectStore(this.storeName)
        .delete(id);

      transactionRequest.onsuccess = () => {
        console.log("Transaction deleted from the database.");
        resolve();
      };

      transactionRequest.onerror = (event) => {
        console.error(
          "Error deleting transaction from the database:",
          event.target.errorCode
        );
        reject(event.target.errorCode);
      };
    });
  }

  async getAllTransactions() {
    return new Promise((resolve, reject) => {
      const transactions = [];
      const objectStore = this.db
        .transaction(this.storeName)
        .objectStore(this.storeName);

      objectStore.openCursor().onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          transactions.push(cursor.value);
          cursor.continue();
        } else {
          resolve(transactions);
        }
      };

      objectStore.onerror = (event) => {
        console.error(
          "Error retrieving transactions from the database:",
          event.target.errorCode
        );
        reject(event.target.errorCode);
      };
    });
  }
}
