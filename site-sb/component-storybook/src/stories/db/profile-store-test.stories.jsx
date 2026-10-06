import * as vitest from 'vitest'

import * as store from '@statstrade/component/db/profile-store.jsx'

// statsui.basic.db.profile-store-test/test-profile-adapter-defaults [12] 
vitest.describe("profile-adapter-defaults",function (){
  vitest.it("preserves host, port, scheme, path, and key",function (){
    vitest.expect(
      store.profile_adapter_defaults("https://database.example:7443/platform","anon-key")
    ).toEqual({
      "host":"database.example",
      "port":"7443",
      "secured":true,
      "basepath":"/platform",
      "apikey":"anon-key"
    });
  });
});

// statsui.basic.db.profile-store-test/test-create-profile-adapter [28] 
vitest.describe("create-profile-adapter",function (){
  vitest.it("uses profile schema lookup for both tables",function (){
    let adapter = store.create_profile_adapter("http://127.0.0.1:54321","local-key");
    vitest.expect(adapter.client.defaults.apikey).toBe("local-key");
    vitest.expect(adapter.lookup.User.schema).toBe("stats_type");
    vitest.expect(adapter.lookup.UserSecret.schema).toBe("stats_type");
  });
});

// statsui.basic.db.profile-store-test/test-set-profile-session [40] 
vitest.describe("set-profile-session",function (){
  vitest.it("syncs both the session and access token",function (){
    let adapter = {"state":{"session":null},"client":{"defaults":{}}};
    let session = {"access_token":"profile-token"};
    store.set_profile_session(adapter,session);
    vitest.expect(adapter.state.session).toEqual(session);
    vitest.expect(adapter.client.defaults.token).toBe("profile-token");
    store.set_profile_session(adapter,null);
    vitest.expect(adapter.state.session).toBe(null);
    vitest.expect(adapter.client.defaults.token).toBe(null);
  });
});

// statsui.basic.db.profile-store-test/test-public-profile-tree [56] 
vitest.describe("public-profile-tree",function (){
  vitest.it("filters by handle and omits private location data",function (){
    vitest.expect(store.public_profile_tree("river")).toEqual([
      "User",
      {"handle":"river"},
      ["handle","first_name","last_name","country_code","city","bio"]
    ]);
  });
});

// statsui.basic.db.profile-store-test/test-owner-profile-tree [68] 
vitest.describe("owner-profile-tree",function (){
  vitest.it("keeps private location JSON out of the editor query",function (){
    vitest.expect(store.owner_profile_tree("user-1")).toEqual([
      "User",
      {"id":"user-1"},
      [
          "id",
          "handle",
          "first_name",
          "last_name",
          "country_code",
          "city",
          "bio"
        ]
    ]);
  });
});

// statsui.basic.db.profile-store-test/test-secret-profile-tree [80] 
vitest.describe("secret-profile-tree",function (){
  vitest.it("returns only the private profile columns",function (){
    vitest.expect(store.secret_profile_tree("user-1")).toEqual([
      "UserSecret",
      {"user_id":"user-1"},
      ["gender","gender_text","pronouns","dob","language"]
    ]);
  });
});

// statsui.basic.db.profile-store-test/test-checked-body [92] 
vitest.describe("checked-body",function (){
  vitest.it("returns a successful response unchanged",function (){
    let response = {"id":"user-1"};
    vitest.expect(store.checked_body(response)).toBe(response);
  });
  vitest.it("throws the PostgREST error message",function (){
    vitest.expect(function (){
      store.checked_body({"message":"Profile rejected"});
    }).toThrow("Profile rejected");
  });
});

// statsui.basic.db.profile-store-test/test-checked-rows [107] 
vitest.describe("checked-rows",function (){
  vitest.it("returns an empty result when no rows match",function (){
    vitest.expect(store.checked_rows([])).toEqual([]);
  });
  vitest.it("throws for a non-array response",function (){
    vitest.expect(function (){
      store.checked_rows({"message":"Denied"});
    }).toThrow("Denied");
  });
});

