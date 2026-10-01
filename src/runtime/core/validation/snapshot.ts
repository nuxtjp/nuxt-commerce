import {
  COMMERCE_SCHEMA,
  type CommerceSnapshot,
  type ContractIssue,
  type ContractValidation
} from '../types'
import { validateCheckout } from './checkout'
import { validateEntitlement } from './entitlement'
import { validatePayment } from './payment'
import {
  addIssue,
  checkIdentifier,
  checkTimestamp,
  inspectObject,
  stringField
} from './primitives'

export class CommerceContractError extends Error {
  readonly issues: readonly ContractIssue[]

  constructor(issues: readonly ContractIssue[]) {
    super(`Invalid commerce state (${issues.length} contract issue(s))`)
    this.name = 'CommerceContractError'
    this.issues = issues
  }
}

export function validateCommerceSnapshot(value: unknown): ContractValidation {
  const issues: ContractIssue[] = []
  const document = inspectObject(
    value,
    '$',
    ['schema', 'subjectId', 'offeringId', 'payment', 'checkout', 'entitlement', 'updatedAt'],
    ['schema', 'subjectId', 'offeringId', 'payment', 'checkout', 'entitlement', 'updatedAt'],
    issues
  )
  if (!document) return { valid: false, issues }
  const schema = stringField(document, 'schema', '$', issues)
  const subjectId = stringField(document, 'subjectId', '$', issues)
  const offeringId = stringField(document, 'offeringId', '$', issues)
  const updatedAt = stringField(document, 'updatedAt', '$', issues)
  if (schema !== undefined && schema !== COMMERCE_SCHEMA) {
    addIssue(issues, '$.schema', 'const', `must equal ${COMMERCE_SCHEMA}`)
  }
  checkIdentifier(subjectId, '$.subjectId', issues)
  checkIdentifier(offeringId, '$.offeringId', issues)
  checkTimestamp(updatedAt, '$.updatedAt', issues)
  validatePayment(document.payment, '$.payment', issues)
  validateCheckout(document.checkout, '$.checkout', issues)
  validateEntitlement(document.entitlement, '$.entitlement', issues)
  if (issues.length) return { valid: false, issues }
  return { valid: true, value: value as CommerceSnapshot }
}

export function isCommerceSnapshot(value: unknown): value is CommerceSnapshot {
  return validateCommerceSnapshot(value).valid
}

export function parseCommerceSnapshot(value: unknown): CommerceSnapshot {
  const result = validateCommerceSnapshot(value)
  if (!result.valid) throw new CommerceContractError(result.issues)
  return result.value
}

