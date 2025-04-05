import { defineComponent, h } from 'vue'
import type { PropType } from 'vue'

export const Badge = defineComponent({
  props: {
    variant: {
      type: String as PropType<'success' | 'destructive' | 'default' | 'outline' | 'warning'>,
      default: 'default'
    }
  },
  setup(props, { slots }) {
    return () => h('span', {
      class: `badge badge-${props.variant}`
    }, slots.default?.())
  }
})