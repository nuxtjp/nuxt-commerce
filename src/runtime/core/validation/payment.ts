import type { ContractIssue } from '../types'
import {
  addIssue,
  checkEnum,
  checkTimestamp,
  inspectObject,
  optionalString,
  stringField
} from './primitives'

const states = [
  'not_required',
  'unpaid',
  'pending',
  'paid',
  'failed',
  'cancelled',
  'refunded'
] as const

export function validatePayment(
  value: unknown,
  path: string,
  issues: ContractIssue[]
): void {
  const document = inspectObject(
    value,
    path,
    ['state', 'updatedAt', 'amountMinor', 'currency'],
    ['state', 'updatedAt'],
    issues
  )
  if (!document) return
  const state = stringField(document, 'state', path, issues)
  const updatedAt = stringField(document, 'updatedAt', path, issues)
  const currency = optionalString(document, 'currency', path, issues)
  checkEnum(state, states, `${path}.state`, issues)
  checkTimestamp(updatedAt, `${path}.updatedAt`, issues)
  if (currency !== undefined && !/^[A-Z]{3}$/.test(currency)) {
    addIssue(issues, `${path}.currency`, 'format', 'must be an ISO 4217 code')
  }
  const hasAmount = Object.hasOwn(document, 'amountMinor')
  const hasCurrency = Object.hasOwn(document, 'currency')
  if (hasAmount !== hasCurrency) {
    addIssue(issues, path, 'money_pair', 'amountMinor and currency must appear together')
  }
  if (hasAmount && (!Number.isSafeInteger(document.amountMinor)
    || Number(document.amountMinor) < 0)) {
    addIssue(issues, `${path}.amountMinor`, 'type', 'must be a non-negative safe integer')
  }
}

