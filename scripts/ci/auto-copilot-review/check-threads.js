// Check unresolved review threads via GraphQL
// Used by: .github/workflows/auto-copilot-review.yml (step: check-threads)
// Context: actions/github-script@v7 (github, context, core are injected via args)
// Env: PR_NUMBER

module.exports = async function({ github, context, core }) {
  const prNumber = parseInt(process.env.PR_NUMBER, 10);

  const query = `
    query($owner: String!, $repo: String!, $pr: Int!, $cursor: String) {
      repository(owner: $owner, name: $repo) {
        pullRequest(number: $pr) {
          reviewThreads(first: 100, after: $cursor) {
            pageInfo {
              hasNextPage
              endCursor
            }
            nodes {
              isResolved
              isOutdated
            }
          }
        }
      }
    }
  `;

  let allThreads = [];
  let cursor = null;
  let hasNextPage = true;

  try {
    while (hasNextPage) {
      const result = await github.graphql(query, {
        owner: context.repo.owner,
        repo: context.repo.repo,
        pr: prNumber,
        cursor: cursor,
      });

      const threadData = result.repository?.pullRequest?.reviewThreads;
      if (!threadData) {
        core.error('❌ Pull request or reviewThreads not found in GraphQL response. Stopping review-thread check.');
        return;
      }
      allThreads = allThreads.concat(threadData.nodes);
      hasNextPage = threadData.pageInfo.hasNextPage;
      cursor = threadData.pageInfo.endCursor;
    }

    const unresolved = allThreads.filter(t => t && !t.isResolved && !t.isOutdated);

    core.info(`Total threads: ${allThreads.length}, Unresolved: ${unresolved.length}`);
    core.setOutput('unresolved_count', unresolved.length.toString());
    core.setOutput('has_unresolved', unresolved.length > 0 ? 'true' : 'false');
  } catch (error) {
    core.error(`❌ Failed to check review threads: ${error.message}`);
    throw error;
  }
};
