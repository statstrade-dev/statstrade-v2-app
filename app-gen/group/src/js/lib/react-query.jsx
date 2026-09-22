import * as ReactQuery from '@tanstack/react-query'

import React from 'react'

import * as xtt from '@statstrade/edge/lib/xt/lang/common-tree.jsx'

import * as xtd from '@statstrade/edge/lib/xt/lang/common-data.jsx'

import * as xtsb from '@statstrade/edge/lib/xt/lang/common-sort-by.jsx'

import * as k from '@statstrade/edge/lib/xt/lang/common-lib.jsx'

// js.lib.react-query/useApiQueriesSingle [80] 
export function useApiQueriesSingle([key,q]){
  let [input,setInput] = React.useState();
  let raw = ReactQuery.useQuery({
    "queryKey":[key,input],
    "queryFn":function ({queryKey}){
        let [_,input] = queryKey;
        return q.fn(input);
      },
    "enabled":q.enabled || k.not_nilp(input)
  });
  let {transform = k.identity,path = ["data"]} = q;
  let {data} = raw;
  let output = q.default;
  try{
    output = (transform(xtd.get_in(data,path)) || q.default);
  }
  catch(e){
    
  }
  return xtd.obj_assign(raw,{input,setInput,output,"queryRaw":q.fn});
}

// js.lib.react-query/useApiQueriesBase [105] 
export function useApiQueriesBase(api){
  return xtd.arr_juxt(
    xtsb.sort_by(xtd.obj_pairs(api.queries),[xtd.first]),
    xtd.first,
    useApiQueriesSingle
  );
}

// js.lib.react-query/useApiQueriesWire [118] 
export function useApiQueriesWire(api,queries){
  for(let qpair of xtsb.sort_by(xtd.obj_pairs(api.queries),[xtd.first])){
    let [qkey,q] = qpair;
    if(q.deps){
      let params = {};
      for(let dpair of xtsb.sort_by(xtd.obj_pairs(q.deps),[xtd.first])){
        let [dkey,d] = dpair;
        let {dataUpdatedAt,output} = xtd.get_in(queries,[dkey]);
        let {transform = k.identity,check = k.T} = d;
        let flag = null;
        try{
          let input = transform(output);
          params[d.key] = {"value":input,"enabled":check(input),"updated":dataUpdatedAt};
        }
        catch(e){
          params[d.key] = {"value":null,"enabled":false,"updated":dataUpdatedAt};
        }
      };
      let params_str = JSON.stringify(params);
      React.useEffect(function (){
        if(xtd.obj_emptyp(xtd.obj_filter(params,function ({enabled}){
          return enabled == false;
        }))){
          let {input,refetch,setInput} = xtd.get_in(queries,[qkey]);
          let ninput = xtd.obj_map(params,function (x){
            return x["value"];
          });
          if(!xtt.eq_nested(ninput,input)){
            setInput(ninput);
          }
          else if(q.refetch){
            refetch();
          }
        }
      },[params_str]);
    }
  };
  return queries;
}

// js.lib.react-query/useApiQueries [164] 
export function useApiQueries(api){
  let queries = useApiQueriesBase(api);
  return useApiQueriesWire(api,queries);
}

// js.lib.react-query/useApi [171] 
export function useApi(api){
  let client = ReactQuery.useQueryClient();
  let queries = useApiQueries(api);
  let mutations = xtd.arr_juxt(xtsb.sort_by(xtd.obj_pairs(api.mutations),[xtd.first]),xtd.first,function ([key,mut]){
    return ReactQuery.useMutation({
      "onSuccess":function (){
            for(let key of mut.refresh || []){
              client.invalidateQueries({"queryKey":[key]});
            };
          },
      "mutationFn":mut.fn
    });
  });
  return {client,mutations,queries};
}