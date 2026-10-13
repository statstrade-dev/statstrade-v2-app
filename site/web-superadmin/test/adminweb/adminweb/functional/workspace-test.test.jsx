import * as r from 'react'

import * as substrate from '@statstrade/web-superadmin/lib/substrate-worker.jsx'

import * as vitest from 'vitest'

import * as global_table from '@statstrade/web-superadmin/a03/s03/global-table.jsx'

import * as T from 'tamagui'

import * as sb from '@statstrade/edge/remote/util-supabase.jsx'

import * as sut from '@statstrade/web-superadmin/adminweb/workspace.jsx'

// statstrade-superadmin.adminweb.functional.workspace-test/test-workspace-page-number-output [20] 
vitest.it("returns the route code for roots and nested pages",function (){
  vitest.expect(sut.getPageNumber("organisation",null)).toBe("A02.S02");
  vitest.expect(sut.getPageNumber("billing",null)).toBe("A02.S03");
  vitest.expect(sut.getPageNumber("global",null)).toBe("A03.S03");
  vitest.expect(sut.getPageNumber("super","admin/campaign")).toBe("A03.S08");
  vitest.expect(sut.getPageNumber("user","personal")).toBe("A02.S04");
});

// statstrade-superadmin.adminweb.functional.workspace-test/test-workspace-tab-number-output [36] 
vitest.it("numbers root, nested, and double digit tabs",function (){
  vitest.expect(sut.getTabNumber("global",null,3)).toBe("A03.S03.T03");
  vitest.expect(sut.getTabNumber("billing",null,2)).toBe("A02.S03.T02");
  vitest.expect(sut.getTabNumber("super","admin/campaign",1)).toBe("A03.S08.T01");
  vitest.expect(sut.getTabNumber("billing",null,10)).toBe("A02.S03.T10");
});

// statstrade-superadmin.adminweb.functional.workspace-test/test-workspace-table-rows [50] 
vitest.describe("workspace table row projection",function (){
  let React = r["default"];
  vitest.afterEach(function (){
    vitest.vi.restoreAllMocks();
  });
  vitest.it("requests id columns through the shared node hook",function (){
    let module_entry = (
      <sut.AdminWorkspace/>);
    vitest.expect(module_entry["type"]).toBe(sut["AdminWorkspace"]);
    let result = {"rows":[{"id":"role-1"}]};
    let hook = vitest.vi.spyOn(global_table,"useTableRows");
    hook.mockReturnValue(result);
    let context = {"node":{"name":"test-node"},"space-id":"app/GUEST"};
    let actual = sut.useTableRows("AccessRole",["id","access","member"],context);
    vitest.expect(actual).toBe(result);
    vitest.expect(hook).toHaveBeenCalledWith("AccessRole",["id","access_id","member_id"],context);
  });
});

