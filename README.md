# @nuxtjp/commerce

決済・利用権の状態を表示し、明示的な購入手続きへの引き継ぎ要求を作れます。

## 利用前の確認

実装済みの範囲、必要な依存関係、検証コマンドを以下の英語説明に併記しています。操作・配備・公開は、それぞれの権限と設定を確認してから実施してください。

## 使い方

リポジトリ内のサンプル・スキーマ・実装を確認し、用途に必要な入力を明示して利用します。下記のGetting startedに、現行設定に対応する検証コマンドを示しています。

検証結果は実行した範囲だけを示します。未実装の機能、未設定の接続、配備環境の確認を合格扱いにしないでください。

## English

Display payment and entitlement state and request an explicit checkout handoff.

## What you can do

- Validate commerce-state documents.
- Render status and emit a bounded handoff request.

## Current scope

The module does not execute payments or redirect to a provider. The application validates and handles the request.

Package distribution is not activated by this documentation. Use the checked-in source and the declared dependency versions; published availability must be verified separately.

## Getting started

Use `pnpm@10.29.3` and the Node.js version declared in `engines` in `package.json`. Run from this repository:

```sh
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test
pnpm build
```

## Examples and interface details

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

## Documentation and source

[Interface reference](docs/interface-reference.md)

[Usage guide](docs/getting-started.md)

[Schemas](schemas) · [Implementation and public interfaces](src) · [Verification cases](test) · [Contributing](CONTRIBUTING.md) · [Security reporting](SECURITY.md) · [License](LICENSE) · [Attribution notices](NOTICE)
