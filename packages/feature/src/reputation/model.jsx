// statstrade-web.feature.reputation.model/starterSubjects [6] 
export var starterSubjects = [
  "Politics",
  "Economy",
  "Housing",
  "Health",
  "Environment",
  "Technology",
  "Sport",
  "Community"
];

// statstrade-web.feature.reputation.model/starterAspects [7] 
export var starterAspects = ["Accuracy","Early insight","Consistency","Calibration"];

// statstrade-web.feature.reputation.model/slug [9] 
export function slug(value){
  return (value || "").toLowerCase().replace(new RegExp("[^a-z0-9]+","g"),"-").replace(new RegExp("^-|-$","g"),"");
}

// statstrade-web.feature.reputation.model/starter-categories [12] 
export function starter_categories(){
  let subjects = starterSubjects.map(function (name){
    return {
      "id":slug(name),
      "name":name,
      "kind":"subject",
      "description":"",
      "color":"#bc1739",
      "parent_id":null,
      "archived":false
    };
  });
  let aspects = starterAspects.map(function (name){
    return {
      "id":slug(name),
      "name":name,
      "kind":"forecast",
      "description":"",
      "color":"#5353a5",
      "parent_id":null,
      "archived":false
    };
  });
  return subjects.concat(aspects);
}

// statstrade-web.feature.reputation.model/programme [19] 
export function programme(brand){
  let saved = brand.detail && brand.detail.reputation;
  return Object.assign(
    {"version":1,"categories":[],"rules":[],"public_profile":false},
    saved || {}
  );
}

// statstrade-web.feature.reputation.model/fingerprint [23] 
export function fingerprint(value){
  return JSON.stringify(value,function (key,entry){
    if(entry && ((typeof entry) == "object") && !Array.isArray(entry)){
      let sorted = {};
      Object.keys(entry).sort().forEach(function (name){
        sorted[name] = entry[name];
      });
      return sorted;
    }
    return entry;
  });
}

// statstrade-web.feature.reputation.model/validate-categories [32] 
export function validate_categories(rows){
  let ids = new Set();
  rows.forEach(function (row){
    if(!row.id || ids.has(row.id)){
      throw new Error("Every category needs a unique identifier.");
    }
    ids.add(row.id);
    if(!(row.name || "").trim()){
      throw new Error("Give every category a name.");
    }
    if(!["subject","forecast"].includes(row.kind)){
      throw new Error("Choose a subject or forecasting aspect.");
    }
    if(!/^#[0-9a-fA-F]{6}$/.test(row.color)){
      throw new Error("Use a six-digit hex colour.");
    }
  });
  rows.forEach(function (row){
    let seen = new Set([row.id]);
    let parent = row.parent_id;
    while(parent){
      if(seen.has(parent) || !ids.has(parent)){
        throw new Error("Category parents must exist and cannot form a cycle.");
      }
      seen.add(parent);
      let found = rows.find(function (item){
        return item.id == parent;
      });
      if(!(found.kind == row.kind)){
        throw new Error("A specialisation must have the same kind as its parent.");
      }
      parent = found.parent_id;
    }
  });
  return rows;
}

// statstrade-web.feature.reputation.model/category-save [51] 
export function category_save(rows,input){
  let existing = rows.find(function (row){
    return row.id == input.id;
  });
  let row = Object.assign({},input,{
    "id":(existing && existing.id) || slug(input.name),
    "name":input.name.trim()
  });
  if(!existing && rows.some(function (item){
    return item.id == row.id;
  })){
    throw new Error("A category with this identifier already exists.");
  }
  return validate_categories(existing ? rows.map(function (item){
    return (item.id == row.id) ? row : item;
  }) : rows.concat([row]));
}

// statstrade-web.feature.reputation.model/reorder-category [58] 
export function reorder_category(rows,id,direction){
  let next = rows.slice();
  let index = rows.findIndex(function (row){
    return row.id == id;
  });
  let target = index + direction;
  if((index >= 0) && (target >= 0) && (target < rows.length)){
    next[index] = rows[target];
    next[target] = rows[index];
  }
  return next;
}

// statstrade-web.feature.reputation.model/merge-programme [66] 
export function merge_programme(detail,configuration){
  validate_categories(configuration.categories);
  return Object.assign(
    {},
    detail || {},
    {"reputation":Object.assign({},configuration,{"version":1})}
  );
}

// statstrade-web.feature.reputation.model/eligible-admin [70] 
export function eligible_admin(roles){
  return roles.some(function (role){
    return (true == role.is_active) && ["owner","admin"].includes(role.level);
  });
}

// statstrade-web.feature.reputation.model/number-label [73] 
export function number_label(value){
  if((null == value) || !Number.isFinite(Number(value))){
    return "—";
  }
  return Number(value).toLocaleString("en-AU",{"maximumFractionDigits":2});
}

