import { vi } from 'vitest'

vi.mock('@statstrade/edge/lib/js/react/ext-box', () => ({
  attachLocalStorage: vi.fn((_storageKey, box) => box),
  createBox: vi.fn(() => ({})),
  getData: vi.fn(),
  setData: vi.fn(),
  useListenBox: vi.fn(),
  useBox: vi.fn(),
  delData: vi.fn(),
}))

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(),
}))
