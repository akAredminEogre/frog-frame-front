// DomConverterStrategyはインターフェースなので、直接テストは行いません。
// 実装クラス（DefaultDomConverter, TableDomConverter）のテストで間接的にカバーされます。
describe('DomConverterStrategy', () => {
  it('should be implemented by concrete converter classes', () => {
    // このテストは、インターフェースが正しく定義されていることを確認するためのプレースホルダーです。
    // 実際のテストはDefaultDomConverter.test.tsやTableDomConverter.test.tsで行われます。
    expect(true).toBe(true);
  });
});
