import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import "./App.css";

const App = () => {
  useEffect(() => {
    document.title = "Test Scraping";
  }, []);
  return (
    <>
      <main className="container mx-auto my-32">
        <Outlet />
      </main>
    </>
  );
};

export default App;
