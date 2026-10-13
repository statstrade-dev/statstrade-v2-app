import * as vitest from 'vitest'

import {renderToStaticMarkup} from 'react-dom/server'

import React from 'react'

import * as T from 'tamagui'

import * as global_sitevar from '@statstrade/edge/lib/statstrade-adminweb/a07-super/s00/global-sitevar.jsx'

// statstrade-adminweb.a07-super.s00.global-sitevar-test/Metadata [18] 
const Metadata = {title:"Admin/Global/Configuration",tags:["autodoc"]};

// statstrade-adminweb.a07-super.s00.global-sitevar-test/test-global-section-update [72] 
vitest.afterEach(function (){
  vitest.vi.restoreAllMocks();
});
vitest.it("uses the selected actor, Global key, revision, value, and reason",async function (){
  let state_spy = vitest.vi.spyOn(r,"useState");
  state_spy.mockReturnValueOnce([
    null,
    function (_){
      null;
    }
  ]);
  state_spy.mockReturnValueOnce([
    "{\"enabled\":true}",
    function (_){
      null;
    }
  ]);
  state_spy.mockReturnValueOnce([
    "Reviewed change",
    function (_){
      null;
    }
  ]);
  state_spy.mockReturnValueOnce([
    false,
    function (_){
      null;
    }
  ]);
  state_spy.mockReturnValueOnce([
    null,
    function (_){
      null;
    }
  ]);
  let row = {
    "key":"compute",
    "revision":9,
    "value_json":{"enabled":false},
    "is_registered":true
  };
  let view_spy = vitest.vi.fn([],return [row]);
  let rows_spy = vitest.vi.spyOn(global_table,"useTableRows");
  rows_spy.mockReturnValue({"view":view_spy,"rows":[row]});
  let rpc_spy = vitest.vi.spyOn(global_table,"rpcCall");
  rpc_spy.mockReturnValue({"ok":true});
  let node = {"kind":"test-node"};
  let props = global_sitevar.useGlobalProps({"node":node,"primary-id":"db/primary/admin"},"actor-17");
  let update = props["actions"]["update"];
  await update();
  let call = rpc_spy["mock"]["calls"][0];
  vitest.expect(call[0]).toBe(node);
  vitest.expect(call[1]).toBe("db/primary/admin");
  vitest.expect(call[2]["id"]).toBe("super-global-section-update");
  vitest.expect(call[3]).toEqual(["actor-17","compute",9,{"enabled":true},"Reviewed change"]);
  vitest.expect(view_spy).toHaveBeenCalled();
});

// statstrade-adminweb.a07-super.s00.global-sitevar-test/test-global-section-editor-render [108] 
vitest.afterEach(function (){
  vitest.vi.restoreAllMocks();
});
vitest.it("shows the selected section and current reason",function (){
  let row = {"key":"compute","title":"Compute settings"};
  let state = {
    "views":{
        "rows":[row],
        "selected":row,
        "selectedKey":"compute",
        "draft":"{\"enabled\":true}",
        "reason":"Reviewed change",
        "busy":false,
        "error":null
      },
    "actions":{
        "select":function (){
            
          },
        "setDraft":function (){
            
          },
        "setReason":function (){
            
          },
        "update":function (){
            
          },
        "reset":function (){
            
          },
        "publishCompute":function (){
            
          }
      }
  };
  let props_spy = vitest.vi.spyOn(global_sitevar,"useGlobalProps");
  props_spy.mockReturnValue(state);
  let markup = renderToStaticMarkup(React.createElement(
    global_sitevar.A07GlobalSiteVar,
    {"context":{},"actorId":"actor-17"}
  ));
  vitest.expect(markup).toContain("Compute settings");
  vitest.expect(markup).toContain("Publish compute");
  vitest.expect(markup).toContain("Reviewed change");
});

// statstrade-adminweb.a07-super.s00.global-sitevar-test/Test_GlobalSectionEditor [140] 
export function Test_GlobalSectionEditor(){
  let [value,setValue] = React.useState("{\"enabled\":true,\"mode\":\"live\"}");
  let [reason,setReason] = React.useState("Routine configuration update");
  return (
    <T.YStack gap="$3" padding="$4" width={640}>
      <T.Text fontSize="$5" fontWeight="700">Global configuration</T.Text>
      <T.XStack gap="$2" alignItems="center">
        <T.Text fontWeight="600">Compute</T.Text>
        <T.Text fontFamily="monospace" color="$color10">revision 3 · registered</T.Text>
      </T.XStack>
      <T.TextArea
        value={value}
        onChangeText={setValue}
        minHeight={180}
        fontFamily="monospace"/>
      <T.Input
        value={reason}
        onChangeText={setReason}
        placeholder="Reason for this change"/>
      <T.XStack gap="$2" flexWrap="wrap">
        <T.Button>Save</T.Button>
        <T.Button chromeless={true}>Reset</T.Button>
        <T.Button backgroundColor="$color3">Publish compute</T.Button>
      </T.XStack>
    </T.YStack>);
}

export default Metadata