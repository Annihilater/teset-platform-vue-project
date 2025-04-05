import { ref, computed } from 'vue';

interface PaginationOptions {
  pageSize?: number;
  initialPage?: number;
}

export function useTablePagination<T>(items: T[], options: PaginationOptions = {}) {
  const {
    pageSize = 10,
    initialPage = 1
  } = options;

  const currentPage = ref(initialPage);

  const totalItems = computed(() => items.length);
  const totalPages = computed(() => Math.ceil(totalItems.value / pageSize));

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    const end = start + pageSize;
    return items.slice(start, end);
  });

  const displayedPages = computed(() => {
    const range = [];
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

  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  };

  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  };

  const resetPage = () => {
    currentPage.value = 1;
  };

  return {
    currentPage,
    pageSize,
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