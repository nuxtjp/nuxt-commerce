import {
  CHECKOUT_REQUEST_SCHEMA,
  type CheckoutHandoffRequest
} from './types'
import { canRequestCheckout } from './presentation'
import {
  CommerceContractError,
  parseCommerceSnapshot
} from './validation/snapshot'
import { isTimestamp } from './validation/primitives'

export function createCheckoutHandoffRequest(
  value: unknown,
  requestedAt = new Date().toISOString()
): CheckoutHandoffRequest {
  const snapshot = parseCommerceSnapshot(value)
  if (!isTimestamp(requestedAt)) {
    throw new CommerceContractError([{
      path: '$.requestedAt',
      code: 'format',
      message: 'must be an RFC 3339 timestamp'
    }])
  }
  if (!canRequestCheckout(snapshot, Date.parse(requestedAt))) {
    throw new CommerceContractError([{
      path: '$.checkout.state',
      code: 'handoff_unavailable',
      message: 'must be ready and unexpired'
    }])
  }
  return Object.freeze({
    schema: CHECKOUT_REQUEST_SCHEMA,
    intent: 'continue_checkout',
    handoffId: snapshot.checkout.handoffId,
    subjectId: snapshot.subjectId,
    offeringId: snapshot.offeringId,
    requestedAt
  })
}

