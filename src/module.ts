import {
  addComponent,
  addImports,
  createResolver,
  defineNuxtModule
} from '@nuxt/kit'
import type { NuxtModule } from '@nuxt/schema'

export interface ModuleOptions {
  componentPrefix: string
}

const commerceModule: NuxtModule<ModuleOptions> = defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@nuxtjp/commerce',
    configKey: 'nuxtJpCommerce',
    compatibility: { nuxt: '^4.5.0' }
  },
  defaults: {
    componentPrefix: 'NuxtJp'
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)
    addComponent({
      name: `${options.componentPrefix}CommerceStatus`,
      filePath: resolver.resolve('./runtime/app/components/CommerceStatus.vue')
    })
    addComponent({
      name: `${options.componentPrefix}CheckoutHandoff`,
      filePath: resolver.resolve('./runtime/app/components/CheckoutHandoff.vue')
    })
    addImports({
      name: 'useCommerceState',
      from: resolver.resolve('./runtime/app/composables/useCommerceState')
    })
    const stylesheet = resolver.resolve('./runtime/app/assets/commerce.css')
    if (!nuxt.options.css.includes(stylesheet)) nuxt.options.css.push(stylesheet)
  }
})

export default commerceModule
