import * as sb from '@statstrade/edge/remote/util-supabase.jsx'

import * as vitest from 'vitest'

import * as api from '@statstrade/edge/remote/api-general.jsx'

// statsui.edge.remote.api-general-test/test-api-get-session [13] 
vitest.describe("get-session",function (){
  vitest.afterEach(function (){
    vitest.vi.restoreAllMocks();
  });
  vitest.it("forwards the current session response",async function (){
    let result = {"data":{"session":{"user":{"id":"user-1"}}},"error":null};
    let spy = vitest.vi.spyOn(sb,"getSession");
    spy.mockResolvedValueOnce(result);
    vitest.expect(await api.get_session()).toEqual(result);
  });
});

// statsui.edge.remote.api-general-test/test-api-get-user [26] 
vitest.describe("get-user",function (){
  vitest.afterEach(function (){
    vitest.vi.restoreAllMocks();
  });
  vitest.it("forwards the authenticated user response",async function (){
    let result = {"data":{"user":{"id":"user-1"}},"error":null};
    let spy = vitest.vi.spyOn(sb,"getUser");
    spy.mockResolvedValueOnce(result);
    vitest.expect(await api.get_user()).toEqual(result);
  });
});

// statsui.edge.remote.api-general-test/test-api-sign-in [39] 
vitest.describe("sign-in",function (){
  vitest.afterEach(function (){
    vitest.vi.restoreAllMocks();
  });
  vitest.it("passes credentials to the password sign-in operation",async function (){
    let client = {};
    let credentials = {"email":"member@example.com","password":"secret"};
    let clientSpy = vitest.vi.spyOn(sb,"getClient");
    let signInSpy = vitest.vi.spyOn(sb,"signInWithPassword");
    clientSpy.mockReturnValue(client);
    signInSpy.mockResolvedValueOnce({"data":{"user":{"id":"user-1"}},"error":null});
    let result = await api.sign_in(credentials);
    vitest.expect(result).toEqual({"data":{"user":{"id":"user-1"}},"error":null});
    vitest.expect(signInSpy).toHaveBeenCalledWith(client,credentials);
  });
});

// statsui.edge.remote.api-general-test/test-api-sign-out [57] 
vitest.describe("sign-out",function (){
  vitest.afterEach(function (){
    vitest.vi.restoreAllMocks();
  });
  vitest.it("passes the shared client to sign-out",async function (){
    let client = {};
    let clientSpy = vitest.vi.spyOn(sb,"getClient");
    let signOutSpy = vitest.vi.spyOn(sb,"signOut");
    clientSpy.mockReturnValue(client);
    signOutSpy.mockResolvedValueOnce({"data":true,"error":null});
    let result = await api.sign_out();
    vitest.expect(result).toEqual({"data":true,"error":null});
    vitest.expect(signOutSpy).toHaveBeenCalledWith(client);
  });
});

// statsui.edge.remote.api-general-test/test-api-sign-in-oauth [74] 
vitest.describe("sign-in-oauth",function (){
  vitest.afterEach(function (){
    vitest.vi.restoreAllMocks();
  });
  vitest.it("passes provider options to the OAuth operation",async function (){
    let client = {};
    let options = {"provider":"google"};
    let clientSpy = vitest.vi.spyOn(sb,"getClient");
    let oauthSpy = vitest.vi.spyOn(sb,"signInWithOAuth");
    clientSpy.mockReturnValue(client);
    oauthSpy.mockResolvedValueOnce({"data":true,"error":null});
    let result = await api.sign_in_oauth(options);
    vitest.expect(result).toEqual({"data":true,"error":null});
    vitest.expect(oauthSpy).toHaveBeenCalledWith(client,options);
  });
});

// statsui.edge.remote.api-general-test/test-api-sign-up [92] 
vitest.describe("sign-up",function (){
  vitest.afterEach(function (){
    vitest.vi.restoreAllMocks();
  });
  vitest.it("passes credentials to account creation",async function (){
    let client = {};
    let credentials = {"email":"member@example.com","password":"secret"};
    let clientSpy = vitest.vi.spyOn(sb,"getClient");
    let signupSpy = vitest.vi.spyOn(sb,"signUp");
    clientSpy.mockReturnValue(client);
    signupSpy.mockResolvedValueOnce({"data":{"user":{"id":"user-1"}},"error":null});
    let result = await api.sign_up(credentials);
    vitest.expect(result).toEqual({"data":{"user":{"id":"user-1"}},"error":null});
    vitest.expect(signupSpy).toHaveBeenCalledWith(client,credentials);
  });
});

