'use client'

import * as directories from '@statstrade/web-superadmin/adminweb/directories.jsx'

import * as workspace from '@statstrade/web-superadmin/adminweb/workspace.jsx'

// statstrade-superadmin.pages.a03.s06-admin-user/Page [16] 
function Page(){
  return (
    <workspace.AdminWorkspace
      section="super"
      area="admin/user"
      content={directories.UsersContent}/>);
}

export default Page