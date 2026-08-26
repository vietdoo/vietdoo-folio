# Working research notes — enterprise Git and release workflow

## Scope
The new article will explain how a large enterprise team manages source code and ships a feature safely, using a fictionalized public-service case: a button that lets a citizen receive an email while an application is being processed at step 3. The company identity will remain generic and must not name the user's employer.

## Sources opened
1. GitHub Docs — About protected branches
   URL: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches
   Key points: branch protection can restrict deletion and force-push, require pull request reviews, required status checks, conversation resolution, signed commits, linear history, merge queue, successful deployments, and restrict who may push. Required reviews can include code owners and approval of the most recent reviewable push; stale approvals can be dismissed when the diff changes. The article should present these as controls, not as a universal mandate.

2. GitHub Docs — Managing a merge queue
   URL: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue
   Key points: a merge queue helps keep a busy branch unbroken; it validates changes on the latest target branch plus changes already queued. It can use GitHub Actions or another CI provider, creates temporary merge-group branches, and requires CI to report on `merge_group` events. A failed check or conflict removes the PR from the queue. The article should use this to explain why “green on my branch” is not enough for a busy main/master.

## Proposed article boundaries
- Explain trunk-based development with short-lived feature branches, while still showing an enterprise-compatible dev -> main/master promotion flow.
- Treat `main` or `master` as production-facing protected branches; do not imply a team should maintain both names simultaneously. If a legacy repository has both, define one canonical branch and make the other a compatibility/transition branch.
- Make the case study safe: no real citizen identifiers, email addresses, attachments, or hidden organization details. Use domain events, authorization, idempotency, audit trail, and feature flag rather than a direct “send email now” side effect.
- Clarify merge is not deploy: merge produces a reviewed artifact; promotion to dev/staging/prod is a separate controlled action with CI, approvals, smoke tests, canary/rolling rollout, observability, and rollback.

## Follow-up sources needed
- DORA or trunk-based guidance for branch lifetime and continuous integration.
- GitHub Actions deployment environments/approvals or equivalent release controls.
- OWASP guidance for authorization/logging and a mail provider/API reference only if specific provider claims are made.

## Additional sources opened
3. DORA — Trunk-based development
   URL: https://dora.dev/capabilities/trunk-based-development/
   Key points: feature branches and trunk-based development differ mainly in scope and lifetime; trunk-based branches are typically short-lived and merged frequently. DORA describes CI as trunk-based development plus fast automated tests after commits, and emphasizes keeping trunk green. Its cited analysis uses goals such as three or fewer active branches, at least daily merges, and no code-freeze/integration phase. The article should present these as evidence-backed targets, not rigid laws for every regulated team.

4. GitHub Docs — Managing environments for deployment
   URL: https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments
   Key points: jobs referencing an environment must pass that environment's protection rules before running or accessing environment secrets. A deployment creates a deployment object tied to the environment and status objects as the job progresses. Use this to separate build artifact promotion from environment-specific approval and secrets.

5. Kubernetes Docs — Deployments
   URL: https://kubernetes.io/docs/concepts/workloads/controllers/deployment/
   Key points: the default Deployment strategy is RollingUpdate, with `maxSurge` and `maxUnavailable` controlling gradual replacement. Kubernetes supports rollout status, revision history, and `kubectl rollout undo` to a previous revision. The article should frame rolling update as one deploy mechanism, not a complete canary strategy; application-level smoke tests and business metrics are still required.

## Working recommendations for the case study
The feature should be modeled as a small, backward-compatible change: a domain command or API endpoint requests an email notification for the citizen, an authorization policy verifies the officer and application scope, an outbox/event records the intent, a worker sends the email idempotently, and audit metadata proves who triggered it and which application step was active. The UI button must not directly send an email from the browser.

The branch flow should show `feature/igate-step3-citizen-email`, local checks, PR into `dev` for integration, promotion of the same immutable artifact to staging/UAT, then PR or controlled promotion to `main`/`master` as the production branch. If the repository uses GitFlow or a legacy `master`, explain the distinction and select one canonical production branch rather than implying both are deployed simultaneously.

The deployment flow should include CI gates, artifact digest, environment protection, database compatibility, feature flag, smoke test, canary/rolling rollout, telemetry, rollback trigger, and post-deploy verification. The article must distinguish merge, build, deploy, and release as separate events.

## Diagram visual review
The first Mermaid renderings are conceptually correct but not equally suitable for inline blog display: `branch-flow.png` is extremely wide and short (3120x184), `email-feature-flow.png` is similarly wide/short (3120x272), and `deploy-gates.png` is very tall (1680x3876). Before final integration, re-render with a more balanced layout or use responsive presentation so labels stay readable in the article. The branch and email graphs are readable at native size; the deploy graph is readable but too tall for a normal article section.

## Revised diagram review
The revised `branch-flow.png` and `email-feature-flow.png` are now vertical, readable, and better suited to the article column than the initial ultra-wide renders. The branch diagram clearly shows feature -> dev -> staging/UAT -> canonical main/master -> immutable artifact -> production -> verify/rollback. The email diagram clearly shows backend authorization at step 3, denied/no-side-effect, outbox, worker, bounded retry, idempotency, provider, delivery status, and audit. The revised `deploy-gates.png` is also reduced to a compact vertical pipeline with the same release controls.

## UI review
The article route was captured at 1440x1000 and 390x844. Desktop shows the long English title, metadata card, and branch-flow diagram without visible overflow. Mobile wraps the title cleanly, stacks metadata, and renders the vertical diagram without horizontal overflow. The vertical diagrams remain readable in the article column and are more suitable than the initial wide layouts.
