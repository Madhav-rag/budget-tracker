import { useStore } from "./store/useStore";

function App() {
  const { categories } = useStore();
  return (
    <div>
      <h1>Budget Tracker</h1>
      <p>{categories.length} categories loaded</p>
    </div>
  );
}

export default App