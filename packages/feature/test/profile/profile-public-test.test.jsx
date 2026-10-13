import * as vitest from 'vitest'

import {TamaguiProvider,Theme,createTamagui} from 'tamagui'

import {defaultConfig} from '@tamagui/config/v4'

import {renderToStaticMarkup} from 'react-dom/server'

import React from 'react'

import * as ui_router from '@statstrade/component/ui-router.jsx'

import * as profile from '@statstrade/feature/profile/profile-public.jsx'

// statstrade-web.feature.profile.profile-public-test/test-profile-handle-from-path [16] 
vitest.describe("profile-handle-from-path",function (){
  vitest.it("decodes the handle segment",function (){
    vitest.expect(profile.profile_handle_from_path("/u/river%20stone")).toBe("river stone");
  });
  vitest.it("returns nil for a different or empty route",function (){
    vitest.expect(profile.profile_handle_from_path("/profile")).toBe(null);
    vitest.expect(profile.profile_handle_from_path("/u/")).toBe(null);
  });
});

// statstrade-web.feature.profile.profile-public-test/test-profile-display-name [32] 
vitest.describe("profile-display-name",function (){
  vitest.it("trims and combines both names",function (){
    vitest.expect(profile.profile_display_name({
      "first_name":"  Ada ",
      "last_name":" Lovelace  ",
      "handle":"ada"
    })).toBe("Ada Lovelace");
  });
  vitest.it("uses the handle when names are absent",function (){
    vitest.expect(profile.profile_display_name({"handle":"ada"})).toBe("@ada");
  });
});

// statstrade-web.feature.profile.profile-public-test/test-profile-location [48] 
vitest.describe("profile-location",function (){
  vitest.it("joins city and country code",function (){
    vitest.expect(profile.profile_location({
      "city":" Melbourne ",
      "country_code":" AU ",
      "location":{"coord":"private"}
    })).toBe("Melbourne, AU");
  });
  vitest.it("handles a missing city or country",function (){
    vitest.expect(profile.profile_location({"city":"Melbourne"})).toBe("Melbourne");
    vitest.expect(profile.profile_location({})).toBe("");
  });
});

// statstrade-web.feature.profile.profile-public-test/test-public-profile-render [67] 
vitest.describe("PublicProfile",function (){
  vitest.afterEach(function (){
    vitest.vi.restoreAllMocks();
  });
  vitest.it("reads the route path and displays its initial loading state",function (){
    let appConfig = createTamagui(defaultConfig);
    let routeHook = ui_router.usePathname;
    let pathSpy = vitest.vi.spyOn(ui_router,"usePathname");
    pathSpy.mockReturnValue("/u/river");
    let profile_element = React.createElement(profile.PublicProfile,{});
    let themed_profile = React.createElement(
      TamaguiProvider,
      {"config":appConfig,"defaultTheme":"light"},
      React.createElement(Theme,{"name":"light"},profile_element)
    );
    let markup = renderToStaticMarkup(themed_profile);
    vitest.expect(pathSpy).toHaveBeenCalled();
    vitest.expect(markup).toContain("Loading profile");
    null;
  });
});