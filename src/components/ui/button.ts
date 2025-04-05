import { defineComponent, h } from 'vue'

export const Button = defineComponent({
  props: {
    variant: {
      type: String,
      default: 'default'
    },
    size: {
      type: String,
      default: 'default'
    }
  },
  setup(props, { slots }) {
    return () => h('button', {
      class: `btn btn-${props.variant} btn-${props.size}`
    }, slots.default?.())
  }
})
