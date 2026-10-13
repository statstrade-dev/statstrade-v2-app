import * as r from 'react'

import * as vitest from 'vitest'

import * as sb from '@statstrade/edge/remote/util-supabase.jsx'

import * as T from 'tamagui'

import * as global_region from '@statstrade/web-superadmin/a03/s03/global-region.jsx'

import * as s00 from '@statstrade/web-superadmin/a03/s03-global.jsx'

import * as workspace from '@statstrade/web-superadmin/adminweb/workspace.jsx'

// statstrade-superadmin.a03.s03-global-test/Metadata [16] 
const Metadata = {title:"Superadmin/Global",tags:["autodoc"]};

// statstrade-superadmin.a03.s03-global-test/test-global-page-table-routing [22] 
vitest.afterEach(function (){
  vitest.vi.restoreAllMocks();
});
vitest.it("renders the selected Country view with the current node and space",function (){
  let react = r["default"];
  let state_spy = vitest.vi.spyOn(react,"useState");
  let selected_sections = [];
  state_spy.mockReturnValueOnce([
    "region",
    function (section){
      selected_sections.push(section);
    }
  ]);
  let node = {"kind":"test-node"};
  let context_spy = vitest.vi.spyOn(react,"useContext");
  context_spy.mockReturnValue({
    "resource":{
        "client":node,
        "scope-id":"tab-one",
        "config":{"primary":{"id":"db/primary/actor-17"}}
      }
  });
  let tree = s00.A03S03GlobalMainContent({"account_id":"actor-17"});
  let section_nav = tree["props"]["children"][0];
  let section_buttons = section_nav["props"]["children"];
  let country_button = section_buttons[2];
  let country_content = country_button["props"]["children"];
  let country_children = country_content["props"]["children"];
  vitest.expect(country_button["props"]["ariaPressed"]).toBe(true);
  vitest.expect(country_children[0]["props"]["children"]).toBe("A03.S03.T03");
  let select_global = section_buttons[0]["props"]["onPress"];
  select_global();
  vitest.expect(selected_sections[0]).toBe("sitevar");
  let panel = tree["props"]["children"][1];
  vitest.expect(panel["type"]).toBe(global_region.A03S03GlobalRegion);
  vitest.expect(panel["props"]["context"]["node"]).toBe(node);
  vitest.expect(panel["props"]["context"]["primary-id"]).toBe("db/primary/actor-17");
  vitest.expect(panel["props"]["context"]["space-id"]).toBe("statstrade-superadmin/tab-one/a03/s03/global");
});

// statstrade-superadmin.a03.s03-global-test/test-global-page-worker-composition [63] 
vitest.afterEach(function (){
  vitest.vi.restoreAllMocks();
  vitest.vi.unstubAllEnvs();
});
vitest.it("renders the shell, authorization gate, and page content",function (){
  let tree = s00.A03S03GlobalMain({"token":"access-17","account_id":"actor-17"});
  vitest.expect(tree["type"]).toBe(workspace.AdminwebShell);
  vitest.expect(tree["props"]["section"]).toBe("global");
  let gate = tree["props"]["children"];
  vitest.expect(gate["type"]).toBe(workspace.SuperadminGate);
});

// statstrade-superadmin.a03.s03-global-test/test-global-page-session-routing [78] 
vitest.afterEach(function (){
  vitest.vi.restoreAllMocks();
});
vitest.it("routes signed-in users to the actor view and guests to sign-in",function (){
  let session_spy = vitest.vi.spyOn(sb,"useListenSession");
  session_spy.mockReturnValueOnce([{"user":{"id":"actor-17"},"access_token":"access-17"}]);
  let authenticated = s00.A03S03GlobalPage();
  vitest.expect(authenticated["type"]).toBe(s00.A03S03GlobalMain);
  vitest.expect(authenticated["props"]["account_id"]).toBe("actor-17");
  vitest.expect(authenticated["props"]["token"]).toBe("access-17");
  session_spy.mockReturnValueOnce([null]);
  let guest = s00.A03S03GlobalPage();
  let links = guest["props"]["children"][1];
  vitest.expect(links["props"]["href"]).toBe("/auth/sign-in");
});

// statstrade-superadmin.a03.s03-global-test/Test_GlobalTableSwitcher [99] 
export function Test_GlobalTableSwitcher(){
  return (
    <T.YStack gap="$3" padding="$4" width={640}>
      <T.Text fontSize="$5" fontWeight="700">Global data</T.Text>
      <T.XStack gap="$2" flexWrap="wrap">
        <T.Button size="$2" backgroundColor="$color3">Global</T.Button>
        <T.Button size="$2" chromeless={true}>Commodity</T.Button>
        <T.Button size="$2" chromeless={true}>Country</T.Button>
        <T.Button size="$2" chromeless={true}>Token</T.Button>
      </T.XStack>
      <T.Text color="$color10">
        Choose a table to inspect the current Statstrade-v2 records.
      </T.Text>
    </T.YStack>);
}

export default Metadata