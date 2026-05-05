import type { MessageTtl } from '@/types'

export const TTL_OPTIONS: { label: string; value: MessageTtl }[] = [
  { label: 'Burn after reading', value: 'view-once' },
  { label: 'Burn after 1 hour', value: '1h' },
]

export const MAX_MESSAGE_LENGTH = 10_000
