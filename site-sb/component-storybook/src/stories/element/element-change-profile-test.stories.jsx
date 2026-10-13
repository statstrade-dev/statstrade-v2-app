import * as vitest from 'vitest'

import {TamaguiProvider,Theme,createTamagui} from 'tamagui'

import {defaultConfig} from '@tamagui/config/v4'

import {renderToStaticMarkup} from 'react-dom/server'

import React from 'react'

import * as editor from '@statstrade/component/element/element-change-profile.jsx'

import * as sb from '@statstrade/edge/remote/util-supabase.jsx'

// statsui.basic.element.element-change-profile-test/test-element-profile-values [16] 
vitest.it("prefers the profile row and falls back to user metadata when absent",function (){
  vitest.expect(editor.profileValues({
    "user_metadata":{"handle":"metadata","avatar_url":"https://img.test/meta.png"}
  },{
    "first_name":"Ada",
    "last_name":"Lovelace",
    "handle":"ada",
    "picture":{"uri":"https://img.test/ada.png"}
  })).toEqual({
    "first_name":"Ada",
    "last_name":"Lovelace",
    "handle":"ada",
    "avatar":"https://img.test/ada.png"
  });
  vitest.expect(editor.profileValues({
    "user_metadata":{
        "first_name":"Grace",
        "handle":"compiler",
        "avatar_url":"https://img.test/grace.png"
      }
  },null)).toEqual({
    "first_name":"Grace",
    "last_name":"",
    "handle":"compiler",
    "avatar":"https://img.test/grace.png"
  });
});

// statsui.basic.element.element-change-profile-test/test-element-validate-profile [36] 
vitest.it("trims names and avatar and rejects malformed fields",function (){
  vitest.expect(editor.validateProfile({
    "first_name":" Ada ",
    "last_name":" Lovelace ",
    "handle":" Ada_1 ",
    "avatar":" https://img.test/ada.png "
  })).toEqual({
    "first_name":"Ada",
    "last_name":"Lovelace",
    "handle":"ada_1",
    "avatar":"https://img.test/ada.png"
  });
  vitest.expect(function (){
    editor.validateProfile(
      {"first_name":"Ada","last_name":"","handle":"ab","avatar":""}
    );
  }).toThrow(
    "Use 3–32 letters, numbers, or underscores for your handle."
  );
});

// statsui.basic.element.element-change-profile-test/test-element-load-profile [52] 
vitest.afterEach(function (){
  vitest.vi.restoreAllMocks();
});
vitest.it("maps one row and throws a gateway failure unchanged",async function (){
  let row = {
    "id":"user-7",
    "handle":"ada",
    "first_name":"Ada",
    "last_name":"Lovelace",
    "picture":{"uri":"https://img.test/ada.png"}
  };
  let query = vitest.vi.spyOn(sb,"queryTable");
  query.mockResolvedValue({"data":row,"error":null});
  let result = await editor.loadProfile({},{"id":"user-7"});
  vitest.expect(query).toHaveBeenCalledWith("User",{
    "select":"id,handle,first_name,last_name,picture",
    "filters":[{"column":"id","operator":"eq","value":"user-7"}],
    "maybe_single":true
  },{"schema":"stats_type"});
  vitest.expect(result).toEqual({
    "first_name":"Ada",
    "last_name":"Lovelace",
    "handle":"ada",
    "avatar":"https://img.test/ada.png"
  });
  let failure = new Error("profile query failed");
  query.mockResolvedValueOnce({"data":null,"error":failure});
  let caught = null;
  try{
    await editor.loadProfile({},{"id":"user-7"});
  }
  catch(error){
    caught = error;
  }
  vitest.expect(caught).toBe(failure);
});

// statsui.basic.element.element-change-profile-test/test-element-save-profile [82] 
vitest.afterEach(function (){
  vitest.vi.restoreAllMocks();
});
vitest.it("checks a changed handle, writes public fields, then updates the handle",async function (){
  let rpc = vitest.vi.spyOn(sb,"callRemote");
  rpc.mockResolvedValueOnce({"data":false,"error":null});
  rpc.mockResolvedValueOnce({"data":{"ok":true},"error":null});
  rpc.mockResolvedValueOnce({"data":{"ok":true},"error":null});
  let saved = await editor.saveProfile({},{
    "first_name":"Ada",
    "last_name":"Lovelace",
    "handle":"old",
    "avatar":""
  },{
    "first_name":" Ada ",
    "last_name":" Lovelace ",
    "handle":" Ada_1 ",
    "avatar":""
  });
  vitest.expect(rpc).toHaveBeenNthCalledWith(1,"check_handle_exists",{"handle":"ada_1"});
  vitest.expect(rpc).toHaveBeenNthCalledWith(2,"user_set_public",{
    "m":{"first_name":"Ada","last_name":"Lovelace","picture":{}}
  });
  vitest.expect(rpc).toHaveBeenNthCalledWith(3,"user_set_handle",{"handle":"ada_1"});
  vitest.expect(saved).toEqual({
    "first_name":"Ada",
    "last_name":"Lovelace",
    "handle":"ada_1",
    "avatar":""
  });
});

