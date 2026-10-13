import * as vitest from 'vitest'

import * as system from '@statstrade/edge/lib/statstrade-adminweb/a07-super/s02-system.jsx'

// statstrade-adminweb.a07-super.s02-system-test/test-system-area-routing [23] 
vitest.it("resolves service, template, room, swap, and brand routes",function (){
  vitest.expect(system.systemAreaRoute("service")).toBe("system/service");
  vitest.expect(system.systemAreaRoute("template")).toBe("system/template");
  vitest.expect(system.systemAreaRoute("room")).toBe("system/room");
  vitest.expect(system.systemAreaRoute("swap")).toBe("system/swap");
  vitest.expect(system.systemAreaRoute("brand")).toBe("system/brand");
  vitest.expect(system.systemAreaRoute("unknown")).toBe(null);
});