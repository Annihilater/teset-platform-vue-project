import type { DirectiveBinding, ObjectDirective } from 'vue';

interface ClickOutsideElement extends HTMLElement {
  _clickOutside?: {
    callback: (event: MouseEvent) => void;
    handler: (event: MouseEvent) => void;
  };
}

const clickOutside: ObjectDirective = {
  mounted(el: ClickOutsideElement, binding: DirectiveBinding) {
    const handler = (e: MouseEvent) => {
      if (!el.contains(e.target as Node) && el !== e.target) {
        binding.value(e);
      }
    };
    
    el._clickOutside = {
      handler,
      callback: binding.value
    };
    
    document.addEventListener('click', handler);
  },
  
  unmounted(el: ClickOutsideElement) {
    if (el._clickOutside) {
      document.removeEventListener('click', el._clickOutside.handler);
      delete el._clickOutside;
    }
  }
};

export default clickOutside; 