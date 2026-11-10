import {renderToStaticMarkup} from 'react-dom/server'

import * as vitest from 'vitest'

import React from 'react'

import * as hf from '@statstrade/edge/lib/js/lib/react-hook-form.jsx'

import * as rq from '@statstrade/edge/lib/js/lib/react-query.jsx'

import * as action from '@statstrade/group/manage-organisation-action.jsx'

// statsui.group.manage-organisation-action-test/test-manage-organisation-context [15] 
vitest.afterEach(function (){
  vitest.vi.restoreAllMocks();
});
vitest.it("refreshes both membership list keys after create or update",function (){
  let useApiHook = rq.useApi;
  let useFormStateHook = hf.useFormState;
  let apiValue = {"kind":"organisation-api"};
  let formsValue = {"kind":"organisation-forms"};
  let apiSpy = vitest.vi.spyOn(rq,"useApi");
  let formSpy = vitest.vi.spyOn(hf,"useFormState");
  apiSpy.mockReturnValue(apiValue);
  formSpy.mockReturnValue(formsValue);
  let captured = null;
  let Probe = function (){
    captured = action.useManageOrganisationContext({"userId":"user-7"});
    return null;
  };
  renderToStaticMarkup(React.createElement(Probe,{}));
  let config = apiSpy.mock.calls[0][0];
  vitest.expect(captured.api).toBe(apiValue);
  vitest.expect(captured.forms.organisation_create).toBe(formsValue);
  vitest.expect(config.queries.organisations_list.default).toEqual([]);
  vitest.expect(config.mutations.organisation_create.refresh).toEqual(["organisations_list","user_list_member_organisations"]);
  vitest.expect(config.mutations.organisation_update.refresh).toEqual(["organisations_list","user_list_member_organisations"]);
  vitest.expect(formSpy.mock.calls[0][0].defaultValues).toEqual({"name":"","title":"","description":""});
});

// statsui.group.manage-organisation-action-test/test-manage-organisation-access-context [45] 
vitest.afterEach(function (){
  vitest.vi.restoreAllMocks();
});
vitest.it("refreshes the member list after add or remove",function (){
  let useApiHook = rq.useApi;
  let apiValue = {"kind":"access-api"};
  let apiSpy = vitest.vi.spyOn(rq,"useApi");
  apiSpy.mockReturnValue(apiValue);
  let captured = null;
  let Probe = function (){
    captured = action.useManageOrganisationAccessContext();
    return null;
  };
  renderToStaticMarkup(React.createElement(Probe,{}));
  let config = apiSpy.mock.calls[0][0];
  vitest.expect(captured.api).toBe(apiValue);
  vitest.expect(captured.forms.organisation_member_add.defaultValues).toEqual({"handle":"","level":"member","scope":""});
  vitest.expect(config.mutations.organisation_member_add.refresh).toEqual(["organisation_member_list"]);
  vitest.expect(config.mutations.organisation_member_remove.refresh).toEqual(["organisation_member_list"]);
});

// statsui.group.manage-organisation-action-test/test-manage-organisation-token-context [69] 
vitest.afterEach(function (){
  vitest.vi.restoreAllMocks();
});
vitest.it("passes the organisation name to the token query and refreshes token lists",function (){
  let useApiHook = rq.useApi;
  let useFormStateHook = hf.useFormStateMap;
  let apiValue = {"kind":"token-api"};
  let formsValue = {"kind":"token-forms"};
  let apiSpy = vitest.vi.spyOn(rq,"useApi");
  let formSpy = vitest.vi.spyOn(hf,"useFormStateMap");
  apiSpy.mockReturnValue(apiValue);
  formSpy.mockReturnValue(formsValue);
  let captured = null;
  let Probe = function (){
    captured = action.useManageOrganisationTokenContext({"name":"maker"});
    return null;
  };
  renderToStaticMarkup(React.createElement(Probe,{}));
  let config = apiSpy.mock.calls[0][0];
  vitest.expect(apiSpy.mock.calls[0][1]).toEqual({"list_organisation_tokens":{"name":"maker"}});
  vitest.expect(captured.api).toBe(apiValue);
  vitest.expect(captured.forms).toBe(formsValue);
  vitest.expect(config.mutations.organisation_token_create.refresh).toEqual(["organisation-token-list"]);
  vitest.expect(
    formSpy.mock.calls[0][0].organisation_token_create.defaultValues
  ).toEqual({
    "native":"",
    "detail":{},
    "name":"",
    "symbol":"",
    "title":"",
    "type":"brand",
    "picture":{},
    "color":"#000000",
    "code":"",
    "decimal":2,
    "icon":{}
  });
});

