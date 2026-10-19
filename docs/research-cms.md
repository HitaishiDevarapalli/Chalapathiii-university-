# Research & Innovation component editor

Open **Admin → Research & Innovation**, select a sidebar option, and use **Build this section**. You can create as many sidebar options as you need with **Add sidebar option**; rename, reorder, hide or delete any existing option.

## Build content

Select a component from the library. Edit it in the properties panel. Components can be arranged in any order using their drag handle or up/down buttons, duplicated, hidden or removed. Choose **Add to → Inside: …** or **Add components inside this group** to place components inside an expandable group. Use **Move component to** to move existing content between a group and the main section.

Available components:

- **Heading:** three heading sizes.
- **Text:** multiline paragraphs.
- **Bullet list:** add, remove and reorder individual points. Each bullet supports a description, badge, visibility and click action: no link, a website URL, or an uploaded PDF.
- **Button:** label, navy/outline style, website or PDF destination, and optional new-tab behavior.
- **Image:** direct upload or Media Storage selection, alt text, caption, custom size, placement and optional click destination.
- **Table:** editable rows and columns, merged cells, formatting, widths and spreadsheet/CSV import.
- **Expandable group:** headings and other components inside a collapsible section.
- **Divider** and **Space:** control content separation and vertical spacing.

**Preview** displays the current draft content using the public renderer, including hidden-content behavior; **Phone** applies the mobile photo stacking and heading sizes inside the preview even on a desktop. Use **Save & publish content** or the research editor's **Publish changes** when ready. Component edits stay in the current editor until published. Switching research options retains edits. Leaving/reloading with unsaved edits prompts before discarding them. A failed publication retains your edits and leaves the previous public content in place.

Space heights support exact typed values or a slider, from 8–160 pixels. Number fields apply their limits when you finish typing. Expandable content supports eight nested groups; move destinations account for all children in a group, and dragging a group inside itself is prevented.

Unsaved edits are also kept as a browser recovery draft. After switching admin tabs or reopening the editor, use **Restore draft** to recover them, or **Discard draft** to continue with published content. Recovery drafts are never shown to public visitors. The main workspace **Publish changes** button publishes the active research editor when Research & Innovation is selected.

## PDFs and images

For a bullet or button, set **Click action → PDF document**, then use **Upload PDF** or **Media Storage**. Images have **Upload image** and **Media Storage** controls. An upload is stored once in the shared catalog; other components can reuse the same file. Uploads accept PDF, JPG, PNG, WebP and GIF, up to the existing 10 MB limit. Image uploads are optimized to WebP by the server. Files use permanent `/uploads/...` URLs and PostgreSQL metadata. Publishing is disabled while a file is uploading.

Uploading uses the existing `gallery.create` permission. Research readers can browse existing media; publication requires the existing research edit/publish permissions. Deleting a component or sidebar option does not delete files from Media Storage. Missing destinations and invalid/executable URLs are rejected before publication and independently on the server.

## Flexible tables

In **Admin → Research & Innovation**, select the sidebar section you want to edit, then choose **Table** from Components. The table builder opens automatically. Select an existing table and click **Edit table** to reopen it.

- Use **Programme eligibility template** to start with School, Ph.D. Programme and Minimum Eligibility columns, including the school cells merged vertically like the reference. The eligibility entries are placeholders; enter the approved criteria before publishing.
- Click a cell, then edit **Cell text**. Enter adds a line break. Double-click a cell, or press Enter on it, to focus its text field. Arrow keys move between cells.
- Shift-click or drag across cells to select a rectangle, then choose **Merge selected cells**. **Split merged cells** separates them again. When merging, existing text is joined with line breaks. Splitting keeps that joined text in the first cell; Undo restores the original cells and their separate text.
- On a phone, use **Select through row** and **Select through column** to extend the selection without a keyboard.
- Insert, delete or move rows and columns. Insertions through a merged cell expand its span. Deleting its first row or column keeps its text in the remaining merged cell. Split cells first if a move would break their span. At least one row and one column must remain.
- Set column widths as percentages. Other columns adjust to keep the total at 100%. Choose up to five header rows; merges remain within the header or within the body.
- Apply bold, italic, underline, text alignment, vertical alignment and text/background colours to selected cells. **Clear cell formatting** keeps the text and merges while restoring inherited formatting.
- Adjust the caption, header/background colours, borders, alternate row shading, font size, cell padding and minimum table width. Wide tables scroll horizontally within the public page on a phone.
- Use **Paste spreadsheet / CSV** to import copied Excel/Google Sheets cells or quoted CSV. Multiline cells are supported. Import and the eligibility template replace the current contents; **Undo / Redo** let you recover the previous table while the builder remains open.

