# Research notes: Policy-as-code for AI agents

## Verified findings

- OpenFGA's current Authorization for Agents documentation (last updated Aug. 24, 2026) frames agent authorization across first-party and third-party domains. It describes modeling agents as principals, narrowing permissions around tools/resources, and task-based authorization with zero permissions at task start plus scoped grants, optional expiration, turn limits, and agent binding.
- OPA's official documentation describes OPA as an open-source, general-purpose policy engine that unifies policy enforcement across a stack. It says OPA decouples policy decision-making from enforcement: software queries OPA with structured input, and OPA evaluates Rego policies and data to produce decisions. Decisions may be structured outputs, not only allow/deny.
- OPA's docs expose a first-class Policy Testing section, which supports a production article angle around treating authorization rules as executable, regression-tested software rather than prose configuration.

## Editorial boundary for a new folio post

The current repository already contains posts on agent identity/delegation, MCP authorization and security, human approval, context firewall, tool contract testing, tool-result freshness, idempotent actions, and deletion guarantees. The new post should therefore focus narrowly on policy lifecycle and testability: policy inputs, default-deny behavior, negative cases, policy diffs, shadow evaluation, enforcement points, and rollback. It should not re-explain who the agent is, how MCP works, or how a human approves a single action.

## Sources

[1]: https://openfga.dev/docs/modeling/agents "OpenFGA — Authorization for Agents"
[2]: https://www.openpolicyagent.org/docs "Open Policy Agent — Official Documentation"
[3]: https://www.openpolicyagent.org/docs/policy-testing "Open Policy Agent — Policy Testing"

## Additional verified findings

- OPA's Policy Testing page says its framework helps verify policy correctness, speed development of new rules, and reduce the time needed to modify rules as requirements evolve. It documents Rego test rules, `opa test`, test discovery by the `test_` prefix, `--fail-on-empty` to avoid silently running zero tests, and JSON output for programmatic consumption.
- Cedar's official validation guide explains that a policy can be syntactically well-formed yet contain typos or type errors that make it ineffective or produce evaluation diagnostics. Cedar validation uses an application schema containing entity types, attributes, relationships, actions, and request component types. The guide expects authorization requests to adhere to the schema and notes that application schema changes may require revalidation of policies still in effect.

## Additional source

[4]: https://docs.cedarpolicy.com/policies/validation.html "Cedar — Policy validation"

## Visual direction verified from existing assets

The recent Folio AI posts use 2560×1440 landscape illustrations with a warm cream paper background, fine hand-drawn charcoal outlines, restrained terracotta/coral, teal, lilac and olive accents, rounded diagram cards, generous whitespace, and a clear left-to-right system narrative. The hero is both a conceptual scene and a readable architecture diagram; in-article images are explanatory diagrams rather than decorative stock imagery. The new set should preserve this visual grammar while using policy, test, diff, and enforcement motifs.

## UI review findings

The clean blog-index baseline and post-change captures were completed at 1440×1000 and 390×844. The index remains visually stable in the captured viewport because the new article is dated Jan. 2, 2026 and appears below the newest posts; both desktop and mobile navigation, card geometry, typography, and existing thumbnails remain intact. The new article route returned HTTP 200 from the restored local server and its English and Vietnamese titles were present in the HTML.

## Article-route visual checks

The local English route `/blog/agent-policy-as-code-authorization-testing/` rendered HTTP 200 with the expected English title, Jan. 2, 2026 publication date, hero/thumbnail, opening incident, citation links, and related-reading links. The Vietnamese target rendered the matching Vietnamese title, the same publication date and hero asset, with translated opening copy and language controls intact. The hero remains legible at the article header and the generated visual set is referenced by the Markdown.
