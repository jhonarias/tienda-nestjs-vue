export const STORAGE_SERVICE = 'STORAGE_SERVICE'

export interface IStorageService {
  upload(bucket: string, path: string, file: Buffer, mimeType: string): Promise<string>
  delete(bucket: string, path: string): Promise<void>
  getPublicUrl(bucket: string, path: string): string
}
