import { IFileTextReader } from 'src/application-business-rules/ports/services/IFileTextReader';

/**
 * FileReader APIのframeworks-and-drivers層ラッパー
 * CA準拠: FileReader APIの直接使用をこの層に閉じ込め、上位層の依存を排除する
 */
export class FileTextReader implements IFileTextReader {
  readAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('ファイルの読み取りに失敗しました'));
        }
      };
      reader.onerror = () => reject(new Error('ファイルの読み取りに失敗しました'));
      reader.readAsText(file);
    });
  }
}
