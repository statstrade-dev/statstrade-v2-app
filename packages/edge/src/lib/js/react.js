import React from 'react'

import ReactDOM from 'react-dom/client'

import * as xtt from '@statstrade/edge/lib/xt/lang/common-tree.jsx'

import * as xtd from '@statstrade/edge/lib/xt/lang/common-data.jsx'

import * as k from '@statstrade/edge/lib/xt/lang/common-lib.jsx'

import * as math from '@statstrade/edge/lib/xt/lang/common-math.jsx'

import * as str from '@statstrade/edge/lib/xt/lang/common-string.jsx'

// js.react/getDOMRoot [179] 
export function getDOMRoot(domNode){
  let internalKey = xtd.arr_find(xtd.obj_keys(domNode),function (key){
    return key.startsWith("__reactContainer$");
  });
  if(internalKey > 0){
    return domNode[internalKey];
  }
  return null;
}

// js.react/renderDOMRoot [190] 
export function renderDOMRoot(id,Component){
  let rootElement = document.getElementById(id);
  let root = getDOMRoot(rootElement);
  if(null == root){
    root = ReactDOM.createRoot(rootElement);
  }
  root.render((
    <Component/>));
  return true;
}

// js.react/useStateFor [199] 
export function useStateFor(controls,key){
  let setterKey = "set" + str.capitalize(key);
  return [controls[key],controls[setterKey]];
}

// js.react/Try [206] 
export class Try extends React.Component{
  constructor(props) {
    super(props);
    this.state = {"hasError":false,"error":null};
  }
  static getDerivedStateFromError(error){
    return {error,"hasError":true};
  }
  render() {
    if(this.state.hasError){
      return this.props.fallback;
    }
    else{
      return this.props.children;
    }
  }
}

// js.react/id [224] 
export function id(n){
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return React.useRef(Math.random().toString(36).substr(2,n || 6)).current;
}

// js.react/useStep [237] 
export function useStep(f){
  let [done,setDone] = React.useState();
  React.useEffect(function (){
    if(!done){
      return f(setDone);
    }
  });
  return [done,setDone];
}

// js.react/makeLazy [247] 
export function makeLazy(component){
  if("function" == (typeof component)){
    return component;
  }
  else{
    return React.lazy(function (){
      return component;
    });
  }
}

// js.react/useLazy [255] 
export function useLazy(component){
  if("function" == (typeof component)){
    return component;
  }
  else{
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return React.useRef(React.lazy(function (){
      return component;
    })).current;
  }
}

// js.react/useRefresh [268] 
export function useRefresh(){
  let [flag,setFlag] = React.useState(true);
  let refresh = function (){
    return setFlag(!flag);
  };
  return refresh;
}

// js.react/useGetCount [276] 
export function useGetCount(n){
  let counterRef = React.useRef(n || 0);
  React.useEffect(function (){
    counterRef.current = (1 + counterRef.current);
  });
  let getCount = React.useRef(function (){
    return counterRef.current;
  }).current;
  return getCount;
}

// js.react/useFollowRef [286] 
export function useFollowRef(value,f){
  f = (f || k.identity);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  let valueRef = React.useRef(f(value));
  // eslint-disable-next-line react-hooks/rules-of-hooks
  React.useEffect(function (){
    valueRef.current = f(value);
  },[value]);
  return valueRef;
}

// js.react/useIsMounted [302] 
export function useIsMounted(){
  let mountedRef = React.useRef(true);
  let isMounted = React.useRef(function (){
    return mountedRef.current;
  }).current;
  React.useEffect(function (){
    return function (){
      mountedRef.current = false;
    };
  },[]);
  return isMounted;
}

// js.react/useIsMountedWrap [313] 
export function useIsMountedWrap(){
  let isMounted = useIsMounted();
  return function (f){
    return function (...args){
      if(isMounted()){
        f(...args);
      }
    };
  };
}

// js.react/useMountedCallback [324] 
export function useMountedCallback(cb){
  let cbRef = useFollowRef(cb);
  React.useEffect(function (){
    if(cbRef.current){
      cbRef.current(true);
    }
    return function (){
      if(cbRef.current){
        cbRef.current(false);
      }
    };
  },[]);
}

