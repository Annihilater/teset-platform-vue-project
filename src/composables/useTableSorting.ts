import { ref, computed, type Ref, type ComputedRef } from 'vue';

export type SortDirection = 'asc' | 'desc' | null;

interface SortOptions<T> {
  defaultSortKey?: keyof T;
  defaultDirection?: SortDirection;
  customSort?: (a: T, b: T, key: keyof T, direction: SortDirection) => number;
}

export function useTableSorting<T extends object>(
  items: T[],
  options: SortOptions<T> = {}
): {
  sortKey: Ref<keyof T | null>;
  sortDirection: Ref<SortDirection>;
  sortedItems: ComputedRef<T[]>;
  toggleSort: (key: keyof T) => void;
  getSortIcon: (key: keyof T) => string;
  resetSort: () => void;
} {
  const {
    defaultSortKey,
    defaultDirection = null,
    customSort
  } = options;

  const sortKey = ref<keyof T | null>(defaultSortKey ?? null) as Ref<keyof T | null>;
  const sortDirection = ref<SortDirection>(defaultDirection);

  const sortedItems = computed(() => {
    if (!sortKey.value || !sortDirection.value) {
      return items;
    }

    return [...items].sort((a, b) => {
      if (customSort) {
        return customSort(a, b, sortKey.value!, sortDirection.value);
      }

      const aValue = a[sortKey.value! as keyof T];
      const bValue = b[sortKey.value! as keyof T];

      if (aValue === bValue) return 0;
      
      const direction = sortDirection.value === 'asc' ? 1 : -1;
      return aValue > bValue ? direction : -direction;
    });
  });

  const toggleSort = (key: keyof T) => {
    if (sortKey.value === key) {
      if (sortDirection.value === 'asc') {
        sortDirection.value = 'desc';
      } else if (sortDirection.value === 'desc') {
        sortDirection.value = null;
        sortKey.value = null;
      } else {
        sortDirection.value = 'asc';
      }
    } else {
      sortKey.value = key;
      sortDirection.value = 'asc';
    }
  };

  const getSortIcon = (key: keyof T) => {
    if (sortKey.value !== key) return 'none';
    return sortDirection.value || 'none';
  };

  const resetSort = () => {
    sortKey.value = defaultSortKey || null;
    sortDirection.value = defaultDirection;
  };

  return {
    sortKey,
    sortDirection,
    sortedItems,
    toggleSort,
    getSortIcon,
    resetSort
  };
} 