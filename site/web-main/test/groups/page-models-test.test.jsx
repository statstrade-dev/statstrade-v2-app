import * as vitest from 'vitest'

import * as registry from '@statstrade/web-main/groups/registry.jsx'

import * as api from '@statstrade/edge/substrate/page-api.jsx'

import * as spec from '@statstrade/edge/substrate/group-spec.jsx'

import * as visual from '@statstrade/feature/visual/shell.jsx'

// statstrade-web.groups.page-models-test/test-visual-routes [10] 
vitest.describe("visual-language route coverage",function (){
  vitest.it("maps every page model to a design and limits navigation to implemented routes",function (){
    vitest.expect(Object.keys(visual.RouteDesigns).sort()).toEqual(Object.keys(registry.Routes).sort());
    visual.ParticipantLinks.concat(visual.OrganisationLinks).forEach(function (link){
      let path = link.href.split("#")[0];
      vitest.expect(registry.Routes[path]).toBeDefined();
    });
  });
  vitest.it("handles detail pages, sign-in callback fragments and organisation creation",function (){
    vitest.expect(
      visual.activeLink("/manage","/manage#access_token=local-test")
    ).toBe(true);
    vitest.expect(visual.activeLink("/manage","/manage?create=1")).toBe(false);
    vitest.expect(visual.activeLink("/manage?create=1","/manage?create=1")).toBe(true);
    vitest.expect(visual.activeLink("/newsroom","/newsroom/article-id")).toBe(true);
    vitest.expect(visual.activeLink("/forecasts","/questions/topic-id")).toBe(true);
    vitest.expect(
      visual.activeLink("/manage/reputation","/manage/reputation/budgets")
    ).toBe(false);
  });
});

// statstrade-web.groups.page-models-test/test-routes [30] 
vitest.describe("web-main route models",function (){
  vitest.it("defines every current route family",function (){
    [
      "/",
      "/profile",
      "/u/[handle]",
      "/newsroom",
      "/newsroom/[publication_id]",
      "/manage",
      "/manage/reputation",
      "/manage/reputation/budgets",
      "/questions/[topic_id]",
      "/about/privacy",
      "/sign-in"
    ].forEach(function (route){
      vitest.expect(registry.Routes[route]["id"].startsWith("web-main/")).toBe(true);
    });
  });
  vitest.it("keeps static pages local and the design preview isolated",function (){
    vitest.expect(
      registry.Routes["/about/privacy"]["models"]["route"]["kind"]
    ).toBe("local");
    vitest.expect(registry.Routes["/reputation/design"]["area"]).toBe("preview");
    vitest.expect(
      Object.keys(registry.Routes["/reputation/design"]["actions"])
    ).toEqual([]);
  });
});

// statstrade-web.groups.page-models-test/test-bindings [44] 
vitest.describe("page binding",function (){
  vitest.it("binds brand and route parameters while preserving a separate action registry",function (){
    let group = registry.Groups["campaigns"];
    let bound = spec.createPageSpec(group,{
      "page-key":"campaigns",
      "brand-id":"brand-a",
      "params":{"offset":50}
    });
    vitest.expect(bound.models.snapshot.model.defaults.args).toEqual(["campaigns","brand-a",{"offset":50}]);
    vitest.expect(bound.models.snapshot.bindings).toBeUndefined();
    vitest.expect(bound.models["campaign-create"]).toBeUndefined();
  });
  vitest.it("rejects omitted bindings instead of running an unscoped read",function (){
    vitest.expect(function (){
      spec.createPageSpec(
        registry.Groups["campaigns"],
        {"page-key":"campaigns","params":{}}
      );
    }).toThrow("Missing page binding");
  });
});

// statstrade-web.groups.page-models-test/test-actions [58] 
vitest.describe("page action arguments",function (){
  vitest.it("uses the selected brand even if a form contains a different organisation",function (){
    let action = {
      "rpc":{
            "input":[
                  {"symbol":"org_id","type":"uuid"},
                  {"symbol":"m","type":"jsonb"}
                ]
          }
    };
    let args = api.actionArgs(action,{"org_id":"foreign","m":{"title":"Updated"}},"brand-a");
    vitest.expect(args).toEqual(["brand-a",{"title":"Updated"}]);
  });
  vitest.it("preserves explicit null defaults, parses JSON fields and rejects omitted target IDs",function (){
    vitest.expect(api.actionArgs(
      {"rpc":{"input":[{"symbol":"token_id","type":"uuid"}]}},
      {"token_id":null},
      "brand-a"
    )).toEqual([null]);
    vitest.expect(api.actionArgs(
      {"rpc":{"input":[{"symbol":"scopes","type":"jsonb"}]}},
      {"scopes":"[\"read\"]"},
      "brand-a"
    )).toEqual([["read"]]);
    vitest.expect(function (){
      api.actionArgs(
        {"rpc":{"input":[{"symbol":"topic_id","type":"uuid"}]}},
        {},
        "brand-a"
      );
    }).toThrow("Missing action field");
  });
});