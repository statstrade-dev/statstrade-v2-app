import * as client_supabase from '@statstrade/edge/lib/xt/db/node/client-supabase.jsx'

import * as client_base from '@statstrade/edge/lib/xt/db/node/client-base.jsx'

import * as substrate from '@statstrade/edge/lib/xt/substrate.jsx'

import * as proxy_util from '@statstrade/edge/lib/xt/db/node/proxy-util.jsx'

import * as proxy_base from '@statstrade/edge/lib/xt/db/node/proxy-base.jsx'

import * as page_proxy from '@statstrade/edge/lib/xt/substrate/page-proxy.jsx'

import * as vitest from 'vitest'

import * as browser_transport from '@statstrade/edge/lib/xt/substrate/transport-browser.jsx'

import * as proxy_supabase from '@statstrade/edge/lib/xt/db/node/proxy-supabase.jsx'

import * as sut from '@statstrade/edge/remote/util-supabase.jsx'

// statsui.edge.remote.util-supabase-test/test-util-new-entry [25] 
vitest.describe("newEntry",function (){
  vitest.it("initializes independent empty lifecycle fields",function (){
    let node = {};
    let params = {"url":"https://db.example","key":"anon"};
    vitest.expect(sut.newEntry(node,params)).toEqual({
      "instance":node,
      "params":params,
      "ready":false,
      "connecting":null,
      "connection":null,
      "error":null,
      "waiters":[],
      "subscriptions":[]
    });
  });
});

// statsui.edge.remote.util-supabase-test/test-util-create-params [48] 
vitest.describe("createParams",function (){
  vitest.afterEach(function (){
    vitest.vi.unstubAllEnvs();
  });
  vitest.it("uses explicit endpoint credentials and preserves an optional token",function (){
    vitest.vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL","https://default.example");
    vitest.vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY","default-key");
    let defaults = sut.createParams();
    let supplied = sut.createParams({
      "url":"https://custom.example",
      "key":"public",
      "token":"access-7"
    });
    vitest.expect(defaults.url).toBe("https://default.example");
    vitest.expect(defaults.key).toBe("default-key");
    vitest.expect(defaults.token).toBeUndefined();
    vitest.expect(supplied).toEqual({
      "url":"https://custom.example",
      "key":"public",
      "token":"access-7"
    });
  });
});

// statsui.edge.remote.util-supabase-test/test-util-get-client [91] 
vitest.describe("getClient",function (){
  vitest.afterEach(async function (){
    await sut.resetClients();
  });
  vitest.it("reuses a node for the same id and config",function (){
    let config = {"url":"https://db.example","key":"anon"};
    let first = sut.getClient("same-client",config);
    vitest.expect(sut.getClient("same-client",config)).toBe(first);
  });
});

// statsui.edge.remote.util-supabase-test/test-util-worker-config [106] 
vitest.describe("workerConfig",function (){
  vitest.it("maps URL transport settings to the worker config",function (){
    let config = sut.workerConfig({
      "url":"https://db.example:5443/rest",
      "key":"anon",
      "token":"access-7"
    });
    vitest.expect(config.primary.defaults.host).toBe("db.example");
    vitest.expect(config.primary.defaults.port).toBe("5443");
    vitest.expect(config.primary.defaults.secured).toBe(true);
    vitest.expect(config.primary.defaults.basepath).toBe("/rest");
    vitest.expect(config.primary.defaults.apikey).toBe("anon");
    vitest.expect(config.primary.defaults.token).toBe("access-7");
  });
});

// statsui.edge.remote.util-supabase-test/test-util-connect-proxy-node [138] 
vitest.afterEach(function (){
  vitest.vi.restoreAllMocks();
});
vitest.it("connects all proxy layers before kernel initialization",async function (){
  let client = sut.createClient({"client_id":"proxy-test"});
  let config = {"database":"primary"};
  let connection = {"transport_id":"worker","connection":{"port":14}};
  let install = vitest.vi.spyOn(page_proxy,"install");
  let base_init = vitest.vi.spyOn(proxy_base,"init_proxy_handlers");
  let supabase_init = vitest.vi.spyOn(proxy_supabase,"init_proxy_handlers");
  let connect = vitest.vi.spyOn(browser_transport,"connect_sharedworker");
  let set_transport = vitest.vi.spyOn(proxy_util,"set_default_transport");
  let kernel_init = vitest.vi.spyOn(client_base,"kernel_init");
  connect.mockResolvedValue(connection);
  kernel_init.mockResolvedValue("initialized");
  let result = await sut.connectProxyNode(client,config);
  vitest.expect(install).toHaveBeenCalledWith(client);
  vitest.expect(base_init).toHaveBeenCalledWith(client);
  vitest.expect(supabase_init).toHaveBeenCalledWith(client);
  vitest.expect(connect).toHaveBeenCalled();
  vitest.expect(set_transport).toHaveBeenCalledWith(client,"worker");
  vitest.expect(kernel_init).toHaveBeenCalledWith(client,config,{},{},{});
  vitest.expect(result["connection"]).toBe(connection);
});

