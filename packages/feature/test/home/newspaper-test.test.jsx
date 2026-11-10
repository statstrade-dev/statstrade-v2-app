import {renderToStaticMarkup} from 'react-dom/server'

import * as vitest from 'vitest'

import React from 'react'

import * as home from '@statstrade/feature/home/newspaper.jsx'

// statstrade-web.feature.home.newspaper-test/test-homepage-data [8] 
vitest.describe("public newspaper data",function (){
  vitest.beforeEach(function (){
    vitest.vi.spyOn(Date,"now").mockReturnValue(1000);
  });
  vitest.afterEach(function (){
    vitest.vi.restoreAllMocks();
  });
  let snapshot = {
    "discovery":{
        "topics":[
            {
              "id":"question-a",
              "title":"Will rates fall?",
              "campaign_id":"campaign-a",
              "time_close":3000,
              "detail":{"pillar_title":"Economy"}
            },
            {
              "id":"question-b",
              "title":"Will housing approvals rise?",
              "campaign_id":"campaign-b",
              "time_close":2000,
              "detail":{"pillar_title":"Housing"}
            },
            {
              "id":"expired",
              "title":"Expired question",
              "time_close":500,
              "detail":{}
            }
          ],
        "campaigns":[{"id":"campaign-a","title":"Rates and prices"}],
        "communities":[]
      },
    "articles":[
        {
          "id":"article-a",
          "headline":"Published report",
          "standfirst":"Evidence from the public record.",
          "organization":"Auspolitics",
          "sources":[]
        }
      ]
  };
  vitest.it("filters questions and counts desks from returned records",function (){
    let model = home.selectHome(snapshot,"","","",1000);
    vitest.expect(model.topics.map(function (t){
      return t.id;
    })).toEqual(["question-a","question-b"]);
    vitest.expect(model.closing.map(function (t){
      return t.id;
    })).toEqual(["question-b","question-a"]);
    vitest.expect(model.sections).toEqual(
      [{"title":"Economy","count":1},{"title":"Housing","count":1}]
    );
  });
  vitest.it("searches real text and applies subject and campaign filters",function (){
    vitest.expect(
      home.selectHome(snapshot,"RATES","","",1000)["topics"].length
    ).toBe(1);
    vitest.expect(
      home.selectHome(snapshot,"","Housing","",1000)["topics"][0].id
    ).toBe("question-b");
    vitest.expect(
      home.selectHome(snapshot,"","","campaign-a",1000)["topics"][0].id
    ).toBe("question-a");
    vitest.expect(
      home.selectHome(snapshot,"missing","","",1000)["articles"].length
    ).toBe(0);
  });
  vitest.it("renders empty sections without invented questions or crowd percentages",function (){
    let html = renderToStaticMarkup(
      React.createElement(home.Newspaper,{"snapshot":{},"loading":false})
    );
    vitest.expect(html).toContain("No open prediction calls yet");
    vitest.expect(html).not.toContain("crowd read");
    vitest.expect(html).not.toContain("Fixture market");
    vitest.expect(html).toContain("What happens");
  });
  vitest.it("does not expose content while the query is loading or failed",function (){
    let html = renderToStaticMarkup(
      React.createElement(home.Newspaper,{"snapshot":snapshot,"loading":true})
    );
    vitest.expect(html).toContain("Loading public questions");
    vitest.expect(html).not.toContain("Will rates fall?");
    let failed = renderToStaticMarkup(React.createElement(
      home.Newspaper,
      {"snapshot":snapshot,"error":"Backend offline"}
    ));
    vitest.expect(failed).toContain("Backend offline");
    vitest.expect(failed).not.toContain("Will rates fall?");
  });
  vitest.it("renders returned questions, correct links and published reporting",function (){
    let html = renderToStaticMarkup(React.createElement(home.Newspaper,{"snapshot":snapshot}));
    vitest.expect(html).toContain("Will rates fall?");
    vitest.expect(html).toContain("/questions/question-a");
    vitest.expect(html).toContain("Published report");
    vitest.expect(html).toContain("/newsroom/article-a");
  });
  vitest.it("rejects unsafe citation protocols and handles unknown close dates",function (){
    vitest.expect(home.safeSourceUrl("javascript:alert(1)")).toBeNull();
    vitest.expect(home.safeSourceUrl("https://user:secret@example.com")).toBeNull();
    vitest.expect(home.safeSourceUrl("https://abs.gov.au/report")).toBe("https://abs.gov.au/report");
    vitest.expect(home.closingLabel(null)).toBe("Closing date to be announced");
  });
});