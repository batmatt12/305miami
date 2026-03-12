# 305 Miami Fence Company Website

This project is ready for **GitHub Pages** (static hosting).

## Files you need for GitHub Pages

- `index.html`
- `styles.css`
- `script.js`
- `form-config.js`
- `.nojekyll`
- `assets/` (all images)

## 1) Configure estimate form (email + SMS)

The form is configured in `form-config.js`.

### A. Email alerts (Formspree)

1. Create a free account at [Formspree](https://formspree.io/).
2. Create a form and set your email recipient to `305miamifencecompany@gmail.com`.
3. Copy your endpoint (looks like `https://formspree.io/f/xxxxxxx`).
4. In `form-config.js`, replace:

```js
formspreeEndpoint: 'https://formspree.io/f/YOUR_FORM_ID'
```

### B. SMS alerts to both numbers (Zapier + Twilio)

1. In Zapier, create a Zap:
   - Trigger: **Webhooks by Zapier** -> **Catch Hook**
   - Action: **Twilio** -> **Send SMS**
2. Configure Twilio action twice (or use Paths/Loop) to send to:
   - `+13053218540`
   - `+17865608256`
3. Copy your Zapier Catch Hook URL.
4. In `form-config.js`, replace:

```js
smsWebhookUrl: 'YOUR_ZAPIER_WEBHOOK_URL'
```

The site sends this JSON payload:

```json
{
  "name": "John Doe",
  "phone": "3050000000",
  "email": "john@email.com",
  "zip": "33101",
  "details": "Fence replacement",
  "consent": "yes",
  "source": "305miamifencecompany.com",
  "recipients": ["+13053218540", "+17865608256"]
}
```

## 2) Upload to GitHub and enable Pages

1. Create a new GitHub repo.
2. Upload all project files.
3. In GitHub: **Settings** -> **Pages**.
4. Source: **Deploy from a branch**.
5. Branch: `main` and folder `/ (root)`.
6. Save.

Your site will publish at:

`https://YOUR-USERNAME.github.io/YOUR-REPO/`

## 3) Test checklist

1. Open live site.
2. Submit a test estimate.
3. Confirm:
   - Email arrives at `305miamifencecompany@gmail.com`
   - SMS arrives at `(305) 321-8540` and `(786) 560-8256`

## Notes

- This version is static and compatible with GitHub Pages.
- No backend server is required.
