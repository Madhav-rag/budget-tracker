import { create } from "zustand";
import {  defaultState, saveState, loadState } from "../types";
import type { AppState, Transaction, Category, Budget } from "../types";

interface StoreActions {
  addTransaction: (t: Transaction) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (c: Category) => void;
  setBudget: (b: Budget) => void;
}

export const useStore = create<AppState & StoreActions>((set) => ({
  ...(loadState() ?? defaultState),

  addTransaction: (t) =>
    set((state) => {
      const next = { ...state, transactions: [...state.transactions, t] };
      saveState(next);
      return next;
    }),

  deleteTransaction: (id) =>
    set((state) => {
      const next = { ...state, transactions: state.transactions.filter((t) => t.id !== id) };
      saveState(next);
      return next;
    }),

  addCategory: (c) =>
    set((state) => {
      const next = { ...state, categories: [...state.categories, c] };
      saveState(next);
      return next;
    }),

  setBudget: (b) =>
    set((state) => {
      const existing = state.budgets.findIndex((x) => x.categoryId === b.categoryId && x.month === b.month);
      const budgets = existing >= 0
        ? state.budgets.map((x, i) => (i === existing ? b : x))
        : [...state.budgets, b];
      const next = { ...state, budgets };
      saveState(next);
      return next;
    }),
}));