import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { transactionService } from '../../services/transaction.service';
import { cardService } from '../../services/card.service';
import type { UserCard } from '../../types';

const CATEGORY_CHOICES = [
  { value: 'SELECTED_CATEGORIES', label: 'Selected Categories' },
  { value: 'RENT', label: 'Rent' },
  { value: 'ONLINE_SHOPPING', label: 'Online Shopping' },
  { value: 'DINING', label: 'Dining' },
  { value: 'GROCERIES', label: 'Groceries' },
  { value: 'PHARMACY', label: 'Pharmacy' },
  { value: 'GAS', label: 'Gas' },
  { value: 'GENERAL_TRAVEL', label: 'General Travel' },
  { value: 'AIRLINE_TRAVEL', label: 'Airline Travel' },
  { value: 'HOTEL_TRAVEL', label: 'Hotel Travel' },
  { value: 'TRANSIT', label: 'Transit' },
  { value: 'ENTERTAINMENT', label: 'Entertainment' },
  { value: 'OTHER', label: 'Other' },
];

interface Recommendation {
  best_card: {
    card_id: number;
    card_name: string;
  } | null;
  multiplier: number;
  rationale: string;
  top3: Array<{
    card_id: number;
    card_name: string;
    multiplier: number;
  }>;
}

const AddTransaction: React.FC = () => {
  const navigate = useNavigate();
  const [userCards, setUserCards] = useState<UserCard[]>([]);
  const [formData, setFormData] = useState({
    merchant: '',
    amount: '',
    category: '',
    card: '',
    notes: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingCards, setLoadingCards] = useState(true);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [loadingRecommendation, setLoadingRecommendation] = useState(false);

  useEffect(() => {
    loadUserCards();
  }, []);

  const loadUserCards = async () => {
    const response = await cardService.getUserCards();
    if (response.success && response.data) {
      setUserCards(response.data.filter((card) => card.is_active));
    }
    setLoadingCards(false);
  };

  const fetchRecommendation = async (category: string, amount?: string) => {
    if (!category) {
      setRecommendation(null);
      return;
    }
    
    setLoadingRecommendation(true);
    try {
      const response = await transactionService.getCardRecommendation(
        category,
        amount ? parseFloat(amount) : undefined
      );
      
      if (response.success && response.data) {
        setRecommendation(response.data.recommendation);
      }
    } catch (err) {
      console.error('Failed to fetch recommendation:', err);
    } finally {
      setLoadingRecommendation(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.merchant.trim()) {
      setError('Merchant name is required');
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    if (!formData.category) {
      setError('Category is required');
      return;
    }

    // Card is now optional - system will recommend one
    
    setLoading(true);

    try {
      const response = await transactionService.createTransaction({
        merchant: formData.merchant,
        amount: parseFloat(formData.amount),
        category: formData.category,
        card_actually_used: formData.card ? parseInt(formData.card) : undefined,
        notes: formData.notes || undefined,
      });

      if (response.success) {
        navigate('/transactions');
      } else {
        setError(response.error?.message || 'Failed to create transaction');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value,
    });

    // Fetch recommendation when category or amount changes
    if (name === 'category') {
      fetchRecommendation(value, formData.amount);
    } else if (name === 'amount' && formData.category) {
      fetchRecommendation(formData.category, value);
    }
  };

  if (loadingCards) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading cards...</div>
      </div>
    );
  }

  // Force user to add cards first
  if (userCards.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Add Transaction</h1>
              <Link
                to="/dashboard"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Back to Dashboard
              </Link>
            </div>

            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 mb-2">No Cards in Your Wallet</h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                You need to add at least one credit card to your wallet before you can add transactions and get card recommendations.
              </p>
              
              <Link
                to="/cards"
                className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-lg"
              >
                Add Cards to Your Wallet
              </Link>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link
                  to="/dashboard"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  ← Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Add Transaction</h1>
            <Link
              to="/dashboard"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Dashboard
            </Link>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="merchant" className="block text-sm font-medium text-gray-700 mb-1">
                Merchant Name *
              </label>
              <input
                type="text"
                id="merchant"
                name="merchant"
                value={formData.merchant}
                onChange={handleChange}
                required
                placeholder="e.g., Whole Foods, Amazon, Shell"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Amount ($) *
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                step="0.01"
                min="0.01"
                placeholder="0.00"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                {CATEGORY_CHOICES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Card Recommendation Display */}
            {formData.category && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">
                      💳 Recommended Card
                    </h3>
                    {loadingRecommendation ? (
                      <p className="text-sm text-gray-600">Loading recommendation...</p>
                    ) : recommendation && recommendation.best_card ? (
                      <div>
                        <p className="text-base font-bold text-green-700 mb-1">
                          {recommendation.best_card.card_name}
                        </p>
                        <p className="text-sm text-gray-700 mb-2">
                          {recommendation.rationale}
                        </p>
                        {formData.amount && (
                          <p className="text-sm font-semibold text-green-600">
                            Potential Reward: ${((parseFloat(formData.amount) * recommendation.multiplier) / 100).toFixed(2)}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600">
                        No card recommendations available for this category.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Additional details about this transaction..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
              >
                {loading ? 'Adding Transaction...' : 'Add Transaction'}
              </button>
              <Link
                to="/dashboard"
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition font-semibold text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTransaction;

