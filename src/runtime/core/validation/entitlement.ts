import type { ContractIssue } from '../types'
import {
  addIssue,
  capabilityPattern,
  checkDateOrder,
  checkEnum,
  checkIdentifier,
  checkTimestamp,
  inspectObject,
  optionalString,
  stringField
} from './primitives'

const states = [
  'inactive',
  'trial',
  'active',
  'grace_period',
  'suspended',
  'expired',
  'revoked'
] as const

export function validateEntitlement(
  value: unknown,
  path: string,
  issues: ContractIssue[]
): void {
  const document = inspectObject(
    value,
    path,
    ['entitlementId', 'state', 'capabilities', 'updatedAt', 'validFrom', 'validUntil'],
    ['entitlementId', 'state', 'capabilities', 'updatedAt'],
    issues
  )
  if (!document) return
  const id = stringField(document, 'entitlementId', path, issues)
  const state = stringField(document, 'state', path, issues)
  const updatedAt = stringField(document, 'updatedAt', path, issues)
  const validFrom = optionalString(document, 'validFrom', path, issues)
  const validUntil = optionalString(document, 'validUntil', path, issues)
  checkIdentifier(id, `${path}.entitlementId`, issues)
  checkEnum(state, states, `${path}.state`, issues)
  checkTimestamp(updatedAt, `${path}.updatedAt`, issues)
  checkTimestamp(validFrom, `${path}.validFrom`, issues)
  checkTimestamp(validUntil, `${path}.validUntil`, issues)
  checkDateOrder(validFrom, validUntil, `${path}.validUntil`, issues)
  validateCapabilities(document.capabilities, `${path}.capabilities`, issues)
}

function validateCapabilities(
  value: unknown,
  path: string,
  issues: ContractIssue[]
): void {
  if (!Array.isArray(value) || value.some(item => typeof item !== 'string')) {
    addIssue(issues, path, 'type', 'must be an array of capability identifiers')
    return
  }
  const capabilities = value as string[]
  if (new Set(capabilities).size !== capabilities.length) {
    addIssue(issues, path, 'unique', 'must not contain duplicates')
  }
  capabilities.forEach((capability, index) => {
    if (!capabilityPattern.test(capability)) {
      addIssue(issues, `${path}[${index}]`, 'format', 'must be a capability identifier')
    }
  })
}

