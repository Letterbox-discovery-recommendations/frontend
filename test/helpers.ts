import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'

/**
 * Create and activate a Pinia instance for tests.
 * Returns the Pinia instance so tests can access stores.
 */
export function createAndActivatePinia() {
  const pinia = createPinia()
  setActivePinia(pinia)
  return pinia
}

/**
 * Mount a component wrapped inside a Suspense parent and with an active Pinia.
 * - wrapped: the component (SFC) to mount
 * - props: props to pass to the wrapped component
 * - options: { stubs, plugins, pinia }
 * Returns { wrapper, inner, pinia }
 */
export function mountWithPiniaAndSuspense(wrapped: any, props: Record<string, any> = {}, options: any = {}) {
  const pinia = options.pinia || createAndActivatePinia()

  const Parent = defineComponent({
    components: { Wrapped: wrapped },
    props: ['props'],
    template: '<Suspense><Wrapped v-bind="props" /></Suspense>',
  })

  const wrapper = mount(Parent as any, {
    props: { props },
    global: {
      stubs: options.stubs || {},
      plugins: [pinia].concat(options.plugins || []),
    },
  })

  // Find the registered child component by the local name 'Wrapped' so we reliably
  // get the inner component wrapper even when the component is wrapped/renamed.
  let inner = wrapper.findComponent({ name: 'Wrapped' })
  // If the name-based lookup didn't find the child (some SFCs don't expose
  // the local name in the runtime), fall back to finding by the actual
  // component definition that was passed in. This is more robust across
  // different build/test setups.
  if (!inner || inner.exists() === false) {
    inner = wrapper.findComponent(wrapped as any)
  }
  return { wrapper, inner, pinia }
}

export default { createAndActivatePinia, mountWithPiniaAndSuspense }