// statsui.edge.remote.api-general-test/test-api-password-reset [110] 
vitest.describe("password-reset",function (){
  vitest.afterEach(function (){
    vitest.vi.restoreAllMocks();
  });
  vitest.it("uses the email and redirect options",async function (){
    let client = {};
    let clientSpy = vitest.vi.spyOn(sb,"getClient");
    let resetSpy = vitest.vi.spyOn(sb,"resetPasswordForEmail");
    clientSpy.mockReturnValue(client);
    resetSpy.mockResolvedValueOnce({"data":true,"error":null});
    let result = await api.password_reset({"email":"member@example.com","redirect":"/sign-in"});
    vitest.expect(result).toEqual({"data":true,"error":null});
    vitest.expect(resetSpy).toHaveBeenCalledWith(client,"member@example.com",{"redirectTo":"/sign-in"});
  });
});

// statsui.edge.remote.api-general-test/test-api-file-upload [128] 
vitest.describe("file-upload",function (){
  vitest.afterEach(function (){
    vitest.vi.restoreAllMocks();
  });
  vitest.it("forwards file path, bucket, and options",async function (){
    let input = {
      "file_raw":"blob",
      "file_path":"avatars/u.png",
      "bucket":"avatars",
      "options":{"upsert":true}
    };
    let spy = vitest.vi.spyOn(sb,"fileUpload");
    spy.mockResolvedValueOnce({"data":{"path":"avatars/u.png"},"error":null});
    let result = await api.file_upload(input);
    vitest.expect(result).toEqual({"data":{"path":"avatars/u.png"},"error":null});
    vitest.expect(spy).toHaveBeenCalledWith({
      "file_raw":"blob",
      "file_path":"avatars/u.png",
      "bucket":"avatars",
      "options":{"upsert":true}
    });
  });
});

// statsui.edge.remote.api-general-test/test-api-upload-public-url [145] 
vitest.describe("upload-and-get-public-url",function (){
  vitest.afterEach(function (){
    vitest.vi.restoreAllMocks();
  });
  vitest.it("uses the uploaded path when Supabase returns one",async function (){
    let input = {
      "file_raw":"blob",
      "file_path":"avatars/u.png",
      "bucket":"avatars"
    };
    let uploadSpy = vitest.vi.spyOn(sb,"fileUpload");
    let urlSpy = vitest.vi.spyOn(sb,"getPublicUrl");
    uploadSpy.mockResolvedValueOnce({"data":{"path":"stored/u.png"},"error":null});
    urlSpy.mockReturnValue("https://cdn.example/stored/u.png");
    vitest.expect(await api.upload_and_get_public_url(input)).toEqual({"data":"https://cdn.example/stored/u.png","error":null});
    vitest.expect(urlSpy).toHaveBeenCalledWith("avatars","stored/u.png");
  });
});

// statsui.edge.remote.api-general-test/test-api-upload-image [162] 
vitest.describe("upload-image",function (){
  vitest.afterEach(function (){
    vitest.vi.unstubAllGlobals();
    vitest.vi.restoreAllMocks();
  });
  vitest.it("uploads the fetched blob and returns its public URL",async function (){
    let blob = "image-blob";
    vitest.vi.stubGlobal("fetch",function (){
      return {
        "blob":async function (){
                return blob;
              }
      };
    });
    let uploadSpy = vitest.vi.spyOn(sb,"fileUpload");
    let urlSpy = vitest.vi.spyOn(sb,"getPublicUrl");
    uploadSpy.mockResolvedValueOnce({"data":{"path":"images/new.png"},"error":null});
    urlSpy.mockReturnValue("https://cdn.example/images/new.png");
    vitest.expect(await api.upload_image({
      "image":{"uri":"https://source.example/image.png"},
      "file_path":"images/new.png",
      "bucket":"images"
    })).toEqual({"data":"https://cdn.example/images/new.png","error":null});
    vitest.expect(uploadSpy).toHaveBeenCalled();
    vitest.expect(urlSpy).toHaveBeenCalledWith("images","images/new.png");
  });
});

// statsui.edge.remote.api-general-test/test-api-list-countries [185] 
vitest.describe("list-countries",function (){
  vitest.afterEach(function (){
    vitest.vi.restoreAllMocks();
  });
  vitest.it("requests the country table and schema",async function (){
    let rows = [{"code":"AU","title":"Australia"}];
    let spy = vitest.vi.spyOn(sb,"queryTable");
    spy.mockResolvedValueOnce({"data":rows,"error":null});
    vitest.expect(await api.list_countries()).toEqual({"data":rows,"error":null});
    vitest.expect(spy).toHaveBeenCalledWith(
      "Country",
      {"select":"*","order":[{"column":"title"}]},
      {"schema":"szn_type"}
    );
  });
});