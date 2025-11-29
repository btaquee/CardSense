import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cardService } from '../../services/card.service';
import { transactionService } from '../../services/transaction.service';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { DollarSign, CreditCard, TrendingUp } from 'lucide-react';

interface CardReward {
  card_id: number;
  card_name: string;
  card_issuer: string;
  rewards_earned: number;
}

const RewardsBreakdown: React.FC = () => {
  const [cardRewards, setCardRewards] = useState<CardReward[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [rewardsResponse, transactionsResponse] = await Promise.all([
        cardService.getCardRewards(),
        transactionService.getTransactions()
      ]);

      if (rewardsResponse.success && rewardsResponse.data) {
        setCardRewards(rewardsResponse.data);
      }

      if (transactionsResponse.success && transactionsResponse.data) {
        setTransactions(transactionsResponse.data);
      }
    } catch (err) {
      setError('Failed to load rewards data');
      console.error('Error loading rewards:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTotalRewards = () => {
    return cardRewards.reduce((sum, card) => sum + card.rewards_earned, 0);
  };

  const getRewardMultiplier = (category: string): number => {
    // This is a simplified version - in production, you'd fetch this from reward rules
    const categoryMultipliers: Record<string, number> = {
      'GROCERIES': 6.0,
      'GAS': 3.0,
      'DINING': 3.0,
      'ONLINE_SHOPPING': 1.0,
      'TRANSIT': 1.0,
      'ENTERTAINMENT': 1.0,
      'PHARMACY': 1.0,
      'OTHER': 1.0
    };
    return categoryMultipliers[category] || 1.0;
  };

  const calculateTransactionReward = (transaction: any): number => {
    const category = transaction.category || 'OTHER';
    const multiplier = getRewardMultiplier(category);
    return (transaction.amount * multiplier) / 100;
  };

  const formatCategoryName = (category: string) => {
    return category.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-xl text-gray-600">Loading rewards...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Rewards Breakdown</h1>
            <p className="text-gray-600">See how you earned your rewards this month</p>
          </div>
          <Link
            to="/dashboard"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Total Rewards Card */}
        <div 
          className="rounded-lg shadow-xl p-8 mb-8"
          style={{ backgroundColor: '#16a34a' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#ffffff', fontSize: '18px', fontWeight: '500', marginBottom: '8px' }}>
                Total Rewards This Month
              </p>
              <h2 style={{ color: '#ffffff', fontSize: '48px', fontWeight: 'bold' }}>
                {formatCurrency(getTotalRewards())}
              </h2>
              <p style={{ color: '#ffffff', fontSize: '16px', marginTop: '8px' }}>
                Based on {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: '24px', borderRadius: '9999px' }}>
              <DollarSign size={64} style={{ color: '#ffffff' }} strokeWidth={2} />
            </div>
          </div>
        </div>

        {/* Rewards by Card */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Rewards by Card</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cardRewards.map((card) => (
              <div
                key={card.card_id}
                className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900">{card.card_name}</h4>
                    <p className="text-sm text-gray-600">{card.card_issuer}</p>
                  </div>
                  <CreditCard className="text-green-600" size={32} />
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-green-900 mb-1">Earned This Month</p>
                  <p className="text-3xl font-bold text-green-600">
                    {formatCurrency(card.rewards_earned)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {cardRewards.length === 0 && (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <TrendingUp size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No rewards yet</h3>
              <p className="text-gray-600 mb-6">
                Add transactions to start earning rewards!
              </p>
              <Link
                to="/transactions/add"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Add Transaction
              </Link>
            </div>
          )}
        </div>

        {/* Recent Rewarding Transactions */}
        {transactions.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Recent Transactions with Rewards</h3>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Merchant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Card
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reward
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.slice(0, 10).map((transaction) => {
                      const reward = calculateTransactionReward(transaction);
                      return (
                        <tr key={transaction.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(transaction.created_at)}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {transaction.merchant}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {transaction.card?.name || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              {formatCategoryName(transaction.category || 'OTHER')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                            {formatCurrency(transaction.amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-green-600">
                            +{formatCurrency(reward)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            {transactions.length > 10 && (
              <div className="mt-4 text-center">
                <Link
                  to="/transactions"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View All Transactions →
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">How Rewards Are Calculated</h3>
          <p className="text-sm text-blue-800 mb-3">
            Your rewards are calculated based on your card's reward rates for each transaction category.
            For example, if your card offers 6% back on groceries and you spend $100 at a grocery store,
            you'll earn $6.00 in rewards.
          </p>
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> Use cards with higher reward rates for specific categories to maximize your earnings!
          </p>
        </div>
      </div>
    </div>
  );
};

export default RewardsBreakdown;

