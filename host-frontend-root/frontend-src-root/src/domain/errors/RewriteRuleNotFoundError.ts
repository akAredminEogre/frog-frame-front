export class RewriteRuleNotFoundError extends Error {
  constructor(id: string) {
    super(`Rewrite rule with id "${id}" not found`);
    this.name = 'RewriteRuleNotFoundError';
  }
}
