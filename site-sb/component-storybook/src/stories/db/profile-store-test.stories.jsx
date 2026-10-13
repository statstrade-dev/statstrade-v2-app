import * as vitest from 'vitest'

import * as store from '@statstrade/component/db/profile-store.jsx'

// statsui.basic.db.profile-store-test/test-profile-checked-body [12] 
vitest.describe("checked-body",function (){
  vitest.it("preserves successful data and reports the server message",function (){
    let data = {"id":"user-1"};
    vitest.expect(store.checked_body(data)).toBe(data);
    vitest.expect(function (){
      store.checked_body({"message":"Profile rejected"});
    }).toThrow("Profile rejected");
  });
});

// statsui.basic.db.profile-store-test/test-profile-checked-rows [25] 
vitest.describe("checked-rows",function (){
  vitest.it("preserves an empty result and rejects an object",function (){
    vitest.expect(store.checked_rows([])).toEqual([]);
    vitest.expect(function (){
      store.checked_rows({"id":"user-1"});
    }).toThrow("unexpected response");
  });
});

// statsui.basic.db.profile-store-test/test-public-profile-spec [36] 
vitest.it("filters by handle and includes only public fields",function (){
  vitest.expect(store.public_profile_spec("river")).toEqual({
    "select":"handle,first_name,last_name,country_code,city,bio",
    "filters":[{"column":"handle","value":"river"}]
  });
});

// statsui.basic.db.profile-store-test/test-owner-profile-spec [45] 
vitest.it("filters by owner id and includes editable fields",function (){
  vitest.expect(store.owner_profile_spec("user-1")).toEqual({
    "select":"id,handle,first_name,last_name,country_code,city,bio",
    "filters":[{"column":"id","value":"user-1"}]
  });
});

// statsui.basic.db.profile-store-test/test-secret-profile-spec [54] 
vitest.it("filters by user id and includes only private fields",function (){
  vitest.expect(store.secret_profile_spec("user-1")).toEqual({
    "select":"gender,gender_text,pronouns,dob,language",
    "filters":[{"column":"user_id","value":"user-1"}]
  });
});

// statsui.basic.db.profile-store-test/test-fetch-public-profile [63] 
vitest.describe("fetch-public-profile",function (){
  vitest.afterEach(function (){
    vitest.vi.restoreAllMocks();
  });
  vitest.it("queries stats_type and returns the matched profile",async function (){
    let row = {"handle":"river","city":"Melbourne"};
    let querySpy = vitest.vi.spyOn(sb,"queryTable");
    querySpy.mockResolvedValueOnce({"data":[row],"error":null});
    let result = await store.fetch_public_profile("river");
    vitest.expect(result).toEqual(row);
    vitest.expect(querySpy).toHaveBeenCalledWith(
      "User",
      store.public_profile_spec("river"),
      {"schema":"stats_type"}
    );
  });
});

// statsui.basic.db.profile-store-test/test-load-owner-profile [83] 
vitest.describe("load-owner-profile",function (){
  vitest.afterEach(function (){
    vitest.vi.restoreAllMocks();
  });
  vitest.it("keeps public and private rows separate",async function (){
    let publicRow = {"id":"user-1","handle":"river"};
    let secretRow = {"pronouns":"they/them"};
    let querySpy = vitest.vi.spyOn(sb,"queryTable");
    querySpy.mockResolvedValueOnce({"data":[publicRow],"error":null});
    querySpy.mockResolvedValueOnce({"data":[secretRow],"error":null});
    let result = await store.load_owner_profile("user-1");
    vitest.expect(result).toEqual({"public":publicRow,"secret":secretRow});
    vitest.expect(querySpy).toHaveBeenNthCalledWith(
      1,
      "User",
      store.owner_profile_spec("user-1"),
      {"schema":"stats_type"}
    );
    vitest.expect(querySpy).toHaveBeenNthCalledWith(
      2,
      "UserSecret",
      store.secret_profile_spec("user-1"),
      {"schema":"stats_type"}
    );
  });
});

// statsui.basic.db.profile-store-test/test-save-public-profile [107] 
vitest.describe("save-public-profile",function (){
  vitest.afterEach(function (){
    vitest.vi.restoreAllMocks();
  });
  vitest.it("sends the payload as RPC argument m and returns the result",async function (){
    let values = {"handle":"river","city":"Melbourne"};
    let saved = {"id":"user-1"};
    let rpcSpy = vitest.vi.spyOn(sb,"callRemote");
    rpcSpy.mockResolvedValueOnce({"data":saved,"error":null});
    let result = await store.save_public_profile(values);
    vitest.expect(result).toEqual(saved);
    vitest.expect(rpcSpy).toHaveBeenCalledWith("user_set_public",{"m":values});
  });
});

// statsui.basic.db.profile-store-test/test-save-secret-profile [125] 
vitest.describe("save-secret-profile",function (){
  vitest.afterEach(function (){
    vitest.vi.restoreAllMocks();
  });
  vitest.it("sends the private payload and returns the result",async function (){
    let values = {"pronouns":"they/them","language":"EN"};
    let saved = {"user_id":"user-1"};
    let rpcSpy = vitest.vi.spyOn(sb,"callRemote");
    rpcSpy.mockResolvedValueOnce({"data":saved,"error":null});
    let result = await store.save_secret_profile(values);
    vitest.expect(result).toEqual(saved);
    vitest.expect(rpcSpy).toHaveBeenCalledWith("user_set_secret",{"m":values});
  });
});