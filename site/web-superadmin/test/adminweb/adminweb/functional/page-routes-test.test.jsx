import * as billingPage from '@statstrade/web-superadmin/pages/adminweb/billing.jsx'

import * as accountPage from '@statstrade/web-superadmin/pages/adminweb/user/account.jsx'

import * as superSystemPage from '@statstrade/web-superadmin/pages/adminweb/super/system.jsx'

import * as cryptoPage from '@statstrade/web-superadmin/pages/adminweb/user/crypto.jsx'

import * as superAdminPage from '@statstrade/web-superadmin/pages/adminweb/super/admin.jsx'

import * as predictionPage from '@statstrade/web-superadmin/pages/adminweb/room/prediction.jsx'

import * as superSystemBrandPage from '@statstrade/web-superadmin/pages/adminweb/super/system/brand.jsx'

import * as superPage from '@statstrade/web-superadmin/pages/adminweb/super.jsx'

import * as personalPage from '@statstrade/web-superadmin/pages/adminweb/user/personal.jsx'

import * as superOrganisationPage from '@statstrade/web-superadmin/pages/adminweb/super/admin/organisation.jsx'

import * as superSystemServicePage from '@statstrade/web-superadmin/pages/adminweb/super/system/service.jsx'

import * as superSystemRoomPage from '@statstrade/web-superadmin/pages/adminweb/super/system/room.jsx'

import * as workspace from '@statstrade/web-superadmin/adminweb/workspace.jsx'

import * as roomSwapPage from '@statstrade/web-superadmin/pages/adminweb/room/swap.jsx'

import * as superUserPage from '@statstrade/web-superadmin/pages/adminweb/super/admin/user.jsx'

import * as userPage from '@statstrade/web-superadmin/pages/adminweb/user.jsx'

import * as superCampaignPage from '@statstrade/web-superadmin/pages/adminweb/super/admin/campaign.jsx'

import * as homePage from '@statstrade/web-superadmin/pages/index.jsx'

import * as indexPage from '@statstrade/web-superadmin/pages/adminweb/index.jsx'

import {expect,it,toBeUndefined} from 'vitest'

import * as chainPage from '@statstrade/web-superadmin/pages/adminweb/chain.jsx'

import * as roomVaultPage from '@statstrade/web-superadmin/pages/adminweb/room/vault.jsx'

import * as organisationPage from '@statstrade/web-superadmin/pages/adminweb/organisation.jsx'

import * as superSystemSwapPage from '@statstrade/web-superadmin/pages/adminweb/super/system/swap.jsx'

import * as roomPage from '@statstrade/web-superadmin/pages/adminweb/room.jsx'

import * as brandPage from '@statstrade/web-superadmin/pages/adminweb/brand.jsx'

import * as superSystemTemplatePage from '@statstrade/web-superadmin/pages/adminweb/super/system/template.jsx'

import * as layout_base from '@statstrade/component/layout/layout-base.jsx'

// statstrade-superadmin.adminweb.functional.page-routes-test/test-superadmin-index-page-shell [38] 
it("places the worker component beneath LayoutBase",function (){
  let page = homePage["default"]();
  let worker_child = page["props"]["children"];
  expect(page["type"]).toBe(layout_base.LayoutBase);
  expect(page["props"]["showDevWebsocket"]).toBe(true);
  expect(page["props"]["showDevtool"]).toBe(true);
  expect(typeof worker_child["type"]).toBe("function");
  expect(worker_child["props"]["children"]).toBeUndefined();
});

// statstrade-superadmin.adminweb.functional.page-routes-test/test-superadmin-index-page-content [51] 
it("preserves a renderable worker status child",function (){
  let page = homePage["default"]();
  let content = page["props"]["children"];
  expect(typeof content["type"]).toBe("function");
  expect(content["props"]["children"]).toBeUndefined();
});

// statstrade-superadmin.adminweb.functional.page-routes-test/test-adminweb-page-routes [61] 
it("mounts the overview inside the numbered shell",function (){
  let page = indexPage["default"]();
  expect(page["type"]).toBe(layout_base.LayoutBase);
  let shell = page["props"]["children"];
  expect(shell["type"]).toBe(workspace["AdminwebShell"]);
  expect(shell["props"]["section"]).toBe("index");
});
it("maps root and nested pages to their workspace data areas",function (){
  let assert_route = function (module,expected_section,expected_area){
    let Page = module["default"];
    let page = Page();
    expect(page["type"]).toBe(workspace["AdminWorkspace"]);
    expect(page["props"]["section"]).toBe(expected_section);
    if(expected_area){
      expect(page["props"]["area"]).toBe(expected_area);
    }
    else{
      expect(page["props"]["area"]).toBeUndefined();
    }
    return page;
  };
  let roots = [
    [userPage,"user",null],
    [organisationPage,"organisation",null],
    [billingPage,"billing",null],
    [chainPage,"chain",null],
    [brandPage,"brand",null],
    [roomPage,"room",null],
    [superPage,"super",null]
  ];
  roots.forEach(function (route){
    assert_route(route[0],route[1],route[2]);
  });
  let areas = [
    [accountPage,"user","account"],
    [cryptoPage,"user","crypto"],
    [personalPage,"user","personal"],
    [roomSwapPage,"room","swap"],
    [roomVaultPage,"room","vault"],
    [predictionPage,"room","prediction"],
    [superAdminPage,"super","admin"],
    [superUserPage,"super","admin/user"],
    [superOrganisationPage,"super","admin/organisation"],
    [superCampaignPage,"super","admin/campaign"],
    [superSystemPage,"super","system"],
    [superSystemBrandPage,"super","system/brand"],
    [superSystemRoomPage,"super","system/room"],
    [superSystemServicePage,"super","system/service"],
    [superSystemSwapPage,"super","system/swap"],
    [superSystemTemplatePage,"super","system/template"]
  ];
  areas.forEach(function (route){
    assert_route(route[0],route[1],route[2]);
  });
});