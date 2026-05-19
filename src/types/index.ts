
/** ISO 8601 date string, e.g. "2026-05-16" */
type ISODate = string;

/** Unique identifier — use crypto.randomUUID() to generate */
type ID = string; 


// Enums

type TransactionType = "income" | "expense";

type RecurrenceInterval = "none" | "daily" | "weekly" | "monthly" | "yearly";


// Interfaces

interface Category {
  id: ID;
  name: string;
  type: TransactionType;
  color: string;
  icon?: string;
  createdAt: ISODate;
}

interface Transaction {
  id: ID;
  type: TransactionType;
  amount: number;
  categoryId: ID;
  description: string;
  date: ISODate;
  recurrence: RecurrenceInterval;
  createdAt: ISODate;
  updatedAt: ISODate;
}

interface Budget {
  id: ID;
  categoryId: ID;
  month: string;
  limitAmount: number;
  createdAt: ISODate;
}


// computed types 

interface CategorySummary {
  category: Category;
  totalSpent: number;
  budget?: Budget;
  percentUsed?: number;
  isOverBudget: boolean;
}

interface MonthlySummary {
  month: string;
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  categoryBreakdown: CategorySummary[];
}


// App state 

interface AppState {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
}


// localStorage helpers ─ persistence

const STORAGE_KEY = "budget_tracker_v1";

function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState(): AppState | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AppState;
  } catch {
    console.error("Failed to parse saved state");
    return null;
  }
}

const defaultState: AppState = {
  transactions: [],
  budgets: [],
  categories: [
    { id: crypto.randomUUID(), name: "Salary",       type: "income",  color: "#4CAF50", icon: "💼", createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: "Freelance",    type: "income",  color: "#8BC34A", icon: "💻", createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: "Groceries",    type: "expense", color: "#FF9800", icon: "🛒", createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: "Rent",         type: "expense", color: "#F44336", icon: "🏠", createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: "Transport",    type: "expense", color: "#2196F3", icon: "🚌", createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: "Dining out",   type: "expense", color: "#9C27B0", icon: "🍜", createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: "Health",       type: "expense", color: "#00BCD4", icon: "💊", createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: "Entertainment",type: "expense", color: "#E91E63", icon: "🎬", createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: "Mobile & Internet", type: "expense", color: "#607D8B", icon: "📱", createdAt: new Date().toISOString() },
  ],
};


// helper functions

function getTransactionsForMonth(transactions: Transaction[], month: string): Transaction[] {
  return transactions.filter(t => t.date.startsWith(month));
}

function getBudgetsForMonth(budgets: Budget[], month: string): Budget[] {
  return budgets.filter(b => b.month === month);
}

function computeMonthlySummary(month: string, transactions: Transaction[], categories: Category[],
  budgets: Budget[]): MonthlySummary {
  const monthTxns = getTransactionsForMonth(transactions, month);
  const monthBudgets = getBudgetsForMonth(budgets, month);
  //income and expenses for the month
  const totalIncome = monthTxns.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = monthTxns.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);

  const categoryBreakdown: CategorySummary[] = categories.map((cat) => {
    //breaking down total spent and budget for a particular category
    const totalSpent = monthTxns.filter(t => t.categoryId === cat.id).reduce((sum, t) => sum + t.amount, 0);
    const budget = monthBudgets.find(b => b.categoryId === cat.id);

    let percentUsed: number | undefined = 0;
    if (budget != undefined) {
        percentUsed = (totalSpent / budget.limitAmount) * 100;
    } else {
        percentUsed = undefined;
    }

    let isOverBudget: boolean;
    if (budget !== undefined) {
        if (totalSpent > budget.limitAmount) {
            isOverBudget = true;
        } else {
            isOverBudget = false;
        }
    }

    return {
      category: cat,
      totalSpent,
      budget,
      percentUsed,
      isOverBudget: isOverBudget,
    };
  });

  return {
    month,
    totalIncome,
    totalExpenses,
    netBalance: totalIncome - totalExpenses,
    categoryBreakdown,
  };
}

export type {
  ID,
  ISODate,
  TransactionType,
  RecurrenceInterval,
  Category,
  Transaction,
  Budget,
  AppState,
  CategorySummary,
  MonthlySummary,
};

export {
  STORAGE_KEY,
  defaultState,
  saveState,
  loadState,
  getTransactionsForMonth,
  computeMonthlySummary,
};