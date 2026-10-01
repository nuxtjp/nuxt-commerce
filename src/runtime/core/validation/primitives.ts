import type { ContractIssue } from '../types'

export type Document = Record<string, unknown>
export const identifierPattern = /^[a-z0-9](?:[a-z0-9._-]{0,126}[a-z0-9])?$/
export const capabilityPattern = /^[a-z0-9]+(?:[._:-][a-z0-9]+)*$/
const timestampPattern =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(?:Z|[+-](\d{2}):(\d{2}))$/

export function addIssue(
  issues: ContractIssue[],
  path: string,
  code: string,
  message: string
): void {
  issues.push({ path, code, message })
}

export function inspectObject(
  value: unknown,
  path: string,
  allowed: readonly string[],
  required: readonly string[],
  issues: ContractIssue[]
): Document | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    addIssue(issues, path, 'type', 'must be an object')
    return undefined
  }
  const document = value as Document
  for (const key of Object.keys(document)) {
    if (!allowed.includes(key)) {
      addIssue(issues, `${path}.${key}`, 'unknown_field', 'is not allowed')
    }
  }
  for (const key of required) {
    if (!Object.hasOwn(document, key)) {
      addIssue(issues, `${path}.${key}`, 'required', 'is required')
    }
  }
  return document
}

export function stringField(
  document: Document,
  key: string,
  path: string,
  issues: ContractIssue[]
): string | undefined {
  const value = document[key]
  if (typeof value !== 'string' || value.length === 0) {
    addIssue(issues, `${path}.${key}`, 'type', 'must be a non-empty string')
    return undefined
  }
  return value
}

export function optionalString(
  document: Document,
  key: string,
  path: string,
  issues: ContractIssue[]
): string | undefined {
  if (!Object.hasOwn(document, key)) return undefined
  return stringField(document, key, path, issues)
}

export function isTimestamp(value: string): boolean {
  const match = timestampPattern.exec(value)
  if (!match || !Number.isFinite(Date.parse(value))) return false
  const [year, month, day, hour, minute, second] =
    match.slice(1, 7).map(part => Number(part))
  const offsetHour = match[7] === undefined ? undefined : Number(match[7])
  const offsetMinute = match[8] === undefined ? undefined : Number(match[8])
  if (year === undefined || month === undefined || day === undefined
    || hour === undefined || minute === undefined || second === undefined) {
    return false
  }
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate()
  return month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth
    && hour <= 23 && minute <= 59 && second <= 59
    && (offsetHour === undefined || offsetHour <= 23)
    && (offsetMinute === undefined || offsetMinute <= 59)
}

export function checkTimestamp(
  value: string | undefined,
  path: string,
  issues: ContractIssue[]
): void {
  if (value !== undefined && !isTimestamp(value)) {
    addIssue(issues, path, 'format', 'must be an RFC 3339 timestamp')
  }
}

export function checkIdentifier(
  value: string | undefined,
  path: string,
  issues: ContractIssue[]
): void {
  if (value !== undefined && !identifierPattern.test(value)) {
    addIssue(issues, path, 'format', 'must be a stable lowercase identifier')
  }
}

export function checkEnum(
  value: string | undefined,
  allowed: readonly string[],
  path: string,
  issues: ContractIssue[]
): void {
  if (value !== undefined && !allowed.includes(value)) {
    addIssue(issues, path, 'enum', `must be one of: ${allowed.join(', ')}`)
  }
}

export function checkDateOrder(
  start: string | undefined,
  end: string | undefined,
  path: string,
  issues: ContractIssue[]
): void {
  if (start && end && isTimestamp(start) && isTimestamp(end)
    && Date.parse(start) > Date.parse(end)) {
    addIssue(issues, path, 'date_order', 'must not be before its start time')
  }
}
