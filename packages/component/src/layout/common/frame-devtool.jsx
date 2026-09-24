import 
  {Activity,FlaskConical,LogIn,LogOut,Minus,Monitor,SquareMinus,SquarePlus,User,Wrench}
 from '@tamagui/lucide-icons'

import * as T from 'tamagui'

import React from 'react'

import * as kd from '@xtalk/lang/common-data.js'

import * as rq from '@statstrade/edge/lib/js/lib/react-query.jsx'

import * as ui_router from '@statstrade/component/ui-router.jsx'

import * as api_public from '@statstrade/edge/remote/api-public.jsx'

import * as kl from '@xtalk/lang/common-lib.js'

import * as sb from '@statstrade/edge/remote/util-supabase.jsx'

import * as ui from '@statstrade/component/ui-common.jsx'

import * as api_nextjs from '@statstrade/edge/remote/api-nextjs.jsx'

import * as gs from '@statstrade/edge/global-store.jsx'

import * as ks from '@xtalk/lang/common-string.js'

import * as gu from '@statstrade/edge/global-ui.jsx'

import * as api_debug from '@statstrade/edge/remote/api-debug.jsx'

// statsui.basic.layout.common.frame-devtool/FrameDevtoolContext [30] 
export var FrameDevtoolContext = React.createContext();

// statsui.basic.layout.common.frame-devtool/api-sign-in [33] 
export function api_sign_in(user){
  gs.setStore(["dev","user"],user.handle);
  gs.setStore(["dev","sign-in"],true);
  return sb.getClient().auth.signInWithPassword(user);
}

// statsui.basic.layout.common.frame-devtool/FrameDevtoolLayout [51] 
export function FrameDevtoolLayout({children,color}){
  return (
    <T.View
      opacity={0.8}
      position="fixed"
      bottom={20}
      right={15}
      zIndex={1000}
      padding="3px"
      borderRadius="$2"
      backgroundColor={color}>{children}
    </T.View>);
}

// statsui.basic.layout.common.frame-devtool/FrameDevtoolPopup [68] 
export function FrameDevtoolPopup({arrowProps,children,color,contentProps,icon,placement}){
  let [open,setOpen] = React.useState(false);
  return (
    <ui.PopoverMenu
      onOpenChange={setOpen}
      open={open}
      buttonProps={{"size":"$2"}}
      contentProps={{
          "backgroundColor":color,
          "borderWidth":0,
          "gap":"$1",
          "opacity":0.8,
          "padding":"$2",
          ...contentProps
        }}
      button={(
          <ui.ButtonNormal icon={icon} backgroundColor={color} size="$2"/>)}
      icon={icon}
      size="$4"
      arrowProps={{
          "backgroundColor":color,
          "borderWidth":0,
          "size":"$3",
          ...arrowProps
        }}
      placement={placement || "bottom-start"}>{children}
    </ui.PopoverMenu>);
}

// statsui.basic.layout.common.frame-devtool/FrameDevtoolButton [94] 
export function FrameDevtoolButton({children,onPress,...props}){
  return (
    <ui.ButtonNormal
      fontSize="8px"
      justifyContent="left"
      onPress={onPress}
      size="$1"
      {...props}>{children}
    </ui.ButtonNormal>);
}

// statsui.basic.layout.common.frame-devtool/FrameDevtoolIconButton [103] 
export function FrameDevtoolIconButton({children,...props}){
  return (
    <ui.ButtonNormal margin={0} padding="3px" size="$1" width="12px" {...props}>{children}</ui.ButtonNormal>);
}

// statsui.basic.layout.common.frame-devtool/frameDevtoolUserAccounts [116] 
export var frameDevtoolUserAccounts = [
  {
  "email":"super@statstrade.io",
  "password":"hello123",
  "handle":"super",
  "is_super":true
},
  {
  "email":"test1@statstrade.io",
  "password":"hello123",
  "handle":"test1"
},
  {
  "email":"test2@statstrade.io",
  "password":"hello123",
  "handle":"test2",
  "onboarding":true
},
  {
  "email":"test3@statstrade.io",
  "password":"hello123",
  "handle":"test3",
  "is_verified":false
},
  {"email":"zcaudate@outlook.com","handle":"zcaudate"}
];

// statsui.basic.layout.common.frame-devtool/frameDevtoolUserAccountsLu [135] 
export var frameDevtoolUserAccountsLu = kd.arr_juxt(frameDevtoolUserAccounts,kd.key_fn("handle"),kl.identity);

