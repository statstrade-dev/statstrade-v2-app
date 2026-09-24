// statsui.edge.remote.group.manage-settings-action/managerSettingsApi [9] 
export var managerSettingsApi = {
  "queries":{
    "get_profile":{
      "fn":function (){
        return {"orgName":"Acme","email":"contact@acme.com"};
      },
      "enabled":true
    }
  },
  "mutations":{
    "update_profile":{
      "fn":function (data){
        console.log("Simulate Update Profile",data);
        return {"success":true};
      }
    }
  }
};