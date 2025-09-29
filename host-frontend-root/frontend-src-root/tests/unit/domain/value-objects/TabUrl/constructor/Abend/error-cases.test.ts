import { TabUrl } from 'src/domain/value-objects/TabUrl';

/**
 * TabUrl constructor - 異常系テスト
 * 1. 空文字列でエラーを投げることを確認
 * 2. HTTPまたはHTTPS以外のプロトコルでエラーを投げることを確認  
 * 3. プロトコルなしのURLで無効なURL形式エラーを投げることを確認
 */
describe('TabUrl constructor - 異常系', () => {
  test('空文字列の場合はエラーを投げる', () => {
    expect(() => {
      new TabUrl('');
    }).toThrow('Tab URL cannot be empty');
  });

  test('HTTPまたはHTTPSで始まらない場合はエラーを投げる', () => {
    expect(() => {
      new TabUrl('ftp://example.com');
    }).toThrow('Tab URL must use http:// or https:// protocol');
  });

  test('プロトコルなしのURLの場合はエラーを投げる', () => {
    expect(() => {
      new TabUrl('example.com');
    }).toThrow('Invalid URL format');
  });
});
