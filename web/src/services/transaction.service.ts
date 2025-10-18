import apiService from './api';
import type { Transaction, TransactionFormData, TransactionCategory } from '../types';

class TransactionService {
  async getTransactions(params?: {
    start_date?: string;
    end_date?: string;
    category_id?: number;
    card_id?: number;
    page?: number;
    page_size?: number;
  }) {
    return apiService.get<Transaction[]>('/transactions/', params);
  }

  async getTransaction(id: number) {
    return apiService.get<Transaction>(`/transactions/${id}/`);
  }

  async createTransaction(data: TransactionFormData) {
    return apiService.post<Transaction>('/transactions/', data);
  }

  async updateTransaction(id: number, data: Partial<TransactionFormData>) {
    return apiService.put<Transaction>(`/transactions/${id}/`, data);
  }

  async deleteTransaction(id: number) {
    return apiService.delete(`/transactions/${id}/`);
  }

  async importCSV(file: File, onProgress?: (progress: number) => void) {
    return apiService.uploadFile<{ rows_processed: number; rows_failed: number; errors?: string[] }>(
      '/transactions/import/',
      file,
      onProgress
    );
  }

  async getCategories() {
    return apiService.get<TransactionCategory[]>('/categories/');
  }

  async getSummary(params?: { start_date?: string; end_date?: string }) {
    return apiService.get('/transactions/summary/', params);
  }

  async exportTransactions(params?: { start_date?: string; end_date?: string; format?: 'csv' | 'pdf' }) {
    return apiService.get('/transactions/export/', params);
  }
}

export const transactionService = new TransactionService();
export default transactionService;

