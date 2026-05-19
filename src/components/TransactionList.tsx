import { useStore } from "../store/useStore";

function TransactionList({ month }: { month: string }) {
  const { transactions, categories, deleteTransaction } = useStore();

  const filtered = transactions.filter((t) => t.date.startsWith(month));

  return (
    <div>
      <h2>Transactions</h2>
      {filtered.length === 0 && <p>No transactions yet.</p>}
      {filtered.map((t) => {
        const category = categories.find((c) => c.id === t.categoryId);
        return (
          <div key={t.id} className="transaction-item">
            <span>{category?.icon} {category?.name}</span>
            <span className={`amount ${t.type}`}>${t.amount}</span>
            <span className="description">{t.description}</span>
            <span className="date">{t.date}</span>
            <button onClick={() => deleteTransaction(t.id)}>Delete</button>
          </div>
        );
      })}
    </div>
  );
}

export default TransactionList;