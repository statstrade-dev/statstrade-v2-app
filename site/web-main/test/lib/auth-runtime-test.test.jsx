import * as vitest from 'vitest'

import {renderToStaticMarkup} from 'react-dom/server'

import * as ReactQuery from '@tanstack/react-query'

import React from 'react'

import * as client_auth from '@statstrade/edge/remote/util-supabase.jsx'

import * as sut from '@statstrade/web-main/lib/auth-runtime.jsx'

// statstrade-web.lib.auth-runtime-test/test-auth-entry-from-session [15] 
vitest.it("preserves user scope and impersonation metadata",function (){
  let session = {"user":{"id":"user-7"},"access_token":"access-7"};
  vitest.expect(
    sut.authEntryFromSession(session,true,"admin-2","session-3")
  ).toEqual({
    "session":session,
    "scope":"user-7",
    "token":"access-7",
    "impersonated":true,
    "actor_id":"admin-2",
    "session_id":"session-3"
  });
  vitest.expect(sut.authEntryFromSession(null,false,null,null)).toBeNull();
  vitest.expect(
    sut.authEntryFromSession({"user":{"id":"user-7"}},false,null,null)
  ).toBeNull();
  vitest.expect(
    sut.authEntryFromSession({"access_token":"access-7"},false,null,null)
  ).toBeNull();
});

// statstrade-web.lib.auth-runtime-test/test-should-start-worker [35] 
vitest.it("requires both scope and token",function (){
  vitest.expect(
    sut.shouldStartWorker({"scope":"user-7","token":"access-7"})
  ).toBe(true);
  vitest.expect(sut.shouldStartWorker({"scope":"user-7"})).toBe(false);
  vitest.expect(sut.shouldStartWorker({"token":"access-7"})).toBe(false);
  vitest.expect(sut.shouldStartWorker(null)).toBe(false);
});

// statstrade-web.lib.auth-runtime-test/test-start-entry-worker [46] 
vitest.it("passes the user's scope and token exactly once",function (){
  let calls = [];
  let connect = function (scope,token){
    calls.push([scope,token]);
    return {"scope":scope,"token":token};
  };
  let guest_result = sut.startEntryWorker(null,connect);
  let user_result = sut.startEntryWorker({"scope":"user-7","token":"access-7"},connect);
  vitest.expect(guest_result).toBeNull();
  vitest.expect(calls).toEqual([["user-7","access-7"]]);
  vitest.expect(user_result).toEqual({"scope":"user-7","token":"access-7"});
});

// statstrade-web.lib.auth-runtime-test/test-auth-defaults [62] 
vitest.it("preserves the secure endpoint path and key and defaults HTTP to port 80",function (){
  vitest.expect(sut.authDefaults("https://db.example:5443/rest","anon-key")).toEqual({
    "host":"db.example",
    "port":"5443",
    "secured":true,
    "basepath":"/rest",
    "apikey":"anon-key"
  });
  vitest.expect(sut.authDefaults("http://db.example","anon-key")).toEqual({
    "host":"db.example",
    "port":80,
    "secured":false,
    "basepath":"",
    "apikey":"anon-key"
  });
});

// statstrade-web.lib.auth-runtime-test/test-auth-worker-config [80] 
vitest.it("maps URL, key, and active user token",function (){
  let config = sut.workerConfig(new URL("https://db.example:5443/rest"),"anon-key","access-7");
  vitest.expect(config.primary.defaults.host).toBe("db.example");
  vitest.expect(config.primary.defaults.port).toBe("5443");
  vitest.expect(config.primary.defaults.basepath).toBe("/rest");
  vitest.expect(config.primary.defaults.apikey).toBe("anon-key");
  vitest.expect(config.primary.defaults.token).toBe("access-7");
});

// statstrade-web.lib.auth-runtime-test/test-auth-runtime-provider [94] 
vitest.afterEach(async function (){
  await client_auth.resetClients();
});
vitest.it("provides guest state and leaves the SharedWorker disconnected",function (){
  let query_client = new ReactQuery.QueryClient();
  let SessionProbe = function (){
    let [session,_setSession,loaded] = client_auth.useListenSession();
    return React.createElement(
      "span",
      null,
      session ? "signed-in" : "guest",
      " ",
      loaded ? "loaded" : "loading"
    );
  };
  let tree = React.createElement(ReactQuery.QueryClientProvider,{"client":query_client},React.createElement(
    sut.AuthRuntimeProvider,
    null,
    React.createElement(SessionProbe,null)
  ));
  let markup = renderToStaticMarkup(tree);
  vitest.expect(markup).toContain("guest");
  vitest.expect(markup).toContain("loading");
  vitest.expect(client_auth.getEntry("default")["ready"]).toBe(false);
});