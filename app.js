


const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
  
  function createTransactionElement() {
    const list = document.getElementById("transaction-list")
    const status = document.getElementById("status")
    budgetForm.addEventListener('submit', addTransaction)
  
  
    list.innerHTML = ""
  
    //ถ้าไม่มีข้อมูลให้แสดง No transactions
  
    if (transactions.length === 0) {
      status.textContent = "No transactions";
    } else {
      status.textContent = "";
    }
  
    transactions.forEach(({ id, type, name, date, amount}) => {
  
  
      const transaction_box = document.createElement('div');
      transaction_box.innerHTML = `
      <div class="transaction-box  ">
      <div class="heading">
           <div class="title">${name} </div>
          <div class="date">${new Date(date).toLocaleDateString()}</div>
      </div>
  
      <div class="amoung ${type}">฿ ${amount}</div>
      <button onclick="myFunction(${id})"> Delete</button>
  </div>`;
  
      list.appendChild(transaction_box);
  
  
    })
  
  
    updateIncome(); 
  }

  saveTransactions()
  createTransactionElement();

  function updateIncome() {
    const incomeBox = document.getElementById("income-amount");
    const expenseBox = document.getElementById("expense-amount");
    const balanceBox = document.getElementById("balance-amount");


    const incomeTotal = transactions
        .filter(trx => trx.type === "income")
        .reduce((total, trx) => total + trx.amount, 0);

    const expenseTotal = transactions
        .filter(trx => trx.type === "expense")
        .reduce((total, trx) => total + trx.amount, 0);

    const balanceTotal = incomeTotal - expenseTotal;

    incomeBox.textContent = `฿${incomeTotal.toFixed(2)}`;
    expenseBox.textContent = `฿${expenseTotal.toFixed(2)}`;
    balanceBox.textContent = `฿${balanceTotal.toFixed(2)}`;
}

  
  function myFunction(id) {
    const index = transactions.findIndex((trx) => trx.id === id);
    transactions.splice(index, 1);
  
    createTransactionElement();
  }
  
  function addTransaction(e) {
      e.preventDefault();
  
      const formData = new FormData(this);
      const type = document.getElementById("switcher") ;
  
      transactions.push({
        id: transactions.length +1,
        name: formData.get("name"),
        amount: parseFloat(formData.get("amount")),
        date: new Date(formData.get("date")),
        type: type.checked ?  "income" :  "expense"
      })
  
      this.reset();
  
      createTransactionElement();
      saveTransactions();
      updateIncome();
  }

  function saveTransactions() {
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date))
    localStorage.setItem('transactions', JSON.stringify(transactions) )
  }