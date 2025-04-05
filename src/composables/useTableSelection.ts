import { ref, computed } from 'vue';

interface SelectionOptions<T> {
  getItemKey?: (item: T) => string | number;
}

export function useTableSelection<T>(items: T[], options: SelectionOptions<T> = {}) {
  const {
    getItemKey = (item: any) => item.id
  } = options;

  const selectedItems = ref<(string | number)[]>([]);

  const isAllSelected = computed(() => {
    return items.length > 0 && items.every(item => selectedItems.value.includes(getItemKey(item)));
  });

  const isPartiallySelected = computed(() => {
    return !isAllSelected.value && selectedItems.value.length > 0;
  });

  const handleSelectAll = (checked: boolean) => {
    selectedItems.value = checked ? items.map(getItemKey) : [];
  };

  const toggleSelection = (item: T) => {
    const key = getItemKey(item);
    const index = selectedItems.value.indexOf(key);
    if (index === -1) {
      selectedItems.value.push(key);
    } else {
      selectedItems.value.splice(index, 1);
    }
  };

  const clearSelection = () => {
    selectedItems.value = [];
  };

  const isSelected = (item: T) => {
    return selectedItems.value.includes(getItemKey(item));
  };

  const getSelectedItems = () => {
    return items.filter(item => selectedItems.value.includes(getItemKey(item)));
  };

  return {
    selectedItems,
    isAllSelected,
    isPartiallySelected,
    handleSelectAll,
    toggleSelection,
    clearSelection,
    isSelected,
    getSelectedItems
  };
} 