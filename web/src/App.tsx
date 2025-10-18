import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import PrivateRoute from './components/Layout/PrivateRoute';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/transactions"
          element={
            <PrivateRoute>
              <div className="p-8">
                <h1 className="text-2xl font-bold">Transactions</h1>
                <p className="text-gray-600 mt-2">Transaction management coming soon...</p>
              </div>
            </PrivateRoute>
          }
        />

        <Route
          path="/budgets"
          element={
            <PrivateRoute>
              <div className="p-8">
                <h1 className="text-2xl font-bold">Budgets</h1>
                <p className="text-gray-600 mt-2">Budget management coming soon...</p>
              </div>
            </PrivateRoute>
          }
        />

        <Route
          path="/cards"
          element={
            <PrivateRoute>
              <div className="p-8">
                <h1 className="text-2xl font-bold">Cards</h1>
                <p className="text-gray-600 mt-2">Card management coming soon...</p>
              </div>
            </PrivateRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <PrivateRoute>
              <div className="p-8">
                <h1 className="text-2xl font-bold">Analytics</h1>
                <p className="text-gray-600 mt-2">Analytics dashboard coming soon...</p>
              </div>
            </PrivateRoute>
          }
        />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;