// statsui.edge.remote.util-supabase-test/test-util-reset-clients [168] 
vitest.describe("resetClients",function (){
  vitest.afterEach(async function (){
    await sut.resetClients();
  });
  vitest.it("rejects pending calls, clears clients, and can be repeated",async function (){
    let node = sut.getClient("reset-client");
    let pending = sut.awaitClient("reset-client");
    let rejection = pending.then(function (_){
      return "resolved";
    },function (error){
      return error.message;
    });
    vitest.expect(sut.getEntry("reset-client")["instance"]).toBe(node);
    vitest.expect(await sut.resetClients()).toBe(true);
    vitest.expect(await rejection).toBe("The SharedWorker client was reset.");
    vitest.expect(sut.getEntry("reset-client")).toBeUndefined();
    vitest.expect(await sut.resetClients()).toBe(true);
  });
});

// statsui.edge.remote.util-supabase-test/test-util-client-readiness [200] 
vitest.describe("client readiness",function (){
  vitest.afterEach(async function (){
    sut.markClientFailed(new Error("ready test cleanup"),"ready-client");
    await sut.resetClients();
  });
  vitest.it("resolves queued calls with the ready node and stores its connection",async function (){
    let node = sut.getClient("ready-client");
    let pending = sut.awaitClient("ready-client");
    let connection = {"port":"ready"};
    vitest.expect(sut.markClientReady("ready-client",connection)).toBe(node);
    vitest.expect(await pending).toBe(node);
    vitest.expect(sut.getEntry("ready-client")["ready"]).toBe(true);
    vitest.expect(sut.getEntry("ready-client")["connection"]).toBe(connection);
  });
});

// statsui.edge.remote.util-supabase-test/test-util-client-failure [225] 
vitest.describe("client failure",function (){
  vitest.afterEach(async function (){
    await sut.resetClients();
  });
  vitest.it("rejects queued calls with the original connection error",async function (){
    sut.getClient("failed-client");
    let pending = sut.awaitClient("failed-client");
    let rejection = pending.then(function (_){
      return null;
    },function (error){
      return error;
    });
    let failure = new Error("worker failed");
    vitest.expect(sut.markClientFailed(failure,"failed-client")).toBe(true);
    vitest.expect(await rejection).toBe(failure);
    vitest.expect(sut.getEntry("failed-client")["error"]).toBe(failure);
  });
});

// statsui.edge.remote.util-supabase-test/test-util-await-client [249] 
vitest.describe("awaitClient",function (){
  vitest.afterEach(async function (){
    sut.markClientFailed(new Error("await test cleanup"),"already-ready");
    await sut.resetClients();
  });
  vitest.it("returns an already-ready client immediately",async function (){
    let node = sut.getClient("already-ready");
    sut.markClientReady("already-ready",{"port":"ready"});
    vitest.expect(await sut.awaitClient("already-ready")).toBe(node);
  });
});

// statsui.edge.remote.util-supabase-test/test-util-web-client-selection [269] 
vitest.afterEach(function (){
  sut.resetWebRuntime();
});
vitest.it("selects the data node for shared calls and the auth node for auth calls",async function (){
  let auth_node = {"id":"auth"};
  let data_node = {"id":"data"};
  vitest.expect(sut.setWebAuthRuntime(auth_node,null,null)).toBe(auth_node);
  vitest.expect(sut.setWebDataClient(data_node)).toBe(data_node);
  vitest.expect(await sut.awaitAuthClient()).toBe(auth_node);
  vitest.expect(await sut.awaitClient()).toBe(data_node);
  sut.setWebDataClient(null);
  vitest.expect(await sut.awaitClient()).toBe(auth_node);
});

