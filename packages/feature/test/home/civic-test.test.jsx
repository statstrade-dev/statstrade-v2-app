import {renderToStaticMarkup} from 'react-dom/server'

import * as vitest from 'vitest'

import React from 'react'

import * as civic from '@statstrade/feature/civic/pages.jsx'

// statstrade-web.feature.home.civic-test/civic-cards [4] 
vitest.describe("issue-led public presentation",function (){
  vitest.it("links issue context and preserves plain-text evidence",function (){
    let html = renderToStaticMarkup(React.createElement(civic.IssueCard,{
      "row":{
            "id":"issue-a",
            "title":"Housing <script>unsafe</script>",
            "summary":"A sourced briefing.",
            "subjects":["Housing"],
            "regions":["VIC"],
            "updated_at":"2026-11-02"
          }
    }));
    vitest.expect(html).toContain("/issues/issue-a");
    vitest.expect(html).toContain("&lt;script&gt;");
    vitest.expect(html).not.toContain("<script>unsafe");
    vitest.expect(html).not.toContain("crowd");
  });
  vitest.it("shows forecast deadlines and links to its primary issue",function (){
    let html = renderToStaticMarkup(React.createElement(civic.ForecastCard,{
      "row":{
            "id":"question-a",
            "issue_id":"issue-a",
            "issue_title":"Housing",
            "title":"Will approvals rise?",
            "status":"open",
            "closes_at":1796032800000,
            "resolution_estimate":"2026-12-01"
          }
    }));
    vitest.expect(html).toContain("/questions/question-a");
    vitest.expect(html).toContain("/issues/issue-a");
    vitest.expect(html).toContain("Expected resolution 1 Dec 2026");
    vitest.expect(html).not.toContain("points");
  });
  vitest.it("uses public status labels and explicit unknown dates",function (){
    vitest.expect(civic.statusLabel("vesting")).toBe("open");
    vitest.expect(civic.statusLabel("discarded")).toBe("void");
    vitest.expect(civic.dateLabel(null)).toBe("Not yet set");
  });
});