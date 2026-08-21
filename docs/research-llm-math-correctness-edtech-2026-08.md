# Research note: Correctness when using LLM APIs to generate mathematics for EdTech

Date checked: 2026-08-21

## Editorial thesis

LLM output should be treated as a candidate artifact, not as the mathematical source of truth. A reliable EdTech system separates generation from verification: generate a structured problem/solution candidate, run an independent checker or solver, validate pedagogy and curriculum constraints, then publish only an accepted artifact. The system should be able to abstain, regenerate, or route to human review.

## Research findings

1. Daheim et al. (EMNLP 2024) study stepwise verification and remediation of student reasoning errors. Their abstract reports a dataset of 1,002 stepwise math reasoning chains with the first error step annotated by teachers. They show that student-solution verification is challenging for current models, and that verifiers can steer response generation toward more targeted, correct, and less hallucinated feedback than baselines.
Source: https://aclanthology.org/2024.emnlp-main.478/

2. Gupta et al., Beyond Final Answers: Evaluating Large Language Models for Math Tutoring (arXiv:2503.16460, 2025), reports that LLMs can often produce pedagogically aligned responses while still making frequent mistakes and inaccuracies. The paper explicitly distinguishes final-answer correctness from the quality and correctness of stepwise tutoring support, and warns that plausible errors can create student misconceptions. It evaluates algebra tutoring with an intelligent-tutoring-system testbed and interactive prompting.
Source: https://arxiv.org/html/2503.16460v1

3. Zhou and Zhang, Step-Wise Formal Verification for LLM-Based Mathematical Problem Solving (arXiv:2505.20869, 2025), proposes a Formalizer plus Critic pipeline. The Formalizer maps natural-language problem/solution content into a structured SimpleMath representation; the Critic verifies steps using external tools such as Z3 and SymPy. The paper describes facts, assumptions, theorems, definitions, conclusions and a solution graph to focus verification on relevant reasoning dependencies.
Source: https://arxiv.org/html/2505.20869v1

4. A practical EdTech architecture should verify multiple properties separately: numerical/symbolic correctness, answer equivalence, domain constraints, step validity, problem solvability, curriculum/grade alignment, pedagogical safety, formatting, and leakage of answer keys. Passing one verifier does not imply passing the others.

## Proposed article direction

Working title EN: "LLM Math That Students Can Trust: A Verification-First Architecture for EdTech APIs"
Working title VI: "LLM sinh Toán đáng tin cho EdTech: Kiến trúc Verification-First khi dùng API"

Distinct angle: not a generic AI tutor article, not a prompt-engineering guide, and not only a model benchmark. It is a production design playbook for generating mathematical exercises and feedback while keeping a deterministic verifier, structured answer contract, dataset regression suite, human review and abstention path outside the LLM.

Planned implementation examples:
- JSON contract for problem, variables, constraints, expected answer set, solution steps and pedagogical intent.
- Generate -> parse -> symbolic/numeric verify -> adversarial checks -> pedagogical review -> publish.
- SymPy/Z3-style examples, with exact arithmetic preferred over floating-point comparison where relevant.
- Metamorphic tests: equivalent expressions, unit changes, variable renaming, boundary values and controlled perturbations.
- Separate generation metrics from release metrics: validity rate, verifier pass rate, answer-equivalence rate, first-error localization, explanation faithfulness, grade alignment, latency and cost.
- Rollback and quarantine for generated items that fail post-publication sampling.

## References to include in article

[1] Daheim et al. (2024), ACL Anthology / EMNLP: https://aclanthology.org/2024.emnlp-main.478/
[2] Gupta et al. (2025), Beyond Final Answers: https://arxiv.org/html/2503.16460v1
[3] Zhou and Zhang (2025), Step-Wise Formal Verification: https://arxiv.org/html/2505.20869v1

## Caveat

The research papers support the need for verification and the difficulty of reliable stepwise tutoring. They do not by themselves guarantee a production accuracy percentage for every EdTech domain. Any article claim should distinguish published evidence, deterministic engineering guarantees, and product-specific benchmark results.

## Visual concept

A four-image editorial schematic set: hero showing LLM candidate entering a verification gate; structured math contract and solver; adversarial/metamorphic test matrix; and a release loop from generate to quarantine/publish/monitor. Use the existing folio paper-texture, lavender-sage-terracotta palette and hand-drawn technical diagram style.

## Additional verified findings

5. MATH-VF (Zhou and Zhang, 2025) describes a Formalizer that converts natural-language solutions into a structured SimpleMath language. Its Critic checks each step with external tools including a computer algebra system and an SMT solver such as Z3. The design separates the LLM's natural-language generation from the formal checking layer and uses a solution graph to focus on relevant dependencies.

6. OpenAI Structured Outputs documentation states that the feature constrains model responses to a supplied JSON Schema and can provide reliable type-safety and programmatically detectable refusals. The documentation also explicitly warns that schema adherence does not eliminate semantic mistakes; generated structured data can still contain errors. This supports the article's distinction between syntactic validity and mathematical correctness.
Source: https://developers.openai.com/api/docs/guides/structured-outputs

7. Official SymPy documentation describes symbolic equation solving and `solveset`; official Z3 materials describe constraint solving over arithmetic and logical formulas. These tools are appropriate examples of independent verifiers, but their domains and modeling assumptions must be made explicit in a production design.
Sources: https://docs.sympy.org/latest/modules/solvers/solvers.html
https://theory.stanford.edu/~nikolaj/programmingz3.html

## Engineering interpretation

The article should use a two-contract model. The LLM API contract guarantees parseable structure, explicit refusal/error states and bounded fields. The mathematics contract guarantees that a separate verifier can recompute, prove, or falsify the claimed result under stated assumptions. An EdTech release gate should fail closed when either contract fails.

A correct answer is not sufficient for tutoring quality. A production grader also needs to check whether the task is solvable as written, whether the solution steps preserve equivalence, whether hints reveal the answer too early, whether the explanation matches the learner's level, and whether a single mistake is corrected without introducing another one.
