const TRACEPARENT = /^00-([0-9a-f]{32})-([0-9a-f]{16})-([0-9a-f]{2})$/i;

function validId(value) {
  return value && !/^0+$/.test(value);
}

export function parseTraceparent(value) {
  const match = TRACEPARENT.exec(value ?? "");
  if (!match || !validId(match[1]) || !validId(match[2])) return null;
  return { traceId: match[1].toLowerCase(), parentSpanId: match[2].toLowerCase(), flags: match[3] };
}

export function contextForGateway({ traceparent, requestId }) {
  const incoming = parseTraceparent(traceparent);
  const traceId = incoming?.traceId ?? requestId;
  if (!/^[0-9a-f]{32}$/i.test(traceId) || !validId(traceId)) throw new Error("requestId must be a non-zero 32-hex value");
  return {
    traceId: traceId.toLowerCase(),
    serverSpanId: requestId.slice(0, 16).toLowerCase(),
    clientSpanId: requestId.slice(16, 32).toLowerCase(),
    flags: incoming?.flags ?? "01",
  };
}

export function responseTraceparent(context) {
  return `00-${context.traceId}-${context.serverSpanId}-${context.flags}`;
}

export function downstreamTraceparent(context) {
  return `00-${context.traceId}-${context.clientSpanId}-${context.flags}`;
}

function requestContext(request) {
  return contextForGateway({
    traceparent: request.headersIn.traceparent,
    requestId: request.variables.request_id,
  });
}

export function gatewayTraceId(request) {
  return requestContext(request).traceId;
}

export function gatewayResponseTraceparent(request) {
  return responseTraceparent(requestContext(request));
}

export function gatewayUpstreamTraceparent(request) {
  return downstreamTraceparent(requestContext(request));
}
