# AI Admission Control Blog Delivery Report

## Audit summary

The folio was reviewed against its existing AI engineering coverage, including model routing and provider rotation, multi-tenant isolation, semantic caching, observability and OpenTelemetry, durable execution, idempotent tool actions, decision traces, contract testing, prompt injection and tool boundaries, agent evaluation, MCP architecture, provenance, and agent identity. The selected topic deliberately moves one layer earlier in the request lifecycle: deciding whether an agent workflow should consume scarce capacity at all.

## Ten topic opportunities

| # | Topic | Why it fits the folio | Duplication risk |
|---:|---|---|---|
| 1 | Admission control, backpressure, and fairness for multi-tenant AI agents | Extends the user's backend, Big Data, latency, and reliability focus while filling the queue-policy gap | Low |
| 2 | Cross-provider output drift detection | Natural follow-up to provider rotation, focused on behavioral change rather than routing | Medium-low |
| 3 | Capability tokens for AI agents | Adds least-privilege authorization to the existing tool and MCP work | Low |
| 4 | Versioned agent releases and rollback | Brings canary release engineering to agent workflows | Low |
| 5 | Incident response runbooks for AI systems | Turns observability and evaluation into operator actions | Low |
| 6 | Evidence graphs for agentic search | Extends provenance into claim-source-decision relationships | Low |
| 7 | Semantic cache freshness contracts | Builds on semantic caching with invalidation and freshness guarantees | Low |
| 8 | Abstention and escalation states | Covers uncertainty as a first-class workflow state | Low |
| 9 | AI data contracts for real-time pipelines | Connects Kafka, Spark, schemas, and agent workloads | Low |
| 10 | Tool cost accounting for agent workflows | Extends idempotency and admission ideas into per-action budgets | Low |

## Selected article

**English title:** The Queue Is a Policy: Admission Control, Backpressure, and Fairness for Multi-Tenant AI Agents

**Vietnamese title:** Queue cũng là Policy: Admission Control, Backpressure và Fairness cho Multi-Tenant AI Agent

**Slug:** `ai-admission-control-backpressure-fairness`

**Publication date:** `2026-07-03`, selected randomly from the requested July 2026 window.

The article argues that a queue is not merely a buffer. It is the policy surface that decides who starts, who waits, who is degraded, who is rejected, and whose retries are allowed to consume scarce model and tool capacity. It covers admission decisions, work estimates, token-based fairness, Deficit Round Robin, deadline-aware p95 admission, graceful load shedding, retry budgets, tenant isolation, and overload telemetry.

## Research sources

The article is grounded in the following sources:

- Envoy Admission Control: https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_filters/admission_control_filter
- Cohere, LLM Serving Fairness: No More Noisy Neighbors: https://cohere.com/blog/serving-fairness
- Throughput-Optimal Scheduling Algorithms for LLM Inference and AI Agents: https://arxiv.org/html/2504.07347v3
- QUARTZ: Quantile-Aware Routing and Queueing for TTFT SLOs in LLM Serving: https://aclanthology.org/2026.findings-acl.1888/
- Google SRE, Handling Overload: https://sre.google/sre-book/handling-overload/
- Google SRE, Addressing Cascading Failures: https://sre.google/sre-book/addressing-cascading-failures/
- Kubernetes API Priority and Fairness: https://kubernetes.io/docs/concepts/cluster-administration/flow-control/

## Content and visual delivery

Both EN and VI articles were written as long-form production guides with human-like editorial pacing, code examples, decision tables, practical trade-offs, and citations. The article contains one generated hero/thumbnail and three in-article illustrations. The hero uses the whiteboard-app style established by the provider-rotation article: warm ivory paper, graphite marker outlines, imperfect hand-drawn lines, restrained pastel accents, labeled nodes, arrows, dashed boundaries, and technical annotations.

The three in-article assets show a fair token-budget queue, a graceful backpressure/load-shedding ladder, and a deadline-aware tail-SLO scheduler. The hero was generated directly; the three in-article illustrations were completed as original vector whiteboard fallback assets after the daily image-generation quota was reached, then visually checked and corrected so the title and subtitle do not overlap.

## Verification

`pnpm run check` completed with 0 errors and existing non-blocking hints only. Unit tests completed with 19 passing tests. Astro/Vercel production build completed successfully, `git diff --check` passed, both language files share the same publication date and asset set, and all four assets are present under `public/blog/ai-admission-control/`.

## Commit and deployment

The repository was ready for a dedicated blog commit after verification. The final commit hash and CI run URL are recorded in the delivery message after the push completes. The repository workflow builds and uploads the Vercel artifact; production availability depends on the configured Vercel Git Integration or external deployment hook.
