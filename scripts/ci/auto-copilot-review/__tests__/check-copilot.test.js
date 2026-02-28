'use strict';

const checkCopilot = require('../check-copilot');

describe('check-copilot', () => {
  let github;
  let context;
  let core;

  beforeEach(() => {
    process.env.PR_NUMBER = '42';

    github = {
      paginate: jest.fn(),
      rest: {
        pulls: {
          get: jest.fn(),
          listReviews: jest.fn(),
        },
      },
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

  test('Copilotがすでにレビュー依頼済みの場合、skip=trueを出力する', async () => {
    github.rest.pulls.get.mockResolvedValue({
      data: {
        requested_reviewers: [
          { login: 'copilot-pull-request-reviewer[bot]' },
        ],
      },
    });
    github.paginate.mockResolvedValue([]);

    await checkCopilot({ github, context, core });

    expect(core.setOutput).toHaveBeenCalledWith('skip', 'true');
  });

  test('Copilotがすでにレビュー済みの場合、skip=trueを出力する', async () => {
    github.rest.pulls.get.mockResolvedValue({
      data: { requested_reviewers: [] },
    });
    github.paginate.mockResolvedValue([
      { user: { login: 'copilot-pull-request-reviewer[bot]' } },
    ]);

    await checkCopilot({ github, context, core });

    expect(core.setOutput).toHaveBeenCalledWith('skip', 'true');
  });

  test('Copilotが依頼済みでもレビュー済みでもない場合、skip=falseを出力する', async () => {
    github.rest.pulls.get.mockResolvedValue({
      data: {
        requested_reviewers: [
          { login: 'other-reviewer' },
        ],
      },
    });
    github.paginate.mockResolvedValue([
      { user: { login: 'other-reviewer' } },
    ]);

    await checkCopilot({ github, context, core });

    expect(core.setOutput).toHaveBeenCalledWith('skip', 'false');
  });

  test('requested_reviewersが空の場合もエラーなく動作する', async () => {
    github.rest.pulls.get.mockResolvedValue({
      data: { requested_reviewers: [] },
    });
    github.paginate.mockResolvedValue([]);

    await checkCopilot({ github, context, core });

    expect(core.setOutput).toHaveBeenCalledWith('skip', 'false');
  });

  test('reviewerオブジェクトのloginがnullでもエラーなく動作する（optional chaining）', async () => {
    github.rest.pulls.get.mockResolvedValue({
      data: {
        requested_reviewers: [null, { login: null }, { login: 'other' }],
      },
    });
    github.paginate.mockResolvedValue([
      { user: null },
      { user: { login: null } },
    ]);

    await expect(checkCopilot({ github, context, core })).resolves.not.toThrow();
    expect(core.setOutput).toHaveBeenCalledWith('skip', 'false');
  });

  test('APIエラーが発生した場合、エラーをスローする', async () => {
    github.rest.pulls.get.mockRejectedValue(new Error('GitHub API error'));

    await expect(checkCopilot({ github, context, core })).rejects.toThrow('GitHub API error');
    expect(core.error).toHaveBeenCalled();
  });
});
