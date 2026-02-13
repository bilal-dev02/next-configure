# next-configure

Minimal CLI tool to configure Next.js projects quickly and cleanly.

## Install

```bash
npx next-configure
```

Run from your Next.js App Router project root.

## Features

- Detects Next.js App Router project automatically
- Optional shadcn/ui installation
- Creates standard folders: `components`, `hooks`, `utils`
- Detects `src` directory and places folders accordingly
- Generates Tailwind v4 theme from primary and secondary colors
- Automatically creates light and dark color variants
- Overwrites `globals.css` with complete theme system

## CLI Demo

```bash
$ npx next-configure

✔ Detected Next.js project
? Do you want to install shadcn/ui? › yes
✔ Installing shadcn/ui

? Do you want to generate standard development folders? › yes
✔ Created components
✔ Created hooks
✔ Created utils

? Do you want to set color theme? › yes
? Enter primary color (hex without #) › 2563eb
? Enter secondary color (hex without #) › f97316

✔ globals.css overwritten successfully
✔ Setup complete
```

## What It Generates

Creates folders: `components`, `hooks`, `utils` (inside `src/` if it exists, otherwise at root).

Generates theme in `globals.css` with Tailwind v4 imports, CSS variables for primary and secondary colors, light and dark variants, and utility classes like `bg-primary`, `text-primary`, `bg-secondary`, `text-secondary`.

## Requirements

- Node.js 18+
- Next.js 13+ with App Router
- `globals.css` in `app/` or `src/app/`

## Contributing

Contributions welcome. For major changes, open an issue first.

Source code: https://github.com/bilal-dev02/next-configure

## License

MIT