// statstrade-web.feature.reputation.model/aspect-cards [77] 
export function aspect_cards(configuration,assets,tokens,configs,scores){
  return configuration.categories.map(function (category){
    let config = category.token_id && category.playable_id && configs.find(function (c){
      return (c.token_id == category.token_id) && (c.playable_id == category.playable_id);
    });
    let token = tokens.find(function (t){
      return t.id == category.token_id;
    });
    let asset = token && config && assets.find(function (a){
      return (a.token_id == token.id) && (a.playable_id == config.playable_id);
    });
    let score = scores.find(function (s){
      return s.category_id == category.id;
    });
    return Object.assign({},category,{
      "samples":score && score.samples,
      "config":config,
      "method":score && score.method,
      "lifetime_earned":score && score.lifetime_earned,
      "token":token,
      "balance":asset && asset.balance,
      "scale_max":score && score.scale_max,
      "provisional":score && score.provisional,
      "rating":score && score.score
    });
  });
}

// statstrade-web.feature.reputation.model/preview-data [86] 
export function preview_data(){
  let categories = starter_categories();
  categories.forEach(function (c){
    c.token_id = ("token-" + c.id);
    c.playable_id = "auspolitics-forecast";
  });
  let tokens = categories.map(function (c){
    return {
      "id":c.token_id,
      "name":c.name,
      "type":"reputation",
      "issuer_id":"auspolitics"
    };
  });
  return {
    "budgets":[
        {
          "id":"budget-preview",
          "token_id":"token-housing",
          "playable_id":"auspolitics-forecast",
          "limit":10000,
          "awarded":2400,
          "reserved":500,
          "status":"active"
        }
      ],
    "capabilities":{
        "automatic_awards":false,
        "manual_awards":false,
        "public_ratings":false
      },
    "assets":[
        {
          "token_id":"token-housing",
          "playable_id":"auspolitics-forecast",
          "balance":240
        },
        {
          "token_id":"token-politics",
          "playable_id":"auspolitics-forecast",
          "balance":680
        },
        {
          "token_id":"token-economy",
          "playable_id":"auspolitics-forecast",
          "balance":420
        },
        {
          "token_id":"token-accuracy",
          "playable_id":"auspolitics-forecast",
          "balance":360
        },
        {
          "token_id":"token-early-insight",
          "playable_id":"auspolitics-forecast",
          "balance":85
        }
      ],
    "history":[
        {
          "category_id":"housing",
          "title":"Will the housing approval be granted?",
          "outcome":"Resolved Yes",
          "probability":"74% Yes before lock",
          "award_ref":"award-preview",
          "points":8
        }
      ],
    "brand":{
        "id":"auspolitics",
        "name":"auspolitics",
        "title":"AusPolitics",
        "detail":{
            "reputation":{
                "version":1,
                "categories":categories,
                "rules":[
                    {
                      "id":"correct-call",
                      "name":"Correct call",
                      "policy":"Configured by AusPolitics",
                      "status":"draft"
                    }
                  ],
                "public_profile":true
              }
          }
      },
    "canManage":true,
    "scores":[
        {
          "category_id":"housing",
          "score":76,
          "lifetime_earned":260,
          "scale_max":100,
          "method":"Sample published score",
          "samples":18,
          "provisional":true
        },
        {
          "category_id":"politics",
          "score":82,
          "lifetime_earned":680,
          "scale_max":100,
          "method":"Sample published score",
          "samples":42
        },
        {
          "category_id":"economy",
          "score":79,
          "lifetime_earned":420,
          "scale_max":100,
          "method":"Sample published score",
          "samples":31
        },
        {
          "category_id":"accuracy",
          "score":84,
          "lifetime_earned":360,
          "scale_max":100,
          "samples":42
        },
        {
          "category_id":"early-insight",
          "score":73,
          "lifetime_earned":85,
          "scale_max":100,
          "samples":18,
          "provisional":true
        }
      ],
    "tokens":tokens,
    "awards":[
        {
          "explanation":"Correct call: 10 base Accuracy points; Housing expertise and Early insight awarded under the sample capped bonus policy.",
          "occurred_at":1793491200000,
          "lines":[
              {"label":"Accuracy","amount":10},
              {"label":"Housing expertise","amount":8},
              {"label":"Early insight","amount":3}
            ],
          "extra":"Community briefing invitation",
          "title":"Will the housing approval be granted?",
          "rating_before":74,
          "source_ref":"sample-prediction",
          "status":"fulfilled",
          "policy_version":"sample-v1",
          "id":"award-preview",
          "rating_after":76
        }
      ],
    "configs":categories.map(function (c){
        return {
          "token_id":c.token_id,
          "playable_id":c.playable_id,
          "status":"active",
          "is_transferable":false,
          "earn_limits":{"maximum":100,"period":"weekly"}
        };
      })
  };
}