'use strict';

const requestReview = require('../request-review');

describe('request-review', () => {
  let github;
  let context;
  let core;

  beforeEach(() => {
    process.env.PR_NUMBER = '42';

    github = {
      rest: {
        pulls: {
          requestReviewers: jest.fn(),
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
      warning: jest.fn(),
    };
  });

  afterEach(() => {
    delete process.env.PR_NUMBER;
  });

  test('Copilotレビューを正常にリクエストする', async () => {
    github.rest.pulls.requestReviewers.mockResolvedValue({});

    await requestReview({ github, context, core });

    expect(github.rest.pulls.requestReviewers).toHaveBeenCalledWith({
      owner: 'testOwner',
      repo: 'testRepo',
      pull_number: 42,
      reviewers: ['copilot-pull-request-reviewer[bot]'],
    });
    expect(core.info).toHaveBeenCalledWith(expect.stringContaining('PR #42'));
  });

  test('APIエラーが発生しても例外をスローせず、warningを出力する（非致命的エラー）', async () => {
    github.rest.pulls.requestReviewers.mockRejectedValue(
      new Error('422 Unprocessable Entity')
    );

    await expect(requestReview({ github, context, core })).resolves.not.toThrow();
    expect(core.warning).toHaveBeenCalledWith(
      expect.stringContaining('422 Unprocessable Entity')
    );
  });

  test('PR_NUMBERを整数としてAPIに渡す', async () => {
    process.env.PR_NUMBER = '100';
    github.rest.pulls.requestReviewers.mockResolvedValue({});

    await requestReview({ github, context, core });

    expect(github.rest.pulls.requestReviewers).toHaveBeenCalledWith(
      expect.objectContaining({ pull_number: 100 })
    );
  });
});