// statsui.edge.remote.util-supabase-test/test-util-set-web-auth-runtime [288] 
vitest.afterEach(function (){
  sut.resetWebRuntime();
});
vitest.it("makes the provided node available to auth operations",async function (){
  let auth_node = {"id":"local-auth"};
  vitest.expect(sut.setWebAuthRuntime(auth_node,null,null)).toBe(auth_node);
  vitest.expect(await sut.awaitAuthClient()).toBe(auth_node);
});

// statsui.edge.remote.util-supabase-test/test-util-set-web-data-client [302] 
vitest.afterEach(function (){
  sut.resetWebRuntime();
});
vitest.it("returns the selected node and supports clearing it",function (){
  let data_node = {"id":"data"};
  vitest.expect(sut.setWebDataClient(data_node)).toBe(data_node);
  vitest.expect(sut.setWebDataClient(null)).toBeNull();
});

// statsui.edge.remote.util-supabase-test/test-util-reset-web-runtime [315] 
vitest.afterEach(async function (){
  sut.resetWebRuntime();
  await sut.resetClients();
});
vitest.it("makes client waits pending again after it clears Web state",async function (){
  sut.setWebAuthRuntime({"id":"auth"},null,null);
  sut.setWebDataClient({"id":"data"});
  vitest.expect(sut.resetWebRuntime()).toBe(true);
  vitest.expect(sut.resetWebRuntime()).toBe(true);
  let state = "pending";
  let pending = sut.awaitClient("web-reset").then(function (_){
    state = "resolved";
    return state;
  },function (error){
    state = error["message"];
    return state;
  });
  await Promise.resolve();
  vitest.expect(state).toBe("pending");
  sut.markClientFailed(new Error("cleanup"),"web-reset");
  vitest.expect(await pending).toBe("cleanup");
});

// statsui.edge.remote.util-supabase-test/test-util-notify-web-auth-changed [342] 
vitest.afterEach(function (){
  sut.resetWebRuntime();
});
vitest.it("invalidates exactly the auth entry and succeeds after teardown",async function (){
  let invalidations = [];
  let query_client = {
    "invalidateQueries":function (query){
        invalidations.push(query);
        return Promise.resolve(true);
      }
  };
  sut.setWebAuthRuntime({},query_client,null);
  vitest.expect(await sut.notifyWebAuthChanged()).toBe(true);
  vitest.expect(invalidations).toEqual([{"queryKey":["web-auth-entry"]}]);
  sut.resetWebRuntime();
  vitest.expect(await sut.notifyWebAuthChanged()).toBe(true);
});

// statsui.edge.remote.util-supabase-test/test-util-publish-or-store-session [365] 
vitest.afterEach(function (){
  sut.resetWebRuntime();
  vitest.vi.restoreAllMocks();
  vitest.vi.unstubAllGlobals();
});
vitest.it("persists local refresh tokens, invalidates query state, and publishes workers",async function (){
  let stored = {};
  let removed = [];
  vitest.vi.stubGlobal("localStorage",{
    "setItem":function (key,value){
        stored[key] = value;
      },
    "removeItem":function (key){
        removed.push(key);
      }
  });
  let invalidations = [];
  let query_client = {
    "invalidateQueries":function (query){
        invalidations.push(query);
        return Promise.resolve(true);
      }
  };
  let auth_node = {"id":"auth"};
  let worker_node = {"id":"worker"};
  sut.setWebAuthRuntime(auth_node,query_client,null);
  let session = {"refresh_token":"refresh-7","user":{"id":"user-7"}};
  vitest.expect(
    await sut.publishOrStoreSession(auth_node,session,"SIGNED_IN")
  ).toBe(session);
  vitest.expect(stored).toEqual({"statstrade-web-refresh-token":"refresh-7"});
  vitest.expect(invalidations).toEqual([{"queryKey":["web-auth-entry"]}]);
  vitest.expect(
    await sut.publishOrStoreSession(auth_node,null,"SIGNED_OUT")
  ).toBeNull();
  vitest.expect(removed).toEqual(["statstrade-web-refresh-token"]);
  let request = vitest.vi.spyOn(substrate,"request");
  request.mockResolvedValue("published");
  vitest.expect(
    await sut.publishOrStoreSession(worker_node,null,"SIGNED_OUT")
  ).toBe("published");
  vitest.expect(request).toHaveBeenCalledWith(
    worker_node,
    null,
    "@statstrade-web/auth/session-set",
    [null,"SIGNED_OUT"],
    {}
  );
});

