import { Route, Routes } from "react-router-dom";
import "./App.css";
import Example from "./Example";
import Header from "./Header";
import QueryTableWithReactQueryProvider from "./QueryTable";
import ExampleWithLocalizationProvider from "./ExampleWithLocalizationProvider";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Example />} />
        <Route
          path="queryTable"
          element={<QueryTableWithReactQueryProvider />}
        />
        <Route
          path="advancedTable"
          element={<ExampleWithLocalizationProvider />}
        />
      </Routes>
    </>
  );
}

export default App;
