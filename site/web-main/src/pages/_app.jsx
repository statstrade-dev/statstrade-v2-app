import React from 'react'

import * as page_models from '@statstrade/web-main/lib/page-models.jsx'

import * as frame from '@statstrade/component/layout/common/frame-base.jsx'

import * as visual from '@statstrade/feature/visual/shell.jsx'

import * as auth_runtime from '@statstrade/web-main/lib/auth-runtime.jsx'

import * as layout_base from '@statstrade/component/layout/layout-base.jsx'

// statstrade-web.page._app/AppLayout [30] 
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
          content="Understand Australian issues. Make informed forecasts."/>
        <meta property="og:type" content="website"/>
        <meta property="og:title" content="Statstrade"/>
        <meta
          property="og:description"
          content="Briefings, evidence, community reasoning and forecasts on the issues shaping Australia."/>
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval' data: blob:; connect-src * 'unsafe-inline' data: blob:; img-src * data: blob: 'unsafe-inline'; frame-src * data: blob: ; style-src * data: blob: 'unsafe-inline';"/>
      </frame.NextHead>
      <layout_base.LayoutBase sharedWorkerEnabled={false}>
        {(true == Component.reputationPreview) ? (
          <visual.Shell routeKey={Component.pageModelKey}>{React.createElement(Component,pageProps)}</visual.Shell>) : (
          <auth_runtime.AuthRuntimeProvider>
            <visual.Shell routeKey={Component.pageModelKey}>
              <page_models.PageModels routeKey={Component.pageModelKey}>{React.createElement(Component,pageProps)}</page_models.PageModels>
            </visual.Shell>
          </auth_runtime.AuthRuntimeProvider>)}
      </layout_base.LayoutBase>
    </React.Fragment>);
}

export default AppLayout