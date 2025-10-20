export class RewriteRuleNotFoundError extends Error {
  constructor(id: number) {
    super(`Rewrite rule with id "${id}" not found`);
    this.name = 'RewriteRuleNotFoundError';
  }
}
