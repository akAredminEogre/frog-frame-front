'use strict';

const checkThreads = require('../check-threads');

describe('check-threads', () => {
  let github;
  let context;
  let core;

  const makeGraphqlResult = (nodes, hasNextPage = false, endCursor = null) => ({
    repository: {
      pullRequest: {
        reviewThreads: {
          pageInfo: { hasNextPage, endCursor },
          nodes,
        },
      },
    },
  });

  beforeEach(() => {
    process.env.PR_NUMBER = '42';

    github = {
      graphql: jest.fn(),
    };
    context = {
      repo: {
        owner: 'testOwner',
        repo: 'testRepo',
      },
    };
    core = {
      info: jest.fn(),
      error: jest.fn(),
      setOutput: jest.fn(),
    };
  });

  afterEach(() => {
    delete process.env.PR_NUMBER;
  });

  test('スレッドが0件の場合、has_unresolved=falseを出力する', async () => {
    github.graphql.mockResolvedValueOnce(makeGraphqlResult([]));

    await checkThreads({ github, context, core });

    expect(core.setOutput).toHaveBeenCalledWith('has_unresolved', 'false');
    expect(core.setOutput).toHaveBeenCalledWith('unresolved_count', '0');
  });

  test('未解決スレッドがある場合、has_unresolved=trueを出力する', async () => {
    github.graphql.mockResolvedValueOnce(makeGraphqlResult([
      { isResolved: false, isOutdated: false },
      { isResolved: true, isOutdated: false },
    ]));

    await checkThreads({ github, context, core });

    expect(core.setOutput).toHaveBeenCalledWith('has_unresolved', 'true');
    expect(core.setOutput).toHaveBeenCalledWith('unresolved_count', '1');
  });

  test('全スレッドが解決済みの場合、has_unresolved=falseを出力する', async () => {
    github.graphql.mockResolvedValueOnce(makeGraphqlResult([
      { isResolved: true, isOutdated: false },
      { isResolved: true, isOutdated: false },
    ]));

    await checkThreads({ github, context, core });

    expect(core.setOutput).toHaveBeenCalledWith('has_unresolved', 'false');
    expect(core.setOutput).toHaveBeenCalledWith('unresolved_count', '0');
  });

  test('isOutdatedのスレッドは未解決扱いしない', async () => {
    github.graphql.mockResolvedValueOnce(makeGraphqlResult([
      { isResolved: false, isOutdated: true },
    ]));

    await checkThreads({ github, context, core });

    expect(core.setOutput).toHaveBeenCalledWith('has_unresolved', 'false');
    expect(core.setOutput).toHaveBeenCalledWith('unresolved_count', '0');
  });

  test('ページネーション: 複数ページのスレッドを全件取得する', async () => {
    github.graphql
      .mockResolvedValueOnce(makeGraphqlResult(
        [{ isResolved: true, isOutdated: false }],
        true,
        'cursor123'
      ))
      .mockResolvedValueOnce(makeGraphqlResult(
        [{ isResolved: false, isOutdated: false }],
        false,
        null
      ));

    await checkThreads({ github, context, core });

    expect(github.graphql).toHaveBeenCalledTimes(2);
    expect(core.setOutput).toHaveBeenCalledWith('has_unresolved', 'true');
    expect(core.setOutput).toHaveBeenCalledWith('unresolved_count', '1');
  });

  test('2ページ目でcursorを引き継いでAPIを呼び出す', async () => {
    github.graphql
      .mockResolvedValueOnce(makeGraphqlResult([], true, 'cursor-abc'))
      .mockResolvedValueOnce(makeGraphqlResult([], false, null));

    await checkThreads({ github, context, core });

    expect(github.graphql).toHaveBeenNthCalledWith(2, expect.any(String), expect.objectContaining({
      cursor: 'cursor-abc',
    }));
  });

  test('GraphQLレスポンスにreviewThreadsがない場合、早期リターンする', async () => {
    github.graphql.mockResolvedValueOnce({
      repository: { pullRequest: null },
    });

    await checkThreads({ github, context, core });

    expect(core.error).toHaveBeenCalledWith(expect.stringContaining('not found'));
    expect(core.setOutput).not.toHaveBeenCalled();
  });

  test('APIエラーが発生した場合、エラーをスローする', async () => {
    github.graphql.mockRejectedValue(new Error('GraphQL error'));

    await expect(checkThreads({ github, context, core })).rejects.toThrow('GraphQL error');
    expect(core.error).toHaveBeenCalled();
  });
});
