'use client'

import * as newsroom from '@statstrade/web-superadmin/adminweb/newsroom.jsx'

import * as workspace from '@statstrade/web-superadmin/adminweb/workspace.jsx'

// statstrade-superadmin.pages.newsroom.imports/Page [7] 
function Page(){
  return (
    <workspace.AdminWorkspace
      section="super"
      area="admin/newsroom"
      content={newsroom.NewsroomContent}/>);
}

export default Page