// statstrade-superadmin.adminweb.functional.workspace-test/test-workspace-content [80] 
vitest.describe("workspace content",function (){
  let React = r["default"];
  vitest.afterEach(function (){
    vitest.vi.restoreAllMocks();
  });
  vitest.it("selects the account projection and displays returned row data",function (){
    let node = {"name":"test-node"};
    let config = {"primary":{"id":"db/primary/test"}};
    let context_hook = vitest.vi.spyOn(substrate,"useSubstrateContext");
    context_hook.mockReturnValue({
      "resource":{"client":node,"scope-id":"tab-one","config":config}
    });
    let state_hook = vitest.vi.spyOn(React,"useState");
    state_hook.mockReturnValue([
      0,
      function (_){
          null;
        }
    ]);
    let effect_hook = vitest.vi.spyOn(React,"useEffect");
    effect_hook.mockImplementation(function (__unused0,__unused1){
      null;
    });
    let rows_hook = vitest.vi.spyOn(global_table,"useTableRows");
    rows_hook.mockReturnValue({"rows":[{"id":"role-1","member_id":"user-1"}]});
    let view = sut.WorkspaceContent({"section":"user","area":"account"});
    vitest.expect(rows_hook).toHaveBeenCalledWith("AccessRole",[
      "class_table",
      "class_context",
      "access_id",
      "member_id",
      "level",
      "scope",
      "is_active",
      "is_public",
      "time_created",
      "time_updated"
    ],{
      "node":node,
      "primary-id":"db/primary/test",
      "space-id":"statstrade-superadmin/tab-one/workspace/user/account",
      "runtime":{
            "config":config,
            "schema":{},
            "lookup":{},
            "opts":{"realtime-enabled":false}
          }
    });
    let body = view["props"]["children"];
    let body_children = body["props"]["children"];
    let tab_strip = body_children[1];
    let role_tab = tab_strip["props"]["children"][0];
    let tab_labels = role_tab["props"]["children"]["props"]["children"];
    vitest.expect(tab_labels[0]["props"]["children"]).toBe("A02.S05.T01");
    let result_stack = body_children[3];
    let result_card = result_stack["props"]["children"][0];
    let result_text = result_card["props"]["children"];
    vitest.expect(JSON.parse(result_text["props"]["children"])).toEqual({"id":"role-1","member_id":"user-1"});
  });
  vitest.it("keeps empty results distinct from load errors",function (){
    let context_hook = vitest.vi.spyOn(substrate,"useSubstrateContext");
    context_hook.mockReturnValue({
      "resource":{
            "client":{},
            "scope-id":"tab-one",
            "config":{"primary":{"id":"db/primary/test"}}
          }
    });
    let state_hook = vitest.vi.spyOn(React,"useState");
    state_hook.mockReturnValue([
      0,
      function (_){
          null;
        }
    ]);
    let effect_hook = vitest.vi.spyOn(React,"useEffect");
    effect_hook.mockImplementation(function (__unused0,__unused1){
      null;
    });
    let rows_hook = vitest.vi.spyOn(global_table,"useTableRows");
    rows_hook.mockReturnValue({"rows":[]});
    let empty_view = sut.WorkspaceContent({"section":"user","area":"account"});
    let empty_body = empty_view["props"]["children"];
    let empty_children = empty_body["props"]["children"];
    let empty_state = empty_children[4];
    vitest.expect(empty_state["type"]).toBe(T.Text);
    vitest.expect(empty_state["props"]["color"]).toBe("$color10");
    rows_hook.mockReturnValue({"rows":[],"error":"offline"});
    let error_view = sut.WorkspaceContent({"section":"user","area":"account"});
    let error_body = error_view["props"]["children"];
    let error_children = error_body["props"]["children"];
    let error_state = error_children[4];
    vitest.expect(error_state["type"]).toBe(T.Text);
    vitest.expect(error_state["props"]["color"]).toBe("$red10");
    vitest.expect(error_state["props"]["accessibilityRole"]).toBe("alert");
  });
});

// statstrade-superadmin.adminweb.functional.workspace-test/test-workspace-billing-tabs [163] 
vitest.afterEach(function (){
  vitest.vi.restoreAllMocks();
});
vitest.it("numbers invoice and payment and selects the payment view",function (){
  let React = r["default"];
  let node = {"name":"test-node"};
  let config = {"primary":{"id":"db/primary/actor-33"}};
  let context_hook = vitest.vi.spyOn(substrate,"useSubstrateContext");
  context_hook.mockReturnValue({
    "resource":{"client":node,"scope-id":"tab-one","config":config}
  });
  let selected_index = [];
  let state_hook = vitest.vi.spyOn(React,"useState");
  state_hook.mockReturnValueOnce([
    0,
    function (index){
      selected_index.push(index);
    }
  ]);
  let effect_hook = vitest.vi.spyOn(React,"useEffect");
  effect_hook.mockImplementation(function (__unused0,__unused1){
    null;
  });
  let rows_hook = vitest.vi.spyOn(global_table,"useTableRows");
  rows_hook.mockReturnValue({"rows":[],"error":null});
  let view = sut.WorkspaceContent({"section":"billing","actorId":"actor-33"});
  let body = view["props"]["children"];
  let body_children = body["props"]["children"];
  let tab_strip = body_children[1];
  let tabs = tab_strip["props"]["children"];
  let invoice_tab = tabs[0];
  let payment_tab = tabs[1];
  let invoice_labels = invoice_tab["props"]["children"]["props"]["children"];
  let payment_labels = payment_tab["props"]["children"]["props"]["children"];
  vitest.expect(invoice_labels[0]["props"]["children"]).toBe("A02.S03.T01");
  vitest.expect(payment_labels[0]["props"]["children"]).toBe("A02.S03.T02");
  vitest.expect(invoice_tab["props"]["ariaPressed"]).toBe(true);
  vitest.expect(payment_tab["props"]["ariaPressed"]).toBe(false);
  let select_payment = payment_tab["props"]["onPress"];
  select_payment();
  vitest.expect(selected_index[0]).toBe(1);
  vitest.expect(rows_hook["mock"]["calls"][0][0]).toBe("OrgBillingInvoice");
  vitest.expect(rows_hook["mock"]["calls"][0][2]["space-id"]).toBe("statstrade-superadmin/tab-one/workspace/billing/root");
});

