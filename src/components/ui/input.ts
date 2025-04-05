import { defineComponent, h } from 'vue'

export const Input = defineComponent({
  props: {
    modelValue: String,
    placeholder: String
  },
  emits: ['update:modelValue'],
  setup(props, { emit, slots }) {
    return () => h('div', { class: 'input-container' }, [
      slots.prefix && h('div', { class: 'input-prefix' }, slots.prefix()),
      h('input', {
        class: 'input',
        value: props.modelValue,
        placeholder: props.placeholder,
        onInput: (e: Event) => emit('update:modelValue', (e.target as HTMLInputElement).value)
      }),
      slots.suffix && h('div', { class: 'input-suffix' }, slots.suffix())
    ])
  }
})