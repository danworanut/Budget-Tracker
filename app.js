

//อ่านข้อมูลจาก Local Storage
const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  
  function createTransactionElement() {
    const list = document.getElementById("transaction-list")
    const status = document.getElementById("status")
    
    budgetForm.addEventListener('submit', addTransaction)
  
    //เรียงลำดับจากวันที่ล่าสุดไปสู่วันที่เก่าที่สุด
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  
    list.innerHTML = ""
  
    //ถ้าไม่มีข้อมูลให้แสดง No transactions
  
    if (transactions.length === 0) {
      status.textContent = "No transactions";
    } else {
      status.textContent = "";
    }

    //สร้างรายการข้อมูลใน transactions
  
    transactions.forEach(({ id, type, name, date, amount}) => {
  
      //การสร้างHTML ภายในองค์ประกอบที่มี id "transaction-list"

      const transaction_box = document.createElement('div');

      //การสร้าง HTML สำหรับแต่ละข้อมูลโดยสร้างค์ประกอบ HTML สำหรับแสดงข้อมูล
      transaction_box.innerHTML = `
      <div class="transaction-box  ">
      <div class="heading">
           <div class="title">${name} </div>
          <div class="date">${new Date(date).toLocaleDateString()}</div>
      </div>
  
      <div class="amoung ${type}">฿ ${amount}</div>

      <button onclick="myFunction(${id})"> Delete</button>
  </div>`;
  //ปุ่ม "Delete" ที่เรียกใช้ฟังก์ชัน myFunction(id) เพื่อลบรายการข้อมูลที่กำหนดด้วย id
  

      list.appendChild(transaction_box);
  
  
    })
    updateIncome(); 
  
    
  }
  updateIncome(); 
  saveTransactions()
  createTransactionElement();

  //การแสดงผลรวมรายรับ รายจ่าย และยอดคงเหลือ 

  function updateIncome() {
    // ผลรวมรายรับถูกแสดงในองค์ประกอบ HTML ที่มี id "income-amount"
    const incomeBox = document.getElementById("income-amount");
    // ผลรวมรายจ่ายถูกแสดงในองค์ประกอบ HTML ที่มี id "expense-amount"
    const expenseBox = document.getElementById("expense-amount");
    
    // ผลรวมยอดคงเหลือถูกแสดงในองค์ประกอบ HTML ที่มี id "balance-amount"
    const balanceBox = document.getElementById("balance-amount");

    //ฟังก์ชันนี้คำนวณผลรวมของรายรับและรายจ่ายจากข้อมูลใน transactions
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

    //ฟังก์ชันจะหา index ของรายการข้อมูลที่ต้องการลบด้วย findIndex แล้วลบรายการนั้นด้วย splice
    const index = transactions.findIndex((trx) => trx.id === id);
    transactions.splice(index, 1);

    //หลังจากการลบรายการ ฟังก์ชัน createTransactionElement ถูกเรียกใช้เพื่ออัปเดตหน้าเว็บ
    createTransactionElement();
  }
  

  //ฟังก์ชันนี้ถูกเรียกเมื่อผู้ใช้ส่งแบบฟอร์ม
  function addTransaction(e) {
      e.preventDefault();
  
      const formData = new FormData(this);
      const type = document.getElementById("switcher") ;
      const date = document.getElementById("date") ;

      //อ่านข้อมูลจากแบบฟอร์มและสร้างรายการข้อมูลใหม่
      transactions.push({
        id: transactions.length +1,
        name: formData.get("name"),
        amount: parseFloat(formData.get("amount")),
        date: date.value ,
        type: type.checked ?  "income" :  "expense"
      })
  

     
   
      this.reset();
      // รายการธุรกรรมใหม่ถูกเพิ่มเข้าในอาเรย์ transactions และแสดงผลลัพธ์บนหน้าเว็บ
      createTransactionElement();
       //หลังจากนั้น ฟังก์ชัน saveTransactions ถูกเรียกเพื่อบันทึกข้อมูลใหม่ลงใน Local Storage 
      saveTransactions();
      // updateIncome ถูกเรียกเพื่ออัปเดตผลรวม
      updateIncome();
  }

  function saveTransactions() {
    //บันทึกข้อมูลรายการธุรกรรมทั้งหมดใน transactions ลงใน Local Storage โดยใช้ localStorage.setItem
    //ข้อมูลถูกเก็บเป็นรูปแบบ JSON ที่ถูกแปลงจากอาเรย์ transactions โดยใช้ JSON.stringify
    localStorage.setItem('transactions', JSON.stringify(transactions) );
  }