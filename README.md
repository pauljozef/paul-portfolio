# Paul Joseph — complete website and hosting guide

Exported 24 September 2026 from the latest published website.
Source revision: 555c5896934e84a41a43a7751493d3fbcc36c789

This includes the latest TL;DR, PSPO I™ wording, centered About column with left-aligned paragraphs, SVG arrows, expandable projects, Carbone gallery, images and PDFs.
This is a complete static website. There is no database, API key, npm install, or build step.

## What the files do

- index.html: all page text, sections, links and image references.
- styles.css: colors, layout, typography and mobile appearance.
- script.js: menus, accordion animations, scrolling and interactive behavior.
- assets/: every local image, logo, CV and research PDF.
- README.md: this guide.
- .nojekyll: tells GitHub to serve the files directly.

The export uses relative local file links so it also works under a GitHub project URL.
Design and content match the published version. The original Sites hosting configuration and Git credentials are not required and are excluded.

## Recommended setup

Use GitHub Pages to host the website. Keep pauljoseph.co registered at GoDaddy.
Think of the website as a house, hosting as the land, and pauljoseph.co as its address.
GitHub Pages supports free hosting from public repositories. Your uploaded code and portfolio assets will be public.
You do not need to buy GoDaddy hosting for this route. Keep renewing your domain at GoDaddy.

## 1. Put the code on GitHub

1. Download this ZIP and use Extract All on Windows (or double-click on Mac).
2. Open the extracted folder. You should see index.html, styles.css, script.js and assets.
3. Sign in or create an account at https://github.com.
4. Select +, then New repository. A repository is simply your project's online folder.
5. Name it paul-portfolio, select Public, and create it.
6. On the empty repository screen, choose “uploading an existing file”. If it already has files, choose Add file > Upload files.
7. Drag the extracted CONTENTS into the upload area, including the whole assets folder. Do not upload the ZIP itself or put everything inside another folder.
8. Click Commit changes. This means “save this version”.
9. Check that index.html appears directly on the repository's first screen. Keep the assets folder and its subfolders intact.

## 2. Switch on GitHub Pages

1. In the repository, open Settings > Pages.
2. Under Build and deployment, choose Deploy from a branch.
3. Select main and /(root), then Save.
4. Check the Actions tab for a successful Pages deployment.
5. Return to Settings > Pages and open the Visit site link.

For a repository called paul-portfolio, the temporary address is usually:
https://YOUR-USERNAME.github.io/paul-portfolio/

Replace YOUR-USERNAME with your real GitHub username, not your display name.
Check the photos, CV download, mobile menu and expandable sections before connecting the domain.

## 3. Connect pauljoseph.co

First, in repository Settings > Pages, save pauljoseph.co under Custom domain.
Then, in GoDaddy, open Domain Portfolio > pauljoseph.co > DNS.

Set these website records. Each A row is a separate record.

| Type | Name | Value |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | YOUR-USERNAME.github.io |

Use the default TTL. The www value has no https:// and no /paul-portfolio/.
Replace old website A records at @ and the old www record; remove stale website AAAA records pointing elsewhere. Keep email MX/TXT records.
If GoDaddy says DNS is managed elsewhere, make these changes at the displayed DNS provider.

Return to GitHub Pages settings. Once the check passes and HTTPS becomes available, enable Enforce HTTPS.
Allow up to 48 hours for DNS updates worldwide; then check https://pauljoseph.co and https://www.pauljoseph.co.
GitHub creates a CNAME file when you save the custom domain for this branch setup. Preserve it during later uploads.
No domain transfer or domain forwarding is needed.

## 4. Change the website later

For a small wording change:
1. Open your GitHub repository.
2. Open index.html and select the pencil icon.
3. Find the old words and carefully replace only those words.
4. Click Commit changes and save to main.
5. Wait for the Pages deployment to finish, then refresh pauljoseph.co.

For design changes, edit styles.css. For behavior changes, edit script.js.
For a new CV, replace assets/Paul-Joseph-CV.pdf with the new PDF using the same filename.
For larger updates, upload the changed files to the same repository paths.

Changes saved to the configured main branch publish automatically. Changes made only in this ChatGPT Sites project do not automatically sync to your separate GitHub repository.
You can ask for updated files here, then upload them to GitHub. Keep GitHub as the latest copy after migration, and provide its current files before asking for further edits here.
You do not repeat the domain setup for normal edits.

A website hosted on GitHub Pages does not rely on an active ChatGPT subscription.
It remains subject to GitHub's service conditions and your account status. Keep the GoDaddy domain renewed. This is ongoing hosting, not a promise of forever.

## Alternative: host on GoDaddy itself

Choose this instead of GitHub Pages only if you want to use a GoDaddy Web Hosting (cPanel) plan. A domain purchase by itself is not that hosting plan.

1. Set up Web Hosting (cPanel) for pauljoseph.co.
2. Go to My Products > Web Hosting > Manage > File Manager.
3. Open the document root for pauljoseph.co. For the primary domain this is normally public_html.
4. Upload this ZIP and extract it there. index.html must be directly in that document root, alongside styles.css, script.js and assets.
5. Remove the uploaded ZIP from the public directory after extraction. If a default welcome page is present, back it up and replace it.
6. In GoDaddy's DNS, set A / @ to the IP shown for YOUR hosting account. Set CNAME / www to pauljoseph.co. Use these GoDaddy values instead of the GitHub table.
7. Activate SSL for pauljoseph.co and www.pauljoseph.co through your hosting dashboard or GoDaddy support, then enable HTTPS redirection. SSL options depend on your hosting plan.
8. For future changes, replace the changed files in the same document root.

A manual GoDaddy upload does not automatically synchronize with GitHub or this chat. Automatic deployments would need separate setup.

## Quick fixes

- No website: index.html may be inside an extra folder, or the Pages deployment may not have finished.
- Missing images: upload assets with all subfolders; filename capitalization must match.
- Old content: check the deployment finished, then try Ctrl+F5 or a private browser window.
- Domain not working: compare the website DNS records with the chosen host. Do not mix GitHub and GoDaddy hosting IPs.
- Custom domain lost after an update: restore the CNAME file or save pauljoseph.co again under Pages > Custom domain.

## Official help (checked September 2026)

- GitHub Pages publishing:
  https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- GitHub custom domains:
  https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
- GitHub HTTPS:
  https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https
- GoDaddy DNS:
  https://www.godaddy.com/help/manage-dns-records-680
- GoDaddy upload:
  https://www.godaddy.com/help/upload-files-using-my-web-hosting-cpanel-file-manager-3239
- GoDaddy hosting DNS:
  https://www.godaddy.com/help/configuring-dns-for-your-web-hosting-cpanel-domain-8852
