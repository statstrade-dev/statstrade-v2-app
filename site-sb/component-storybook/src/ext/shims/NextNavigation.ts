// Storybook shim for Next.js App Router hooks
// This prevents errors like "invariant expected app router to be mounted" in Storybook.

export type AppRouterInstance = {
  push: (href: string) => void
  replace: (href: string) => void
  refresh: () => void
  back: () => void
  forward: () => void
  prefetch: (href: string) => Promise<void>
}

const noop = () => {}
const warn = (method: string) => (...args: any[]) => {
  if (typeof console !== 'undefined') {
    // Log once per method per session to avoid noisy consoles
    try {
      console.debug(`[storybook shim] next/navigation.${method} called`, ...args)
    } catch (_) {}
  }
}

export function useRouter(): AppRouterInstance {
  return {
    push: warn('router.push'),
    replace: warn('router.replace'),
    refresh: warn('router.refresh'),
    back: warn('router.back'),
    forward: warn('router.forward'),
    prefetch: async (_href: string) => {
      warn('router.prefetch')(_href)
      return Promise.resolve()
    },
  }
}

export function usePathname(): string {
  // Provide a stable fallback pathname in Storybook
  return typeof window !== 'undefined' ? window.location.pathname || '/' : '/'
}

export function useSearchParams(): URLSearchParams {
  if (typeof window !== 'undefined') {
    return new URLSearchParams(window.location.search)
  }
  return new URLSearchParams()
}

export function useParams<T extends Record<string, string> = Record<string, string>>(): T {
  // No dynamic segments in Storybook by default; return empty params
  return {} as T
}

export function redirect(_url: string) {
  warn('redirect')(_url)
}

export function notFound() {
  warn('notFound')()
}

// Some components import this from next/navigation to inject styles during SSR.
// In Storybook we can no-op; optionally invoke the callback for side effects.
export function useServerInsertedHTML(cb?: () => any) {
  try {
    if (typeof cb === 'function') {
      cb()
    }
  } catch (_) {
    // ignore in Storybook
  }
}
