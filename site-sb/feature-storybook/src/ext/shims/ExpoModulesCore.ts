export const NativeModulesProxy: Record<string, any> = {}
export const requireNativeModule = (_name: string) => ({} as any)
export const requireOptionalNativeModule = (_name: string) => ({} as any)
export const requireNativeViewManager = (_name: string) => ({} as any)

export const EventSubscription = { remove: () => {} }

export const Platform = {
  OS: 'web' as const,
  select<T extends Record<string, any>>(specs: T): T[keyof T] | undefined {
    // Prefer 'web', then 'default'
    if ('web' in specs) return specs['web']
    if ('default' in specs) return specs['default']
    return undefined
  },
}

export class UnavailabilityError extends Error {
  constructor(moduleName: string, propertyName: string) {
    super(`The method or property ${moduleName}.${propertyName} is not available on web.`)
    this.name = 'UnavailabilityError'
  }
}

export const CodedError = class extends Error {
  code;
  constructor(code, message) {
    super(message);
this.code = code;
  }
};

export const PermissionStatus = {
  GRANTED: 'granted',
  UNDETERMINED: 'undetermined',
  DENIED: 'denied',
};

export function createPermissionHook(options) {
  return () => [null, () => {}, () => {}];
}


export default { NativeModulesProxy, requireNativeModule, requireOptionalNativeModule, requireNativeViewManager, Platform, UnavailabilityError, EventSubscription }
