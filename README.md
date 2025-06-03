# Ocean Bight Website

This is the website for Ocean Bight, deployed on GitHub Pages.

## Setup Instructions

1. Create a GitHub account if you don't have one already
2. Create a new repository named `oceanbight.github.io`
3. Push these files to the repository
4. GitHub will automatically deploy the website

## Domain Setup

1. Log in to your Namecheap account
2. Go to Domain List and select your domain (oceanbight.com)
3. Go to Advanced DNS
4. Add these DNS records:
   - Type: A
   - Host: @
   - Value: 185.199.108.153
   - TTL: Automatic

   - Type: A
   - Host: @
   - Value: 185.199.109.153
   - TTL: Automatic

   - Type: A
   - Host: @
   - Value: 185.199.110.153
   - TTL: Automatic

   - Type: A
   - Host: @
   - Value: 185.199.111.153
   - TTL: Automatic

5. Wait for DNS propagation (can take up to 48 hours)

## Local Development

To run the website locally:

```bash
python -m http.server 8000
```

Then open http://localhost:8000 in your browser.
