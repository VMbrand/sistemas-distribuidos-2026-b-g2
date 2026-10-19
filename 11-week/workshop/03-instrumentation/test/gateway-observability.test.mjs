import assert from "node:assert/strict";
import test from "node:test";
import { contextForGateway, downstreamTraceparent, parseTraceparent } from "../gateway-trace-context.mjs";
import { createGatewayMetrics, observeGatewayRequest, renderPrometheus } from "../gateway-metrics.mjs";

test("preserves the received trace ID when the gateway calls Catalog API", () => {
  const received = "00-4bf92f3577b34da6a3ce929d0e0e4736-1111111111111111-01";
  const context = contextForGateway({ traceparent: received, requestId: "22222222222222223333333333333333" });
  const forwarded = parseTraceparent(downstreamTraceparent(context));

  assert.equal(forwarded.traceId, parseTraceparent(received).traceId);
  assert.notEqual(forwarded.parentSpanId, parseTraceparent(received).parentSpanId);
});

test("renders request counter and latency histogram", () => {
  const metrics = createGatewayMetrics();
  observeGatewayRequest(metrics, { route: "catalog_admin_stock", outcome: "success", durationSeconds: 0.084 });
  const text = renderPrometheus(metrics);

  assert.match(text, /gateway_http_requests_total\{route="catalog_admin_stock",outcome="success"\} 1/);
  assert.match(text, /gateway_http_request_duration_seconds_bucket/);
});
