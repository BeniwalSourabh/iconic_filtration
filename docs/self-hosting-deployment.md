# Self-Hosting Deployment

Use this path when the website should run without Vercel.

## What You Need

- A VPS or cloud server with a public IPv4 address.
- Docker and Docker Compose installed on that server.
- Zoho domain DNS access.
- The production environment variables from `.env.example`.

## Build And Run On The Server

Copy the project to the server, then create a production `.env` file on the server.

Required values:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXTAUTH_URL=https://your-domain.com
DATABASE_URL=
AUTH_SECRET=
NEXTAUTH_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
GMAIL_USER=
GMAIL_APP_PASSWORD=
QUOTE_NOTIFICATION_TO=sales@iconicfiltration.com
LEAD_NOTIFICATION_TO=sales@iconicfiltration.com
```

Start the website:

```bash
docker compose -f docker-compose.example.yml --env-file .env up -d --build
```

The app will run on port `3000` inside the server.

The Docker build sets `SELF_HOST_STANDALONE=true`, which enables Next.js standalone output for the server image.

## Connect Zoho Domain DNS

In Zoho DNS, point the domain to your server IP:

```txt
Type: A
Host: @
Value: YOUR_SERVER_PUBLIC_IP
TTL: Automatic
```

For the `www` version:

```txt
Type: CNAME
Host: www
Value: your-domain.com
TTL: Automatic
```

Do not remove Zoho Mail MX, SPF, DKIM, or DMARC records if email is active on the same domain.

## HTTPS

Install Nginx or Caddy on the server and issue an SSL certificate with Let's Encrypt.

For Nginx, proxy traffic to the app:

```nginx
server {
  server_name your-domain.com www.your-domain.com;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

After DNS is pointing to the server, run Certbot for SSL:

```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## Production Checks

After deployment, check:

- `https://your-domain.com`
- `https://your-domain.com/v2`
- `https://your-domain.com/products`
- `https://your-domain.com/request-quote`
- Admin login
- Quote form email notification