// statsui.basic.layout.common.frame-devtool/FrameDevtoolUserRow [140] 
export function FrameDevtoolUserRow({user}){
  let {api,controls,page} = React.useContext(FrameDevtoolContext);
  let backgroundColor = "$color1";
  let {auth} = user;
  let isCurrent = kd.get_in(controls.session,["user","email"]) == kd.get_in(user,["email"]);
  let ncolor = isCurrent ? "$color12" : "$color1";
  let nbackgroundColor = isCurrent ? "$color1" : "$color12";
  return (
    <T.XStack
      alignItems="center"
      flex={1}
      paddingHorizontal={2}
      borderRadius={4}
      backgroundColor={nbackgroundColor}
      width="120px">
      <FrameDevtoolIconButton
        icon={auth ? Minus : null}
        color={ncolor}
        backgroundColor={nbackgroundColor}
        disabled={!auth}
        onPress={function (){
            api.mutations.delete_testuser.mutateAsync({"id":auth.id}).then(function (){
              page.toast.show(ui.t("User Deleted"),{
                "message":JSON.stringify(kd.obj_pick(user,["email","password","handle","is_super"]))
              });
              if(isCurrent){
                return api.mutations.sign_out.mutateAsync();
              }
            });
          }}/>
      <FrameDevtoolButton
        flex={1}
        color={ncolor}
        backgroundColor={nbackgroundColor}
        onPress={function (){
            if(!auth){
              api.mutations.create_testuser.mutateAsync(user).then(function (res){
                page.toast.show(ui.t("User Created"),{"message":JSON.stringify(user)});
                if(user.is_verified == false){
                  console.log(res,user);
                  controls.setSession(res.data);
                  return res;
                }
                return api.mutations.sign_in.mutateAsync(user);
              });
            }
            else if(!isCurrent){
              api.mutations.sign_in.mutateAsync(user);
            }
          }}>{user.handle}
      </FrameDevtoolButton>
      <FrameDevtoolIconButton
        icon={Monitor}
        color={ncolor}
        backgroundColor={nbackgroundColor}
        onPress={function (){
            console.log(user);
          }}/>
    </T.XStack>);
}

// statsui.basic.layout.common.frame-devtool/FrameDevtoolUser [214] 
export function FrameDevtoolUser(){
  let {api,controls} = React.useContext(FrameDevtoolContext);
  React.useEffect(function (){
    api.queries.list_testusers.setInput({"emails":frameDevtoolUserAccounts.map(kd.key_fn("email"))});
  },[]);
  let users = kd.get_in(api.queries.list_testusers,["data","data"]) || [];
  return (
    <FrameDevtoolPopup
      icon={User}
      color={controls.color}
      placement="left-end"
      contentProps={{"backgroundColor":"$color12"}}
      arrowProps={{"backgroundColor":"$color12"}}>
      {users.map(function (user,i){
        user = kd.obj_assign(user,frameDevtoolUserAccounts[i]);
        let key = i;
        let color = "$color1";
        return (
          <FrameDevtoolUserRow user={user} key={key}/>);
      })}
    </FrameDevtoolPopup>);
}

// statsui.basic.layout.common.frame-devtool/FrameDevtoolSharedWorker [242] 
export function FrameDevtoolSharedWorker(){
  let {controls,sharedWorker} = React.useContext(FrameDevtoolContext);
  let state = kd.get_in(sharedWorker,["state"]);
  let connection = kd.get_in(state,["connection"]);
  let status = connection ? "connected" : "disconnected";
  let transport_id = kd.get_in(connection,["transport_id"]) || "n/a";
  let transport_kind = kd.get_in(connection,["transport","meta","kind"]) || "n/a";
  let worker = kd.get_in(connection,["ready","worker"]) || "n/a";
  let signal = kd.get_in(connection,["ready","signal"]) || "n/a";
  let init_status = kd.get_in(state,["init","status"]) || "n/a";
  return (
    <FrameDevtoolPopup
      icon={Monitor}
      color={controls.color}
      placement="bottom-end"
      contentProps={{
          "alignItems":"flex-start",
          "justifyContent":"left",
          "minWidth":"190px"
        }}>
      <T.YStack gap="$1">
        <T.Text fontFamily="monospace" fontSize="8px">SharedWorker</T.Text>
        <T.Text fontFamily="monospace" fontSize="8px">{"status: " + status}</T.Text>
        <T.Text fontFamily="monospace" fontSize="8px">{"transport: " + transport_kind}</T.Text>
        <T.Text fontFamily="monospace" fontSize="8px">{"transport-id: " + transport_id}</T.Text>
        <T.Text fontFamily="monospace" fontSize="8px">{"worker: " + worker}</T.Text>
        <T.Text fontFamily="monospace" fontSize="8px">{"signal: " + signal}</T.Text>
        <T.Text fontFamily="monospace" fontSize="8px">{"init: " + init_status}</T.Text>
        <FrameDevtoolButton
          backgroundColor={controls.color}
          onPress={function (){
              console.log("SHAREDWORKER",sharedWorker);
            }}>Inspect
        </FrameDevtoolButton>
      </T.YStack>
    </FrameDevtoolPopup>);
}

