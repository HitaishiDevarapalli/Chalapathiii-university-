# Research page

Open **Admin → Research & Innovation** to manage the public `/research` page.

The page uses the university's existing navy (`#072A6C`) and gold (`#D4AF37`). The twelve sidebar sections, research update titles and Pre Ph.D. syllabus group follow the supplied reference. On mobile, the section navigation scrolls horizontally.

Select a sidebar section in the editor to change its title, introduction, visibility or order. Use **Publish changes** to save page settings and ordering. Add or edit a research item to publish text, a document link, an optional badge, or an expandable document group. Documents can be assigned to a group in the same section. Use **Choose document from Media Storage** to select an uploaded file, or enter a website path or HTTP(S) URL. Item save, hide/show and delete operations publish immediately; deleting a group also deletes its child entries after confirmation.

The reference supplies document titles, but no PDFs or destination URLs. Those entries display as text until their real documents are attached through admin. Other sidebar sections have honest empty states until university content is added.

Published data is saved to PostgreSQL through the existing authenticated `PUT /api/config/researchContent` endpoint. Public visitors read the same config without browser-local drafts. Open public pages refresh on focus and every 15 seconds while visible. Failed saves retain the editor's changes and show an error. The existing session, CSRF and research edit/publish permission checks protect publication. No database migration or new server route is required.

Legacy browser-local items load into admin when no research config has been published yet. Publish once to make those items available to other devices. The previous placeholder upgrades to live content while preserving saved entries. Maintenance and page visibility remain configurable. Existing `/research/projects`, `/research/publications` and `/research/patents` routes select their corresponding sections.

Verification from the project root:

```powershell
npm run build -- --outDir work/research-build
cd server
npm run build
node tests/research.cjs
```

The test starts an isolated PostgreSQL database and Express server and uses a headless Chrome browser. It never uses production accounts or data. Screenshots are saved under `work/research-qa/`.
