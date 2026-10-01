import { describe, expect, it } from 'vitest'
import {
  canRequestCheckout,
  deriveCommercePresentation
} from '../src/runtime/core'
import { snapshot } from './fixtures'

describe('commerce presentation', () => {
  it('derives localized labels and display tones', () => {
    const view = deriveCommercePresentation(
      snapshot,
      'ja',
      Date.parse('2026-07-26T00:00:00Z')
    )
    expect(view.payment).toEqual({
      code: 'paid',
      label: '支払い済み',
      tone: 'success'
    })
    expect(view.entitlement.label).toBe('有効')
    expect(view.capabilities).toEqual(snapshot.entitlement.capabilities)
    expect(view.canRequestCheckout).toBe(true)
  })

  it('fails closed when a ready handoff expires', () => {
    expect(canRequestCheckout(
      snapshot,
      Date.parse('2026-08-01T00:00:00Z')
    )).toBe(false)
  })
})

