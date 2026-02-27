// Request Copilot review for a PR
// Used by: .github/workflows/auto-copilot-review.yml (step: request-copilot-review)
// Context: actions/github-script@v7 (github, context, core are injected)
// Env: PR_NUMBER

const prNumber = parseInt(process.env.PR_NUMBER, 10);
try {
  await github.rest.pulls.requestReviewers({
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: prNumber,
    reviewers: ['copilot-pull-request-reviewer[bot]'],
  });
  core.info(`✅ Copilot review requested for PR #${prNumber}`);
} catch (error) {
  core.warning(`⚠️ Failed to request Copilot review (non-fatal): ${error.message}`);
}
