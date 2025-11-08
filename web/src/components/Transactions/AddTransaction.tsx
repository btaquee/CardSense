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

    if (!formData.card) {
      setError('Card is required');
      return;
    }

    setLoading(true);

    try {
      const response = await transactionService.createTransaction({
        merchant: formData.merchant,
        amount: parseFloat(formData.amount),
        category: formData.category,
        card: parseInt(formData.card),
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loadingCards) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading cards...</div>
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

          {userCards.length === 0 && (
            <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded">
              <p className="font-semibold">No active cards found</p>
              <p className="text-sm mt-1">
                Please add a card to your wallet before creating a transaction.{' '}
                <Link to="/cards" className="underline font-medium">
                  Go to Cards
                </Link>
              </p>
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

            <div>
              <label htmlFor="card" className="block text-sm font-medium text-gray-700 mb-1">
                Card *
              </label>
              <select
                id="card"
                name="card"
                value={formData.card}
                onChange={handleChange}
                required
                disabled={userCards.length === 0}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select a card</option>
                {userCards.map((userCard) => (
                  <option key={userCard.id} value={userCard.card_id}>
                    {userCard.card_name || `Card ${userCard.card_id}`}
                  </option>
                ))}
              </select>
            </div>

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
                disabled={loading || userCards.length === 0}
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

