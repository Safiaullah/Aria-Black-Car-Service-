# Aria Black Car Service

Premium luxury black car website for **ariablackcarservice.com**.

## Preview locally

```bash
cd "/Users/samiramohammad/Aria Black Car Service"
python3 -m http.server 8080
```

Open [http://localhost:8080](http://localhost:8080)

## Deploy

Upload all files to your web host (Netlify, Vercel, Cloudflare Pages, or any static hosting). Point your domain `ariablackcarservice.com` DNS to the host.

### Netlify (drag & drop)

Drag the project folder to [app.netlify.com/drop](https://app.netlify.com/drop).

### Vercel

```bash
npx vercel --prod
```

## Customize before launch

| Item | Location |
|------|----------|
| Phone number | Search for `8889002742` / `(888) 900-2742` in `index.html` |
| Email addresses | `bookings@` and `info@ariablackcarservice.com` |
| Pricing | `#pricing` section in `index.html` |
| Hero video | `<video>` source in hero section |
| Fleet photos | Replace Unsplash URLs with your own vehicle images |

## Structure

```
├── index.html      # Main immersive landing page
├── css/styles.css  # Luxury black & champagne gold theme
├── js/main.js      # Nav, fleet tabs, FAQ, animations, booking form
├── robots.txt
├── sitemap.xml
└── README.md
```

## Features

- Full-screen NYC video hero with booking card
- Scrolling route marquee (Detailed Drivers–style)
- Service grid with featured airport transfer
- Interactive fleet tabs with hover interior reveal
- Airport destination cards with pricing hints
- Transparent pricing tables
- FAQ accordion, testimonials, SEO schema markup
- Mobile-responsive with floating call/book buttons