// statstrade-superadmin.adminweb.functional.workspace-test/test-adminweb-shell-numbered-navigation [214] 
vitest.afterEach(function (){
  vitest.vi.restoreAllMocks();
});
vitest.it("shows the Accounts code and existing Billing destination",function (){
  let React = r["default"];
  vitest.vi.spyOn(substrate,"useSubstrateContext").mockReturnValue({
    "resource":{"client":{"name":"shell-node"},"scope-id":"tab-one"}
  });
  vitest.vi.spyOn(React,"useMemo").mockImplementation(function (factory,_dependencies){
    return factory();
  });
  vitest.vi.spyOn(React,"useEffect").mockImplementation(function (_effect,_dependencies){
    null;
  });
  vitest.vi.spyOn(ext_page,"listenModelOutput").mockReturnValue({"current":null});
  let child = React.createElement("span",{},"Billing content");
  let view = sut.AdminwebShell({"section":"billing","children":child});
  let columns = view["props"]["children"];
  let sidebar_children = columns[0]["props"]["children"];
  let groups = sidebar_children[1];
  let accounts_group = groups[1];
  let accounts_children = accounts_group["props"]["children"];
  let heading = accounts_children[0];
  let heading_children = heading["props"]["children"];
  vitest.expect(heading_children[0]["props"]["children"]).toBe("A02");
  let account_entries = accounts_children[1];
  let billing_row = account_entries[2];
  let billing_link = billing_row["props"]["children"][0];
  vitest.expect(billing_link["props"]["href"]).toBe("/adminweb/billing");
  let link_children = billing_link["props"]["children"]["props"]["children"];
  vitest.expect(link_children[1]["props"]["children"]).toBe("A02.S03");
});

// statstrade-superadmin.adminweb.functional.workspace-test/test-campaign-impersonation-handoff [260] 
vitest.describe("campaign account impersonation",function (){
  let React = r["default"];
  vitest.afterEach(function (){
    vitest.vi.restoreAllMocks();
    vitest.vi.unstubAllGlobals();
  });
  vitest.it("posts the selected account and submits the returned ticket",async function (){
    let state_hook = vitest.vi.spyOn(React,"useState");
    state_hook.mockReturnValueOnce([
      "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      function (_){
          null;
        }
    ]);
    state_hook.mockReturnValueOnce([
      "Support case 1234",
      function (_){
          null;
        }
    ]);
    state_hook.mockReturnValueOnce([
      null,
      function (_){
          null;
        }
    ]);
    state_hook.mockReturnValueOnce([
      false,
      function (_){
          null;
        }
    ]);
    let session_hook = vitest.vi.spyOn(sb,"useListenSession");
    session_hook.mockReturnValueOnce([{"access_token":"superadmin-token"}]);
    let response = {
      "ok":true,
      "json":function (){
            return Promise.resolve({
              "ticket":"one-use-ticket",
              "redeem_url":"https://web.example/api/impersonation/redeem"
            });
          }
    };
    let fetch_call = null;
    let fetch_spy = function (url,options){
      fetch_call = [url,options];
      return Promise.resolve(response);
    };
    vitest.vi.stubGlobal("fetch",fetch_spy);
    let form_input = null;
    let submitted = false;
    let form = {
      "appendChild":function (child){
            form_input = child;
          },
      "submit":function (){
            submitted = true;
          }
    };
    let input = {};
    let appended_form = null;
    let document_fake = {
      "createElement":function (tag){
            return (tag == "form") ? form : input;
          },
      "body":{
            "appendChild":function (child){
                  appended_form = child;
                }
          }
    };
    vitest.vi.stubGlobal("document",document_fake);
    let tree = sut.CampaignManagement({"section":"super","area":"admin/campaign"});
    let body = tree["props"]["children"];
    let controls = body["props"]["children"];
    let buttons = controls.filter(function (child){
      return child && (child["type"] == T.Button);
    });
    let open_button = buttons[0];
    vitest.expect(open_button["props"]["disabled"]).toBe(false);
    vitest.expect(open_button["props"]["children"]).toBe("Impersonate");
    await open_button["props"]["onPress"]();
    vitest.expect(fetch_call[0]).toBe("/api/impersonation/start");
    vitest.expect(fetch_call[1]["method"]).toBe("POST");
    vitest.expect(fetch_call[1]["headers"]["Authorization"]).toBe("Bearer superadmin-token");
    vitest.expect(JSON.parse(fetch_call[1]["body"])).toEqual({
      "target_user_id":"bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      "reason":"Support case 1234"
    });
    vitest.expect(form["method"]).toBe("POST");
    vitest.expect(form["action"]).toBe("https://web.example/api/impersonation/redeem");
    vitest.expect(form_input["name"]).toBe("ticket");
    vitest.expect(form_input["value"]).toBe("one-use-ticket");
    vitest.expect(appended_form).toBe(form);
    vitest.expect(submitted).toBe(true);
  });
});