Tables support up to **200 rows × 20 columns**. Choose **Done**, review the table in the research canvas, then **Publish changes**. Closing the builder retains your research draft; it does not publish. Table data, merges and formatting use the existing server publishing flow and survive reloads.

Run `npm run test:research-tables` from `server/` for structure and import tests. After building the frontend and backend, `node tests/research-table-browser.cjs` verifies the full editor and public page against isolated test data. Screenshots are under `work/research-qa/tables/`.

## Photo size and placement

Select an image card to open its photo controls. Choose Full width, Medium, Small or **Custom width**. Custom widths support either a percentage of the content area (10–100%) or a pixel width (40–2400 px); the photo always fits within its container. Use the number fields or sliders, or drag the corner handle in the editing canvas. Arrow keys on the handle adjust width in 5% steps.

**Keep original photo proportions** keeps the height automatic. Turn it off for a custom frame height (40–2000 px). **Fill frame** crops the edges without stretching, with left/right and top/bottom crop-focus controls. **Show entire photo** fits the whole image inside the frame without cropping or stretching.

**Photo layout** places the image on its own row or on the left/right beside following text. An image on its own row can align left, centre or right. Wrapped images have an adjustable gap beside text and stack above the following content at phone widths. **Position in section** places the image immediately before or after a named heading, bullet list, button or other component; the existing card drag handle and move-to-group controls are also available. Separate Space above/below sliders control vertical spacing. **Reset photo layout** restores the full-width, original-proportions layout. All settings are saved with the image component and use the same renderer in preview and on the public page.

## Existing content and persistence

Legacy update entries, badges, hidden entries and Pre Ph.D. syllabus groups load as editable components automatically. Nothing needs to be re-entered. Editing a section saves its component array; the public page uses that array while unchanged sections continue reading their legacy entries. Deleted/empty sections do not restore defaults after reload.

Research content is saved through the existing authenticated `PUT /api/config/researchContent` endpoint. Public visitors read the same database content and refresh on focus or every 15 seconds while visible. No database migration is required. Existing research subroutes continue selecting their corresponding sections. The navy (`#072A6C`) and gold (`#D4AF37`) university palette is used throughout.

## Build and verification

This update adds a pinned Zod frontend dependency and research content validation to the existing API. Update both frontend and backend source on the VPS, install the frontend lockfile dependencies, build both, restart the existing `chalapathi-api` process and publish the frontend assets using the existing VPS deployment procedure.

The VPS login shell can default to Node 20 even when the API uses Node 22. Before installing dependencies, load the existing NVM installation with `source /root/.nvm/nvm.sh`, run `nvm use 22`, and check `node --version`. The API supports Node 22 or 24; the frontend Prisma dependency requires Node 22.12+ when using Node 22. Use the `server/` Prisma 5 tooling for API generation. Run `node tests/native-password.cjs` from `server/` before restarting the API, and explicitly select the active Node interpreter with `pm2 restart chalapathi-api --interpreter "$(command -v node)" --update-env`.

The frontend lockfile includes the complete optional bundled WASM dependency tree so `npm ci --include=dev` works with the VPS's npm 10.8.2. Installation plans are checked in a fresh directory for Linux x64 as well as against the existing frontend and backend dependencies. A lockfile mismatch stops deployment before any service restart or frontend publication; pull the corrected lockfile instead of changing dependency versions on the VPS.

From the project root:

```powershell
npm ci
npx tsc --noEmit
npx vite build
cd server
npm run build
node tests/research.cjs
```

The integration test uses isolated PostgreSQL, temporary uploads/accounts, a real Express server and independent admin/visitor browser sessions. It verifies all eight component types, heading sizes, multiline text, individual bullet controls, working navigation, button styles, direct PDF/image uploads, reuse from Media Storage, failed upload recovery, destination validation, exact spacing, drag-and-drop, duplication/removal/visibility for every type, nested group moves and depth limits, publication failures, permissions, responsive layouts and sidebar deletion/empty states. Screenshots are saved under `work/research-qa/`. It never uses production data.
