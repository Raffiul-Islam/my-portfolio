This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

## Generate the resume PDF

Install Python 3 and the PDF dependencies once:

```bash
python -m pip install -r scripts/requirements-resume.txt
```

Install [Tectonic](https://tectonic-typesetting.github.io/en-US/install.html),
the LaTeX compiler. The generator finds `tectonic` on PATH, a Windows copy at
`.tools/tectonic/tectonic.exe`, or the executable specified by `TECTONIC`.
This workspace already has a local Windows copy. On a fresh clone, install it
again; the compiler is not committed. The first compilation needs internet
access to download LaTeX packages; subsequent runs reuse Tectonic's cache.
The generator uses the official `tlextras-2022.0r0.tar` bundle directly to avoid
a slow relay redirect. Set `TECTONIC_BUNDLE` to override the URL or use a local bundle.

Then regenerate the resume whenever portfolio content changes:

```bash
npm run resume:generate
```

This generates two one-page PDFs:

- `public/Resume_Raffiul_Islam_With_Photo.pdf`: with the portrait at the top left.
- `public/Resume_Raffiul_Islam_Without_Photo.pdf`: without a portrait.

The preview initially displays the version with a photo and switches to the
selected version when downloading. The Download PDF dropdown offers
**With photo** and **Without photo**. Both download as `Resume-Raffiul Islam.pdf`.
`public/Resume_Raffiul_Islam.pdf` remains a copy of Corporate for existing links.
The portrait is `public/images/resume-photo.jpg`, extracted from the supplied
sample resume. Replace that file to change it. No running Next.js server is needed. Python
must be available as `python`, or set `PYTHON` to its executable path.

Edit the shared content files instead of hardcoding resume content in JSX:

- `data/contacts.json`: contact labels and links, shared with the contact page.
- `data/profile.json`: name, role, employer, location, summary, about text, and
  delivery strengths. The home/contact pages use the corresponding shared fields.
- `data/skills.json`: skill categories, shared with the skills page.
- `data/projects.ts`: all project titles, descriptions, stacks, highlights, and
  live links, shared with the project pages. The generator reads literal fields
  using the TypeScript parser without executing image imports.
- `data/resume.json`: education and references preserved from the previous PDF.
  `experienceHighlights` selects project highlights for the one-page resume:
  each entry names a project, a display label, and zero-based `highlightIndexes`
  from that project's `highlights` array. Employment dates live in `data/profile.json`.

`pages/resume.tsx` displays the generated PDF; it contains no resume source data.
Changes to page styling or unrelated JSX do not change the PDF. The generated
document uses a one-page LaTeX layout modeled on the previous RenderCV PDF:
serif fonts, section rules, selected experience bullets, and two-column references.
The original LaTeX source was unavailable, so this is a recreated template.
Edit `scripts/resume-template.tex` to change typography or spacing. The generated
sources and logs are `.resume-build/resume-corporate.tex` / `.log` and
`.resume-build/resume-software-farm.tex` / `.log`.
Only selected experience highlights are included; all projects remain on the site.
The first successful generation backs up the previous PDF to
`.resume-backups/Resume_Raffiul_Islam.original.pdf` (ignored by Git). Generation
validates links, required sections, photo presence, one-page length, and LaTeX
overflow warnings for both variants before replacing published files. If content becomes too long, shorten it or
select fewer highlights; the previous PDF stays intact. Commit the generated
PDF with content changes; generation is a manual command, not part of the build.

## Run the website

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
