import * as r from 'react'

import * as page_core from '@xtalk/substrate/page-core.js'

import * as ext_page from '@statstrade/edge/lib/js/react/ext-page.js'

import * as vitest from 'vitest'

import * as T from 'tamagui'

import * as client_base from '@xtalk/db/node/client-base.js'

import * as global_table from '@statstrade/edge/lib/statstrade-superadmin/a03/s03/global-table.jsx'

// statstrade-superadmin.a03.s03.global-table-test/Metadata [23] 
const Metadata = {title:"Superadmin/Global/Table",tags:["autodoc"]};

// statstrade-superadmin.a03.s03.global-table-test/test-superadmin-table-projection [29] 
vitest.it("builds both projections from the requested fields",function (){
  let projection = global_table.tableImpl("Token",["id","code"]);
  vitest.expect(projection["base"]["list"]["spec"]).toEqual(["Token",{"data":["id","code"]}]);
  vitest.expect(projection["base"]["data"]["spec"]).toEqual(["Token",{"data":["id","code"]}]);
  vitest.expect(projection["cached"]).toEqual({});
});

// statstrade-superadmin.a03.s03.global-table-test/test-superadmin-pull-model [41] 
vitest.it("calls the node client with the primary service and pull spec",async function (){
  let pullSpy = vitest.vi.spyOn(client_base,"pull_call");
  let rows = [{"id":"t1","code":"STAT"}];
  pullSpy.mockResolvedValueOnce(rows);
  let node = {"kind":"test-node"};
  let spec = ["Token",{"data":["id","code"]}];
  let opts = {"cache":false};
  let model = global_table.tablePageModel("db/primary",spec,opts);
  vitest.expect(model["defaults"]).toEqual({"args":[],"output":[]});
  vitest.expect(model["options"]["refresh"]["Token"]).toBe(true);
  let disabled = global_table.tablePageModel("db/primary",spec,{"realtime-enabled":false});
  vitest.expect(disabled["options"]).toEqual({});
  let result = await model["handler"]({"node":node});
  vitest.expect(result).toEqual(rows);
  vitest.expect(pullSpy).toHaveBeenCalledWith(node,"db/primary",spec,opts);
  pullSpy.mockRestore();
});

// statstrade-superadmin.a03.s03.global-table-test/test-superadmin-dataview-model [66] 
vitest.it("executes the supplied dataview using the selected primary service",async function (){
  let dataviewSpy = vitest.vi.spyOn(client_base,"dataview_call");
  let rows = [{"id":"g1","key":"compute"}];
  dataviewSpy.mockResolvedValueOnce(rows);
  let node = {"kind":"test-node"};
  let dataview = {"table":"Global","select":{"key":"compute"}};
  let opts = {"cache":false};
  let model = global_table.dataviewPageModel("db/primary",dataview,opts);
  let result = await model["handler"]({"node":node});
  vitest.expect(result).toEqual(rows);
  vitest.expect(model["options"]["refresh"]["Global"]).toBe(true);
  vitest.expect(dataviewSpy).toHaveBeenCalledWith(node,"db/primary",dataview,opts);
  dataviewSpy.mockRestore();
});

// statstrade-superadmin.a03.s03.global-table-test/Test_ExtTableRows [87] 
export function Test_ExtTableRows(){
  let [empty,setEmpty] = React.useState(false);
  let rows = [
    {"id":"AU","title":"Australia","code":"AU"},
    {"id":"JP","title":"Japan","code":"JP"}
  ];
  return (
    <T.YStack gap="$3" padding="$4" width={640}>
      <T.XStack alignItems="center" justifyContent="space-between">
        <T.Text fontSize="$5" fontWeight="700">Table rows</T.Text>
        <T.Button
          size="$2"
          chromeless={true}
          onPress={function (){
              setEmpty(!empty);
            }}>{empty ? "Show records" : "Show empty state"}
        </T.Button>
      </T.XStack>
      {empty ? (
        <T.Text color="$color10" padding="$3">No records found.</T.Text>) : rows.map(function (row){
        return (
          <T.YStack
            key={row["id"]}
            gap="$1"
            padding="$3"
            borderBottomWidth={1}
            borderColor="$color4">
            <T.Text fontWeight="600">{row["title"]}</T.Text>
            <T.Text fontFamily="monospace">{JSON.stringify(row)}</T.Text>
          </T.YStack>);
      })}
    </T.YStack>);
}

