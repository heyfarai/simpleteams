import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface TeamLogoUploadResult {
  success: boolean
  logoUrl?: string
  storagePath?: string
  error?: string
}

export class TeamLogoService {
  private static readonly BUCKET_NAME = 'team-assets'
  private static readonly MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
  private static readonly ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

  /**
   * Upload a team logo to Supabase Storage and update the team record
   */
  static async uploadTeamLogo(teamId: string, file: File): Promise<TeamLogoUploadResult> {
    try {
      // Validate file
      const validation = this.validateFile(file)
      if (!validation.valid) {
        return { success: false, error: validation.error }
      }

      // Generate file path
      const fileExtension = file.name.split('.').pop()?.toLowerCase()
      const fileName = `logo-${teamId}-${Date.now()}.${fileExtension}`
      const storagePath = `logos/${fileName}`

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: true // Replace if exists
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        return { success: false, error: `Upload failed: ${uploadError.message}` }
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(storagePath)

      const publicUrl = urlData.publicUrl

      // Update team record
      const { error: updateError } = await supabase
        .from('teams')
        .update({
          logo_storage_path: storagePath,
          logo_public_url: publicUrl,
          logo_url: publicUrl // Keep existing field for compatibility
        })
        .eq('id', teamId)

      if (updateError) {
        console.error('Database update error:', updateError)
        // Try to clean up uploaded file
        await this.deleteTeamLogo(storagePath)
        return { success: false, error: `Failed to update team record: ${updateError.message}` }
      }

      return {
        success: true,
        logoUrl: publicUrl,
        storagePath
      }

    } catch (error) {
      console.error('Team logo upload error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  /**
   * Delete a team logo from storage
   */
  static async deleteTeamLogo(storagePath: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([storagePath])

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  /**
   * Remove logo from team record and delete from storage
   */
  static async removeTeamLogo(teamId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Get current logo path
      const { data: team, error: fetchError } = await supabase
        .from('teams')
        .select('logo_storage_path')
        .eq('id', teamId)
        .single()

      if (fetchError) {
        return { success: false, error: `Failed to fetch team: ${fetchError.message}` }
      }

      // Update team record first
      const { error: updateError } = await supabase
        .from('teams')
        .update({
          logo_storage_path: null,
          logo_public_url: null,
          logo_url: null
        })
        .eq('id', teamId)

      if (updateError) {
        return { success: false, error: `Failed to update team: ${updateError.message}` }
      }

      // Delete from storage if path exists
      if (team?.logo_storage_path) {
        await this.deleteTeamLogo(team.logo_storage_path)
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  /**
   * Get optimized logo URL with transformations
   */
  static getOptimizedLogoUrl(storagePath: string, options: {
    width?: number
    height?: number
    quality?: number
  } = {}): string {
    const { width = 200, height = 200, quality = 80 } = options

    const { data } = supabase.storage
      .from(this.BUCKET_NAME)
      .getPublicUrl(storagePath, {
        transform: {
          width,
          height,
          resize: 'cover',
          quality
        }
      })

    return data.publicUrl
  }

  /**
   * Validate uploaded file
   */
  private static validateFile(file: File): { valid: boolean; error?: string } {
    if (file.size > this.MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `File too large. Maximum size is ${this.MAX_FILE_SIZE / 1024 / 1024}MB`
      }
    }

    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: `Invalid file type. Allowed types: ${this.ALLOWED_TYPES.join(', ')}`
      }
    }

    return { valid: true }
  }

  /**
   * Generate a default logo URL (for teams without uploaded logos)
   */
  static getDefaultLogoUrl(teamName: string): string {
    // You could use a service like UI Avatars or create a default logo
    const initials = teamName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase()

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&size=200&background=9f0f1c&color=ffffff&bold=true`
  }
}