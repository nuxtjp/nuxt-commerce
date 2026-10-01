import type { ContractIssue } from '../types'
import {
  checkDateOrder,
  checkEnum,
  checkIdentifier,
  checkTimestamp,
  inspectObject,
  optionalString,
  stringField
} from './primitives'

const states = [
  'unavailable',
  'ready',
  'requested',
  'accepted',
  'expired',
  'cancelled'
] as const
const modes = ['external_checkout', 'local_instructions'] as const

export function validateCheckout(
  value: unknown,
  path: string,
  issues: ContractIssue[]
): void {
  const document = inspectObject(
    value,
    path,
    ['handoffId', 'state', 'mode', 'updatedAt', 'requestedAt', 'expiresAt'],
    ['handoffId', 'state', 'mode', 'updatedAt'],
    issues
  )
  if (!document) return
  const id = stringField(document, 'handoffId', path, issues)
  const state = stringField(document, 'state', path, issues)
  const mode = stringField(document, 'mode', path, issues)
  const updatedAt = stringField(document, 'updatedAt', path, issues)
  const requestedAt = optionalString(document, 'requestedAt', path, issues)
  const expiresAt = optionalString(document, 'expiresAt', path, issues)
  checkIdentifier(id, `${path}.handoffId`, issues)
  checkEnum(state, states, `${path}.state`, issues)
  checkEnum(mode, modes, `${path}.mode`, issues)
  checkTimestamp(updatedAt, `${path}.updatedAt`, issues)
  checkTimestamp(requestedAt, `${path}.requestedAt`, issues)
  checkTimestamp(expiresAt, `${path}.expiresAt`, issues)
  checkDateOrder(requestedAt ?? updatedAt, expiresAt, `${path}.expiresAt`, issues)
}

