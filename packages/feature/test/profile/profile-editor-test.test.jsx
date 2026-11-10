import * as vitest from 'vitest'

import * as pageApi from '@statstrade/edge/substrate/page-api.jsx'

import React from 'react'

import * as clientAuth from '@statstrade/edge/remote/util-supabase.jsx'

import {renderToStaticMarkup} from 'react-dom/server'

import {TamaguiProvider,createTamagui} from 'tamagui'

import {defaultConfig} from '@tamagui/config/v4'

import * as editor from '@statstrade/feature/profile/profile-editor.jsx'

// statstrade-web.feature.profile.profile-editor-test/renderThemed [15] 
export function renderThemed(element){
  return renderToStaticMarkup(React.createElement(
    TamaguiProvider,
    {"config":createTamagui(defaultConfig),"defaultTheme":"light"},
    element
  ));
}

// statstrade-web.feature.profile.profile-editor-test/test-profile-values [20] 
vitest.describe("profile-values",function (){
  vitest.it("maps both rows and applies the default language",function (){
    vitest.expect(editor.profile_values({
      "public":{"handle":"river","city":"Melbourne"},
      "secret":{"pronouns":"they/them"}
    })).toEqual({
      "handle":"river",
      "dob":"",
      "bio":"",
      "city":"Melbourne",
      "gender":"",
      "country_code":"",
      "gender_text":"",
      "pronouns":"they/them",
      "last_name":"",
      "first_name":"",
      "language":"EN"
    });
  });
});

// statstrade-web.feature.profile.profile-editor-test/test-public-profile-payload [43] 
vitest.describe("public-profile-payload",function (){
  vitest.it("trims names and canonicalizes handle and country",function (){
    let values = {
      "handle":" River_1 ",
      "first_name":" Ada ",
      "last_name":"  ",
      "country_code":"au",
      "city":" Melbourne ",
      "bio":" Hello "
    };
    let normalized = editor.public_profile_payload(values);
    vitest.expect(normalized).toEqual({
      "handle":"river_1",
      "first_name":"Ada",
      "last_name":null,
      "country_code":"AU",
      "city":"Melbourne",
      "bio":"Hello"
    });
    vitest.expect(editor.public_profile_payload(normalized)).toEqual(normalized);
  });
  vitest.it("rejects handles outside the allowed range",function (){
    vitest.expect(function (){
      editor.public_profile_payload({"handle":"ab"});
    }).toThrow("Use 3–30 letters");
  });
});

// statstrade-web.feature.profile.profile-editor-test/test-secret-profile-payload [69] 
vitest.describe("secret-profile-payload",function (){
  vitest.it("trims fields and canonicalizes the language code",function (){
    vitest.expect(editor.secret_profile_payload({
      "gender":"female",
      "gender_text":"  ",
      "pronouns":" they/them ",
      "dob":"2000-01-02",
      "language":"fr"
    })).toEqual({
      "gender":"female",
      "gender_text":null,
      "pronouns":"they/them",
      "dob":"2000-01-02",
      "language":"FR"
    });
  });
  vitest.it("rejects invalid enum and empty language values",function (){
    vitest.expect(function (){
      editor.secret_profile_payload({"gender":"unknown","language":"EN"});
    }).toThrow("Gender must be");
    vitest.expect(function (){
      editor.secret_profile_payload({"language":""});
    }).toThrow("Enter a language code");
  });
});

// statstrade-web.feature.profile.profile-editor-test/test-profile-field-render [96] 
vitest.describe("ProfileField",function (){
  vitest.it("renders the label and current value",function (){
    let modelSpy = vitest.vi.spyOn(pageApi,"usePageApi");
    modelSpy.mockReturnValue({"owner":{"status":"loading"},"data":{}});
    let markup = renderThemed(React.createElement(editor.ProfileField,{
      "id":"profile-bio",
      "label":"Bio",
      "value":"Market researcher",
      "onChange":function (){
            
          }
    }));
    vitest.expect(markup).toContain("Bio");
    vitest.expect(markup).toContain("Market researcher");
  });
});

// statstrade-web.feature.profile.profile-editor-test/test-profile-editor-signed-out [114] 
vitest.describe("ProfileEditor",function (){
  vitest.afterEach(function (){
    vitest.vi.restoreAllMocks();
  });
  vitest.it("prompts for sign-in and omits profile forms",function (){
    let modelSpy = vitest.vi.spyOn(pageApi,"usePageApi");
    modelSpy.mockReturnValue({"owner":{"status":"loading"},"data":{}});
    let sessionSpy = vitest.vi.spyOn(clientAuth,"useListenSession");
    sessionSpy.mockReturnValue([
      null,
      function (){
          
        },
      true
    ]);
    let markup = renderThemed(React.createElement(editor.ProfileEditor,{}));
    vitest.expect(markup).toContain("Sign in to manage your profile");
    vitest.expect(!markup.includes("Save public profile")).toBe(true);
    vitest.expect(!markup.includes("Save private profile")).toBe(true);
  });
});