// statstrade-superadmin.a03.s03.global-table-test/test-superadmin-table-row-hook [116] 
vitest.describe("table rows",function (){
  vitest.afterEach(function (){
    vitest.vi.restoreAllMocks();
  });
  vitest.it("returns the subscribed table rows and attaches its projection",function (){
    let react = r["default"];
    let rows = [{"id":"au","name":"Australia"}];
    let memoSpy = vitest.vi.spyOn(react,"useMemo");
    memoSpy.mockImplementation(function (factory,_dependencies){
      return factory();
    });
    let refSpy = vitest.vi.spyOn(react,"useRef");
    refSpy.mockImplementation(function (initial){
      return {"current":initial};
    });
    let stateSpy = vitest.vi.spyOn(react,"useState");
    stateSpy.mockImplementation(function (initial){
      return [
        initial,
        function (_value){
              null;
            }
      ];
    });
    let effectSpy = vitest.vi.spyOn(react,"useEffect");
    effectSpy.mockImplementation(function (_effect,_dependencies){
      null;
    });
    let node = {"kind":"test-node"};
    let attachSpy = vitest.vi.spyOn(page_core,"group_add_attach");
    let outputSpy = vitest.vi.spyOn(ext_page,"listenModelOutput");
    outputSpy.mockReturnValue({"current":rows});
    let result = global_table.useTableRows("Country",["id","name"],{"node":node,"space-id":"app/admin"});
    vitest.expect(result["rows"]).toEqual(rows);
    vitest.expect(result["realtimeStatus"]).toBe("CONNECTING");
    vitest.expect(attachSpy).toHaveBeenCalled();
    vitest.expect(outputSpy).toHaveBeenCalled();
  });
});

// statstrade-superadmin.a03.s03.global-table-test/test-superadmin-row-hook [155] 
vitest.describe("row lifecycle",function (){
  vitest.afterEach(function (){
    vitest.vi.restoreAllMocks();
  });
  vitest.it("returns rows and skips Global subscription when opted out",function (){
    let react = r["default"];
    let rows = [{"id":"user-1","name":"User one"}];
    let effects = [];
    let memoSpy = vitest.vi.spyOn(react,"useMemo");
    memoSpy.mockImplementation(function (factory,_dependencies){
      return factory();
    });
    let refSpy = vitest.vi.spyOn(react,"useRef");
    refSpy.mockImplementation(function (initial){
      return {"current":initial};
    });
    let stateSpy = vitest.vi.spyOn(react,"useState");
    stateSpy.mockImplementation(function (initial){
      return [
        initial,
        function (_value){
              null;
            }
      ];
    });
    let effectSpy = vitest.vi.spyOn(react,"useEffect");
    effectSpy.mockImplementation(function (effect,_dependencies){
      effects.push(effect);
    });
    let node = {"kind":"test-node"};
    let attachSpy = vitest.vi.spyOn(page_core,"group_add_attach");
    let outputSpy = vitest.vi.spyOn(ext_page,"listenModelOutput");
    outputSpy.mockReturnValue({"current":rows});
    let subscribeSpy = vitest.vi.spyOn(client_base,"subscribe_db");
    let result = global_table.useRows(["User",{"data":["id","name"]}],{
      "node":node,
      "primary-id":"db/primary/admin",
      "space-id":"app/admin",
      "opts":{"realtime-enabled":false}
    },global_table.tablePageModel);
    vitest.expect(result["rows"]).toEqual(rows);
    vitest.expect(result["realtimeStatus"]).toBe("DISABLED");
    vitest.expect(attachSpy).toHaveBeenCalled();
    vitest.expect(outputSpy).toHaveBeenCalled();
    vitest.expect(effects["length"]).toBe(2);
    effects[1]();
    vitest.expect(subscribeSpy).not.toHaveBeenCalled();
  });
});

// statstrade-superadmin.a03.s03.global-table-test/test-superadmin-realtime-group-lifecycle [204] 
vitest.describe("realtime group lifecycle",function (){
  vitest.afterEach(function (){
    vitest.vi.restoreAllMocks();
  });
  vitest.it("subscribes and unsubscribes through the node client",async function (){
    let react = r["default"];
    let effects = [];
    let memoSpy = vitest.vi.spyOn(react,"useMemo");
    memoSpy.mockImplementation(function (factory,_dependencies){
      return factory();
    });
    let refSpy = vitest.vi.spyOn(react,"useRef");
    refSpy.mockImplementation(function (initial){
      return {"current":initial};
    });
    let stateSpy = vitest.vi.spyOn(react,"useState");
    stateSpy.mockImplementation(function (initial){
      return [
        initial,
        function (_value){
              null;
            }
      ];
    });
    let effectSpy = vitest.vi.spyOn(react,"useEffect");
    effectSpy.mockImplementation(function (effect,_dependencies){
      effects.push(effect);
    });
    let node = {"kind":"test-node"};
    let outputSpy = vitest.vi.spyOn(ext_page,"listenModelOutput");
    outputSpy.mockReturnValue({"current":[]});
    let subscribeSpy = vitest.vi.spyOn(client_base,"subscribe_db");
    subscribeSpy.mockResolvedValueOnce([true]);
    let unsubscribeSpy = vitest.vi.spyOn(client_base,"unsubscribe_db");
    unsubscribeSpy.mockResolvedValueOnce(true);
    global_table.useRows(["User",{"data":["id","name"]}],{
      "node":node,
      "primary-id":"db/primary/admin",
      "space-id":"tab-17/admin/a03/s03",
      "opts":{}
    },global_table.tablePageModel);
    let cleanup = effects[1]();
    await cleanup();
    let subscribe_args = subscribeSpy["mock"]["calls"][0];
    let connection_id = subscribe_args[2];
    vitest.expect(subscribe_args[0]).toBe(node);
    vitest.expect(subscribe_args[1]).toBe("db/primary/admin");
    vitest.expect(connection_id).toContain("tab-17/admin/a03/s03");
    vitest.expect(connection_id).toContain("superadmin/tables@");
    vitest.expect(unsubscribeSpy["mock"]["calls"][0]).toEqual([
      node,
      "db/primary/admin",
      connection_id,
      ["realtime:Superadmin:Global"],
      {}
    ]);
  });
});

