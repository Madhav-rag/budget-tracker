import { useState } from "react";
import { useStore } from "../store/useStore";
import { computeMonthlySummary } from "../types";
import type { Budget } from "../types";

function BudgetManager({ month }: { month: string }) {
  const { categories, transactions, budgets, setBudget } = useStore();
  const summary = computeMonthlySummary(month, transactions, categories, budgets);

  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id ?? "");
  const [limitAmount, setLimitAmount] = useState<number | null>(null);

  function handleSetBudget() {
    if (!selectedCategory || !limitAmount || limitAmount <= 0) return;

    const newBudget: Budget = {
      id: crypto.randomUUID(),
      categoryId: selectedCategory,
      month,
      limitAmount,
      createdAt: new Date().toISOString(),
    };

    setBudget(newBudget);
    setLimitAmount(0);
  }

  return (
    <div className="budget-manager">
      <h2>Budget Limits</h2>

      <div className="budget-form">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories
            .filter((c) => c.type === "expense")
            .map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.name}
              </option>
            ))}
        </select>

        <input
            type="number"
            placeholder="0"
            value={limitAmount ?? ""}
            onChange={(e) => setLimitAmount(e.target.value ? Number(e.target.value) : null)}
        />

        <button onClick={handleSetBudget}>Set Budget</button>
      </div>

      <div className="budget-list">
        {summary.categoryBreakdown
          .filter((c) => c.budget !== undefined)
          .map((c) => (
            <div key={c.category.id} className="budget-item">
              <div className="budget-item-header">
                <span>{c.category.icon} {c.category.name}</span>
                <span className={c.isOverBudget ? "over-budget" : ""}>
                  ${c.totalSpent} / ${c.budget!.limitAmount}
                </span>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${Math.min(c.percentUsed ?? 0, 100)}%`,
                    background: c.isOverBudget ? "#ef4444" : "#aa3bff",
                  }}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default BudgetManager;