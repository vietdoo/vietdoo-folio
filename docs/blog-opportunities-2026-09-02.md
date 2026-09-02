# Blog opportunity review — 2026-09-02

## Audit baseline

The repository contains 48 bilingual topic pairs under `src/data/blog`, with the strongest editorial pattern centered on production AI engineering: agent reliability, security boundaries, evaluations, observability, orchestration, tool calling, RAG, cost, release engineering, and deployment. Recent posts already cover chaos engineering, change/drift management, time semantics, durable execution, compensation transactions, decision traces, output provenance, policy-as-code, identity/delegation, model upgrades, schema evolution, context engineering, and semantic caching.

The existing `ai-agent-drift-management` article is present and dated 2026-04-22. It already owns the topic of detecting changed tools, policies, permissions, schemas, and world state before execution. Therefore no new post should be another drift/preflight or generic change-management article.

## External signals used for prioritization

LangChain’s 12 June 2026 survey of more than 1,300 professionals reports that 57.3% have agents in production, quality is the leading barrier, observability adoption is materially ahead of eval adoption, and multi-model usage is common [1]. O’Reilly’s Signals for 2026 identifies agent protocols, context engineering, AI-native architecture, and infrastructure for autonomous agents as active directions [2]. Recent research and engineering discussion around semantic diffs points to a useful missing layer between raw patches and human approval: reviewing the meaning and affected entities of a generated change.

## Ten non-duplicative opportunities

| # | Proposed post | Distinct editorial angle | Fit and duplication check |
|---:|---|---|---|
| 1 | **Semantic Diffs for AI Agents: Review Intent, Not Just JSON** / **Semantic Diff cho AI Agent: Review Intent, không chỉ JSON** | Convert tool arguments and state mutations into entity-level intent, impact, invariants, and approval-friendly diffs. | Best fit. Does not repeat decision traces (history), provenance (evidence), code supply chain (artifact custody), or drift management (dependency change). It focuses on the proposed mutation itself and what a reviewer can approve. |
| 2 | **Agent Output Contracts: Separate Draft, Decision, and Commit** | A three-phase contract that prevents a fluent answer from being mistaken for an executed business action. | Useful but adjacent to action gates, NLU-to-action, and tool contracts. |
| 3 | **The Agent Review Queue Is a Capacity System** | Model human review as a queue with risk-weighted priority, SLA, aging, and decision debt. | Interesting but overlaps human-in-loop and admission control; narrower than #1. |
| 4 | **AI Agents and Referential Integrity: Preventing Orphaned Actions** | Check relational invariants before an agent edits linked records, permissions, or workflows. | Distinct database angle, but overlaps schema evolution and compensation. |
| 5 | **Replayable Agent Sandboxes: Testing Side Effects Without Touching Production** | Deterministic world snapshots, fake tools, and side-effect recording for realistic replay. | Strong, but close to sandboxing, synthetic users, and counterfactual release experiments. |
| 6 | **Agent Capability Negotiation at Runtime** | Capability manifests, expiry, feature flags, and safe downgrade across MCP/A2A tools. | Relevant, but partially overlaps A2A, MCP, provider rotation, and drift. |
| 7 | **AI Agent Data Lineage: From Source Row to External Action** | Follow a field from source evidence through context, decision, transformation, and tool mutation. | Strong governance topic, but overlaps output provenance and observability. |
| 8 | **When an Agent Changes a Schema: Compatibility Windows for AI Workflows** | Manage tool/schema changes while long-running plans are still in flight. | Good practical topic, but too close to existing schema evolution and drift management. |
| 9 | **Agentic Feature Flags: Kill Behavior Before Killing the Whole Agent** | Feature flags for tools, actions, autonomy level, and approval requirements. | Valuable but overlaps incident response, policy-as-code, and release experiments. |
| 10 | **Designing Agent Receipts: A User-Readable Proof of What Changed** | Post-action receipts with before/after, actor, authorization, evidence, and rollback path. | Distinct UX surface, but adjacent to decision traces and provenance. |

## Selection

Choose #1: **Semantic Diffs for AI Agents: Review Intent, Not Just JSON**. It is the clearest unoccupied layer in the current folio. The article can express a practical runtime pattern: normalize an agent’s proposed tool call into a semantic change set, compute affected entities and invariants, render a human-readable diff, then authorize or reject at the write boundary. It is technical enough for the existing audience, concrete enough to include TypeScript and JSON examples, and topical without becoming a generic “AI code review” post.

The selected publication date is **2026-09-01**, randomly chosen from 2026-08-31, 2026-09-01, and 2026-09-02. It is intentionally distinct from the latest existing post date of 2026-08-31.

## References

[1]: https://www.langchain.com/state-of-agent-engineering "LangChain — State of Agent Engineering"
[2]: https://www.oreilly.com/radar/signals-for-2026/ "O’Reilly — Signals for 2026"
[3]: https://arxiv.org/abs/2607.13111 "SemaDiff: Identifying Semantic-Changing Commits with Generated Code and Tests"
