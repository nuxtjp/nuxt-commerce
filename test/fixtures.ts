import {
  COMMERCE_SCHEMA,
  type CommerceSnapshot
} from '../src/runtime/core'

export const snapshot: CommerceSnapshot = {
  schema: COMMERCE_SCHEMA,
  subjectId: 'subject-001',
  offeringId: 'workflow-standard',
  payment: {
    state: 'paid',
    amountMinor: 120000,
    currency: 'JPY',
    updatedAt: '2026-07-25T00:00:00Z'
  },
  checkout: {
    handoffId: 'handoff-001',
    state: 'ready',
    mode: 'external_checkout',
    updatedAt: '2026-07-25T00:00:00Z',
    expiresAt: '2026-08-01T00:00:00Z'
  },
  entitlement: {
    entitlementId: 'entitlement-001',
    state: 'active',
    capabilities: ['workflow.read', 'workflow.simulate'],
    updatedAt: '2026-07-25T00:00:00Z',
    validFrom: '2026-07-25T00:00:00Z',
    validUntil: '2027-07-25T00:00:00Z'
  },
  updatedAt: '2026-07-25T00:00:00Z'
}