// js.react/useFollowDelayed [336] 
export function useFollowDelayed(value,delay,isMounted){
  if(0 == delay){
    return [value,k.noop];
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  let [delayed,setDelayed] = React.useState(value);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  React.useEffect(function (){
    new Promise(function (resolve,reject){
      setTimeout(function (){
        new Promise(function (inner_resolve){
          inner_resolve((function (){
            if(isMounted()){
              setDelayed(value);
            }
          })());
        }).then(function (value){
          resolve(value);
        }).catch(function (err){
          reject(err);
        });
      },delay);
    });
  },[value]);
  return [delayed,setDelayed];
}

// js.react/useStablized [352] 
export function useStablized(input,isStabilized){
  let [output,setOutput] = React.useState(input);
  React.useEffect(function (){
    if(isStabilized && (null != input) && xtt.eq_nested(input,output)){
      setOutput(input);
    }
  },[input]);
  return isStabilized ? output : input;
}

// js.react/runIntervalStop [368] 
export function runIntervalStop(intervalRef){
  let interval = intervalRef.current;
  if(null != interval){
    clearInterval(interval);
    intervalRef.current = null;
  }
  return interval;
}

// js.react/runIntervalStart [378] 
export function runIntervalStart(fRef,msRef,intervalRef){
  let prev = runIntervalStop(intervalRef);
  if(null != msRef.current){
    let curr = setInterval(function (){
      fRef.current();
    },msRef.current);
    intervalRef.current = curr;
    return [prev,curr];
  }
  return [prev];
}

// js.react/useInterval [392] 
export function useInterval(f,ms){
  let fRef = useFollowRef(f);
  let msRef = useFollowRef(ms);
  let intervalRef = React.useRef(null);
  let stopInterval = React.useRef(function (){
    return runIntervalStop(intervalRef);
  }).current;
  let startInterval = React.useRef(function (){
    return runIntervalStart(fRef,msRef,intervalRef);
  }).current;
  React.useEffect(function (){
    startInterval();
    return stopInterval;
  },[ms]);
  return {startInterval,stopInterval};
}

// js.react/runTimeoutStop [415] 
export function runTimeoutStop(timeoutRef){
  let timeout = timeoutRef.current;
  if(null != timeout){
    clearTimeout(timeout);
    timeoutRef.current = null;
  }
  return timeout;
}

// js.react/runTimeoutStart [425] 
export function runTimeoutStart(fRef,msRef,timeoutRef){
  let prev = runTimeoutStop(timeoutRef);
  let curr = setTimeout(function (){
    fRef.current();
  },msRef.current || 0);
  timeoutRef.current = curr;
  return [prev,curr];
}

// js.react/useTimeout [437] 
export function useTimeout(f,ms,init){
  let fRef = useFollowRef(f);
  let msRef = useFollowRef(ms);
  let timeoutRef = React.useRef(null);
  let stopTimeout = React.useRef(function (){
    return runTimeoutStop(timeoutRef);
  }).current;
  let startTimeout = React.useRef(function (){
    return runTimeoutStart(fRef,msRef,timeoutRef);
  }).current;
  React.useEffect(function (){
    if(false != init){
      startTimeout();
    }
    return stopTimeout;
  },[]);
  return {startTimeout,stopTimeout};
}

// js.react/useCountdown [459] 
export function useCountdown(initial,onComplete,opts){
  let {interval = 1000,step = 1,to = 0} = opts || {};
  let [current,setCurrent] = React.useState(initial);
  let {startInterval,stopInterval} = useInterval(function (){
    if(current > to){
      setCurrent(current - step);
    }
    else{
      stopInterval();
      if(onComplete){
        onComplete(current);
      }
    }
  },interval);
  return [
    current,
    setCurrent,
    {"startCountdown":startInterval,"stopCountdown":stopInterval}
  ];
}

// js.react/useNow [487] 
export function useNow(interval){
  let [now,setNow] = React.useState(Date.now());
  let {startInterval,stopInterval} = useInterval(function (){
    setNow(Date.now());
  },interval || 1000);
  return [now,{"startNow":startInterval,"stopNow":stopInterval}];
}

// js.react/useSubmit [504] 
export function useSubmit({
  result,
  delay = 200,
  setResult = (function (){
  return null;
}),
  onSubmit = (function (){
  return null;
}),
  onError = (function (res){
  console.log(" js.react/useSubmit 512\n\n","ERRORED",res);
  return res["body"];
}),
  onSuccess = k.identity,
  isMounted = (function (){
  return true;
})
}){
  let [waiting,setWaiting] = React.useState(function (){
    return false;
  });
  let onAction = function (){
    setWaiting(true);
    Promise.resolve().then(function (){
      if(onSubmit){
        return onSubmit();
      }
    }).then(function (res){
      if(isMounted()){
        setResult(onSuccess(res));
      }
      setTimeout(function (){
        if(isMounted()){
          setWaiting(false);
        }
      },delay);
    }).catch(function (err){
      setTimeout(function (){
        if(isMounted()){
          setWaiting(false);
        }
      },delay);
      if(isMounted()){
        setResult(onError(err));
      }
    });
  };
  let errored = result && ("error" == result["status"]);
  return {errored,onAction,setWaiting,waiting};
}

// js.react/useSubmitResult [544] 
export function useSubmitResult({onError,onResult,onSubmit,onSuccess,result,setResult}){
  let isMounted = useIsMounted();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  [result,setResult] = ((null == setResult) ? React.useState() : [result,setResult]);
  React.useEffect(function (){
    if(onResult){
      onResult(result);
    }
  },[result]);
  let {errored,onAction,setWaiting,waiting} = useSubmit({isMounted,onError,onSubmit,onSuccess,result,setResult});
  return {errored,isMounted,onAction,result,setResult,setWaiting,waiting,"onActionPress":function (){
      return errored ? setResult(null) : onAction();
    },"onActionReset":function (){
      return setResult(null);
    }};
}

// js.react/convertIndex [583] 
export function convertIndex({data,value,setValue,allowNotFound,valueFn = k.identity}){
  let forwardFn = function (idx){
    let out = data && data[idx || 0];
    return out ? valueFn(out) : null;
  };
  let reverseFn = function (label){
    let idx = xtd.arr_find(xtd.arr_map(data,valueFn),function (item){
      return item == label;
    });
    return allowNotFound ? idx : Math.max(0,idx);
  };
  let setIndex = function (idx){
    setValue(forwardFn(idx));
  };
  let index = reverseFn(value);
  let items = xtd.arr_map(data,valueFn);
  return {index,items,setIndex};
}

// js.react/convertModular [606] 
export function convertModular({data,value,setValue,valueFn = k.identity,indexFn}){
  let forwardFn = function (idx){
    let out = data && data[math.mod_pos(idx || 0,data.length)];
    return out ? valueFn(out) : null;
  };
  let reverseFn = function (label){
    let pval = indexFn();
    let nval = Math.max(0,xtd.arr_find(xtd.arr_map(data,valueFn),function (item){
      return item == label;
    }));
    let offset = math.mod_offset(pval,nval,data.length);
    return pval + offset;
  };
  let setIndex = function (idx){
    setValue(forwardFn(idx));
  };
  let index = reverseFn(value);
  let items = xtd.arr_map(data,valueFn);
  return {index,items,setIndex};
}

// js.react/convertIndices [639] 
export function convertIndices({data,values,setValues,valueFn = k.identity}){
  let forwardFn = function (indices){
    let out = [];
    for(let i = 0; i < indices.length; ++i){
      let e = indices[i];
      if(e){
        out.push(data[i]);
      }
    };
    return out;
  };
  let reverseFn = function (values){
    return xtd.arr_map(data,function (e){
      return 0 <= xtd.arr_find(values,function (item){
        return item == e;
      });
    });
  };
  let setIndices = function (indices){
    setValues(forwardFn(indices));
  };
  let indices = reverseFn(values);
  let items = xtd.arr_map(data,valueFn);
  return {indices,items,setIndices};
}

// js.react/convertPosition [665] 
export function convertPosition({length,max,min,step}){
  let divisions = Math.floor((max - min) / step);
  let unit = length / divisions;
  let forwardFn = function (value){
    let n = Math.floor((value - min) / step);
    return n * unit;
  };
  let reverseFn = function (pos){
    let relative = Math.max(0,Math.min(length,pos));
    let n = math.round(relative / unit);
    let out = min + (n * step);
    return out;
  };
  return {forwardFn,reverseFn};
}

// js.react/useChanging [685] 
export function useChanging(data,f,state){
  f = (f || xtd.first);
  data = (data || []);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  let [value,setValue] = state || React.useState(f(data));
  React.useEffect(function (){
    if(xtd.not_emptyp(data) && ((null == value) || (0 > xtd.arr_find(data,function (item){
      return item == value;
    })))){
      setValue(f(data));
    }
  },[JSON.stringify(data)]);
  return [value,setValue];
}

// js.react/useTree [702] 
export function useTree({branchesFn,displayFn,formatFn,initial,parents,root,setInitial,targetFn,tree}){
  branchesFn = (branchesFn || (function (tree,_parents,_root){
    if(tree){
      let out = xtd.obj_keys(tree);
      out.sort();
      return out;
    }
    else{
      return [];
    }
  }));
  targetFn = (targetFn || (function (tree,branch,_parents,_root){
    if(tree){
      return tree[branch];
    }
    else{
      return null;
    }
  }));
  let branches = branchesFn(tree,parents,root);
  let [branch,setBranch] = React.useState(initial || xtd.first(branches));
  let target = (tree && branch) ? targetFn(tree,branch,parents,root) : null;
  React.useEffect(function (){
    if((null != branch) && (null == target) && xtd.not_emptyp(branches) && targetFn(tree,xtd.first(branches),parents,root)){
      setBranch(xtd.first(branches));
    }
    if((null != branch) && setInitial && (initial != branch)){
      setInitial(branch);
    }
  },[branch,initial]);
  let view = displayFn(target,branch,parents,root);
  return {branch,branches,setBranch,view};
}