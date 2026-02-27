// Check if Copilot review has already been requested or completed
// Used by: .github/workflows/auto-copilot-review.yml (step: check-copilot)
// Context: actions/github-script@v7 (github, context, core are injected)
// Env: PR_NUMBER

const prNumber = parseInt(process.env.PR_NUMBER, 10);
try {
  const { data: pr } = await github.rest.pulls.get({
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: prNumber,
  });
  const alreadyRequested = pr.requested_reviewers?.some(
    r => r?.login === 'copilot-pull-request-reviewer[bot]'
  );
  const { data: reviews } = await github.rest.pulls.listReviews({
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: prNumber,
  });
  const alreadyReviewed = reviews?.some(
    r => r.user?.login === 'copilot-pull-request-reviewer[bot]'
  );
  const skip = alreadyRequested || alreadyReviewed;
  core.info(`Copilot already requested: ${alreadyRequested}, reviewed: ${alreadyReviewed}`);
  core.setOutput('skip', skip ? 'true' : 'false');
} catch (error) {
  core.error(`❌ Failed to check Copilot status: ${error.message}`);
  throw error;
}
