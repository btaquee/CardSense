import apiService from './api';
import type { Budget, BudgetFormData } from '../types';

class BudgetService {
  async getBudgets(params?: { is_active?: boolean }) {
    return apiService.get<Budget[]>('/budgets/', params);
  }

  async getBudget(id: number) {
    return apiService.get<Budget>(`/budgets/${id}/`);
  }

  async createBudget(data: BudgetFormData) {
    return apiService.post<Budget>('/budgets/', data);
  }

  async updateBudget(id: number, data: Partial<BudgetFormData>) {
    return apiService.put<Budget>(`/budgets/${id}/`, data);
  }

  async deleteBudget(id: number) {
    return apiService.delete(`/budgets/${id}/`);
  }

  async getBudgetStatus(id: number) {
    return apiService.get<{
      budget: Budget;
      spent: number;
      remaining: number;
      percentage_used: number;
      is_exceeded: boolean;
    }>(`/budgets/${id}/status/`);
  }

  async getSummary() {
    return apiService.get<Budget[]>('/budgets/summary/');
  }
}

export const budgetService = new BudgetService();
export default budgetService;

