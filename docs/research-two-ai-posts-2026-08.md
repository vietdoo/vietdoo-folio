# Research notes: Arbitration and AI Agent FinOps

## Scope and non-duplication boundaries

The folio already covers A2A interoperability, handover, model routing, SLOs, observability, evals, human-in-the-loop action gates, durable execution, admission control, and decision traces. The arbitration article must therefore focus on **what happens after independent agents produce incompatible recommendations**: conflict taxonomy, evidence normalization, confidence calibration, arbitration policy, abstention, escalation, and an auditable final decision. It should not duplicate A2A transport, handover mechanics, generic voting, or decision-trace storage.

The FinOps article must focus on **cost attribution and unit economics for AI agent workloads**: tenant/workflow/outcome dimensions, token and tool-call metering, shared-cost allocation, budget envelopes, chargeback/showback, quality-adjusted cost, and optimization policy. It should not duplicate model-router mechanics, generic observability, or the existing AI SLO article.

## FinOps source reviewed

[FinOps for AI Overview](https://www.finops.org/wg/finops-for-ai-overview/) — FinOps Foundation, last updated February 17, 2026. Key findings: cost-per-token and volatile pricing create new visibility challenges; organizations should regularly track AI costs and usage, set quotas, tag resources, optimize GPU allocation, and align real-time financial monitoring with business outcomes. The basic `Price × Quantity = Cost` equation still applies. AI differs because model/service pricing changes quickly, cloud providers add SKUs, native tagging may be unavailable, token meters can differ between user input and billed/compressed prompts, GPU scarcity affects capacity, and TCO must include quality and ongoing training/operations. FinOps can manage, report, and allocate token value while extending existing cloud practices.

Related sources to verify in article drafting:

- [FinOps unit economics capability](https://www.finops.org/framework/capabilities/unit-economics/)
- [FinOps for AI technology category](https://www.finops.org/framework/technology-categories/ai/)
- [AI for FinOps prompts and allocation](https://www.finops.org/wg/ai-finops-prompts/)

## Arbitration research leads

Search results indicate relevant research on calibrated abstention, multi-agent deliberation, evidence-weighted arbitration, judge calibration, and human escalation. Candidate sources to verify before final drafting include:

- [Trust or Escalate: LLM Judges with Provable Guarantees for Human Agreement](https://proceedings.iclr.cc/paper_files/paper/2025/hash/08dabd5345b37fffcbe335bd578b15a0-Abstract-Conference.html)
- [A Survey of Abstention in Large Language Models](https://direct.mit.edu/tacl/article/doi/10.1162/tacl_a_00754/131566/Know-Your-Limits-A-Survey-of-Abstention-in-Large)
- [From Debate to Decision: Conformal Social Choice for Safe Multi-Agent Deliberation](https://arxiv.org/abs/2604.07667)
- [One Panel Does Not Fit All: Case-Adaptive Multi-Agent Deliberation for Clinical Prediction](https://aclanthology.org/2026.acl-srw.75/)

These sources should support claims about calibration, abstention, disagreement, and evidence-aware aggregation without presenting a generic “agents vote” article.

## Verified arbitration sources

[Trust or Escalate: LLM Judges with Provable Guarantees for Human Agreement](https://proceedings.iclr.cc/paper_files/paper/2025/hash/08dabd5345b37fffcbe335bd578b15a0-Abstract-Conference.html), ICLR 2025, argues that reliable LLM evaluation should not blindly rely on model preference. It proposes selective evaluation: estimate judge confidence, trust only selected cases, and escalate uncertain cases. The abstract describes calibrated simulated annotators and cascaded selective evaluation, where cheaper judges handle easy cases and stronger judges or humans are used only when necessary. This supports a cost-aware arbitration cascade rather than majority voting everywhere.

[Know Your Limits: A Survey of Abstention in Large Language Models](https://direct.mit.edu/tacl/article/doi/10.1162/tacl_a_00754/131566/Know-Your-Limits-A-Survey-of-Abstention-in-Large), TACL 2025, frames abstention as refusal to answer and organizes methods/evaluation through query, model, and human-values perspectives. The article identifies abstention as a way to reduce hallucinations and improve safety, while noting domain/context limitations. For the blog, abstention should be a deliberate system state with a measurable coverage/correctness trade-off, not an evasive fallback.

MIT page was CAPTCHA-blocked for interactive rendering, but the extracted open-access abstract and bibliographic metadata were available; do not rely on any content beyond that abstract unless independently verified.
