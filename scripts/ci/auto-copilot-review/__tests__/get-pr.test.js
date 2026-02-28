'use strict';

const getPr = require('../get-pr');

describe('get-pr', () => {
  let github;
  let context;
  let core;

  beforeEach(() => {
    github = {
      paginate: jest.fn(),
      rest: {
        repos: {
          listPullRequestsAssociatedWithCommit: jest.fn(),
        },
      },
    };
    context = {
      payload: {
        workflow_run: {
          head_sha: 'abc123def456',
        },
      },
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

  test('オープンPRが見つかった場合、pr_numberを出力する', async () => {
    github.paginate.mockResolvedValue([
      { number: 42, state: 'open' },
    ]);

    await getPr({ github, context, core });

    expect(core.setOutput).toHaveBeenCalledWith('pr_number', '42');
    expect(core.info).toHaveBeenCalledWith(expect.stringContaining('PR #42'));
  });

  test('オープンPRが複数ある場合、最初のオープンPRのpr_numberを出力する', async () => {
    github.paginate.mockResolvedValue([
      { number: 10, state: 'closed' },
      { number: 42, state: 'open' },
      { number: 50, state: 'open' },
    ]);

    await getPr({ github, context, core });

    expect(core.setOutput).toHaveBeenCalledWith('pr_number', '42');
  });

  test('オープンPRが存在しない場合、空文字を出力する', async () => {
    github.paginate.mockResolvedValue([
      { number: 10, state: 'closed' },
    ]);

    await getPr({ github, context, core });

    expect(core.setOutput).toHaveBeenCalledWith('pr_number', '');
    expect(core.info).toHaveBeenCalledWith(expect.stringContaining('No open PR'));
  });

  test('PRが0件の場合、空文字を出力する', async () => {
    github.paginate.mockResolvedValue([]);

    await getPr({ github, context, core });

    expect(core.setOutput).toHaveBeenCalledWith('pr_number', '');
  });

  test('APIエラーが発生した場合、core.errorを呼び出し空文字を出力する', async () => {
    github.paginate.mockRejectedValue(new Error('API rate limit exceeded'));

    await getPr({ github, context, core });

    expect(core.error).toHaveBeenCalledWith(expect.stringContaining('API rate limit exceeded'));
    expect(core.setOutput).toHaveBeenCalledWith('pr_number', '');
  });

  test('head_shaを使ってAPIを呼び出す', async () => {
    github.paginate.mockResolvedValue([{ number: 42, state: 'open' }]);

    await getPr({ github, context, core });

    expect(github.paginate).toHaveBeenCalledWith(
      github.rest.repos.listPullRequestsAssociatedWithCommit,
      expect.objectContaining({
        commit_sha: 'abc123def456',
        owner: 'testOwner',
        repo: 'testRepo',
      })
    );
  });
});
