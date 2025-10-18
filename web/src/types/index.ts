// User Types
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
  last_login?: string;
}

export interface UserProfile {
  id: number;
  user_id: number;
  phone?: string;
  notification_preferences: Record<string, boolean>;
  theme_preference: string;
}

// Transaction Types
export interface Transaction {
  id: number;
  user_id: number;
  amount: number;
  date: string;
  category_id: number;
  category?: TransactionCategory;
  card_id?: number;
  card?: CreditCard;
  merchant: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface TransactionCategory {
  id: number;
  name: string;
  icon: string;
  color: string;
  description?: string;
}

export interface TransactionFormData {
  amount: number;
  date: string;
  category_id: number;
  card_id?: number;
  merchant: string;
  notes?: string;
}

// Budget Types
export interface Budget {
  id: number;
  user_id: number;
  category_id: number;
  category?: TransactionCategory;
  amount: number;
  period: string;
  start_date: string;
  end_date: string;
  alert_threshold: number;
  is_active: boolean;
  spent?: number;
  remaining?: number;
  percentage_used?: number;
}

export interface BudgetFormData {
  category_id: number;
  amount: number;
  period: string;
  start_date: string;
  end_date: string;
  alert_threshold: number;
}

// Credit Card Types
export interface CreditCard {
  id: number;
  name: string;
  issuer: string;
  annual_fee: number;
  image_url?: string;
  description?: string;
  is_active: boolean;
  reward_rules?: RewardRule[];
}

export interface UserCard {
  id: number;
  user_id: number;
  card_id: number;
  card?: CreditCard;
  nickname?: string;
  added_date: string;
  is_primary: boolean;
}

export interface RewardRule {
  id: number;
  card_id: number;
  category_id: number;
  category?: TransactionCategory;
  reward_type: string;
  reward_value: number;
  cap_amount?: number;
  cap_period?: string;
  start_date?: string;
  end_date?: string;
}

export interface CardRecommendation {
  card: CreditCard;
  potential_reward: number;
  reward_type: string;
  reason: string;
}

// Alert Types
export interface Alert {
  id: number;
  user_id: number;
  alert_type: string;
  title: string;
  message: string;
  priority: string;
  created_at: string;
  is_read: boolean;
  action_url?: string;
}

// Recommendation Types
export interface Recommendation {
  id: number;
  user_id: number;
  recommendation_type: string;
  card_id?: number;
  card?: CreditCard;
  category_id?: number;
  category?: TransactionCategory;
  potential_value: number;
  reason: string;
  created_at: string;
  is_dismissed: boolean;
}

// Analytics Types
export interface SpendingAnalytics {
  period: string;
  total_spent: number;
  total_rewards: number;
  category_breakdown: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  card_usage_stats: Array<{
    card: string;
    transactions: number;
    amount: number;
    rewards: number;
  }>;
}

export interface DashboardData {
  summary: {
    total_spent_this_month: number;
    total_rewards_this_month: number;
    active_budgets: number;
    budget_alerts: number;
  };
  recent_transactions: Transaction[];
  budget_status: Budget[];
  spending_trends: Array<{
    date: string;
    amount: number;
  }>;
  top_cards: UserCard[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

