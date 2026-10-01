import commerce from '../src/module'

export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: [[commerce, { componentPrefix: 'NuxtJp' }]]
})

