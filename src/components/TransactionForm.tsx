import { useState, useEffect } from "react";
import type { Transaction, TransactionType, RecurrenceInterval } from "../types";
import { useStore } from "../store/useStore";

function TransactionForm() {
  const { categories, addTransaction } = useStore();

  const [amount, setAmount] = useState<number>(0);
  const [type, setType] = useState<TransactionType>("expense");
  const [categoryId, setCategoryId] = useState<string>(categories[0]?.id ?? "");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [recurrence, setRecurrence] = useState<RecurrenceInterval>("none");

  useEffect(() => {
  const firstMatch = categories.find((cat) => cat.type === type);
  setCategoryId(firstMatch?.id ?? "");
}, [type]);

  function handleSubmit() {
    console.log({ amount, type, categoryId, date, description });
    if (amount <= 0 || !categoryId || !date) return;

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      type,
      amount,
      categoryId,
      description,
      date,
      recurrence,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addTransaction(newTransaction);

    // reset form
    setAmount(0);
    setDescription("");
    setDate(new Date().toISOString().split("T")[0]);
    setRecurrence("none");
  }

  return (
    <div>
      <h2>Add Transaction</h2>

      <select value={type} onChange={(e) => setType(e.target.value as TransactionType)}>
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />

      <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
        {categories
          .filter((cat) => cat.type === type)
          .map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.icon} {cat.name}
            </option>
          ))}
      </select>

      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <select value={recurrence} onChange={(e) => setRecurrence(e.target.value as RecurrenceInterval)}>
        <option value="none">No recurrence</option>
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
        <option value="yearly">Yearly</option>
      </select>

      <button onClick={handleSubmit}>Add Transaction</button>
    </div>
  );
}

export default TransactionForm;