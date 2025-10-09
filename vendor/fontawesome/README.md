How to install Font Awesome locally for this project

This project expects the Font Awesome CSS and webfonts to be available at:

  /vendor/fontawesome/css/all.min.css
  /vendor/fontawesome/webfonts/*

You can install these files in two ways.

1) Download manually from the Font Awesome CDN

- Create the folder structure in the project root:
  vendor/fontawesome/css
  vendor/fontawesome/webfonts

- Download the CSS file and the webfonts listed in the CSS (woff2/woff/ttf) from the CDN and place them under the `webfonts/` folder. Example (from project root):

  curl -L -o vendor/fontawesome/css/all.min.css "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"

  # Inspect the CSS to find referenced webfont URLs, then download each to webfonts/
  # Example:
  curl -L -o vendor/fontawesome/webfonts/fa-solid-900.woff2 "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/webfonts/fa-solid-900.woff2"

2) Use npm to install and copy files (if you have node locally)

  npm install @fortawesome/fontawesome-free --no-audit --no-fund
  mkdir -p vendor/fontawesome/css vendor/fontawesome/webfonts
  cp node_modules/@fortawesome/fontawesome-free/css/all.min.css vendor/fontawesome/css/
  cp -r node_modules/@fortawesome/fontawesome-free/webfonts/* vendor/fontawesome/webfonts/

After copying files, open the site and verify the CSS loads from /vendor/fontawesome/css/all.min.css.

Security note: Hosting local copies reduces CORS/CSP issues and avoids relying on third-party CDNs. Keep these files up-to-date if you care about vulnerability fixes.