export type MessageTtl = 'view-once' | '1h'

export interface CreateMessageRequest {
  content: string
  ttl: MessageTtl
}

export interface CreateMessageResponse {
  id: string
  expiresAt: string // ISO 8601
}

export interface ViewMessageResponse {
  content: string
  burnedAt: string // ISO 8601
}

export interface ApiError {
  code: 'NOT_FOUND' | 'ALREADY_BURNED' | 'EXPIRED' | 'SERVER_ERROR'
  message: string
}