// statsui.edge.remote.util-supabase-test/test-util-postgrest-value [476] 
vitest.describe("postgrestValue",function (){
  vitest.it("quotes in-list strings and represents null exactly",function (){
    vitest.expect(sut.postgrestValue(null)).toBe("null");
    vitest.expect(sut.postgrestValue("a,b",true)).toBe("\"a,b\"");
  });
});

// statsui.edge.remote.util-supabase-test/test-util-query-and-selection-contracts [489] 
vitest.describe("Supabase query helpers",function (){
  vitest.it("encodes filters, selection and route helpers exactly",function (){
    let params = new URLSearchParams(sut.buildQuery({
      "select":"id,name",
      "filters":[
            {"column":"status","value":"active"},
            {"column":"id","operator":"in","value":["a",2]}
          ],
      "order":[{"column":"name","ascending":false}],
      "limit":0,
      "offset":4
    }));
    vitest.expect(params.get("status")).toBe("eq.active");
    vitest.expect(params.get("id")).toBe("in.(\"a\",2)");
    vitest.expect(params.get("order")).toBe("name.desc");
    vitest.expect(params.get("limit")).toBe("0");
    vitest.expect(params.get("offset")).toBe("4");
    vitest.expect(sut.postgrestValue("a,b",true)).toBe("\"a,b\"");
    vitest.expect(sut.toSelect(["id","email"])).toBe("id,email");
    vitest.expect(
      sut.toSelect({"profile":{"rel":"users","fields":["id","email"]}})
    ).toBe("profile:users(id,email)");
    vitest.expect(function (){
      sut.toSelect({"age":42});
    }).toThrow("Invalid spec");
    vitest.expect(sut.authHref("/auth","sign-in")).toBe("/auth/sign-in");
    vitest.expect(sut.authHref(null,"sign-in")).toBe("/sign-in");
    vitest.expect(sut.authRedirectTo(null,"https://app.example")).toBe("https://app.example");
  });
});

// statsui.edge.remote.util-supabase-test/test-util-auth-href [526] 
vitest.describe("authHref",function (){
  vitest.it("joins routes with and without a configured prefix",function (){
    vitest.expect(sut.authHref("/auth","sign-in")).toBe("/auth/sign-in");
    vitest.expect(sut.authHref(null,"sign-in")).toBe("/sign-in");
  });
});

// statsui.edge.remote.util-supabase-test/test-util-auth-redirect [539] 
vitest.describe("authRedirectTo",function (){
  vitest.it("prefers site configuration and falls back to origin",function (){
    vitest.expect(
      sut.authRedirectTo("https://site.example","https://app.example")
    ).toBe("https://site.example");
    vitest.expect(sut.authRedirectTo(null,"https://app.example")).toBe("https://app.example");
  });
});

// statsui.edge.remote.util-supabase-test/test-util-local-store [572] 
vitest.describe("getLocalStore",function (){
  vitest.afterEach(function (){
    vitest.vi.unstubAllGlobals();
  });
  vitest.it("parses JSON but preserves unstructured values",function (){
    vitest.vi.stubGlobal("localStorage",{
      "getItem":function (key){
            return (key == "json") ? "{\"id\":1}" : "opaque";
          }
    });
    vitest.expect(sut.getLocalStore("json")).toEqual({"id":1});
    vitest.expect(sut.getLocalStore("token")).toBe("opaque");
  });
});

// statsui.edge.remote.util-supabase-test/test-util-subscribe-worker-auth-events [601] 
let subscribe_test_client = null;
vitest.afterEach(async function (){
  if(subscribe_test_client){
    await sut.unsubscribeWorkerAuthEvents(subscribe_test_client);
  }
  sut.resetWebRuntime();
  vitest.vi.restoreAllMocks();
});
vitest.it("subscribes once under the Web auth event topic",async function (){
  subscribe_test_client = sut.createClient({"client_id":"subscribe-test"});
  sut.setWebDataClient(subscribe_test_client);
  let register = vitest.vi.spyOn(substrate,"register_trigger");
  let subscribe = vitest.vi.spyOn(substrate,"subscribe");
  let unsubscribe = vitest.vi.spyOn(substrate,"unsubscribe");
  subscribe.mockResolvedValue("subscribed");
  unsubscribe.mockResolvedValue(true);
  vitest.expect(await sut.subscribeWorkerAuthEvents(subscribe_test_client)).toBe("subscribed");
  vitest.expect(register).toHaveBeenCalled();
  vitest.expect(subscribe).toHaveBeenCalledWith(
    subscribe_test_client,
    "statstrade-web-auth",
    "session.changed",
    "statstrade-auth-session",
    {}
  );
});

