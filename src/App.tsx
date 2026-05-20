import { useState } from "react";
import { useStore } from "./store/useStore";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import MonthlySummary from "./components/MonthlySummary";
import SpendingChart from "./components/SpendingChart";
import BudgetManager from "./components/BudgetManager";

function App() {
  const { transactions } = useStore();
  //params are current value and functions to change it
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)  // defaults to current month e.g. "2026-05"
  );

  return (
    <div> 
      <div className="app-header">
        <h1>Budget Tracker</h1>
      </div>
      <p>Total Transactions added: {transactions.length}</p>
      <p>Transactions for {new Date(selectedMonth + "-01").toLocaleString("default", { month: "long" })}: {transactions.filter(t => t.date.startsWith(selectedMonth)).length}</p>

      <input
        type="month"
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
      />
      <MonthlySummary month={selectedMonth} />
      <SpendingChart month={selectedMonth} />
      <BudgetManager month={selectedMonth} />
      <TransactionForm />
      <TransactionList month={selectedMonth} />
    </div>
  );
}

export default App;