// statsui.basic.layout.common.frame-devtool/FrameDevtoolActivity [300] 
export function FrameDevtoolActivity(){
  let context = React.useContext(FrameDevtoolContext);
  let {controls} = context;
  let router = ui_router.useRouter();
  return (
    <FrameDevtoolPopup
      icon={Activity}
      color={controls.color}
      placement="bottom-end"
      contentProps={{"alignItems":"flex-start","justifyContent":"left"}}>
      <FrameDevtoolButton
        backgroundColor={controls.color}
        onPress={function (){
            console.log("G Store",gs.getStore());
          }}>G Store
      </FrameDevtoolButton>
      <FrameDevtoolButton
        backgroundColor={controls.color}
        onPress={function (){
            console.log("G UI",gu.getUI());
          }}>G UI
      </FrameDevtoolButton>
      <FrameDevtoolButton
        backgroundColor={controls.color}
        onPress={function (){
            console.log("SESSION",controls.session);
          }}>Auth Session
      </FrameDevtoolButton>
      <FrameDevtoolButton
        backgroundColor={controls.color}
        onPress={function (){
            console.log("TOOL CONTEXT",context);
          }}>Tool Context
      </FrameDevtoolButton>
      <FrameDevtoolButton
        backgroundColor={controls.color}
        onPress={function (){
            console.log(gu.getUI(["dev"]));
          }}>Dev All
      </FrameDevtoolButton>
      <FrameDevtoolButton
        backgroundColor={controls.color}
        onPress={function (){
            globalThis.DevContext = gu.getUI(["dev","context"]);
            console.log(gu.getUI(["dev","context"]));
          }}>Dev Context
      </FrameDevtoolButton>
      <FrameDevtoolButton
        backgroundColor={controls.color}
        onPress={function (){
            globalThis.DevQueries = gu.getUI(["dev","context","api","queries"]);
            console.log(globalThis.DevQueries);
          }}>Dev Queries
      </FrameDevtoolButton>
      <FrameDevtoolButton
        backgroundColor={controls.color}
        onPress={function (){
            globalThis.DevOutputs = kd.obj_map(
              gu.getUI(["dev","context","api","queries"]),
              kd.key_fn("output")
            );
            console.log(globalThis.DevOutputs);
          }}>Dev Outputs
      </FrameDevtoolButton>
    </FrameDevtoolPopup>);
}

// statsui.basic.layout.common.frame-devtool/FrameDevtoolWrench [376] 
export function FrameDevtoolWrench(){
  let {controls,page} = React.useContext(FrameDevtoolContext);
  let {current,setCurrent} = ui.useThemeGlobal();
  return (
    <FrameDevtoolPopup
      icon={Wrench}
      color={controls.color}
      placement="bottom"
      contentProps={{"alignItems":"flex-start","justifyContent":"left"}}>
      <FrameDevtoolButton
        backgroundColor={controls.color}
        onPress={function (){
            page.toast.show(
              ui.t("Ping Toast"),
              {"message":ui.t("This is an example of the ping toast")}
            );
          }}>Ping Toast
      </FrameDevtoolButton>
      <FrameDevtoolButton
        backgroundColor={controls.color}
        onPress={function (){
            setCurrent((current == "light") ? "dark" : "light");
          }}>{"Theme " + ks.capitalize(current)}
      </FrameDevtoolButton>
      <FrameDevtoolButton
        backgroundColor={controls.color}
        onPress={function (){
            let client = sb.getClient();
            let uid = kd.get_in(controls.session,["user","id"]);
            if(uid){
              client.schema("szn_type").from("User").select("is_onboarded").eq("id",uid).single().then(function (res){
                let current = kd.get_in(res,["data","is_onboarded"]);
                api_public.user_set_public({"is_onboarded":!current}).then(function (){
                  page.toast.show(
                    ui.t("Onboarding Toggled"),
                    {"message":"User onboarding set to " + !current}
                  );
                  window.location.reload();
                });
              });
            }
          }}>Toggle Onboarding
      </FrameDevtoolButton>
    </FrameDevtoolPopup>);
}

