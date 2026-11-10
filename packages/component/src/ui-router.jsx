import * as PagesRouter from 'next/compat/router'

import * as NextNavigation from 'next/navigation'

// statsui.basic.ui-router/useRouter [7] 
export function useRouter(){
  let pages = PagesRouter.useRouter();
  if(pages){
    return pages;
  }
  return NextNavigation.useRouter();
}

// statsui.basic.ui-router/usePathname [12] 
export function usePathname(){
  let pages = PagesRouter.useRouter();
  let path = NextNavigation.usePathname();
  return pages ? (pages.asPath || pages.pathname || "/").split("?")[0] : path;
}