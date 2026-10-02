# Paul Joseph — final GitHub website update

Prepared 2 October 2026 from the latest published review website.
Source revision: b0da876284f4ebd733511fd8d12831e7dbd3f1bd

Includes the latest CV and both CV buttons, July–September 2026 internship dates,
updated internship description, website motion animations and the two-line headline.

## Upload to your existing GitHub repository

1. Download this ZIP and choose Extract All.
2. Open your existing pauljozef/paul-portfolio repository on GitHub.
3. Choose Add file > Upload files.
4. Drag the extracted CONTENTS into the upload area: index.html, styles.css,
   script.js, motion.css, motion.js, assets, CNAME, .nojekyll and this README.
   Do not upload the ZIP or the folder containing these files.
5. Check that the asset paths begin with assets/ and the five code files are at
   the repository root. Existing files with matching paths will be updated.
6. Click Commit changes to main.
7. Wait for the Pages deployment in Actions to show a green check.
8. Open https://pauljoseph.co and refresh. On Windows, Ctrl+Shift+R forces a refresh.

You do not need to delete the repository, reconnect your domain, or change GoDaddy DNS.
The included CNAME retains pauljoseph.co. Keep GitHub Pages set to main / (root).

If you upload files separately, upload assets and the new motion.css and motion.js
before replacing index.html, so the new page has everything it needs.

## Files

- index.html: page content and links.
- styles.css: layout and visual design.
- script.js: navigation and expandable sections.
- motion.css and motion.js: responsive animations and reduced-motion support.
- assets/: all local images, logos, CV and research PDFs.
- CNAME: your custom domain.
- .nojekyll: serves this static website directly.

No build step, package installation, database or ChatGPT subscription is needed
for these files to run on GitHub Pages. This ZIP does not update GitHub by itself.

Code, local paths and references were checked. Automated visual browser testing
was unavailable; check the finished page and both CV buttons after deployment.
