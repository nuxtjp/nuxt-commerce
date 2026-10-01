import { describe, expect, it } from 'vitest'
import Ajv2020 from 'ajv/dist/2020'
import schema from '../schemas/commerce-state-v1.schema.json'
import { snapshot } from './fixtures'

describe('published commerce JSON Schema', () => {
  const validate = new Ajv2020({ strict: true }).compile(schema)

  it('accepts the shared fixture', () => {
    expect(validate(snapshot), JSON.stringify(validate.errors)).toBe(true)
  })

  it('rejects executable and secret-bearing additions', () => {
    const unsafe = {
      ...snapshot,
      checkout: {
        ...snapshot.checkout,
        checkoutUrl: 'https://payments.example/secret'
      }
    }
    expect(validate(unsafe)).toBe(false)
    expect(validate({ ...snapshot, providerToken: 'secret' })).toBe(false)
  })

  it('requires money fields as a pair', () => {
    const invalid = {
      ...snapshot,
      payment: {
        state: 'paid',
        amountMinor: 100,
        updatedAt: snapshot.payment.updatedAt
      }
    }
    expect(validate(invalid)).toBe(false)
  })
})

