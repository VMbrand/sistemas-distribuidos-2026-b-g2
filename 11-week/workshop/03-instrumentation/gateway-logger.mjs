export function gatewayLog({ event, level = "INFO", traceId, spanId, correlationId, durationMs, route, status, productId }) {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    service: "api-gateway",
    version: "0.3.0-dev",
    environment: "local",
    trace_id: traceId,
    span_id: spanId,
    correlation_id: correlationId,
    event,
    message: "Gateway handled catalog stock request",
    duration_ms: durationMs,
    route,
    http_status: status,
    product_id: productId,
  });
}

export function logGatewayRequest(request, fields) {
  request.log(gatewayLog(fields));
}
