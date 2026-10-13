import {expect,it} from 'vitest'

import * as campaign from '@statstrade/web-superadmin/pages/adminweb/super/admin/campaign.jsx'

import * as workspace from '@statstrade/web-superadmin/adminweb/workspace.jsx'

// statstrade-superadmin.adminweb.functional.campaign-test/test-campaign-page-route [14] 
it("passes the superadmin campaign route to the workspace",function (){
  let Page = campaign["default"];
  let page = Page();
  expect(page["type"]).toBe(workspace["AdminWorkspace"]);
  expect(page["props"]["section"]).toBe("super");
  expect(page["props"]["area"]).toBe("admin/campaign");
});