// statsui.basic.layout.common.frame-devtool/FrameDevtoolInfo [432] 
export function FrameDevtoolInfo(){
  let {api,controls} = React.useContext(FrameDevtoolContext);
  let dims = ui.useWindowDimensions();
  let handle = kd.get_in(controls.session,["user","user_metadata","handle"]) || kd.get_in(controls.session,["user","email"]) || "anon";
  return (
    <T.XStack padding="$1" gap="$1">
      <T.YStack flex={1}>
        <FrameDevtoolButton
          backgroundColor={controls.color}
          width="50px"
          onPress={function (){
              if(controls.session){
                api.mutations.sign_out.mutateAsync();
              }
              else{
                api.mutations.sign_in.mutateAsync(
                  frameDevtoolUserAccountsLu[gs.getStore(["dev","user"]) || "super"]
                );
              }
            }}>{handle}
        </FrameDevtoolButton>
      </T.YStack>
      <T.YStack>
        <T.Text fontFamily="monospace" fontSize="8px">{"w: " + dims.width}</T.Text>
        <T.Text fontFamily="monospace" fontSize="8px">{"h: " + dims.height}</T.Text>
      </T.YStack>
    </T.XStack>);
}

// statsui.basic.layout.common.frame-devtool/frameDevtoolApi [475] 
export var frameDevtoolApi = {
  "queries":{
    "list_testusers":{
      "fn":api_debug.debug_get_users_by_email,
      "args":[{"name":"input","keys":["email"]}]
    }
  },
  "mutations":{
    "sign_in":{"fn":api_sign_in},
    "sign_out":{
      "fn":function (){
        return sb.getClient().auth.signOut();
      }
    },
    "create_testuser":{
      "fn":api_nextjs.debug_testusers_create,
      "refresh":["list_testusers"]
    },
    "delete_testuser":{
      "fn":api_nextjs.debug_testusers_delete,
      "refresh":["list_testusers"]
    }
  }
};

// statsui.basic.layout.common.frame-devtool/useFrameDevtoolContext [489] 
export function useFrameDevtoolContext(){
  let toast = ui.useToastController();
  let [session,setSession] = sb.useListenSession();
  let color = session ? (session.access_token ? (session.user.user_metadata.super ? "$purple8" : "$green8") : "$red8") : "$color1";
  let [debugContent,setDebugContent] = React.useState(null);
  let [sharedWorker,setSharedWorker] = React.useState(null);
  let api = rq.useApi(frameDevtoolApi);
  let controls = {color,session,setSession};
  let page = {toast};
  return {api,controls,debugContent,page,setDebugContent,setSharedWorker,sharedWorker};
}

// statsui.basic.layout.common.frame-devtool/useDevtoolInjection [519] 
export function useDevtoolInjection(content){
  let {setDebugContent} = React.useContext(FrameDevtoolContext);
  React.useEffect(function (){
    setDebugContent(content);
    return function (){
      setDebugContent(null);
    };
  },[]);
}

// statsui.basic.layout.common.frame-devtool/useDevtoolSharedWorker [530] 
export function useDevtoolSharedWorker(resource){
  let {setSharedWorker} = React.useContext(FrameDevtoolContext);
  React.useEffect(function (){
    setSharedWorker(resource);
    return function (){
      setSharedWorker(null);
    };
  },[resource]);
}

// statsui.basic.layout.common.frame-devtool/FrameDevtoolScreen [543] 
export function FrameDevtoolScreen(){
  let {controls,debugContent} = React.useContext(FrameDevtoolContext);
  if(!debugContent){
    return null;
  }
  return (
    <FrameDevtoolPopup
      icon={FlaskConical}
      color={controls.color}
      placement="top-end"
      contentProps={{"backgroundColor":"$color12"}}
      arrowProps={{"backgroundColor":"$color12"}}>{debugContent}
    </FrameDevtoolPopup>);
}

// statsui.basic.layout.common.frame-devtool/FrameDevtoolProvider [558] 
export function FrameDevtoolProvider({children}){
  let context = useFrameDevtoolContext();
  gu.usePathContext(["devtool"],context);
  let {controls,page} = context;
  sb.useListeners({
    "onSignedIn":function ({user}){
        if(gs.getStore(["dev","sign-in"],true)){
          page.toast.show(
            ui.t("Login Successful"),
            {"message":"Signed in as " + user.email + "."}
          );
          gs.setStore(["dev","sign-in"],false);
        }
      },
    "onSignedOut":function (){
        page.toast.show(ui.t("Logout Successful"));
      }
  });
  return (
    <FrameDevtoolContext.Provider value={context}>{children}</FrameDevtoolContext.Provider>);
}

// statsui.basic.layout.common.frame-devtool/FrameDevtoolPanel [585] 
export function FrameDevtoolPanel(){
  let context = React.useContext(FrameDevtoolContext);
  let {controls} = context;
  return (
    <FrameDevtoolLayout color={controls.color}>
      <T.YStack gap="$1">
        <T.XStack gap="$1">
          <FrameDevtoolUser/>
          <FrameDevtoolWrench/>
          <FrameDevtoolScreen/>
          <FrameDevtoolSharedWorker/>
          <FrameDevtoolActivity/>
        </T.XStack>
        <FrameDevtoolInfo/>
      </T.YStack>
    </FrameDevtoolLayout>);
}