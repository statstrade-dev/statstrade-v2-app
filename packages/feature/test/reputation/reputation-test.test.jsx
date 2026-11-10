import * as vitest from 'vitest'

import {renderToStaticMarkup} from 'react-dom/server'

import {TamaguiProvider,createTamagui} from 'tamagui'

import {defaultConfig} from '@tamagui/config/v4'

import React from 'react'

import * as sb from '@statstrade/edge/remote/util-supabase.jsx'

import * as pageApi from '@statstrade/edge/substrate/page-api.jsx'

import * as globalStore from '@statstrade/edge/global-store.jsx'

import * as model from '@statstrade/feature/reputation/model.jsx'

import * as summary from '@statstrade/feature/reputation/public-summary.jsx'

import * as store from '@statstrade/feature/reputation/store.jsx'

import * as screen from '@statstrade/feature/reputation/screen.jsx'

// statstrade-web.feature.reputation.reputation-test/object-containing [16] 
export function object_containing(value){
  return vitest.expect.objectContaining(value);
}

// statstrade-web.feature.reputation.reputation-test/markup [19] 
export function markup(component,props){
  return renderToStaticMarkup(React.createElement(
    TamaguiProvider,
    {"config":createTamagui(defaultConfig),"defaultTheme":"light"},
    React.createElement(component,props)
  ));
}

// statstrade-web.feature.reputation.reputation-test/test-categories [25] 
vitest.describe("Brand-owned category catalogue",function (){
  vitest.it("does not seed or overwrite a brand until explicitly requested",function (){
    vitest.expect(model.programme({"detail":{}})).toMatchObject({"categories":[],"rules":[]});
    vitest.expect(model.starter_categories()).toHaveLength(12);
  });
  vitest.it("normalises every separator when creating an identifier",function (){
    vitest.expect(model.slug("  Local & community / housing  ")).toBe("local-community-housing");
  });
  vitest.it("renames and archives without changing identifiers or other categories",function (){
    let rows = model.starter_categories();
    let original = rows[0];
    let next = model.category_save(
      rows,
      Object.assign({},original,{"name":"Federal politics","archived":true})
    );
    vitest.expect(next[0]).toMatchObject({"id":"politics","name":"Federal politics","archived":true});
    vitest.expect(rows[0]["name"]).toBe("Politics");
    vitest.expect(next[1]).toBe(rows[1]);
  });
  vitest.it("rejects duplicate identifiers, missing parents, mixed kinds and cycles",function (){
    let rows = model.starter_categories();
    vitest.expect(function (){
      model.category_save(rows,{"name":"Politics","kind":"subject","color":"#123456"});
    }).toThrow("already exists");
    vitest.expect(function (){
      model.category_save(rows,Object.assign({},rows[0],{"parent_id":"missing"}));
    }).toThrow("parents");
    vitest.expect(function (){
      model.category_save(rows,Object.assign({},rows[0],{"parent_id":"accuracy"}));
    }).toThrow("same kind");
    vitest.expect(function (){
      model.category_save(rows,Object.assign({},rows[0],{"parent_id":"politics"}));
    }).toThrow("cycle");
  });
  vitest.it("compares JSONB values independently of key order while retaining category order",function (){
    vitest.expect(
      model.fingerprint({"name":"Housing","detail":{"a":1,"b":2}})
    ).toBe(
      model.fingerprint({"detail":{"b":2,"a":1},"name":"Housing"})
    );
    vitest.expect(model.fingerprint([1,2])).not.toBe(model.fingerprint([2,1]));
  });
  vitest.it("reorders immutably and retains unrelated brand metadata",function (){
    let rows = model.starter_categories();
    vitest.expect(model.reorder_category(rows,"economy",-1)[0]["id"]).toBe("economy");
    vitest.expect(rows[0]["id"]).toBe("politics");
    vitest.expect(model.merge_programme(
      {"website":"keep","reputation":{"old":true}},
      {"categories":rows,"rules":[]}
    )).toMatchObject({
      "website":"keep",
      "reputation":{"version":1,"categories":rows}
    });
  });
});

