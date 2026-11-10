'use client'

import * as directories from '@statstrade/web-superadmin/adminweb/directories.jsx'

import * as workspace from '@statstrade/web-superadmin/adminweb/workspace.jsx'

// statstrade-superadmin.pages.a02.s02-organisation/Page [16] 
function Page(){
  return (
    <workspace.AdminWorkspace
      section="organisation"
      content={directories.OrganisationsContent}/>);
}

export default Page