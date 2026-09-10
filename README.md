# Pantography Shopify theme

Live storefront: https://pantography.com

## Branch

One branch, `main`, connected to the live theme. Anything committed here goes live.

## Setup in Shopify

Online Store, then Themes, then Add theme, then Connect from GitHub. Connect `main` to the live theme.

## Things to know

Sync is bidirectional and cannot be disabled. Any change made in the Shopify theme editor is auto-committed back to `main`.

`config/settings_data.json` is the usual conflict point, because the theme editor rewrites it constantly. Change theme settings in Shopify, not in git.

A branch cannot be reconnected once it has been disconnected. Reconnecting adds a new theme instead. Renaming the theme in Shopify is safe and writes nothing to the repo. Never disconnect.
