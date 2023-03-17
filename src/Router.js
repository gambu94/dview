import React, { Suspense, lazy } from "react";
import { history } from "./history";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Footer from "./components/Footer";
import Header from "./components/Header";

export const AppRouter = () => {
  return (
    <Router history={history}>
      <Header />
      <div className="container-fluid">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/home" element={<Home />} />
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};
