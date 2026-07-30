import { Injectable } from '@nestjs/common'
import { createClient } from '@supabase/supabase-js'
import type { IStorageService } from '../../core/domain/ports/storage-service.port'

@Injectable()
export class SupabaseStorageService implements IStorageService {
  private getClient() {
    const url = process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) throw new Error('Supabase env vars not configured')
    return createClient(url, key)
  }

  async upload(bucket: string, path: string, file: Buffer, mimeType: string): Promise<string> {
    const supabase = this.getClient()
    const { error } = await supabase.storage.from(bucket).upload(path, file, {
      contentType: mimeType,
      upsert: true,
    })
    if (error) throw new Error(`Error subiendo imagen: ${error.message}`)
    return this.getPublicUrl(bucket, path)
  }

  async delete(bucket: string, path: string): Promise<void> {
    const supabase = this.getClient()
    const { error } = await supabase.storage.from(bucket).remove([path])
    if (error) throw new Error(`Error eliminando imagen: ${error.message}`)
  }

  getPublicUrl(bucket: string, path: string): string {
    const supabase = this.getClient()
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
  }
}
