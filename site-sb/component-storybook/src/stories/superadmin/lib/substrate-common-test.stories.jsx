import * as vitest from 'vitest'

import React from 'react'

import * as common from '@statstrade/web-superadmin/lib/substrate-common.jsx'

// statstrade-superadmin.lib.substrate-common-test/test-substrate-config [15] 
vitest.it("maps Supabase URL fields and cache defaults",function (){
  let url = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL);
  let secure = url["protocol"] == "https:";
  let path = url["pathname"];
  let config = common.createConfig("sqlite",{"filename":":memory:"});
  vitest.expect(config["site_map_url"]).toBe("/worker/site-map/manifest.json");
  vitest.expect(config["primary"]["type"]).toBe("supabase");
  vitest.expect(config["primary"]["defaults"]["host"]).toBe(url["hostname"]);
  vitest.expect(config["primary"]["defaults"]["secured"]).toBe(secure);
  vitest.expect(config["primary"]["defaults"]["basepath"]).toBe((path == "/") ? "" : path);
  vitest.expect(config["primary"]["defaults"]["apikey"]).toBe(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  vitest.expect(config["caching"]["type"]).toBe("sqlite");
  vitest.expect(config["caching"]["defaults"]["filename"]).toBe(":memory:");
});

// statstrade-superadmin.lib.substrate-common-test/test-substrate-context [40] 
vitest.afterEach(function (){
  vitest.vi.restoreAllMocks();
});
vitest.it("reads the context created for substrate consumers",function (){
  let expected = {"resource":{"client":{"id":"actor-17"}}};
  let context_spy = vitest.vi.spyOn(r,"useContext");
  context_spy.mockReturnValue(expected);
  vitest.expect(common.useSubstrateContext()).toBe(expected);
  vitest.expect(context_spy).toHaveBeenCalledWith(common.SubstrateContext);
});

// statstrade-superadmin.lib.substrate-common-test/test-substrate-devtool-publication [54] 
vitest.afterEach(function (){
  vitest.vi.restoreAllMocks();
});
vitest.it("registers the active resource returned by the shared worker",function (){
  let resource = {"client":{"id":"devtool-probe"}};
  let state_index = 0;
  let values = ["ready",resource,null];
  let state_spy = vitest.vi.spyOn(r,"useState");
  state_spy.mockImplementation(function (_initial){
    let value = values[state_index];
    state_index = (state_index + 1);
    return [
      value,
      function (_next){
          return null;
        }
    ];
  });
  let effect_spy = vitest.vi.spyOn(r,"useEffect");
  effect_spy.mockImplementation(function (_effect,_dependencies){
    return null;
  });
  let registration_spy = vitest.vi.spyOn(devtool,"useDevtoolSharedWorker");
  registration_spy.mockImplementation(function (_resource){
    return null;
  });
  let state = common.useSubstrateNode({"client_id":"devtool-probe"},function (_client_id,_worker_url,_config){
    return resource;
  },function (_resource){
    return null;
  });
  vitest.expect(state["readyState"]).toBe("ready");
  vitest.expect(state["resource"]).toBe(resource);
  vitest.expect(registration_spy).toHaveBeenCalledTimes(1);
  vitest.expect(registration_spy).toHaveBeenCalledWith(resource);
});

// statstrade-superadmin.lib.substrate-common-test/test-substrate-provider [88] 
vitest.afterEach(function (){
  vitest.vi.restoreAllMocks();
});
vitest.it("wraps children in the substrate context provider",function (){
  let resource = {"client":{"id":"actor-17"}};
  let state_index = 0;
  let values = ["ready",resource,null];
  let state_spy = vitest.vi.spyOn(r,"useState");
  state_spy.mockImplementation(function (_initial){
    let value = values[state_index];
    state_index = (state_index + 1);
    return [
      value,
      function (_next){
          return null;
        }
    ];
  });
  vitest.vi.spyOn(r,"useEffect").mockImplementation(function (_effect,_dependencies){
    return null;
  });
  vitest.vi.spyOn(devtool,"useDevtoolSharedWorker").mockImplementation(function (_resource){
    return null;
  });
  let child = React.createElement("span",{"data-role":"content"});
  let result = common.SubstrateProvider(child,{},function (){
    return null;
  },function (_resource){
    return null;
  });
  let context = common["SubstrateContext"];
  vitest.expect(result["type"]).toBe(context["Provider"]);
  vitest.expect(result["props"]["value"]["readyState"]).toBe("ready");
  vitest.expect(result["props"]["value"]["resource"]).toBe(resource);
  vitest.expect(result["props"]["children"]).toBe(child);
});