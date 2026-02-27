/**
 * ExportRulesJsonPresenter.present - 正常系テスト（コールバック呼び出し）
 * 1. jsonContentとfileNameでtriggerDownloadコールバックが呼び出される
 * 2. showErrorInViewは呼び出されない（コールバック分離）
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ExportRulesJsonOutputData } from 'src/application-business-rules/dto/output/ExportRulesJsonOutputData';
import { ExportRulesJsonPresenter } from 'src/interface-adapters/presenters/ExportRulesJsonPresenter';

describe('ExportRulesJsonPresenter.present - 正常系（コールバック呼び出し）', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('jsonContentとfileNameでtriggerDownloadコールバックが呼び出される', () => {
    const jsonContent = '{"version":"1.0","exportedAt":"2026-02-27T12:00:00+09:00","rules":[]}';
    const fileName = 'frog-frame-front-rules-20260227_120000.json';
    const outputData = new ExportRulesJsonOutputData(jsonContent, fileName);
    const mockTriggerDownload = vi.fn();
    const mockShowErrorInView = vi.fn();

    const presenter = new ExportRulesJsonPresenter(mockTriggerDownload, mockShowErrorInView);
    presenter.present(outputData);

    expect(mockTriggerDownload).toHaveBeenCalledTimes(1);
    expect(mockTriggerDownload).toHaveBeenCalledWith(jsonContent, fileName);
    expect(mockShowErrorInView).not.toHaveBeenCalled();
  });
});