// statsui.basic.element.element-change-profile-test/test-element-change-email [109] 
vitest.afterEach(function (){
  vitest.vi.restoreAllMocks();
});
vitest.it("returns the updated user and throws the worker error unchanged",async function (){
  let client = {"id":"worker-node"};
  let user = {"id":"user-7","email":"new@example.com"};
  let update = vitest.vi.spyOn(sb,"updateUser");
  update.mockResolvedValueOnce({"data":{"user":user},"error":null});
  vitest.expect(await editor.changeEmail(client," new@example.com ")).toEqual(user);
  vitest.expect(update).toHaveBeenCalledWith(client,{"email":"new@example.com"});
  let failure = new Error("email update failed");
  update.mockResolvedValueOnce({"data":null,"error":failure});
  let caught = null;
  try{
    await editor.changeEmail(client,"new@example.com");
  }
  catch(error){
    caught = error;
  }
  vitest.expect(caught).toBe(failure);
});

// statsui.basic.element.element-change-profile-test/test-element-profile-field [130] 
vitest.it("keeps profile fields associated with their labels",function (){
  let appConfig = createTamagui(defaultConfig);
  let field = React.createElement(editor.ProfileField,{
    "id":"profile-handle",
    "label":"Handle",
    "value":"ada_1",
    "disabled":true,
    "onChange":function (){
        
      }
  });
  let themedField = React.createElement(
    TamaguiProvider,
    {"config":appConfig,"defaultTheme":"light"},
    React.createElement(Theme,{"name":"light"},field)
  );
  let markup = renderToStaticMarkup(themedField);
  vitest.expect(markup).toContain("Handle");
  vitest.expect(markup).toContain("ada_1");
  vitest.expect(markup).toContain("disabled");
});

// statsui.basic.element.element-change-profile-test/test-element-profile-notice [149] 
vitest.it("uses alert semantics for errors and status semantics for success",function (){
  let appConfig = createTamagui(defaultConfig);
  let error_notice = React.createElement(editor.Notice,{"error":"Could not save your profile."});
  let themed_error = React.createElement(
    TamaguiProvider,
    {"config":appConfig,"defaultTheme":"light"},
    React.createElement(Theme,{"name":"light"},error_notice)
  );
  let error_markup = renderToStaticMarkup(themed_error);
  let message_notice = React.createElement(editor.Notice,{"message":"Profile updated."});
  let themed_message = React.createElement(
    TamaguiProvider,
    {"config":appConfig,"defaultTheme":"light"},
    React.createElement(Theme,{"name":"light"},message_notice)
  );
  let message_markup = renderToStaticMarkup(themed_message);
  vitest.expect(error_markup).toContain("role=\"alert\"");
  vitest.expect(error_markup).toContain("Could not save your profile.");
  vitest.expect(error_markup).toContain("aria-live=\"polite\"");
  vitest.expect(message_markup).toContain("role=\"status\"");
  vitest.expect(message_markup).toContain("Profile updated.");
});

// statsui.basic.element.element-change-profile-test/test-element-profile-editor [173] 
vitest.afterEach(async function (){
  vitest.vi.restoreAllMocks();
  await sb.resetClients();
});
vitest.it("shows both editable sections for the active screen",function (){
  let appConfig = createTamagui(defaultConfig);
  let session_hook = vitest.vi.spyOn(sb,"useListenSession");
  session_hook.mockReturnValue([null]);
  let editor_element = React.createElement(editor.ProfileEditor,{});
  let themed_editor = React.createElement(
    TamaguiProvider,
    {"config":appConfig,"defaultTheme":"light"},
    React.createElement(Theme,{"name":"light"},editor_element)
  );
  let markup = renderToStaticMarkup(themed_editor);
  vitest.expect(markup).toContain("Personal information");
  vitest.expect(markup).toContain("Email address");
  vitest.expect(session_hook).toHaveBeenCalled();
});