import {
  computed,
  toValue,
  type MaybeRefOrGetter
} from 'vue'
import type { CommerceLocale } from '../../core/types'
import {
  deriveCommercePresentation,
  validateCommerceSnapshot
} from '../../core'

export function useCommerceState(
  source: MaybeRefOrGetter<unknown>,
  locale: MaybeRefOrGetter<CommerceLocale> = 'ja',
  now: MaybeRefOrGetter<number> = () => Date.now()
) {
  const validation = computed(() => validateCommerceSnapshot(toValue(source)))
  const snapshot = computed(() => {
    const result = validation.value
    return result.valid ? result.value : undefined
  })
  const presentation = computed(() => {
    const value = snapshot.value
    return value
      ? deriveCommercePresentation(value, toValue(locale), toValue(now))
      : undefined
  })

  return {
    validation,
    snapshot,
    presentation
  }
}

