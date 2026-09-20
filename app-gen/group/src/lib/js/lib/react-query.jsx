import * as ReactQuery from '@tanstack/react-query'

import React from 'react'

import * as k from '@statstrade/group/lib/xt/lang/base-lib'

// js.lib.react-query/useApiQueriesSingle [76] 
export function useApiQueriesSingle([key,q]){
  let [input,setInput] = React.useState();
  let raw = ReactQuery.useQuery({
    "queryKey":[key,input],
    "queryFn":function ({queryKey}){
        let [_,input] = queryKey;
        return q.fn(input);
      },
    "enabled":q.enabled || (null != input)
  });
  let {transform = k.identity,path = ["data"]} = q;
  let {data} = raw;
  let output = q.default;
  try{
    output = (transform(k.get_in(data,path)) || q.default);
  }
  catch(e){
    
  }
  return k.obj_assign(raw,{input,setInput,output,"queryRaw":q.fn});
}

// js.lib.react-query/useApiQueriesBase [101] 
export function useApiQueriesBase(api){
  return k.arr_juxt(k.sort_by(k.obj_pairs(api.queries),[
    function (arr){
      return arr[0];
    }
  ]),function (arr){
    return arr[0];
  },useApiQueriesSingle);
}

// js.lib.react-query/useApiQueriesWire [114] 
export function useApiQueriesWire(api,queries){
  for(let qpair of k.sort_by(k.obj_pairs(api.queries),[
    function (arr){
      return arr[0];
    }
  ])){
    let [qkey,q] = qpair;
    if(q.deps){
      let params = {};
      for(let dpair of k.sort_by(k.obj_pairs(q.deps),[
        function (arr){
              return arr[0];
            }
      ])){
        let [dkey,d] = dpair;
        let {dataUpdatedAt,output} = k.get_in(queries,[dkey]);
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
        if(k.obj_emptyp(k.obj_filter(params,function ({enabled}){
          return enabled == false;
        }))){
          let {input,refetch,setInput} = k.get_in(queries,[qkey]);
          let ninput = k.obj_map(params,k.key_fn("value"));
          if(!k.eq_nested(ninput,input)){
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

// js.lib.react-query/useApiQueries [160] 
export function useApiQueries(api){
  let queries = useApiQueriesBase(api);
  return useApiQueriesWire(api,queries);
}

// js.lib.react-query/useApi [167] 
export function useApi(api){
  let client = ReactQuery.useQueryClient();
  let queries = useApiQueries(api);
  let mutations = k.arr_juxt(k.sort_by(k.obj_pairs(api.mutations),[
    function (arr){
      return arr[0];
    }
  ]),function (arr){
    return arr[0];
  },function ([key,mut]){
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