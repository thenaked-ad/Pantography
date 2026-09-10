# Pantography Shopify theme

Live storefront: https://pantography.com

## Branches

| Branch | Connect to | Purpose |
|---|---|---|
| `main` | the **live** theme | Mirrors what is published. Merging here goes live. |
| `dev`  | an **unpublished** copy | Staging. Preview here before merging to `main`. |

## Setup in Shopify

Online Store → Themes → Add theme → Connect from GitHub.

1. Connect `main` to the currently live theme.
2. Add theme → Connect from GitHub again, connect `dev` to a new (unpublished) theme.

## Things to know

- Sync is **bidirectional and cannot be disabled**. Any change made in the Shopify
  theme editor is auto-committed back to the connected branch.
- `config/settings_data.json` is the usual conflict point, because the theme editor
  writes to it constantly. Prefer making settings changes in the editor, not in git.
- A branch **cannot be reconnected** once disconnected — it creates a new theme instead.

## History

- `main` — the live theme exactly as exported on 10 Sep 2026. No modifications.
- `dev`  — adds the FLOATING / FLAT segment search fix. See that commit for detail.
