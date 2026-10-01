import { describe, expect, it } from 'vitest'
import {
  CommerceContractError,
  isCommerceSnapshot,
  parseCommerceSnapshot,
  validateCommerceSnapshot
} from '../src/runtime/core'
import { snapshot } from './fixtures'

describe('commerce contract guard', () => {
  it('accepts the complete provider-neutral snapshot', () => {
    expect(isCommerceSnapshot(snapshot)).toBe(true)
    expect(parseCommerceSnapshot(snapshot)).toBe(snapshot)
    expect(validateCommerceSnapshot(snapshot)).toEqual({
      valid: true,
      value: snapshot
    })
  })

  it.each(['provider', 'token', 'checkoutUrl', 'customerEmail'])(
    'rejects boundary field %s',
    field => {
      const result = validateCommerceSnapshot({ ...snapshot, [field]: 'private' })
      expect(result.valid).toBe(false)
      if (!result.valid) {
        expect(result.issues).toContainEqual(expect.objectContaining({
          path: `$.${field}`,
          code: 'unknown_field'
        }))
      }
    }
  )

  it('rejects incomplete money and duplicate capabilities', () => {
    const result = validateCommerceSnapshot({
      ...snapshot,
      payment: { ...snapshot.payment, currency: undefined },
      entitlement: {
        ...snapshot.entitlement,
        capabilities: ['workflow.read', 'workflow.read']
      }
    })
    expect(result.valid).toBe(false)
    if (!result.valid) {
      expect(result.issues.map(issue => issue.code)).toEqual(
        expect.arrayContaining(['type', 'unique'])
      )
    }
  })

  it('rejects invalid calendar dates and reversed validity', () => {
    const result = validateCommerceSnapshot({
      ...snapshot,
      updatedAt: '2026-02-31T00:00:00Z',
      entitlement: {
        ...snapshot.entitlement,
        validFrom: '2027-01-01T00:00:00Z',
        validUntil: '2026-01-01T00:00:00Z'
      }
    })
    expect(result.valid).toBe(false)
    expect(() => parseCommerceSnapshot(result)).toThrow(CommerceContractError)
  })
})

