# Nimo Crypto API

Serverless API on AWS. Look up crypto prices, email them, and view past lookups.

**Live API:** `https://66zeydjuyd.execute-api.ap-southeast-2.amazonaws.com/Prod`

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/crypto/price` | Get price, send email, save to database |
| `GET` | `/history` | List all past lookups |

---

## POST /crypto/price

**Request**

```bash
curl -X POST "https://66zeydjuyd.execute-api.ap-southeast-2.amazonaws.com/Prod/crypto/price" \
  -H "Content-Type: application/json" \
  -d '{"crypto": "bitcoin", "email": "you@example.com", "currency": "usd"}'
```

| Field | Required | Description |
|-------|----------|-------------|
| `crypto` | Yes | Coin name (e.g. `bitcoin`, `ethereum`) |
| `email` | Yes | Email to send the price to |
| `currency` | No | Fiat currency (default: `usd`) |

**Success (200)**

```json
{
  "success": true,
  "price": 65465,
  "crypto": "bitcoin",
  "currency": "usd",
  "timestamp": "2026-06-22T14:00:00.413Z"
}
```

**Errors**

| Status | Reason |
|--------|--------|
| `400` | Missing or invalid `crypto` / `email`, or recipient not verified in SES |
| `404` | Coin not found |
| `500` | Server error (e.g. email not verified in SES) |

---

## GET /history

**Request**

```bash
curl "https://66zeydjuyd.execute-api.ap-southeast-2.amazonaws.com/Prod/history"
```

**Success (200)**

```json
{
  "success": true,
  "count": 1,
  "history": [
    {
      "id": "364700aa-e6ea-4da5-84cf-af2f0f003b89",
      "crypto": "bitcoin",
      "price": 65465,
      "currency": "usd",
      "email": "you@example.com",
      "timestamp": "2026-06-22T14:00:00.413Z"
    }
  ]
}
```

---

## Deploy

```bash
npm install
sam build
sam deploy --guided
```

Or push to `main` — GitHub Actions deploys automatically and manual deployment option is also added.

**GitHub secrets:** `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `SENDER_EMAIL`

**SES:** Verify sender email before deploy. In sandbox mode, recipient emails must also be verified.

---
