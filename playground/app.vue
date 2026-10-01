<script setup lang="ts">
import type { CheckoutHandoffRequest } from '../src/runtime/core'
import { commerceState } from './state'

const latestRequest = ref<CheckoutHandoffRequest>()

function receiveRequest(request: CheckoutHandoffRequest): void {
  latestRequest.value = request
}
</script>

<template>
  <main>
    <h1>@nuxtjp/commerce playground</h1>
    <NuxtJpCommerceStatus :state="commerceState" locale="ja" />
    <NuxtJpCheckoutHandoff
      :state="commerceState"
      locale="ja"
      @request="receiveRequest"
    />
    <pre v-if="latestRequest">{{ latestRequest }}</pre>
  </main>
</template>

<style>
main {
  font-family: system-ui, sans-serif;
  margin: 3rem auto;
  max-width: 48rem;
  padding: 0 1rem;
}
</style>

