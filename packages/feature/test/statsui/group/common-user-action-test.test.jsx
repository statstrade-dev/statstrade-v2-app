import {renderToStaticMarkup} from 'react-dom/server'

import * as vitest from 'vitest'

import * as ReactQuery from '@tanstack/react-query'

import React from 'react'

import * as action from '@statstrade/group/common-user-action.jsx'

// statsui.group.common-user-action-test/test-user-api-queries [14] 
vitest.afterEach(function (){
  vitest.vi.restoreAllMocks();
});
vitest.it("returns user, session, and profile query results",async function (){
  let userSpy = vitest.vi.spyOn(action.userApi.queries.get_user,"fn");
  let sessionSpy = vitest.vi.spyOn(action.userApi.queries.get_session,"fn");
  let profileSpy = vitest.vi.spyOn(action.userApi.queries.user_get_profile,"fn");
  userSpy.mockResolvedValue({"data":{"user":{"id":"user-7"}},"error":null});
  sessionSpy.mockResolvedValue({"data":{"session":{"user":{"id":"user-7"}}},"error":null});
  profileSpy.mockResolvedValue({"is_onboarded":true});
  let captured = null;
  let Probe = function (){
    captured = action.useUserActionContext();
    return null;
  };
  renderToStaticMarkup(React.createElement(
    ReactQuery.QueryClientProvider,
    {"client":new ReactQuery.QueryClient()},
    React.createElement(Probe,{})
  ));
  let user = await captured.api.queries.get_user.queryRaw(null);
  let session = await captured.api.queries.get_session.queryRaw(null);
  let profile = await captured.api.queries.user_get_profile.queryRaw(null);
  let profileValues = captured.forms.user_profile.getValues();
  vitest.expect(user).toEqual({"user":{"id":"user-7"}});
  vitest.expect(session).toEqual({"session":{"user":{"id":"user-7"}}});
  vitest.expect(profile).toEqual({"is_onboarded":true});
  vitest.expect(profileValues).toEqual({
    "handle":"",
    "first_name":"",
    "last_name":"",
    "bio":"",
    "country_code":"",
    "location":{"city":""}
  });
  vitest.expect(captured.api.mutations.user_set_public.refresh).toEqual(["get_user","user_get_profile"]);
  vitest.expect(userSpy).toHaveBeenCalled();
  vitest.expect(sessionSpy).toHaveBeenCalled();
  vitest.expect(profileSpy).toHaveBeenCalled();
  vitest.vi.restoreAllMocks();
});