// statsui.basic.db.profile-store-test/test-fetch-public-profile [121] 
vitest.describe("fetch-public-profile",function (){
  vitest.afterEach(function (){
    vitest.vi.restoreAllMocks();
  });
  vitest.it("uses the public query and returns its first row",async function (){
    let adapter = {};
    let row = {"handle":"river","city":"Melbourne"};
    let pullSpy = vitest.vi.spyOn(impl_supabase,"pull_async");
    pullSpy.mockResolvedValueOnce([row]);
    let result = await store.fetch_public_profile(adapter,"river");
    vitest.expect(result).toEqual(row);
    vitest.expect(pullSpy).toHaveBeenCalledWith(adapter,[
      "User",
      {"handle":"river"},
      ["handle","first_name","last_name","country_code","city","bio"]
    ]);
    null;
  });
});

// statsui.basic.db.profile-store-test/test-save-public-profile [144] 
vitest.describe("save-public-profile",function (){
  vitest.afterEach(function (){
    vitest.vi.restoreAllMocks();
  });
  vitest.it("sets the session and sends the public payload",async function (){
    let adapter = {"state":{"session":null},"client":{"defaults":{}}};
    let session = {"access_token":"owner-token"};
    let payload = {"handle":"river","city":"Melbourne"};
    let rpcSpy = vitest.vi.spyOn(impl_supabase,"rpc_call_async");
    rpcSpy.mockResolvedValueOnce({"id":"user-1"});
    let result = await store.save_public_profile(adapter,session,payload);
    vitest.expect(result).toEqual({"id":"user-1"});
    vitest.expect(adapter.client.defaults.token).toBe("owner-token");
    vitest.expect(rpcSpy).toHaveBeenCalledWith(adapter,{
      "id":"user_set_public",
      "schema":"stats_rpc",
      "input":[{"symbol":"m"}]
    },[payload],{});
    null;
  });
});

// statsui.basic.db.profile-store-test/test-save-secret-profile [170] 
vitest.describe("save-secret-profile",function (){
  vitest.afterEach(function (){
    vitest.vi.restoreAllMocks();
  });
  vitest.it("uses the private profile payload contract",async function (){
    let adapter = {"state":{"session":null},"client":{"defaults":{}}};
    let payload = {"pronouns":"they/them","language":"EN"};
    let rpcSpy = vitest.vi.spyOn(impl_supabase,"rpc_call_async");
    rpcSpy.mockResolvedValueOnce({"user_id":"user-1"});
    let result = await store.save_secret_profile(adapter,{"access_token":"owner-token"},payload);
    vitest.expect(result).toEqual({"user_id":"user-1"});
    vitest.expect(rpcSpy).toHaveBeenCalledWith(adapter,{
      "id":"user_set_secret",
      "schema":"stats_rpc",
      "input":[{"symbol":"m"}]
    },[payload],{});
    null;
  });
});

// statsui.basic.db.profile-store-test/test-load-owner-profile [194] 
vitest.describe("load-owner-profile",function (){
  vitest.afterEach(function (){
    vitest.vi.restoreAllMocks();
  });
  vitest.it("sets the token and runs both owner-filtered trees",async function (){
    let adapter = {"state":{"session":null},"client":{"defaults":{}}};
    let session = {"access_token":"owner-token"};
    let publicRow = {"id":"user-1","handle":"river"};
    let secretRow = {"pronouns":"they/them"};
    let pullSpy = vitest.vi.spyOn(impl_supabase,"pull_async");
    pullSpy.mockResolvedValueOnce([publicRow]);
    pullSpy.mockResolvedValueOnce([secretRow]);
    let result = await store.load_owner_profile(adapter,session,"user-1");
    vitest.expect(result).toEqual({"public":publicRow,"secret":secretRow});
    vitest.expect(adapter.client.defaults.token).toBe("owner-token");
    vitest.expect(pullSpy).toHaveBeenNthCalledWith(1,adapter,store.owner_profile_tree("user-1"));
    vitest.expect(pullSpy).toHaveBeenNthCalledWith(2,adapter,store.secret_profile_tree("user-1"));
    null;
  });
});