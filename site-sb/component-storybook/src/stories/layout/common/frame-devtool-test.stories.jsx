import * as vitest from 'vitest'

import React from 'react'

import * as devtool from '@statstrade/component/layout/common/frame-devtool.jsx'

// statsui.basic.layout.common.frame-devtool-test/test-frame-devtool-sign-in [15] 
vitest.afterEach(function (){
  vitest.vi.restoreAllMocks();
});
vitest.it("rejects missing passwords before auth and clears state after auth failure",async function (){
  let set_store_spy = vitest.vi.spyOn(gs,"setStore");
  set_store_spy.mockImplementation(function (_path,_value){
    return null;
  });
  let failure = new Error("invalid credentials");
  let sign_in = vitest.vi(function (_user){
    return Promise.reject(failure);
  });
  let get_client_spy = vitest.vi.spyOn(sb,"getClient");
  get_client_spy.mockReturnValue({"auth":{"signInWithPassword":sign_in}});
  let missing_error = null;
  try{
    await devtool.api_sign_in({"handle":"test-user"});
  }
  catch(error){
    missing_error = error;
  }
  vitest.expect(missing_error["message"]).toBe("This account has no password configured.");
  vitest.expect(sign_in).not.toHaveBeenCalled();
  let auth_error = null;
  try{
    await devtool.api_sign_in({
      "handle":"test-user",
      "password":"wrong",
      "email":"test@example.test"
    });
  }
  catch(error){
    auth_error = error;
  }
  vitest.expect(auth_error).toBe(failure);
  vitest.expect(set_store_spy).toHaveBeenNthCalledWith(1,["dev","user"],"test-user");
  vitest.expect(set_store_spy).toHaveBeenNthCalledWith(2,["dev","sign-in"],true);
  vitest.expect(set_store_spy).toHaveBeenNthCalledWith(3,["dev","sign-in"],false);
});

// statsui.basic.layout.common.frame-devtool-test/test-frame-devtool-worker-lifecycle [56] 
vitest.afterEach(function (){
  vitest.vi.restoreAllMocks();
});
vitest.it("registers and runs the effect cleanup",function (){
  let set_worker = vitest.vi(function (_resource){
    return null;
  });
  vitest.vi.spyOn(r,"useContext").mockReturnValue({"setSharedWorker":set_worker});
  let effect_spy = vitest.vi.spyOn(r,"useEffect");
  let resource = {"worker":"shared"};
  devtool.useDevtoolSharedWorker(resource);
  let callback = effect_spy["mock"]["calls"][0][0];
  let cleanup = callback();
  vitest.expect(set_worker).toHaveBeenNthCalledWith(1,resource);
  cleanup();
  vitest.expect(set_worker).toHaveBeenNthCalledWith(2,null);
});
vitest.it("does nothing when the devtool provider is absent",function (){
  let context_spy = vitest.vi.spyOn(r,"useContext");
  context_spy.mockReturnValue(null);
  let effect_spy = vitest.vi.spyOn(r,"useEffect");
  effect_spy.mockImplementation(function (_callback,_dependencies){
    return null;
  });
  devtool.useDevtoolSharedWorker({"worker":"shared"});
  let callback = effect_spy["mock"]["calls"][0][0];
  vitest.expect(callback()).toBe(null);
});

// statsui.basic.layout.common.frame-devtool-test/test-frame-devtool-screen-state [86] 
vitest.afterEach(function (){
  vitest.vi.restoreAllMocks();
});
vitest.it("switches between empty and injected states",function (){
  let context_spy = vitest.vi.spyOn(r,"useContext");
  context_spy.mockReturnValueOnce({"debugContent":null});
  vitest.expect(devtool.FrameDevtoolScreen()).toBe(null);
  let child = React.createElement("span",{},"Injected panel");
  context_spy.mockReturnValueOnce({"debugContent":child,"controls":{"color":"purple"}});
  let screen = devtool.FrameDevtoolScreen();
  vitest.expect(screen["props"]["children"]).toBe(child);
  vitest.expect(screen["props"]["placement"]).toBe("top-end");
});

// statsui.basic.layout.common.frame-devtool-test/test-frame-devtool-user-row-action [105] 
vitest.afterEach(function (){
  vitest.vi.restoreAllMocks();
});
vitest.it("creates the selected user then signs in",async function (){
  let user = {
    "email":"test@example.test",
    "password":"pass123",
    "handle":"test-user"
  };
  let create_user = vitest.vi(function (input){
    return Promise.resolve({"id":"auth-1"});
  });
  let sign_in = vitest.vi(function (input){
    return Promise.resolve({"data":{"user":input}});
  });
  let toast_show = vitest.vi(function (_title,_options){
    return null;
  });
  vitest.vi.spyOn(r,"useContext").mockReturnValue({
    "controls":{"session":null},
    "api":{
        "mutations":{
            "create_testuser":{"mutateAsync":create_user},
            "sign_in":{"mutateAsync":sign_in}
          }
      },
    "page":{"toast":{"show":toast_show}}
  });
  let row = devtool.FrameDevtoolUserRow({"user":user});
  let action = row["props"]["children"][1];
  await action["props"]["onPress"];
  vitest.expect(create_user).toHaveBeenCalledWith(user);
  vitest.expect(sign_in).toHaveBeenCalledWith(user);
  vitest.expect(toast_show).toHaveBeenCalled();
});