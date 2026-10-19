const buckets = [0.05, 0.1, 0.3, 0.6, 1, 3];

const labels = ({ route, outcome }) => `route="${route}",outcome="${outcome}"`;

export function createGatewayMetrics() {
  return { requests: new Map(), buckets: new Map(), count: new Map(), sum: new Map() };
}

export function observeGatewayRequest(metrics, { route, outcome, durationSeconds }) {
  const key = labels({ route, outcome });
  metrics.requests.set(key, (metrics.requests.get(key) ?? 0) + 1);
  metrics.count.set(key, (metrics.count.get(key) ?? 0) + 1);
  metrics.sum.set(key, (metrics.sum.get(key) ?? 0) + durationSeconds);
  for (const bucket of buckets) {
    if (durationSeconds <= bucket) {
      const bucketKey = `${key},le="${bucket}"`;
      metrics.buckets.set(bucketKey, (metrics.buckets.get(bucketKey) ?? 0) + 1);
    }
  }
  const infinityKey = `${key},le="+Inf"`;
  metrics.buckets.set(infinityKey, (metrics.buckets.get(infinityKey) ?? 0) + 1);
}

export function renderPrometheus(metrics) {
  const rows = [
    "# HELP gateway_http_requests_total Requests handled by API Gateway",
    "# TYPE gateway_http_requests_total counter",
    ...[...metrics.requests].map(([key, value]) => `gateway_http_requests_total{${key}} ${value}`),
    "# HELP gateway_http_request_duration_seconds Gateway request latency",
    "# TYPE gateway_http_request_duration_seconds histogram",
    ...[...metrics.buckets].map(([key, value]) => `gateway_http_request_duration_seconds_bucket{${key}} ${value}`),
    ...[...metrics.count].map(([key, value]) => `gateway_http_request_duration_seconds_count{${key}} ${value}`),
    ...[...metrics.sum].map(([key, value]) => `gateway_http_request_duration_seconds_sum{${key}} ${value}`),
  ];
  return `${rows.join("\n")}\n`;
}
