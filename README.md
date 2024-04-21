# /tg/station handbook

[![Publish on GitHub Pages](https://github.com/Hamcha/tghandbook/actions/workflows/publish.yml/badge.svg)](https://github.com/Hamcha/tghandbook/actions/workflows/publish.yml) [![Lint](https://github.com/Hamcha/tghandbook/actions/workflows/lint.yml/badge.svg)](https://github.com/Hamcha/tghandbook/actions/workflows/lint.yml)

A fancier way to browse the /tg/ wiki. This handbook is a single page application that bundles 20+ pages from the /tg/station wiki, adds some fancy filtering and Nanotrasen styling.

Try it live here: https://hamcha.github.io/tghandbook/

## What does it do

It adapts the pages layout to be narrow as it's meant to be used in a small window, much like a PDA or an in-game book.

The initial focus was on Chemistry, but the handbook is also good if you need to cross-reference multiple guides at the same time thanks to its fuzzy-search functionality, plus it's gonna get better support for other guides _eventually_.

## I found a problem

Cool! Please open an issue about it [here](https://github.com/Hamcha/tghandbook/issues) or alternatively contact me (@Hamcha, I'm on /tg/station's discord server)

## Development

Start hot-reloading server with `npm start`

Build with `npm run build`

Note: While in development mode some compile-time variables (e.g. the changelog data) will use a locally downloaded version (not up to date) to avoid making requests to GitHub API (as the quota is really low).

## Credits & License

The project is licensed under AGPL-v3.0-only (SPDX identifier). Please see the LICENSE file for details.

This project ships exported pages from the /tg/station wiki in `./data/pages`. Those pages have been written by tons of contributors, check the user list here: https://tgstation13.org/wiki/Special:ListUsers