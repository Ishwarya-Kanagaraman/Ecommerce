import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Header from "./components/headers/Header";
import MainPages from "./components/mainpages/Pages";
import { DataProvider } from "./GlobalState";
function App() {
  return (
    <DataProvider>
      <Router>
      <div className="App">
        <Header/>
        <MainPages/>
      </div>
      </Router>
    </DataProvider>
  );
}

export default App;
