import {
  COMMERCE_SCHEMA,
  type CommerceSnapshot
} from '../src/runtime/core'

export const commerceState: CommerceSnapshot = {
  schema: COMMERCE_SCHEMA,
  subjectId: 'demo-user',
  offeringId: 'workflow-standard',
  payment: {
    state: 'paid',
    amountMinor: 120000,
    currency: 'JPY',
    updatedAt: '2026-07-25T09:00:00+09:00'
  },
  checkout: {
    handoffId: 'demo-handoff',
    state: 'ready',
    mode: 'external_checkout',
    updatedAt: '2026-07-25T09:00:00+09:00',
    expiresAt: '2030-07-25T09:00:00+09:00'
  },
  entitlement: {
    entitlementId: 'demo-entitlement',
    state: 'active',
    capabilities: ['workflow.read', 'workflow.simulate'],
    updatedAt: '2026-07-25T09:00:00+09:00',
    validFrom: '2026-07-25T09:00:00+09:00',
    validUntil: '2030-07-25T09:00:00+09:00'
  },
  updatedAt: '2026-07-25T09:00:00+09:00'
}

