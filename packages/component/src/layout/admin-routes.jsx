import * as kd from '@xtalk/lang/common-data.js'

// statsui.basic.layout.admin-routes/F00_GUEST [8] 
export var F00_GUEST = "guest";

// statsui.basic.layout.admin-routes/F01_HOME [9] 
export var F01_HOME = "home";

// statsui.basic.layout.admin-routes/F02_SETTINGS [10] 
export var F02_SETTINGS = "settings";

// statsui.basic.layout.admin-routes/F03_MANAGE [11] 
export var F03_MANAGE = "manage";

// statsui.basic.layout.admin-routes/F04_MARKET [12] 
export var F04_MARKET = "market";

// statsui.basic.layout.admin-routes/F05_WALLET [13] 
export var F05_WALLET = "wallet";

// statsui.basic.layout.admin-routes/F06_GAME [14] 
export var F06_GAME = "game";

// statsui.basic.layout.admin-routes/F07_ADMIN [15] 
export var F07_ADMIN = "admin";

// statsui.basic.layout.admin-routes/ROUTES [17] 
export var ROUTES = {
  "home":{
    "dashboard":{
      "key":"home/dashboard",
      "title":"Dashboard",
      "description":"Platform activity at a glance"
    }
  },
  "settings":{
    "account":{
      "key":"settings/account",
      "title":"Account",
      "description":"Account overview"
    },
    "general":{
      "key":"settings/general",
      "title":"General",
      "description":"General preferences"
    },
    "security":{
      "key":"settings/security",
      "title":"Security",
      "description":"Security and access"
    },
    "profile":{
      "key":"settings/profile",
      "title":"Profile",
      "description":"Profile details"
    },
    "notification":{
      "key":"settings/notification",
      "title":"Notifications",
      "description":"Notification preferences"
    },
    "wallet":{
      "key":"settings/wallet",
      "title":"Wallet",
      "description":"Wallet settings"
    },
    "components":{
      "key":"settings/components",
      "title":"Components",
      "description":"UI component gallery"
    },
    "blockchain":{
      "key":"settings/blockchain",
      "title":"Blockchain",
      "description":"Blockchain connections"
    }
  },
  "manage":{
    "organisation":{
      "key":"manage/organisation",
      "title":"Organisation",
      "description":"Organisation management"
    },
    "room":{
      "key":"manage/room",
      "title":"Room",
      "description":"Room management"
    },
    "entity":{
      "key":"manage/entity",
      "title":"Entity",
      "description":"Entity management"
    },
    "cash":{
      "key":"manage/cash",
      "title":"Cash",
      "description":"Cash management"
    }
  },
  "market":{
    "overview":{
      "key":"market/overview",
      "title":"Market",
      "description":"Market overview"
    },
    "orders":{
      "key":"market/orders",
      "title":"Orders",
      "description":"Market orders"
    },
    "contracts":{
      "key":"market/contracts",
      "title":"Contracts",
      "description":"Market contracts"
    },
    "history":{
      "key":"market/history",
      "title":"History",
      "description":"Market history"
    }
  },
  "wallet":{
    "assets":{
      "key":"wallet/assets",
      "title":"Assets",
      "description":"Wallet assets"
    }
  },
  "game":{
    "overview":{
      "key":"game/overview",
      "title":"Game",
      "description":"Game overview"
    },
    "manage":{
      "key":"game/manage",
      "title":"Manage",
      "description":"Game management"
    },
    "order":{
      "key":"game/order",
      "title":"Order",
      "description":"Game orders"
    },
    "contract":{
      "key":"game/contract",
      "title":"Contract",
      "description":"Game contracts"
    }
  },
  "admin":{
    "global":{
      "key":"admin/global",
      "title":"Global",
      "description":"Global configuration"
    },
    "system":{
      "key":"admin/system",
      "title":"System",
      "description":"System operations"
    },
    "service":{
      "key":"admin/service",
      "title":"Service",
      "description":"Service operations"
    },
    "manage":{
      "key":"admin/manage",
      "title":"Manage",
      "description":"Administrative management"
    },
    "view":{
      "key":"admin/view",
      "title":"View",
      "description":"Administrative views"
    },
    "account":{
      "key":"admin/account",
      "title":"Account",
      "description":"Account administration"
    },
    "organisation":{
      "key":"admin/organisation",
      "title":"Organisation",
      "description":"Organisation administration"
    },
    "abuse":{
      "key":"admin/abuse",
      "title":"Abuse",
      "description":"Abuse review"
    }
  }
};

// statsui.basic.layout.admin-routes/NAVIGATION [109] 
export var NAVIGATION = [
  {"key":"home","label":"HOME","icon":"home"},
  {"key":"market","label":"MARKET","icon":"activity"},
  {"key":"wallet","label":"WALLET","icon":"wallet"},
  {"key":"game","label":"GAME","icon":"network"},
  {"key":"manage","label":"MANAGE","icon":"briefcase"},
  {"key":"settings","label":"SETTINGS","icon":"settings"},
  {"key":"admin","label":"ADMIN","icon":"rocket"}
];

// statsui.basic.layout.admin-routes/DEFAULT-SECTIONS [118] 
export var DEFAULT_SECTIONS = {
  "home":"dashboard",
  "settings":"account",
  "manage":"organisation",
  "market":"overview",
  "wallet":"assets",
  "game":"overview",
  "admin":"global"
};

// statsui.basic.layout.admin-routes/routeId [127] 
export function routeId(group,section){
  return group + "/" + section;
}

// statsui.basic.layout.admin-routes/getSection [134] 
export function getSection(group,section){
  let entries = ROUTES[group];
  return entries[section];
}

// statsui.basic.layout.admin-routes/sectionsFor [142] 
export function sectionsFor(group){
  return kd.obj_vals(ROUTES[group]);
}

// statsui.basic.layout.admin-routes/defaultSection [149] 
export function defaultSection(group){
  return DEFAULT_SECTIONS[group];
}

// statsui.basic.layout.admin-routes/sectionKey [156] 
export function sectionKey(route){
  return route.split("/")[1];
}