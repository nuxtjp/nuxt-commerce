import type {
  CommerceLocale,
  CommerceSnapshot,
  EntitlementStatus,
  PaymentStatus
} from './types'

export type CommerceTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger'

export interface CommerceStatusView {
  readonly code: string
  readonly label: string
  readonly tone: CommerceTone
}

export interface CommercePresentation {
  readonly payment: CommerceStatusView
  readonly entitlement: CommerceStatusView
  readonly capabilities: readonly string[]
  readonly canRequestCheckout: boolean
}

const paymentLabels: Record<CommerceLocale, Record<PaymentStatus, string>> = {
  ja: {
    not_required: '支払い不要',
    unpaid: '未払い',
    pending: '処理中',
    paid: '支払い済み',
    failed: '失敗',
    cancelled: 'キャンセル済み',
    refunded: '返金済み'
  },
  en: {
    not_required: 'No payment required',
    unpaid: 'Unpaid',
    pending: 'Pending',
    paid: 'Paid',
    failed: 'Failed',
    cancelled: 'Cancelled',
    refunded: 'Refunded'
  }
}
const entitlementLabels: Record<CommerceLocale, Record<EntitlementStatus, string>> = {
  ja: {
    inactive: '無効',
    trial: '試用中',
    active: '有効',
    grace_period: '猶予期間',
    suspended: '停止中',
    expired: '期限切れ',
    revoked: '失効'
  },
  en: {
    inactive: 'Inactive',
    trial: 'Trial',
    active: 'Active',
    grace_period: 'Grace period',
    suspended: 'Suspended',
    expired: 'Expired',
    revoked: 'Revoked'
  }
}

const paymentTones: Record<PaymentStatus, CommerceTone> = {
  not_required: 'neutral',
  unpaid: 'warning',
  pending: 'info',
  paid: 'success',
  failed: 'danger',
  cancelled: 'neutral',
  refunded: 'neutral'
}
const entitlementTones: Record<EntitlementStatus, CommerceTone> = {
  inactive: 'neutral',
  trial: 'info',
  active: 'success',
  grace_period: 'warning',
  suspended: 'danger',
  expired: 'neutral',
  revoked: 'danger'
}

export function canRequestCheckout(
  snapshot: CommerceSnapshot,
  now = Date.now()
): boolean {
  const handoff = snapshot.checkout
  if (handoff.state !== 'ready') return false
  return handoff.expiresAt === undefined || Date.parse(handoff.expiresAt) > now
}

export function deriveCommercePresentation(
  snapshot: CommerceSnapshot,
  locale: CommerceLocale = 'ja',
  now = Date.now()
): CommercePresentation {
  const payment = snapshot.payment.state
  const entitlement = snapshot.entitlement.state
  return {
    payment: { code: payment, label: paymentLabels[locale][payment], tone: paymentTones[payment] },
    entitlement: {
      code: entitlement,
      label: entitlementLabels[locale][entitlement],
      tone: entitlementTones[entitlement]
    },
    capabilities: snapshot.entitlement.capabilities,
    canRequestCheckout: canRequestCheckout(snapshot, now)
  }
}