// statstrade-web.feature.reputation.reputation-test/test-identity [61] 
vitest.describe("Reputation identity",function (){
  vitest.it("requires an active owner or administrator",function (){
    vitest.expect(model.eligible_admin([
      {"level":"admin","is_active":false},
      {"level":"member","is_active":true}
    ])).toBe(false);
    vitest.expect(model.eligible_admin([{"level":"owner","is_active":true}])).toBe(true);
  });
  vitest.it("does not treat asset balances as lifetime earnings or ratings",function (){
    let data = model.preview_data();
    let cards = model.aspect_cards(
      model.programme(data.brand),
      data.assets,
      data.tokens,
      data.configs,
      []
    );
    let housing = cards.find(function (c){
      return c.id == "housing";
    });
    vitest.expect(housing.balance).toBe(240);
    vitest.expect(housing.lifetime_earned).toBeUndefined();
    vitest.expect(housing.rating).toBeUndefined();
  });
  vitest.it("does not borrow another playable balance or make unlinked labels into balances",function (){
    let data = model.preview_data();
    let cards = model.aspect_cards(model.programme(data.brand),[
      {
          "token_id":"token-housing",
          "playable_id":"foreign-playable",
          "balance":999
        }
    ],data.tokens,data.configs,[]);
    let housing = cards.find(function (c){
      return c.id == "housing";
    });
    vitest.expect(housing.balance).toBeUndefined();
    vitest.expect(
      model.aspect_cards({"categories":[{"id":"unlinked"}]},[{"balance":999}],[],[{}],[])[0]["balance"]
    ).toBeUndefined();
  });
  vitest.it("preserves zero and treats unavailable amounts explicitly",function (){
    vitest.expect(model.number_label(0)).toBe("0");
    vitest.expect(model.number_label(null)).toBe("—");
  });
});

// statstrade-web.feature.reputation.reputation-test/test-store [88] 
vitest.describe("Reputation store",function (){
  vitest.afterEach(function (){
    vitest.vi.restoreAllMocks();
  });
  vitest.it("filters token and role reads by exact brand and member",async function (){
    let query = vitest.vi.spyOn(sb,"queryTable");
    query.mockResolvedValueOnce({"data":[{"id":"org-a","title":"A","detail":{}}]});
    query.mockResolvedValueOnce({
      "data":[
            {"id":"access-a","class_table":"Org","class_context":"Global"}
          ]
    });
    query.mockResolvedValueOnce({"data":[{"level":"admin","is_active":true}]});
    query.mockResolvedValueOnce({"data":[{"id":"token-a","type":"reputation"}]});
    query.mockResolvedValueOnce({"data":[]});
    let data = await store.load_brand("org-a","user-a");
    vitest.expect(data.canManage).toBe(true);
    vitest.expect(query).toHaveBeenNthCalledWith(3,"AccessRole",object_containing({
      "filters":[
            {"column":"access_id","value":"access-a"},
            {"column":"class_table","value":"Org"},
            {"column":"class_context","value":"Global"},
            {"column":"member_id","value":"user-a"}
          ]
    }),{"schema":"stats_type"});
    vitest.expect(query).toHaveBeenNthCalledWith(
      4,
      "Token",
      object_containing({"filters":[{"column":"issuer_id","value":"org-a"}]}),
      {"schema":"stats_type"}
    );
    vitest.expect(data.capabilities.manual_awards).toBe(false);
  });
  vitest.it("paginates instead of silently truncating a large catalogue",async function (){
    let query = vitest.vi.spyOn(sb,"queryTable");
    query.mockResolvedValueOnce({"data":new Array(200).fill({"id":"row"})});
    query.mockResolvedValueOnce({"data":[{"id":"last"}]});
    vitest.expect(await store.rows("Token","id",[])).toHaveLength(201);
    vitest.expect(query).toHaveBeenLastCalledWith(
      "Token",
      object_containing({"offset":200}),
      {"schema":"stats_type"}
    );
  });
  vitest.it("preserves current unrelated metadata and passes the selected org id to org_update",async function (){
    let brand = {"id":"org-a","detail":{"website":"old"}};
    let config = {"categories":model.starter_categories(),"rules":[]};
    let query = vitest.vi.spyOn(sb,"queryTable");
    let rpc = vitest.vi.spyOn(sb,"callRemote");
    query.mockResolvedValueOnce({"data":[{"id":"org-a","detail":{"website":"new"}}]});
    rpc.mockResolvedValueOnce({"data":{"id":"org-a"}});
    let saved = await store.save_programme(brand,config);
    vitest.expect(saved.detail.website).toBe("new");
    vitest.expect(rpc).toHaveBeenCalledWith("org_update",{
      "org_id":"org-a",
      "m":{"detail":model.merge_programme({"website":"new"},config)}
    });
  });
  vitest.it("rejects stale programme changes before writing",async function (){
    let query = vitest.vi.spyOn(sb,"queryTable");
    let rpc = vitest.vi.spyOn(sb,"callRemote");
    query.mockResolvedValueOnce({
      "data":[
            {
                "id":"org-a",
                "detail":{"reputation":{"categories":[{"id":"changed"}]}}
              }
          ]
    });
    await vitest.expect(
      store.save_programme({"id":"org-a","detail":{}},{"categories":[],"rules":[]})
    ).rejects.toThrow("programme changed");
    vitest.expect(rpc).not.toHaveBeenCalled();
  });
  vitest.it("surfaces server permission failures and never reports a successful save",async function (){
    let query = vitest.vi.spyOn(sb,"queryTable");
    let rpc = vitest.vi.spyOn(sb,"callRemote");
    query.mockResolvedValueOnce({"data":[{"id":"org-a","detail":{}}]});
    rpc.mockResolvedValueOnce({"error":{"message":"Not an administrator"}});
    await vitest.expect(
      store.save_programme({"id":"org-a","detail":{}},{"categories":[],"rules":[]})
    ).rejects.toThrow("Not an administrator");
  });
});

