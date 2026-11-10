import * as vitest from 'vitest'

import {TamaguiProvider,Theme,createTamagui} from 'tamagui'

import {defaultConfig} from '@tamagui/config/v4'

import {renderToStaticMarkup} from 'react-dom/server'

import React from 'react'

import * as ui_image from '@statstrade/component/ui-image.jsx'

import * as ui from '@statstrade/component/ui-common.jsx'

import * as profile from '@statstrade/component/element/element-profile.jsx'

import * as ui_form from '@statstrade/component/ui-form.jsx'

// statsui.basic.element.element-profile-test/test-calc-profile-defaults [18] 
vitest.it("prefers stored profile values and supplies complete form keys",function (){
  vitest.expect(profile.calc_profile_defaults({
    "handle":"ada",
    "first_name":"Ada",
    "last_name":"Lovelace",
    "bio":"Mathematician",
    "country_code":"GB",
    "location":{"city":"London"}
  },null,null)).toEqual({
    "handle":"ada",
    "first_name":"Ada",
    "last_name":"Lovelace",
    "bio":"Mathematician",
    "country_code":"GB",
    "location":{"city":"London"}
  });
  vitest.expect(profile.calc_profile_defaults(null,{"email":"ada@example.test"},{
    "preferred_username":"ada_7",
    "first_name":"Ada",
    "last_name":"Lovelace"
  })).toEqual(
    {"handle":"ada_7","first_name":"Ada","last_name":"Lovelace"}
  );
  vitest.expect(profile.calc_profile_defaults(
    null,
    {"email":"ada@example.test"},
    {"full_name":"Ada Lovelace"}
  )).toEqual({
    "handle":"adalovelace",
    "first_name":"Ada Lovelace",
    "last_name":""
  });
});

// statsui.basic.element.element-profile-test/test-profile-form-fields [44] 
vitest.afterEach(function (){
  vitest.vi.restoreAllMocks();
});
vitest.it("renders every persisted profile field and supplied action labels",function (){
  let appConfig = createTamagui(defaultConfig);
  let useRemoteCheckHook = ui.useRemoteCheck;
  let FormInputComponent = ui_form.FormInput;
  let ImageUploadComponent = ui_image.ImageUpload;
  let remoteSpy = vitest.vi.spyOn(ui,"useRemoteCheck");
  remoteSpy.mockImplementation(function (_){
    null;
  });
  let inputSpy = vitest.vi.spyOn(ui_form,"FormInput");
  inputSpy.mockImplementation(function (props){
    return React.createElement("label",{"data-field":props.field},props.title);
  });
  let imageSpy = vitest.vi.spyOn(ui_image,"ImageUpload");
  imageSpy.mockImplementation(function (_){
    return React.createElement("div",{"data-component":"profile-image"},"Profile photo");
  });
  let form = {
    "watch":function (_){
        "ada";
      },
    "control":{},
    "formState":{"isValid":true},
    "handleSubmit":function (_){
        return function (){
          return null;
        };
      }
  };
  let component = React.createElement(profile.ProfileForm,{
    "onSubmit":function (_){
        null;
      },
    "isBusy":false,
    "form":form,
    "user":{"id":"user-7"},
    "userType":"participant",
    "labels":{"submit":"Save profile","skip":"Skip profile"},
    "onSkip":function (){
        null;
      },
    "api":{
        "queries":{
            "check-handle-exists":{
                "queryRaw":function (_){
                    null;
                  }
              }
          }
      },
    "setProfileImage":function (_){
        null;
      },
    "profileImage":null
  });
  let themed = React.createElement(
    TamaguiProvider,
    {"config":appConfig,"defaultTheme":"light"},
    React.createElement(Theme,{"name":"light"},component)
  );
  let markup = renderToStaticMarkup(themed);
  vitest.expect(markup).toContain("data-field=\"handle\"");
  vitest.expect(markup).toContain("data-field=\"first_name\"");
  vitest.expect(markup).toContain("data-field=\"last_name\"");
  vitest.expect(markup).toContain("data-field=\"bio\"");
  vitest.expect(markup).toContain("data-field=\"country_code\"");
  vitest.expect(markup).toContain("data-field=\"location.city\"");
  vitest.expect(markup).toContain("Save profile");
  vitest.expect(markup).toContain("Skip profile");
  vitest.expect(remoteSpy).toHaveBeenCalled();
  vitest.expect(inputSpy.mock.calls.length).toBe(6);
  vitest.expect(imageSpy).toHaveBeenCalled();
});

// statsui.basic.element.element-profile-test/test-uploaded-image-url [97] 
vitest.it("unwraps success and throws the original failure",function (){
  vitest.expect(profile.uploadedImageUrl({
    "data":"https://images.example.test/user-7/profile.jpg",
    "error":null
  })).toBe("https://images.example.test/user-7/profile.jpg");
  let failure = new Error("image upload failed");
  vitest.expect(function (){
    profile.uploadedImageUrl({"data":null,"error":failure});
  }).toThrow(failure);
});