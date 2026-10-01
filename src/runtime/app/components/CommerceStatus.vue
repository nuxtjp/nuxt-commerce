<script setup lang="ts">
import { computed, toRef } from 'vue'
import type { CommerceLocale } from '../../core/types'
import { useCommerceState } from '../composables/useCommerceState'

const props = withDefaults(defineProps<{
  state: unknown
  locale?: CommerceLocale
  title?: string
}>(), {
  locale: 'ja'
})
const locale = computed(() => props.locale)
const commerce = useCommerceState(toRef(props, 'state'), locale)
const text = computed(() => props.locale === 'ja'
  ? {
      title: props.title ?? '利用状況',
      payment: '支払い',
      entitlement: '利用権',
      capabilities: '有効な機能',
      empty: 'なし',
      invalid: 'コマース状態を表示できません'
    }
  : {
      title: props.title ?? 'Commerce status',
      payment: 'Payment',
      entitlement: 'Entitlement',
      capabilities: 'Enabled capabilities',
      empty: 'None',
      invalid: 'Commerce state is unavailable'
    })
</script>

<template>
  <section class="njc-panel" aria-live="polite">
    <h2>{{ text.title }}</h2>
    <p
      v-if="!commerce.presentation.value"
      class="njc-invalid"
      role="status"
    >
      {{ text.invalid }}
    </p>
    <template v-else>
      <dl class="njc-status-grid">
        <div>
          <dt>{{ text.payment }}</dt>
          <dd :data-tone="commerce.presentation.value.payment.tone">
            {{ commerce.presentation.value.payment.label }}
          </dd>
        </div>
        <div>
          <dt>{{ text.entitlement }}</dt>
          <dd :data-tone="commerce.presentation.value.entitlement.tone">
            {{ commerce.presentation.value.entitlement.label }}
          </dd>
        </div>
      </dl>
      <h3>{{ text.capabilities }}</h3>
      <ul v-if="commerce.presentation.value.capabilities.length" class="njc-capabilities">
        <li
          v-for="capability in commerce.presentation.value.capabilities"
          :key="capability"
        >
          {{ capability }}
        </li>
      </ul>
      <p v-else>{{ text.empty }}</p>
    </template>
  </section>
</template>
