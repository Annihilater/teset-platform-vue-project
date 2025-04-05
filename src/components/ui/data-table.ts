import { defineComponent, h } from 'vue'
import type { PropType } from 'vue'

// 定义列和数据的接口
interface TableColumn {
  field: string
  label: string
  [key: string]: any
}

export const DataTable = defineComponent({
  props: {
    columns: {
      type: Array as PropType<TableColumn[]>,
      required: true
    },
    data: {
      type: Array as PropType<Record<string, any>[]>,
      default: () => []
    },
    loading: Boolean,
    sortField: String,
    sortOrder: String
  },
  emits: ['sort-change'],
  setup(props, { emit, slots }) {
    return () => h('div', { class: 'data-table-container' }, [
      h('table', { class: 'data-table' }, [
        h('thead', {}, [
          h('tr', {}, props.columns?.map(column => 
            h('th', {
              class: 'data-table-header',
              onClick: () => {
                const field = column.field
                const order = props.sortField === field && props.sortOrder === 'asc' ? 'desc' : 'asc'
                emit('sort-change', field, order)
              }
            }, column.label)
          ))
        ]),
        h('tbody', {}, props.data?.map(row => 
          h('tr', {}, props.columns?.map(column => 
            h('td', {}, slots[`cell-${column.field}`] 
              ? slots[`cell-${column.field}`]?.({ row })
              : row[column.field]
            )
          ))
        ))
      ]),
      props.loading && h('div', { class: 'data-table-loading' }, '加载中...')
    ])
  }
})