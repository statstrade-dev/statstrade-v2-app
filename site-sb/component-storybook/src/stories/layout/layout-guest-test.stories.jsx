import {renderToStaticMarkup} from 'react-dom/server'

import * as vitest from 'vitest'

import * as ReactQuery from '@tanstack/react-query'

import React from 'react'

import * as layout from '@statstrade/component/layout/layout-guest.jsx'

// statsui.basic.layout.layout-guest-test/test-guest-auth-api [39] 
vitest.describe("useLayoutGuestContext",function (){
  vitest.afterEach(function (){
    vitest.vi.restoreAllMocks();
  });
  vitest.it("calls the password and OAuth APIs with their requests",async function (){
    let passwordRequest = null;
    let oauthRequest = null;
    let passwordSpy = vitest.vi.spyOn(api_general,"sign_in");
    let oauthSpy = vitest.vi.spyOn(api_general,"sign_in_oauth");
    passwordSpy.mockImplementation(function (args){
      passwordRequest = args;
      return "signed-in";
    });
    oauthSpy.mockImplementation(function (args){
      oauthRequest = args;
      return "redirected";
    });
    let captured = null;
    let Probe = function (){
      captured = layout.useLayoutGuestContext();
      return null;
    };
    renderToStaticMarkup(React.createElement(
      ReactQuery.QueryClientProvider,
      {"client":new ReactQuery.QueryClient()},
      React.createElement(Probe,{})
    ));
    let password_input = {"email":"guest@example.com","password":"secret"};
    let oauth_input = {"provider":"google"};
    await captured.api.mutations.sign_in.mutateAsync.password_input;
    await captured.api.mutations.sign_in_oauth.mutateAsync.oauth_input;
    vitest.expect(passwordRequest).toEqual({"email":"guest@example.com","password":"secret"});
    vitest.expect(oauthRequest).toEqual({"provider":"google"});
  });
});