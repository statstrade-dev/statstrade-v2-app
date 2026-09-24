// statsui.edge.remote.group.manage-market-action/mockMarkets [9] 
export function mockMarkets(){
  return [
    {
      "id":"m1",
      "question":"Will we launch the new product this month?",
      "status":"live",
      "description":"Bet on whether our Q4 product launch happens in November",
      "outcomes":[
          {"label":"Yes","points":30600,"percentage":68,"color":"$green9"},
          {"label":"No","points":14400,"percentage":32,"color":"$red9"}
        ],
      "totalStaked":45000,
      "participantCount":234,
      "endDate":"Nov 30, 2025"
    },
    {
      "id":"m2",
      "question":"Which feature will get the most votes?",
      "status":"live",
      "description":"Community decides the next feature we build",
      "outcomes":[
          {
            "label":"Dark Mode",
            "points":28476,
            "percentage":42,
            "color":"$blue9"
          },
          {
            "label":"Mobile App",
            "points":23730,
            "percentage":35,
            "color":"$purple9"
          },
          {
            "label":"API Access",
            "points":15594,
            "percentage":23,
            "color":"$pink9"
          }
        ],
      "totalStaked":67800,
      "participantCount":512,
      "endDate":"Dec 15, 2025"
    }
  ];
}

// statsui.edge.remote.group.manage-market-action/managerMarketApi [32] 
export var managerMarketApi = {
  "queries":{
    "prospect_market_list":{
      "fn":function (){
        return new Promise(function (resolve){
          setTimeout(function (){
            resolve(mockMarkets());
          },800);
        });
      },
      "default":[]
    },
    "get_market_stats":{
      "fn":function (){
        return new Promise(function (resolve){
          setTimeout(function (){
            resolve({
              "activeMarkets":8,
              "totalVolume":"225K",
              "totalParticipants":"1,557",
              "avgStake":145
            });
          },500);
        });
      },
      "default":{
        "activeMarkets":0,
        "totalVolume":"0",
        "totalParticipants":"0",
        "avgStake":0
      }
    }
  },
  "mutations":{}
};