import * as xtd from '@statstrade/edge/lib/xt/lang/common-data.jsx'

// xt.substrate.base-space/space [65] 
export function space(space_id,opts){
  opts = (opts || {});
  return {
    "id":space_id,
    "state":opts["state"] || {},
    "meta":opts["meta"] || {}
  };
}

// xt.substrate.base-space/get-space [75] 
export function get_space(node,space_id){
  return (node["spaces"])[space_id || "__NODE__"];
}

// xt.substrate.base-space/create-space [84] 
export function create_space(node,space_id,opts){
  let entry = space(space_id || "__NODE__",opts);
  node["spaces"][entry["id"]] = entry;
  return entry;
}

// xt.substrate.base-space/ensure-space [94] 
export function ensure_space(node,space_id,opts){
  let sid = space_id || "__NODE__";
  let entry = get_space(node,sid);
  if(null == entry){
    entry = create_space(node,sid,opts);
  }
  return entry;
}

// xt.substrate.base-space/remove-space [104] 
export function remove_space(node,space_id){
  let sid = space_id || "__NODE__";
  let {spaces} = node;
  let entry = spaces[sid];
  delete(spaces[sid]);
  return entry;
}

// xt.substrate.base-space/list-spaces [114] 
export function list_spaces(node){
  return xtd.arr_sort(Object.keys(node["spaces"]),function (x){
    return x;
  },function (x,y){
    return 0 > x.localeCompare(y);
  });
}

// xt.substrate.base-space/get-space-state [122] 
export function get_space_state(node,space_id){
  let entry = ensure_space(node,space_id,null);
  return entry["state"];
}

// xt.substrate.base-space/set-space-state [129] 
export function set_space_state(node,space_id,state){
  let entry = ensure_space(node,space_id,null);
  entry["state"] = state;
  return state;
}

// xt.substrate.base-space/update-space-state [137] 
export function update_space_state(node,space_id,updater){
  let entry = ensure_space(node,space_id,null);
  let curr = entry["state"];
  let next = updater(curr,entry,node);
  entry["state"] = next;
  return next;
}