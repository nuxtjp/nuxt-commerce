import { describe, expect, it } from 'vitest'
import {
  CHECKOUT_REQUEST_SCHEMA,
  CommerceContractError,
  createCheckoutHandoffRequest
} from '../src/runtime/core'
import { snapshot } from './fixtures'

describe('checkout handoff request', () => {
  it('emits only a provider-neutral application intent', () => {
    const request = createCheckoutHandoffRequest(
      snapshot,
      '2026-07-26T00:00:00Z'
    )
    expect(request).toEqual({
      schema: CHECKOUT_REQUEST_SCHEMA,
      intent: 'continue_checkout',
      handoffId: 'handoff-001',
      subjectId: 'subject-001',
      offeringId: 'workflow-standard',
      requestedAt: '2026-07-26T00:00:00Z'
    })
    expect(Object.isFrozen(request)).toBe(true)
    expect(Object.keys(request)).not.toContain('url')
    expect(Object.keys(request)).not.toContain('provider')
  })

  it('rejects unavailable and expired handoffs', () => {
    expect(() => createCheckoutHandoffRequest({
      ...snapshot,
      checkout: { ...snapshot.checkout, state: 'unavailable' }
    }, '2026-07-26T00:00:00Z')).toThrow(CommerceContractError)
    expect(() => createCheckoutHandoffRequest(
      snapshot,
      '2026-08-01T00:00:00Z'
    )).toThrow(CommerceContractError)
  })
})