// statstrade-web.feature.reputation.reputation-test/test-render [139] 
vitest.describe("Reputation screens",function (){
  vitest.afterEach(function (){
    vitest.vi.restoreAllMocks();
  });
  vitest.it("renders preview without subscribing to auth or making data requests",function (){
    let auth = vitest.vi.spyOn(sb,"useListenSession");
    let query = vitest.vi.spyOn(sb,"queryTable");
    let html = markup(screen.ReputationPage,{"preview":true});
    vitest.expect(html).toContain("Interactive design preview");
    vitest.expect(html).toContain("AusPolitics");
    vitest.expect(auth).not.toHaveBeenCalled();
    vitest.expect(query).not.toHaveBeenCalled();
  });
  vitest.it("keeps member points, skill ratings and lifetime totals separate",function (){
    let data = model.preview_data();
    let html = markup(
      screen.MemberProfile,
      {"data":data,"configuration":model.programme(data.brand)}
    );
    vitest.expect(html).toContain("Lifetime earned points");
    vitest.expect(html).toContain("Current balance: 240");
    vitest.expect(html).toContain("Skill 76");
    vitest.expect(html).not.toContain("NaN");
  });
  vitest.it("retains the recorded issuer, line amounts and rating movement on receipts",function (){
    let data = model.preview_data();
    let html = markup(screen.Receipt,{
      "award":data.awards[0],
      "brand":data.brand,
      "onClose":function (){
            
          }
    });
    vitest.expect(html).toContain("Awarded by AusPolitics");
    vitest.expect(html).toContain("+10");
    vitest.expect(html).toContain("74 → 76");
    vitest.expect(html).toContain("sample-v1");
  });
  vitest.it("keeps pending receipts distinct from confirmed awards and formats signed adjustments",function (){
    let data = model.preview_data();
    let award = Object.assign({},data.awards[0],{
      "status":"pending",
      "lines":[{"label":"Correction","amount":-5}]
    });
    let html = markup(screen.Receipt,{
      "award":award,
      "brand":data.brand,
      "onClose":function (){
            
          }
    });
    vitest.expect(html).toContain("Recorded by AusPolitics");
    vitest.expect(html).toContain("pending");
    vitest.expect(html).not.toContain("+-5");
  });
  vitest.it("disables administration when membership is read only",function (){
    let data = model.preview_data();
    data.canManage = false;
    let html = markup(screen.ReputationWorkspace,{"data":data,"preview":false});
    vitest.expect(html).toContain("Read-only programme");
    vitest.expect(html).toContain("disabled");
  });
  vitest.it("public profiles do not query private data",function (){
    let query = vitest.vi.spyOn(sb,"queryTable");
    vitest.expect(markup(summary.PublishedReputation,{})).toContain("No public brand reputation summary");
    vitest.expect(query).not.toHaveBeenCalled();
  });
});

// statstrade-web.feature.reputation.reputation-test/test-live-write-error [190] 
vitest.describe("live reputation write recovery",function (){
  vitest.afterEach(function (){
    vitest.vi.restoreAllMocks();
  });
  vitest.it("retains the programme instead of replacing it with an initial-load error page",function (){
    let apiSpy = vitest.vi.spyOn(pageApi,"usePageApi");
    apiSpy.mockReturnValue({
      "owner":{"status":"ready","error":"budget-unavailable"},
      "data":{"brand":{"id":"brand","title":"Test Brand","detail":{}}},
      "mutations":{}
    });
    let brandSpy = vitest.vi.spyOn(globalStore,"useStore");
    brandSpy.mockReturnValue([
      {"id":"brand"},
      function (){
          
        }
    ]);
    let html = markup(screen.LiveReputationPage,{});
    vitest.expect(html).toContain("Reputation &amp; rewards");
    vitest.expect(html.includes("Unable to load programme")).toBe(false);
  });
});