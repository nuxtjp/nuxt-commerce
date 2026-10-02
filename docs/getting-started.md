# Using @nuxtjp/commerce

Display payment and entitlement state and request an explicit checkout handoff.

## Before you start

The module does not execute payments or redirect to a provider. The application validates and handles the request.

## First steps

Run from the repository root:

```sh
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test
pnpm build
```

## How to assess the result

- Validate commerce-state documents.
- Render status and emit a bounded handoff request.

A passing source-level check establishes only what that check observes. Keep missing configuration, unavailable services and unverified deployment paths visible.

## Continue reading

[Repository overview](../README.md)
