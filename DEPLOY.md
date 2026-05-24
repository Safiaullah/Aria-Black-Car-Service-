# Deploy Aria Black Car Service — Vercel + GoDaddy

Domain: **ariablackcarservice.com**

---

## Part 1 — Put your code on GitHub

### Step 1: Create a GitHub account (if needed)

Go to [github.com](https://github.com) and sign up.

### Step 2: Create a new repository

1. Click **+** → **New repository**
2. Name: `aria-black-car-service` (or any name)
3. Set to **Private** or **Public**
4. Do **not** check “Add a README” (you already have files)
5. Click **Create repository**

### Step 3: Push this project from your Mac

Open Terminal and run (replace `YOUR_USERNAME` with your GitHub username):

```bash
cd "/Users/samiramohammad/Aria Black Car Service"

git init
git add .
git commit -m "Initial commit — Aria Black Car Service website"

git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/aria-black-car-service.git
git push -u origin main
```

If GitHub asks you to log in, use a **Personal Access Token** as the password (Settings → Developer settings → Personal access tokens).

---

## Part 2 — Deploy on Vercel

### Step 4: Create a Vercel account

1. Go to [vercel.com](https://vercel.com)
2. Click **Sign Up**
3. Choose **Continue with GitHub** (easiest)

### Step 5: Import your project

1. On the Vercel dashboard, click **Add New…** → **Project**
2. Find **aria-black-car-service** in the list → click **Import**
3. Framework Preset: **Other** (static site — no build needed)
4. Root Directory: leave as **./**
5. Build Command: leave **empty**
6. Output Directory: leave **empty** (Vercel serves `index.html` from the root)
7. Click **Deploy**

Wait ~30 seconds. You’ll get a URL like:

`https://aria-black-car-service-xxxxx.vercel.app`

Open it — your site should be live on that preview URL.

### Step 6: Add your custom domain in Vercel

1. Open your project on Vercel
2. Go to **Settings** → **Domains**
3. Type: `ariablackcarservice.com` → **Add**
4. Also add: `www.ariablackcarservice.com` → **Add**
5. Vercel will show **Invalid Configuration** until DNS is set — that’s normal. Keep this tab open; you need the DNS values shown there.

Vercel will display something like:

| Type  | Name | Value              |
|-------|------|--------------------|
| **A** | `@`  | `76.76.21.21`      |
| **CNAME** | `www` | `cname.vercel-dns.com` |

*(Use the exact values Vercel shows in your dashboard — they can change.)*

---

## Part 3 — Connect GoDaddy to Vercel

You can use **Method A** (recommended) or **Method B**.

---

### Method A — Change nameservers (recommended, simplest)

Use this if you only need the website on Vercel (no GoDaddy email/hosting on this domain).

#### Step 7A: Copy Vercel nameservers

In Vercel → **Domains** → click your domain → choose **Vercel DNS** / nameserver option if offered.

Typical Vercel nameservers:

- `ns1.vercel-dns.com`
- `ns2.vercel-dns.com`

(Use whatever Vercel displays for your project.)

#### Step 8A: Update nameservers in GoDaddy

1. Log in at [godaddy.com](https://www.godaddy.com)
2. Go to **My Products** → find **ariablackcarservice.com** → click **DNS** or **Manage**
3. Scroll to **Nameservers** → **Change**
4. Select **Enter my own nameservers (Advanced)**
5. Remove old nameservers; add:
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`
6. **Save**

Propagation can take **15 minutes to 48 hours** (often under 1 hour).

#### Step 9A: Verify in Vercel

Back in Vercel → **Settings** → **Domains** — status should change to **Valid Configuration** with a green check.

---

### Method B — Keep GoDaddy DNS (manual records)

Use this if you use **GoDaddy email** or other DNS records you must keep.

#### Step 7B: Open DNS management

1. GoDaddy → **My Products** → **ariablackcarservice.com** → **DNS** / **Manage DNS**
2. Under **DNS Records**, you’ll edit/add records below.

#### Step 8B: Delete conflicting records

Remove or edit any existing records that conflict:

- Old **A** record for `@` pointing elsewhere
- Old **CNAME** for `www` pointing elsewhere
- **Forwarding** on the domain (turn off if enabled)

#### Step 9B: Add Vercel DNS records

Click **Add** and create:

| Type  | Name | Value                    | TTL  |
|-------|------|--------------------------|------|
| **A** | `@`  | `76.76.21.21`            | 600  |
| **CNAME** | `www` | `cname.vercel-dns.com` | 1 Hour |

*(Match values exactly to what Vercel shows in **Settings → Domains**.)*

#### Step 10B: Optional — redirect root to www (or vice versa)

In Vercel → **Domains**, set one as primary (e.g. `ariablackcarservice.com`). Vercel usually auto-redirects `www` ↔ apex.

#### Step 11B: Verify

Wait 15–60 minutes. In Vercel, refresh **Domains** until both show **Valid**.

Test:

- https://ariablackcarservice.com
- https://www.ariablackcarservice.com

---

## Part 4 — HTTPS & final checks

### Step 12: SSL certificate

Vercel issues a free SSL certificate automatically once DNS is valid. No action needed in GoDaddy.

### Step 13: Set primary domain

In Vercel → **Domains** → click **⋯** next to your preferred URL → **Set as Primary** (usually `ariablackcarservice.com` without `www`).

### Step 14: Test the site

- [ ] Homepage loads with video hero
- [ ] Booking form works (opens email)
- [ ] Phone links work on mobile
- [ ] `https://` shows padlock in browser

---

## Part 5 — Future updates

Every time you change the website:

```bash
cd "/Users/samiramohammad/Aria Black Car Service"
git add .
git commit -m "Describe your change"
git push
```

Vercel redeploys automatically within ~1 minute.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Domain shows “Invalid Configuration” | Wait longer; double-check A and CNAME match Vercel exactly |
| GoDaddy parking page still shows | Turn off **Domain Forwarding** in GoDaddy |
| `www` works but apex doesn’t | Ensure **A** record `@` → `76.76.21.21` exists |
| Site works on `.vercel.app` but not custom domain | DNS only — wait or flush DNS cache |
| 404 on subpages | This site is single-page; all links are `#` anchors — normal |

**GoDaddy support:** [help.godaddy.com](https://www.godaddy.com/help)  
**Vercel DNS docs:** [vercel.com/docs/projects/domains](https://vercel.com/docs/projects/domains)

---

## Quick reference

| Item | Value |
|------|--------|
| Project folder | `/Users/samiramohammad/Aria Black Car Service` |
| Vercel | [vercel.com/dashboard](https://vercel.com/dashboard) |
| GoDaddy DNS | My Products → Domain → DNS |
| Apex A record | `76.76.21.21` |
| WWW CNAME | `cname.vercel-dns.com` |
