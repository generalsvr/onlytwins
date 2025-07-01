import { useState, useEffect } from 'react';
import { paymentsService } from '@/lib/services/v1/client/payments';
import { PaymentHistoryResponse } from '@/lib/types/payments';

export const usePaymentHistory = (initialData?: PaymentHistoryResponse) => {
  const [data, setData] = useState<PaymentHistoryResponse | null>(initialData || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchHistory = async (page: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await paymentsService.getPaymentsHistory(page);
      setData(response);
      setCurrentPage(page);
    } catch (err) {
      setError('Failed to fetch payment history');
      console.error('Error fetching payment history:', err);
    } finally {
      setLoading(false);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= (data?.totalPages || 1)) {
      fetchHistory(page);
    }
  };

  const nextPage = () => {
    if (currentPage < (data?.totalPages || 1)) {
      goToPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const refresh = () => {
    fetchHistory(currentPage);
  };

  // Инициализируем текущую страницу из пропсов
  useEffect(() => {
    if (initialData) {
      setCurrentPage(initialData.page);
    }
  }, [initialData]);

  return {
    data,
    loading,
    error,
    currentPage,
    totalPages: data?.totalPages || 1,
    totalCount: data?.totalCount || 0,
    goToPage,
    nextPage,
    prevPage,
    refresh,
    hasNextPage: currentPage < (data?.totalPages || 1),
    hasPrevPage: currentPage > 1,
  };
};