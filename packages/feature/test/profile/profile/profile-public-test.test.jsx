import * as vitest from 'vitest'

import {renderToStaticMarkup} from 'react-dom/server'

import React from 'react'

import * as profile from '@statstrade/feature/profile/profile-public.jsx'

// statstrade-web.feature.profile.profile-public-test/test-profile-handle-from-path [14] 
vitest.describe("profile-handle-from-path",function (){
  vitest.it("decodes the handle segment",function (){
    vitest.expect(profile.profile_handle_from_path("/u/river%20stone")).toBe("river stone");
  });
  vitest.it("returns nil for a different or empty route",function (){
    vitest.expect(profile.profile_handle_from_path("/profile")).toBe(null);
    vitest.expect(profile.profile_handle_from_path("/u/")).toBe(null);
  });
});

// statstrade-web.feature.profile.profile-public-test/test-profile-display-name [30] 
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

// statstrade-web.feature.profile.profile-public-test/test-profile-location [46] 
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

// statstrade-web.feature.profile.profile-public-test/test-public-profile-render [65] 
vitest.describe("PublicProfile",function (){
  vitest.afterEach(function (){
    vitest.vi.restoreAllMocks();
  });
  vitest.it("reads the route path and displays its initial loading state",function (){
    let pathSpy = vitest.vi.spyOn(ui_router,"usePathname");
    pathSpy.mockReturnValue("/u/river");
    let markup = renderToStaticMarkup(React.createElement(profile.PublicProfile,{}));
    vitest.expect(pathSpy).toHaveBeenCalled();
    vitest.expect(markup).toContain("Loading profile");
    null;
  });
});