import React from 'react'

import * as frame from '@statstrade/component/layout/common/frame-base.jsx'

import * as layout_base from '@statstrade/component/layout/layout-base.jsx'

// statstrade-web.page._app/AppLayout [21] 
export function AppLayout({Component,pageProps}){
  React.useEffect(function (){
    
  },[]);
  return (
    <React.Fragment>
      <frame.NextHead>
        <meta
          property="og:image"
          content={process.env.NEXT_PUBLIC_SITE_URL + "/api/og?title=Statstrade"}/>
        <meta
          property="og:image:alt"
          content="Turn every opinion into engagement."/>
        <meta property="og:type" content="website"/>
        <meta property="og:title" content="Statstrade"/>
        <meta
          property="og:description"
          content="Statstrade lets your brand run live predictions that boost interaction, loyalty, and insights - all in one gamified experience."/>
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval' data: blob:; connect-src * 'unsafe-inline' data: blob:; img-src * data: blob: 'unsafe-inline'; frame-src * data: blob: ; style-src * data: blob: 'unsafe-inline';"/>
      </frame.NextHead>
      <layout_base.LayoutBase><Component>{pageProps}</Component></layout_base.LayoutBase>
    </React.Fragment>);
}

export default AppLayout