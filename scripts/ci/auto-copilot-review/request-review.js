// Request Copilot review for a PR
// Used by: .github/workflows/auto-copilot-review.yml (step: Request Copilot review)
// Context: actions/github-script@v7 (github, context, core are injected via args)
// Env: PR_NUMBER

module.exports = async function({ github, context, core }) {
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
};
