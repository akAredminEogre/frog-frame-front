// Get PR number from head SHA
// Used by: .github/workflows/auto-copilot-review.yml (step: get-pr)
// Context: actions/github-script@v7 (github, context, core are injected via args)

module.exports = async function({ github, context, core }) {
  const headSha = context.payload.workflow_run.head_sha;
  try {
    const prs = await github.paginate(
      github.rest.repos.listPullRequestsAssociatedWithCommit,
      {
        owner: context.repo.owner,
        repo: context.repo.repo,
        commit_sha: headSha,
        per_page: 100,
      }
    );
    const pr = prs.find(p => p.state === 'open');
    if (!pr) {
      core.info(`No open PR found for SHA: ${headSha}`);
      core.setOutput('pr_number', '');
    } else {
      core.info(`Found PR #${pr.number} for SHA: ${headSha}`);
      core.setOutput('pr_number', pr.number.toString());
    }
  } catch (error) {
    core.error(`❌ Failed to get PR number for SHA ${headSha}: ${error.message}`);
    core.setOutput('pr_number', '');
  }
};
