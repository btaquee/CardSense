import apiService from './api';
import type { CreditCard, UserCard, CardRecommendation } from '../types';

class CardService {
  // Card database
  async getAllCards(params?: { is_active?: boolean }) {
    return apiService.get<CreditCard[]>('/cards/', params);
  }

  async getCard(id: number) {
    return apiService.get<CreditCard>(`/cards/${id}/`);
  }

  async getCardRewards(id: number) {
    return apiService.get<CreditCard>(`/cards/${id}/rewards/`);
  }

  // User cards
  async getUserCards() {
    return apiService.get<UserCard[]>('/user-cards/');
  }

  async addUserCard(card_id: number, nickname?: string) {
    return apiService.post<UserCard>('/user-cards/', { card_id, nickname });
  }

  async removeUserCard(id: number) {
    return apiService.delete(`/user-cards/${id}/`);
  }

  async setPrimaryCard(id: number) {
    return apiService.put(`/user-cards/${id}/primary/`);
  }

  // Recommendations
  async getRecommendation(params: { amount: number; category_id: number }) {
    return apiService.get<CardRecommendation>('/cards/recommend/', params);
  }

  async compareCards(params: { amount: number; category_id: number; card_ids: number[] }) {
    return apiService.post<CardRecommendation[]>('/cards/compare/', params);
  }
}

export const cardService = new CardService();
export default cardService;

