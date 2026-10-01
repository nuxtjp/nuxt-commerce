<script setup lang="ts">
import { computed, toRef } from 'vue'
import {
  createCheckoutHandoffRequest,
  type CheckoutHandoffRequest,
  type CommerceLocale
} from '../../core'
import { useCommerceState } from '../composables/useCommerceState'

const props = withDefaults(defineProps<{
  state: unknown
  locale?: CommerceLocale
  label?: string
}>(), {
  locale: 'ja'
})
const emit = defineEmits<{
  request: [request: CheckoutHandoffRequest]
}>()
const locale = computed(() => props.locale)
const commerce = useCommerceState(toRef(props, 'state'), locale)
const buttonLabel = computed(() => props.label
  ?? (props.locale === 'ja' ? 'チェックアウトへ進む' : 'Continue to checkout'))

function requestHandoff(): void {
  if (!commerce.presentation.value?.canRequestCheckout) return
  emit('request', createCheckoutHandoffRequest(props.state))
}
</script>

<template>
  <button
    class="njc-handoff"
    type="button"
    :disabled="!commerce.presentation.value?.canRequestCheckout"
    @click="requestHandoff"
  >
    {{ buttonLabel }}
  </button>
</template>
