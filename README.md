# next-configure

Minimal CLI tool to configure Next.js projects quickly and cleanly.

## Install

Run directly with `npx` from your Next.js project root:

```bash
npx next-configure
```

This should be executed inside an existing Next.js App Router project (where `package.json` with `next` is present).

---

## Overview

`next-configure` automates common setup tasks you usually repeat after running `create-next-app`:

- Detects a valid Next.js App Router project.
- Optionally installs and wires up `shadcn/ui`.
- Creates standard development folders.
- Generates a Tailwind v4–compatible theme in `globals.css` from your brand colors.

The goal is to speed up setup while staying minimal and under your control.

---

## CLI Demo

Example interaction:

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

---

## What It Configures

### Folders

If you opt in:

- When `src/` exists:
  - `src/components`
  - `src/hooks`
  - `src/utils`
- Otherwise:
  - `components`
  - `hooks`
  - `utils`

Existing folders are left as-is; missing ones are created.

### Theme in `globals.css`

If you choose to set a color theme:

- Locates one of:
  - `src/app/globals.css`
  - `app/globals.css`
- Overwrites it with:
  - Tailwind v4–style imports:
    - `@import "tailwindcss";`
    - `@import "tw-animate-css";`
  - A theme based on CSS variables:
    - Primary and secondary colors (from your input).
    - Automatically generated light and dark variants.
  - Utility classes, for example:
    - `bg-primary`, `bg-secondary`
    - `text-primary`, `text-secondary`

If `globals.css` is not found in `app/` or `src/app/`, the CLI exits with a clear error.

---

## Design Principles

- Minimal surface area.
- No enforced application architecture.
- Does not touch layout or routing files.
- Uses a small, focused dependency set.
- All major actions are opt-in via prompts.

---

## Requirements

- Node.js **18+**
- Next.js **13+** with **App Router**
- Tailwind v4-compatible setup with `globals.css` under `app/` or `src/app/`

---

## Contributing

This project is open source. Contributions are welcome.

- For substantial changes, please open an issue first to discuss the direction.
- For small fixes or improvements, submit a pull request with a clear description.

Please keep changes aligned with the goals of being minimal, predictable, and Next.js App Router–focused.

---

## Issues

If you run into a bug or want to request a feature:

- Open an issue on GitHub with:
  - Steps to reproduce (if applicable).
  - Your Node.js and Next.js versions.
  - Any relevant CLI output.

Source code and issue tracker: https://github.com/bilal-dev02/next-configure

---

## License

MIT
