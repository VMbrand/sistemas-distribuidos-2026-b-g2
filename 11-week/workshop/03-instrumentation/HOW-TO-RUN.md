# Run the API Gateway observability spike

Requirements: Node.js 20 or later. The source modules use only the Node.js standard library.

```powershell
cd 11-week/workshop/03-instrumentation
node --test test/gateway-observability.test.mjs
```

Expected output on this machine:

```text
✔ preserves the received trace ID when the gateway calls Catalog API
✔ renders request counter and latency histogram
```

`gateway-observability.conf` is the NGINX njs integration sketch. It must be reviewed in the official `amaranta-shop-api-gateway` repository before it is enabled; its `/metrics` route is intentionally internal-only.
