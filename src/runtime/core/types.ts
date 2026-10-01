export const COMMERCE_SCHEMA = 'nuxtjp://commerce/state/v1' as const
export const CHECKOUT_REQUEST_SCHEMA =
  'nuxtjp://commerce/checkout-handoff-request/v1' as const

export type CommerceLocale = 'ja' | 'en'
export type PaymentStatus =
  | 'not_required'
  | 'unpaid'
  | 'pending'
  | 'paid'
  | 'failed'
  | 'cancelled'
  | 'refunded'
export type CheckoutStatus =
  | 'unavailable'
  | 'ready'
  | 'requested'
  | 'accepted'
  | 'expired'
  | 'cancelled'
export type EntitlementStatus =
  | 'inactive'
  | 'trial'
  | 'active'
  | 'grace_period'
  | 'suspended'
  | 'expired'
  | 'revoked'

export interface PaymentState {
  readonly state: PaymentStatus
  readonly updatedAt: string
  readonly amountMinor?: number
  readonly currency?: string
}

export interface CheckoutHandoff {
  readonly handoffId: string
  readonly state: CheckoutStatus
  readonly mode: 'external_checkout' | 'local_instructions'
  readonly updatedAt: string
  readonly requestedAt?: string
  readonly expiresAt?: string
}

export interface EntitlementState {
  readonly entitlementId: string
  readonly state: EntitlementStatus
  readonly capabilities: readonly string[]
  readonly updatedAt: string
  readonly validFrom?: string
  readonly validUntil?: string
}

export interface CommerceSnapshot {
  readonly schema: typeof COMMERCE_SCHEMA
  readonly subjectId: string
  readonly offeringId: string
  readonly payment: PaymentState
  readonly checkout: CheckoutHandoff
  readonly entitlement: EntitlementState
  readonly updatedAt: string
}

export interface CheckoutHandoffRequest {
  readonly schema: typeof CHECKOUT_REQUEST_SCHEMA
  readonly intent: 'continue_checkout'
  readonly handoffId: string
  readonly subjectId: string
  readonly offeringId: string
  readonly requestedAt: string
}

export interface ContractIssue {
  readonly path: string
  readonly code: string
  readonly message: string
}

export type ContractValidation =
  | { readonly valid: true; readonly value: CommerceSnapshot }
  | { readonly valid: false; readonly issues: readonly ContractIssue[] }

