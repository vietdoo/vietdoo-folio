# Research Notes — Synthetic Users for AI Agents

## Working angle

The article should distinguish a **synthetic user** used to generate interaction scenarios from a synthetic persona used as a substitute for human research. The production-engineering focus is scenario generation for end-to-end agent evaluation: realistic task state, multi-turn behavior, tool context, hidden goals, policy boundaries, and held-out evaluation protection.

## Findings from current sources

The Korea and Singapore AI Safety Institutes describe constructing a small set of well-designed tasks and expanding them through controlled variations such as different data profiles and policies. They define task-specific correctness and safety conditions, often as granular yes/no criteria, and note that realistic agent evaluation benefits from mirrored MCP implementations, realistic test data, multi-turn interaction with a separate user simulator, and interconnected application environments. Their earlier benchmarks used overtly synthetic data and localhost websites, which encouraged agents to behave as if the scenario was artificial. They separately identify lack of data awareness, lack of audience awareness, and lack of policy compliance as useful risk categories.

RealUserSim reports that unconstrained LLM user simulators can be poor proxies for human behavior and that hand-written behavioral directives can cause unnatural directive amplification. Its proposed grounded simulation uses behavioral profiles extracted from more than 14,000 authentic human–LLM conversations, a fidelity benchmark across 600 conversations and 71+ domains, and anti-leakage controls. The paper is useful for the article’s distinction between a simulator that merely roleplays a persona and one grounded in observed behavior while keeping evaluation data held out.

## Editorial guardrails

The article should not claim that synthetic users replace real users. It should frame them as a scalable test-input generator and stress-test harness. It should avoid training a simulator on the same conversations, rubrics, hidden goals, or expected answers used for final evaluation. It should use separate generation, development, and locked evaluation partitions; track provenance and generator versions; deduplicate near-identical scenarios; include adversarial and mundane cases; and evaluate both agent task success and simulator fidelity.

## Initial source list

[1]: https://sgaisi.sg/resources/testing-ai-agents-for-data-leakage-risks-in-realistic-tasks/ "AISI — Testing AI Agents for Data Leakage Risks in Realistic Tasks"
[2]: https://arxiv.org/abs/2605.20204 "RealUserSim: Bridging the Reality Gap in Agent Benchmarking via Grounded User Simulation"

## Additional evaluation guidance

OpenAI’s evaluation guidance recommends task-specific evals that reflect real-world distributions, continuous evaluation, automated scoring where possible, and calibration against human feedback. It explicitly lists synthetic, domain-specific, human-curated, production, and historical data as possible dataset sources, and uses held-out reference examples in its summarization example. The article should turn those principles into an operational partitioning policy rather than present synthetic generation as a replacement for human review.

NVIDIA describes a privacy-preserving workflow that generates domain-specific synthetic data, scores and filters examples, pairs them with ground truth, and runs reproducible evaluation in CI/CD. This supports the article’s proposed pipeline: generate scenarios, lint and deduplicate them, attach expected invariants, quarantine development data from the locked test set, and continuously evaluate changes.

[3]: https://developers.openai.com/api/docs/guides/evaluation-best-practices "OpenAI API — Evaluation best practices"
[4]: https://developer.nvidia.com/blog/how-to-build-privacy-preserving-evaluation-benchmarks-with-synthetic-data/ "NVIDIA Technical Blog — How to Build Privacy-Preserving Evaluation Benchmarks with Synthetic Data"

## Leakage-specific findings

AgentLeak argues that output-only audits miss privacy leakage through inter-agent messages, shared memory, and tool arguments. Its benchmark spans multiple domains, includes a structured attack taxonomy, and evaluates internal as well as external channels. This supports making scenario observability part of the article: a synthetic user test should capture the final answer, tool calls, inter-agent messages, memory writes, and policy decisions instead of judging only the visible response.

LatestEval distinguishes input contamination from input-and-label contamination and describes dynamic construction from recent materials to reduce overlap with pretraining data. The article should translate the broader principle carefully: no generation method can prove a closed model has never seen a scenario, so teams should minimize exposure, keep final sets locked, use similarity/near-duplicate checks, rotate scenario families, and report the provenance and limitations of the benchmark.

[5]: https://arxiv.org/html/2602.11510v2 "AgentLeak: A Full-Stack Benchmark for Privacy Leakage in Multi-Agent LLM Systems"
[6]: https://arxiv.org/html/2312.12343v1 "Avoiding Data Contamination in Language Model Evaluation: Dynamic Test Construction with Latest Materials"

## Visual review

The generated hero and scenario-factory diagram were reviewed at full resolution. Both use the existing folio visual language: warm ivory paper, hand-drawn charcoal outlines, muted lavender/indigo blocks, burnt-orange accents, sparse editorial labels, and generous whitespace. The hero clearly separates the scenario factory from the firewall and locked evaluation vault. The scenario-factory image clearly distinguishes controlled lanes, variants, merged scenarios, the invariant marker, the synthetic user, and the agent test harness. No blocking text or layout defects were observed.

The split-and-lock and fidelity-loop diagrams were also reviewed at full resolution. The first shows a one-way path from generator through development and deduplication, across a visible firewall, into a locked evaluation vault. The second shows redacted production patterns feeding development, then shadow review and a sealed release gate, with a controlled feedback loop. Their labels and arrows are readable and the visuals match the new hero and the existing post style.

## Page UI review

The new route was rendered on desktop (1440×1000) and mobile (390×844). Manual inspection showed the long title wraps cleanly, the metadata card remains readable, the hero maintains its aspect ratio, and the opening paragraph is visible without layout overflow. The final desktop comparison changed 2,500 pixels (0.174%) and the route loaded with HTTP 200. The mobile capture completed successfully as well. The local dev capture recorded transient Vite optimized-dependency 504 console diagnostics during startup; these produced no page errors, and the production build itself passed.