// statstrade-superadmin.adminweb.functional.workspace-test/test-superadmin-gate [338] 
vitest.describe("superadmin access check",function (){
  let React = r["default"];
  vitest.afterEach(function (){
    vitest.vi.restoreAllMocks();
  });
  vitest.it("allows true, denies other values, and reports an RPC failure",async function (){
    let exercise = async function (rpc_result,expected_state){
      vitest.vi.restoreAllMocks();
      let node = {"name":"test-node"};
      let substrate_hook = vitest.vi.spyOn(substrate,"useSubstrateContext");
      substrate_hook.mockReturnValue({
        "resource":{
                "client":node,
                "config":{"primary":{"id":"db/primary/superadmin"}}
              }
      });
      let setter = vitest.vi.fn();
      let state_hook = vitest.vi.spyOn(React,"useState");
      state_hook.mockReturnValueOnce(["checking",setter]);
      let memo_hook = vitest.vi.spyOn(React,"useMemo");
      memo_hook.mockImplementation(function (factory,_dependencies){
        return factory();
      });
      let effect_fn = null;
      let effect_hook = vitest.vi.spyOn(React,"useEffect");
      effect_hook.mockImplementation(function (callback,_dependencies){
        effect_fn = callback;
      });
      let rpc_hook = vitest.vi.spyOn(global_table,"rpcCall");
      rpc_hook.mockReturnValueOnce(rpc_result);
      let child = React.createElement("span",{});
      let checking_view = sut.SuperadminGate({"children":child});
      vitest.expect(checking_view["type"]).toBe(T.YStack);
      let cleanup = effect_fn();
      await Promise.resolve();
      vitest.expect(setter).toHaveBeenCalledWith(expected_state);
      let call = rpc_hook["mock"]["calls"][0];
      vitest.expect(call[0]).toBe(node);
      vitest.expect(call[1]).toBe("db/primary/superadmin");
      vitest.expect(call[2]["id"]).toBe("check-is-super");
      vitest.expect(call[3]).toEqual([]);
      vitest.expect(call[4]).toEqual({});
      state_hook.mockReturnValueOnce([expected_state,setter]);
      let result_view = sut.SuperadminGate({"children":child});
      if(expected_state == "allowed"){
        vitest.expect(result_view).toBe(child);
      }
      if(!(expected_state == "allowed")){
        let alert = result_view["props"]["children"];
        vitest.expect(result_view["type"]).toBe(T.YStack);
        vitest.expect(alert["type"]).toBe(T.Text);
        vitest.expect(alert["props"]["accessibilityRole"]).toBe("alert");
        vitest.expect(alert["props"]["color"]).toBe("$red10");
      }
      if(cleanup){
        cleanup();
      }
    };
    await exercise(Promise.resolve(true),"allowed");
    await exercise(Promise.resolve("true"),"denied");
    await exercise(Promise.reject(new Error("offline")),"error");
  });
});

// statstrade-superadmin.adminweb.functional.workspace-test/test-admin-workspace-session [403] 
vitest.describe("workspace session boundary",function (){
  vitest.afterEach(function (){
    vitest.vi.restoreAllMocks();
  });
  vitest.it("exposes sign-in when there is no token",function (){
    let session_hook = vitest.vi.spyOn(sb,"useListenSession");
    session_hook.mockReturnValueOnce([null]);
    let page = sut.AdminWorkspace({"section":"user"});
    let anchor = page["props"]["children"][1];
    vitest.expect(page["type"]).toBe(T.YStack);
    vitest.expect(anchor["type"]).toBe(T.Anchor);
    vitest.expect(anchor["props"]["href"]).toBe("/auth/sign-in");
  });
  vitest.it("passes the authenticated actor and route to the workspace guard",function (){
    let session_hook = vitest.vi.spyOn(sb,"useListenSession");
    session_hook.mockReturnValueOnce([{"access_token":"session-token","user":{"id":"actor-33"}}]);
    let page = sut.AdminWorkspace({"section":"chain","area":"tokens"});
    vitest.expect(page["type"]).toBe(sut["AdminWorkspaceGuard"]);
    vitest.expect(page["props"]).toEqual({"section":"chain","area":"tokens","actorId":"actor-33"});
  });
});