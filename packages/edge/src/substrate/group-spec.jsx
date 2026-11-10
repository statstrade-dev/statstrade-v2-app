// statsui.edge.substrate.group-spec/instanceGroupId [7] 
export function instanceGroupId(definition,instance_id){
  return definition["id"] + "@" + instance_id;
}

// statsui.edge.substrate.group-spec/createPageSpec [12] 
export function createPageSpec(definition,bindings){
  let values = bindings || {};
  let models = {};
  Object.entries(definition["models"]).forEach(function ([id,template]){
    let entry = JSON.parse(JSON.stringify(template));
    if(entry["kind"] == "local"){
      entry = {
        "kind":"local",
        "model":{
                "defaults":{"args":[],"output":values["route"] || {}},
                "options":{}
              }
      };
    }
    if(entry["kind"] == "parameter"){
      entry = values["table-model"];
      if(!(entry || {})["dataview"] || !(entry || {})["model"]){
        throw new Error("Table browser requires a typed table-model dataview.");
      }
      entry = JSON.parse(JSON.stringify({
        "kind":"dataview",
        "dataview":entry["dataview"],
        "model":entry["model"]
      }));
    }
    if(entry["bindings"]){
      entry["model"]["defaults"]["args"] = entry["bindings"].map(function (key){
        if(!Object.prototype.hasOwnProperty.call(values,key)){
          throw new Error("Missing page binding: " + key);
        }
        return values[key];
      });
      delete entry["bindings"];
    }
    if(entry["requires-actor"]){
      if(!values["actor-id"]){
        throw new Error("An actor-id is required for the operations snapshot.");
      }
      entry["model"]["defaults"]["args"] = [values["actor-id"]].concat(entry["actor-tail"] || []);
    }
    models[id] = entry;
  });
  let group_id = values["instance-id"] ? instanceGroupId(definition,values["instance-id"]) : definition["id"];
  return {"group_id":group_id,"models":models};
}