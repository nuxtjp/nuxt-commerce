# @nuxtjp/commerce

Provider-neutral commerce state contracts and presentation components for
Nuxt 4. The package displays payment and entitlement state, then emits a
checkout handoff **request**. It never performs payment work.

## Boundary

This package contains:

- a versioned JSON Schema and matching TypeScript types;
- fail-closed runtime guards for untrusted state;
- status and checkout-handoff presentation components;
- a composable and pure functions for consumer-owned UI.

It intentionally contains no provider SDK, credential, token, checkout URL,
storage, network request, redirect, or payment execution. A separate
application adapter may handle the emitted request after applying its own
authorization and provider policy.

## Install

```sh
pnpm add ./nuxtjp-commerce-0.1.0.tgz
```

```ts
export default defineNuxtConfig({
  modules: ['@nuxtjp/commerce']
})
```

The optional module setting `componentPrefix` defaults to `NuxtJp`.

## Contract

`CommerceSnapshot` uses schema identifier `nuxtjp://commerce/state/v1` and
contains:

- stable `subjectId` and `offeringId`;
- `payment`: lifecycle state plus optional minor-unit amount and currency;
- `checkout`: handoff lifecycle, mode, timestamps, and a non-secret ID;
- `entitlement`: lifecycle, validity, and capability identifiers;
- an RFC 3339 snapshot timestamp.

Unknown fields are rejected at every level. In particular, provider names,
tokens, secrets, URLs, raw customer data, and executable actions are outside
the contract. See [the published schema](schemas/commerce-state-v1.schema.json).

```ts
import {
  parseCommerceSnapshot,
  validateCommerceSnapshot
} from '@nuxtjp/commerce/core'

const result = validateCommerceSnapshot(input)
if (result.valid) {
  const state = parseCommerceSnapshot(input)
}
```

## Nuxt UI

```vue
<NuxtJpCommerceStatus :state="state" locale="ja" />
<NuxtJpCheckoutHandoff
  :state="state"
  locale="ja"
  @request="sendToApplicationAdapter"
/>
```

`NuxtJpCheckoutHandoff` renders a button only as an intent surface. It emits:

```ts
{
  schema: 'nuxtjp://commerce/checkout-handoff-request/v1',
  intent: 'continue_checkout',
  handoffId,
  subjectId,
  offeringId,
  requestedAt
}
```

It does not navigate or contact any service. Invalid, non-ready, or expired
handoffs remain disabled.

The auto-imported `useCommerceState(source, locale?, now?)` returns computed
`validation`, `snapshot`, and `presentation` values. The optional clock makes
expiry behavior deterministic in tests and simulations.

## Verify locally

```sh
pnpm install --offline
pnpm typecheck
pnpm test
pnpm build
```

The playground is a presentation-only build fixture:

```sh
pnpm nuxt dev playground
```

