import * as vitest from 'vitest'

import * as admin from '@statstrade/edge/lib/statstrade-adminweb/a07-super/s01-admin.jsx'

// statstrade-adminweb.a07-super.s01-admin-test/test-admin-area-routing [21] 
vitest.it("resolves user, organisation, and campaign routes",function (){
  vitest.expect(admin.adminAreaRoute("user")).toBe("admin/user");
  vitest.expect(admin.adminAreaRoute("organisation")).toBe("admin/organisation");
  vitest.expect(admin.adminAreaRoute("campaign")).toBe("admin/campaign");
  vitest.expect(admin.adminAreaRoute("unknown")).toBe(null);
});