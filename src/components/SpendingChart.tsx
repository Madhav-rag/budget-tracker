import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useStore } from "../store/useStore";
import { computeMonthlySummary } from "../types";

function SpendingChart({ month }: { month: string }) {
  const { transactions, categories, budgets } = useStore();
  const summary = computeMonthlySummary(month, transactions, categories, budgets);

  const data = summary.categoryBreakdown
    .filter((c) => c.totalSpent > 0)
    .map((c) => ({
      name: `${c.category.icon} ${c.category.name}`,
      value: c.totalSpent,
      color: c.category.color,
    }));

  if (data.length === 0) {
    return <p>No spending data for this month.</p>;
  }

  return (
    <div className="chart-container">
      <h2>Spending by Category</h2>
      <PieChart width={400} height={300}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `$${value}`} />
        <Legend />
      </PieChart>
    </div>
  );
}

export default SpendingChart;