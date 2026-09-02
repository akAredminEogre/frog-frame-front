import { vi } from 'vitest';

import { IJsonParser } from 'src/application-business-rules/ports/services/IJsonParser';

/**
 * IJsonParserのモックオブジェクトを生成する
 * @returns IJsonParser型のモックオブジェクト
 */
export const createMockJsonParser = (): IJsonParser => ({
  parse: vi.fn(),
  parseAsObject: vi.fn(),
});
