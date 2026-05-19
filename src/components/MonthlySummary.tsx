import { useStore } from "../store/useStore";
import { computeMonthlySummary } from "../types";

function MonthlySummary({ month }: { month: string }) {
  const { transactions, categories, budgets } = useStore();
  const summary = computeMonthlySummary(month, transactions, categories, budgets);

  return (
    <div className="summary">
      <div className="summary-card income">
        <p>Income</p>
        <h2>${summary.totalIncome}</h2>
      </div>
      <div className="summary-card expense">
        <p>Expenses</p>
        <h2>${summary.totalExpenses}</h2>
      </div>
      <div className="summary-card balance">
        <p>Net Balance</p>
        <h2>${summary.netBalance}</h2>
      </div>
    </div>
  );
}

export default MonthlySummary;