// statsui.edge.remote.util-supabase-test/test-util-unsubscribe-worker-auth-events [631] 
let unsubscribe_test_client = null;
vitest.afterEach(async function (){
  if(unsubscribe_test_client){
    await sut.unsubscribeWorkerAuthEvents(unsubscribe_test_client);
  }
  sut.resetWebRuntime();
  vitest.vi.restoreAllMocks();
});
vitest.it("unsubscribes the stored room and makes teardown repeatable",async function (){
  unsubscribe_test_client = sut.createClient({"client_id":"unsubscribe-test"});
  sut.setWebDataClient(unsubscribe_test_client);
  let subscribe = vitest.vi.spyOn(substrate,"subscribe");
  subscribe.mockResolvedValue("subscribed");
  let unsubscribe = vitest.vi.spyOn(substrate,"unsubscribe");
  unsubscribe.mockResolvedValue(true);
  let unregister = vitest.vi.spyOn(substrate,"unregister_trigger");
  await sut.subscribeWorkerAuthEvents(unsubscribe_test_client);
  vitest.expect(
    await sut.unsubscribeWorkerAuthEvents(unsubscribe_test_client)
  ).toBe(true);
  vitest.expect(unsubscribe).toHaveBeenCalledWith(
    unsubscribe_test_client,
    "statstrade-web-auth",
    "session.changed",
    "statstrade-auth-session",
    {}
  );
  vitest.expect(unregister).toHaveBeenCalledWith(unsubscribe_test_client,"session.changed");
  vitest.expect(
    await sut.unsubscribeWorkerAuthEvents(unsubscribe_test_client)
  ).toBe(false);
});

// statsui.edge.remote.util-supabase-test/test-util-public-url [711] 
vitest.describe("getPublicUrl",function (){
  vitest.beforeEach(function (){
    vitest.vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL","https://db.example");
  });
  vitest.afterEach(function (){
    vitest.vi.unstubAllEnvs();
  });
  vitest.it("encodes each path segment without encoding separators",function (){
    let url = sut.getPublicUrl("profile pics","users/u 1/photo?.png");
    vitest.expect(url).toContain("/storage/v1/object/public/profile%20pics/");
    vitest.expect(url).toContain("users/u%201/photo%3F.png");
  });
});

// statsui.edge.remote.util-supabase-test/test-util-update-user [738] 
vitest.afterEach(async function (){
  sut.markClientFailed(null,"default");
  await sut.resetClients();
  vitest.vi.restoreAllMocks();
  vitest.vi.unstubAllEnvs();
});
vitest.it("routes the update, publishes the changed user, and preserves errors",async function (){
  vitest.vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL","https://db.example");
  vitest.vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY","anon");
  let active_client = sut.getClient("default");
  sut.markClientReady("default",null);
  let user = {"id":"user-7","email":"new@example.com"};
  let session = {
    "access_token":"access",
    "user":{"id":"user-7","email":"old@example.com"}
  };
  let put = vitest.vi.spyOn(client_supabase,"user_put");
  put.mockResolvedValue({"user":user});
  let current = vitest.vi.spyOn(client_supabase,"current_session");
  current.mockResolvedValue(session);
  let publish = vitest.vi.spyOn(substrate,"request");
  publish.mockResolvedValue(true);
  let options = {"emailRedirectTo":"https://app.test/auth/callback"};
  let result = await sut.updateUser(active_client,{"email":"new@example.com"},options);
  vitest.expect(put).toHaveBeenCalledWith(active_client,"db/primary",{"email":"new@example.com"},options);
  vitest.expect(current).toHaveBeenCalledWith(active_client,"db/primary",{});
  vitest.expect(publish).toHaveBeenCalledWith(
    active_client,
    null,
    "@statstrade-web/auth/session-set",
    [{"access_token":"access","user":user},"USER_UPDATED"],
    {}
  );
  vitest.expect(result).toEqual({"data":{"user":user},"error":null});
  let failure = new Error("user update failed");
  put.mockRejectedValueOnce(failure);
  let failed = await sut.updateUser(active_client,{"email":"bad@example.com"},{});
  vitest.expect(failed).toEqual({"data":null,"error":failure});
  vitest.expect(publish).toHaveBeenCalledTimes(1);
});