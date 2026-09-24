export const openURL = (url: string) => {
  if (typeof window !== 'undefined') {
    window.open(url, '_blank')
  }
}
export const createURL = (path: string) => path
export const canOpenURL = async () => true
export default { openURL, createURL, canOpenURL }
