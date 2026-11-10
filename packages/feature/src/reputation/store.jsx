import * as sb from '@statstrade/edge/remote/util-supabase.jsx'

import * as model from '@statstrade/feature/reputation/model.jsx'

// statstrade-web.feature.reputation.store/checked [7] 
export function checked(response){
  if(response.error){
    throw new Error(response.error.message || "The request failed.");
  }
  return response.data;
}

// statstrade-web.feature.reputation.store/rows [11] 
export async function rows(table,select,filters){
  let all = [];
  let offset = 0;
  while(true){
    let page = checked(await sb.queryTable(table,{
      "select":select,
      "filters":filters,
      "order":[{"column":"id","ascending":true}],
      "limit":200,
      "offset":offset
    },{"schema":"stats_type"}));
    if(!Array.isArray(page)){
      throw new Error("Unexpected data response.");
    }
    all = all.concat(page);
    if(page.length < 200){
      return all;
    }
    offset = (offset + 200);
    if(offset >= 10000){
      throw new Error(
        "This catalogue needs a paged backend summary before it can be loaded safely."
      );
    }
  }
}

// statstrade-web.feature.reputation.store/load-brand [22] 
export async function load_brand(id,user_id){
  let brands = await rows("Org","id,name,title,detail",[{"column":"id","value":id}]);
  let brand = brands[0];
  if(!brand){
    throw new Error("This brand is unavailable to your account.");
  }
  let access = await rows("Access","id,class_table,class_context",[
    {"column":"class_ref","value":id},
    {"column":"class_table","value":"Org"},
    {"column":"class_context","value":"Global"}
  ]);
  let roles = [];
  if(user_id && (access.length > 0)){
    roles = await rows("AccessRole","level,is_active",[
      {"column":"access_id","value":access[0]["id"]},
      {"column":"class_table","value":access[0]["class_table"]},
      {"column":"class_context","value":access[0]["class_context"]},
      {"column":"member_id","value":user_id}
    ]);
  }
  let tokens = await rows(
    "Token",
    "id,name,title,type,issuer_id,detail",
    [{"column":"issuer_id","value":id}]
  );
  tokens = tokens.filter(function (t){
    return ["points","reputation","timebound"].includes(t.type);
  });
  let configs = [];
  if(tokens.length > 0){
    configs = await rows("PlayableConfig","id,token_id,playable_id,status,earn_limits,expiry_rule,is_transferable,display",[
      {
          "column":"token_id",
          "operator":"in",
          "value":tokens.map(function (t){
                return t.id;
              })
        }
    ]);
  }
  return {
    "budgets":[],
    "capabilities":{
        "automatic_awards":false,
        "manual_awards":false,
        "public_ratings":false
      },
    "assets":[],
    "brand":brand,
    "scopeUserId":user_id,
    "canManage":model.eligible_admin(roles),
    "scores":[],
    "tokens":tokens,
    "notice":"Balances, published ratings and award history will appear when this programme exposes its member summary. Configuration alone does not issue rewards.",
    "awards":[],
    "configs":configs
  };
}

// statstrade-web.feature.reputation.store/save-programme [40] 
export async function save_programme(brand,configuration){
  let freshRows = await rows(
    "Org",
    "id,name,title,detail",
    [{"column":"id","value":brand.id}]
  );
  let fresh = freshRows[0];
  if(!fresh){
    throw new Error("This brand is no longer available.");
  }
  if(!(model.fingerprint(model.programme(fresh)) == model.fingerprint(model.programme(brand)))){
    throw new Error(
      "The programme changed. Reload it before saving your changes."
    );
  }
  let detail = model.merge_programme(fresh.detail,configuration);
  checked(
    await sb.callRemote("org_update",{"org_id":brand.id,"m":{"detail":detail}})
  );
  return Object.assign({},fresh,{"detail":detail});
}