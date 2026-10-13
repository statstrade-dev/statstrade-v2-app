import {expect,it,vi} from 'vitest'

import * as campaign from '@statstrade/web-superadmin/pages/adminweb/super/admin/campaign.jsx'

// statstrade-superadmin.adminweb.functional.campaign-test/test-campaign-page-route [12] 
vi.mock("@statstrade/web-superadmin/adminweb/workspace.jsx",function (){
  return {"AdminWorkspace":"workspace-manager"};
});
it("passes the superadmin campaign route to the workspace",function (){
  let Page = campaign["default"];
  let page = Page();
  expect(page["type"]).toBe("workspace-manager");
  expect(page["props"]["section"]).toBe("super");
  expect(page["props"]["area"]).toBe("admin/campaign");
});