// statstrade-superadmin.a03.s03.global-table-test/test-superadmin-table-realtime-option [258] 
vitest.it("defaults to enabled and disables only for an explicit false value",function (){
  vitest.expect(global_table.tableRealtimeEnabled({})).toBe(true);
  vitest.expect(
    global_table.tableRealtimeEnabled({"realtime-enabled":true})
  ).toBe(true);
  vitest.expect(
    global_table.tableRealtimeEnabled({"realtime-enabled":false})
  ).toBe(false);
});

// statstrade-superadmin.a03.s03.global-table-test/test-superadmin-dataview-row-hook [271] 
vitest.describe("dataview rows",function (){
  vitest.afterEach(function (){
    vitest.vi.restoreAllMocks();
  });
  vitest.it("returns the subscribed rows for the supplied dataview",function (){
    let react = r["default"];
    let memoSpy = vitest.vi.spyOn(react,"useMemo");
    memoSpy.mockImplementation(function (factory,_dependencies){
      return factory();
    });
    let refSpy = vitest.vi.spyOn(react,"useRef");
    refSpy.mockImplementation(function (initial){
      return {"current":initial};
    });
    let stateSpy = vitest.vi.spyOn(react,"useState");
    stateSpy.mockImplementation(function (initial){
      return [
        initial,
        function (_value){
              null;
            }
      ];
    });
    let effectSpy = vitest.vi.spyOn(react,"useEffect");
    effectSpy.mockImplementation(function (_effect,_dependencies){
      null;
    });
    let node = {"kind":"test-node"};
    let rows = [{"id":"g1","key":"compute"}];
    let attachSpy = vitest.vi.spyOn(page_core,"group_add_attach");
    let outputSpy = vitest.vi.spyOn(ext_page,"listenModelOutput");
    outputSpy.mockReturnValue({"current":rows});
    let dataview = {"table":"Global","select":{"key":"compute"}};
    let result = global_table.useDataviewRows(dataview,{"node":node,"space-id":"app/test"});
    vitest.expect(result["rows"]).toEqual(rows);
    vitest.expect(attachSpy).toHaveBeenCalled();
    vitest.expect(outputSpy).toHaveBeenCalled();
  });
});

// statstrade-superadmin.a03.s03.global-table-test/test-superadmin-rpc-forwarding [310] 
vitest.it("passes the seeded request to the direct node client",async function (){
  let rpcSpy = vitest.vi.spyOn(client_base,"rpc_call");
  let result = {"ok":true};
  rpcSpy.mockResolvedValueOnce(result);
  let node = {"kind":"test-node"};
  let spec = {"id":"super-global-section-update"};
  let args = ["actor-1","compute",3,{"enabled":true},"reviewed"];
  let opts = {"timeout":1000};
  let response = await global_table.rpcCall(node,"db/primary",spec,args,opts);
  vitest.expect(response).toEqual(result);
  vitest.expect(rpcSpy).toHaveBeenCalledWith(node,"db/primary",spec,args,opts);
  rpcSpy.mockRestore();
});

// statstrade-superadmin.a03.s03.global-table-test/test-superadmin-table-render [329] 
vitest.it("builds row, status, error, and empty-state elements",function (){
  let row = {"id":"tok-1","name":"Statstrade"};
  let populated = global_table.TableList({"title":"Tokens","rows":[row],"realtimeStatus":"LIVE"});
  let populated_children = populated["props"]["children"];
  vitest.expect(populated["type"]).toBe("View");
  vitest.expect(populated_children[0]["props"]["children"]).toBe("Tokens");
  vitest.expect(populated_children[2]["props"]["children"]).toBe("LIVE");
  let card = populated_children[4][0];
  vitest.expect(card["type"]).toBe("View");
  vitest.expect(card["props"]["children"][0]["props"]["children"]).toBe("Statstrade");
  let empty = global_table.TableList({
    "title":"Tokens",
    "rows":[],
    "realtimeError":"Network unavailable"
  });
  let empty_children = empty["props"]["children"];
  vitest.expect(empty_children[3]["props"]["children"]).toBe("Network unavailable");
  vitest.expect(empty_children[4]["type"]).toBe("Text");
  vitest.expect(empty_children[4]["props"]["children"]).toBe("No records found.");
});

export default Metadata