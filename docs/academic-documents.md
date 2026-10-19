# Syllabus & Regulations documents

Open **Admin → Syllabus & Regulations**, then choose **BTech** or **MTech** and **Syllabus** or **Regulations**.

- Enter a title and select a PDF, up to **50 MB per document**.
- Click **Upload & publish**. The document becomes available immediately in the matching public navigation section.
- Add more documents by repeating the upload. Each of the four sections has its own list.
- Use **Edit / replace** to rename a document or replace its PDF. Leaving the file field empty keeps the current PDF.
- Use **Remove** and confirm to delete the document from the website.

Uploads show progress. A success message appears only after the server saves the PDF and document record. Failed uploads display an error and retain the form for retrying. **Reload documents** reloads saved records from the server.

Files live in the backend's existing persistent `UPLOADS_DIR`; metadata lives in PostgreSQL. No database migration is needed. Keep that uploads directory and the database in regular backups. The backend must be running for uploading and public downloads. The existing Nginx configuration permits these upload sizes.

Academic permissions apply: viewing the admin section requires `academics.view`; publishing a new file requires `academics.create` and `academics.publish`; editing requires `academics.edit` and `academics.publish`; removal requires `academics.delete`.

The public pages are `/academics/documents/{btech|mtech}/{syllabus|regulations}`.

From `server/`, run `npm run test:academic-documents` for isolated upload, permissions, exact size boundary, cleanup, CRUD and persistence tests. For the browser workflow, build the frontend, then run the same test with `ACADEMIC_BROWSER_TEST=1` and optionally `CHROME_PATH` pointing to Chrome. Tests use their own temporary database and upload directory.
