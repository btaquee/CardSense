import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { budgetService } from '../../services/budget.service';
import { formatCurrency } from '../../utils/formatters';
import { TrendingUp, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';

const BudgetList: React.FC = () => {
  const navigate = useNavigate();
  const [currentBudget, setCurrentBudget] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = async () => {
    try {
      setLoading(true);
      const response = await budgetService.getCurrentBudget();
      console.log('Budget response:', response);
      if (response.success && response.data) {
        setCurrentBudget(response.data);
      }
    } catch (err) {
      setError('Failed to load budgets');
      console.error('Error loading budgets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this budget? This action cannot be undone.')) {
      return;
    }

    try {
      setError('');
      const now = new Date();
      const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      const response = await budgetService.deleteBudget(yearMonth);
      
      if (response.success) {
        setSuccess('Budget deleted successfully!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setError('Failed to delete budget');
      }
    } catch (err) {
      setError('Failed to delete budget');
      console.error('Error deleting budget:', err);
    }
  };

  const getStatusColor = (percentUsed: number) => {
    if (percentUsed >= 100) return 'bg-red-500';
    if (percentUsed >= 90) return 'bg-orange-500';
    if (percentUsed >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusText = (percentUsed: number) => {
    if (percentUsed >= 100) return 'Over Budget!';
    if (percentUsed >= 90) return 'Critical (90%+)';
    if (percentUsed >= 70) return 'Warning (70%+)';
    if (percentUsed >= 50) return 'On Track';
    return 'Good';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-xl text-gray-600">Loading budgets...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Budget Management</h1>
            <p className="text-gray-600">Track your monthly spending and stay on budget</p>
          </div>
          <Link
            to="/budgets/create"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Create Budget
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        {/* Current Budget */}
        {currentBudget && currentBudget.budget ? (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Current Month's Budget</h2>
                <p className="text-gray-600 mt-1">
                  {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-gray-600">Budget Amount</div>
                  <div className="text-3xl font-bold text-gray-900">
                    {formatCurrency(currentBudget.budget)}
                  </div>
                </div>
                <button
                  onClick={handleDelete}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  title="Delete Budget"
                >
                  <Trash2 size={18} className="mr-2" />
                  Delete
                </button>
              </div>
            </div>

            {/* Progress Section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Spent: {formatCurrency(currentBudget.mtd)}
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {(currentBudget.percent_used * 100).toFixed(1)}% used
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className={`h-4 rounded-full transition-all ${getStatusColor(currentBudget.percent_used * 100)}`}
                  style={{ width: `${Math.min(currentBudget.percent_used * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Spent</div>
                <div className="text-xl font-bold text-gray-900">
                  {formatCurrency(currentBudget.mtd)}
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Remaining</div>
                <div className="text-xl font-bold text-green-600">
                  {formatCurrency(currentBudget.budget - currentBudget.mtd)}
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Status</div>
                <div className={`text-lg font-semibold ${
                  currentBudget.percent_used * 100 >= 90 ? 'text-red-600' :
                  currentBudget.percent_used * 100 >= 70 ? 'text-orange-600' :
                  'text-green-600'
                }`}>
                  {getStatusText(currentBudget.percent_used * 100)}
                </div>
              </div>
            </div>

            {/* Threshold Indicators */}
            <div className="border-t pt-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Alert Thresholds</h3>
              <div className="space-y-2">
                {[50, 70, 90].map((threshold) => {
                  const reached = currentBudget.percent_used * 100 >= threshold;
                  return (
                    <div key={threshold} className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        {reached ? (
                          <CheckCircle className="text-orange-500 mr-2" size={16} />
                        ) : (
                          <div className="w-4 h-4 mr-2 border-2 border-gray-300 rounded-full"></div>
                        )}
                        <span className={reached ? 'text-gray-900 font-medium' : 'text-gray-600'}>
                          {threshold}% threshold ({formatCurrency(currentBudget.budget * (threshold / 100))})
                        </span>
                      </div>
                      {reached && (
                        <span className="text-orange-600 text-xs">Reached</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <TrendingUp size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No budget set for this month</h3>
            <p className="text-gray-600 mb-6">Create a monthly budget to track your spending</p>
            <Link
              to="/budgets/create"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Create Budget
            </Link>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <AlertCircle className="text-blue-600 mr-3 mt-1 flex-shrink-0" size={24} />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">How Budgets Work</h3>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Set one budget amount per month</li>
                <li>All transactions automatically count toward your budget</li>
                <li>Get alerts at custom thresholds (defaults: 50%, 70%, and 90%)</li>
                <li>Create a new budget each month to keep tracking</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Back to Dashboard */}
        <div className="mt-8 text-center">
          <Link
            to="/dashboard"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BudgetList;

