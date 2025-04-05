import { ref, computed } from 'vue';
import type { Ref } from 'vue';

interface PaginationOptions {
  pageSize?: number;
  initialPage?: number;
}

export function usePagination<T>(items: Ref<T[]>, options: PaginationOptions = {}) {
  const { pageSize = 10, initialPage = 1 } = options;
  
  const currentPage = ref(initialPage);
  const pageSizeRef = ref(pageSize);
  
  const totalItems = computed(() => items.value.length);
  
  const totalPages = computed(() => {
    return Math.ceil(totalItems.value / pageSizeRef.value) || 1; // 至少返回1页，避免除以0
  });
  
  const paginatedItems = computed(() => {
    const startIndex = (currentPage.value - 1) * pageSizeRef.value;
    const endIndex = startIndex + pageSizeRef.value;
    return items.value.slice(startIndex, endIndex);
  });
  
  const displayedPages = computed(() => {
    const range: number[] = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage.value - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages.value, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      range.push(i);
    }
    
    return range;
  });
  
  function prevPage() {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  }
  
  function nextPage() {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
    }
  }
  
  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  }
  
  function resetPage() {
    currentPage.value = 1;
  }
  
  return {
    currentPage,
    pageSize: pageSizeRef,
    totalItems,
    totalPages,
    paginatedItems,
    displayedPages,
    prevPage,
    nextPage,
    goToPage,
    resetPage
  };
} 