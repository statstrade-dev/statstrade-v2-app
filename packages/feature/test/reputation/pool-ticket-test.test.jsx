import {renderToStaticMarkup} from 'react-dom/server'

import * as vitest from 'vitest'

import React from 'react'

import * as ticket from '@statstrade/feature/reputation/pool-ticket.jsx'

import * as page_api from '@statstrade/edge/substrate/page-api.jsx'

// statstrade-web.feature.reputation.pool-ticket-test/test-ticket [7] 
vitest.describe("pool voting ticket",function (){
  function render(pool,actor){
    return renderToStaticMarkup(React.createElement(page_api.PageContext.Provider,{"value":{"actor":actor}},React.createElement(ticket.PoolTicket,{
      "api":{"data":{"pool":pool}},
      "question":{"id":"topic"},
      "open":true
    })));
  }
  vitest.it("shows a complementary split and the real spending bank",function (){
    let html = render({
      "can_buy":true,
      "bank":{
            "available":250,
            "daily_amount":250,
            "bank_cap":2500,
            "committed":100,
            "claimable":0
          },
      "rewards":[{"category":"Housing","amount":99,"type":"Expertise"}]
    },"member");
    vitest.expect(html).toContain("250");
    vitest.expect(html).toContain("st-user-binary-control__heading");
    vitest.expect(html).toContain("50/50 split");
    vitest.expect(html).toContain("Points allocated to Yes (%)");
    vitest.expect(html).toContain("Housing · 99 Expertise");
    vitest.expect(html).not.toContain("349 available");
    vitest.expect(html).toContain("Add 50 points");
    vitest.expect(html).toContain("st-user-point-stepper");
    vitest.expect(html).toContain("st-user-funding-preview");
  });
  vitest.it("restores a final receipt without editable voting controls",function (){
    let html = render({
      "position":{
            "receipt":{
                  "allocation":{"id":"receipt-a","total_spend":100,"quote":{"legs":[]}}
                }
          }
    },"member");
    vitest.expect(html).toContain("Prediction locked");
    vitest.expect(html).toContain("receipt-a");
    vitest.expect(html).toContain("disabled=\"\"");
    vitest.expect(html).toContain("100 Auspolitics points committed");
  });
  vitest.it("shows guests a sign-in action without fabricating a balance",function (){
    let html = render({"can_buy":true},null);
    vitest.expect(html).toContain("Sign in to predict");
    vitest.expect(html).toContain("—");
    vitest.expect(html).not.toContain("Confirm and lock");
  });
});