// statsui.group.manage-organisation-action-test/test-manage-organisation-commodity-context [100] 
vitest.afterEach(function (){
  vitest.vi.restoreAllMocks();
});
vitest.it("passes the organisation name and refreshes the commodity list",function (){
  let useApiHook = rq.useApi;
  let useFormStateHook = hf.useFormStateMap;
  let apiValue = {"kind":"commodity-api"};
  let formsValue = {"kind":"commodity-forms"};
  let apiSpy = vitest.vi.spyOn(rq,"useApi");
  let formSpy = vitest.vi.spyOn(hf,"useFormStateMap");
  apiSpy.mockReturnValue(apiValue);
  formSpy.mockReturnValue(formsValue);
  let captured = null;
  let Probe = function (){
    captured = action.useManageOrganisationCommodityContext({"name":"maker"});
    return null;
  };
  renderToStaticMarkup(React.createElement(Probe,{}));
  let config = apiSpy.mock.calls[0][0];
  vitest.expect(apiSpy.mock.calls[0][1]).toEqual({"list_organisation_commodities":{"name":"maker"}});
  vitest.expect(captured.api).toBe(apiValue);
  vitest.expect(captured.forms).toBe(formsValue);
  vitest.expect(config.mutations.organisation_commodity_create.refresh).toEqual(["organisation-commodity-list"]);
  vitest.expect(
    formSpy.mock.calls[0][0].organisation_commodity_create.defaultValues
  ).toEqual({
    "name":"",
    "code":"",
    "type":"digital",
    "color":"#000000",
    "title":"",
    "icon":{},
    "picture":{},
    "detail":{}
  });
});

// statsui.group.manage-organisation-action-test/test-manage-billing-context [130] 
vitest.afterEach(function (){
  vitest.vi.restoreAllMocks();
});
vitest.it("exposes the billing API and card form defaults",function (){
  let useApiHook = rq.useApi;
  let useFormStateHook = hf.useFormStateMap;
  let apiValue = {"kind":"billing-api"};
  let formsValue = {"kind":"billing-forms"};
  let apiSpy = vitest.vi.spyOn(rq,"useApi");
  let formSpy = vitest.vi.spyOn(hf,"useFormStateMap");
  apiSpy.mockReturnValue(apiValue);
  formSpy.mockReturnValue(formsValue);
  let captured = null;
  let Probe = function (){
    captured = action.useManageBillingContext();
    return null;
  };
  renderToStaticMarkup(React.createElement(Probe,{}));
  let config = apiSpy.mock.calls[0][0];
  vitest.expect(captured.api).toBe(apiValue);
  vitest.expect(captured.forms).toBe(formsValue);
  vitest.expect(config.queries.list_invoices.fn()).toEqual([
    {"id":1,"description":"Pro Plan","date":"Oct 1","amount":"$29"}
  ]);
  vitest.expect(config.mutations.add_payment_method.fn({"card_name":"Ada"})).toEqual({"success":true});
  vitest.expect(formSpy.mock.calls[0][0].billing_new.defaultValues).toEqual({"card_name":"","card_number":"","expiry":"","cvc":""});
});

// statsui.group.manage-organisation-action-test/test-manage-invite-context [159] 
vitest.afterEach(function (){
  vitest.vi.restoreAllMocks();
});
vitest.it("refreshes invitation queries after the email invite mutation",function (){
  let useApiHook = rq.useApi;
  let useFormStateHook = hf.useFormStateMap;
  let apiValue = {"kind":"invite-api"};
  let formsValue = {"kind":"invite-forms"};
  let apiSpy = vitest.vi.spyOn(rq,"useApi");
  let formSpy = vitest.vi.spyOn(hf,"useFormStateMap");
  apiSpy.mockReturnValue(apiValue);
  formSpy.mockReturnValue(formsValue);
  let captured = null;
  let Probe = function (){
    captured = action.useManageInviteContext();
    return null;
  };
  renderToStaticMarkup(React.createElement(Probe,{}));
  let config = apiSpy.mock.calls[0][0];
  vitest.expect(captured.api).toBe(apiValue);
  vitest.expect(captured.forms).toBe(formsValue);
  vitest.expect(config.queries.organisation_invite_list.default).toEqual([]);
  vitest.expect(config.mutations.organisation_invite_email_create.refresh).toEqual(["organisation-invite-list"]);
  vitest.expect(formSpy.mock.calls[0][0].invite_create.defaultValues).toEqual({"channel":"generic","campaign":"","emails":""});
});

// statsui.group.manage-organisation-action-test/test-manage-settings-context [187] 
vitest.afterEach(function (){
  vitest.vi.restoreAllMocks();
});
vitest.it("returns the settings defaults and update result",function (){
  let useApiHook = rq.useApi;
  let useFormStateHook = hf.useFormStateMap;
  let apiValue = {"kind":"settings-api"};
  let formsValue = {"kind":"settings-forms"};
  let apiSpy = vitest.vi.spyOn(rq,"useApi");
  let formSpy = vitest.vi.spyOn(hf,"useFormStateMap");
  apiSpy.mockReturnValue(apiValue);
  formSpy.mockReturnValue(formsValue);
  let captured = null;
  let Probe = function (){
    captured = action.useSettingsContext();
    return null;
  };
  renderToStaticMarkup(React.createElement(Probe,{}));
  let config = apiSpy.mock.calls[0][0];
  vitest.expect(captured.api).toBe(apiValue);
  vitest.expect(captured.forms).toBe(formsValue);
  vitest.expect(config.queries.get_settings.fn()).toEqual({
    "orgName":"Acme Corp",
    "email":"contact@acme.com",
    "website":"https://acme.com"
  });
  vitest.expect(config.mutations.update_settings.fn({"orgName":"Maker"})).toEqual({"success":true});
  vitest.expect(formSpy.mock.calls[0][0].settings_profile.defaultValues).toEqual({"orgName":"","email":"","website":""});
});