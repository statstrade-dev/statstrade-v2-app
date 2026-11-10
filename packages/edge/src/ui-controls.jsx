import React from 'react'

// statsui.edge.ui-controls/useControls [5] 
export function useControls(declarations){
  let names = declarations.map(function (entry){
    return Array.isArray(entry) ? entry[0] : entry;
  });
  let signature = JSON.stringify(names);
  let [values,setValues] = React.useState(function (){
    let initial = {};
    declarations.forEach(function (entry){
      initial[Array.isArray(entry) ? entry[0] : entry] = (Array.isArray(entry) ? entry[1] : null);
    });
    return initial;
  });
  let setters = React.useMemo(function (){
    let result = {};
    names.forEach(function (name){
      let setter = "set" + name.charAt(0).toUpperCase() + name.slice(1);
      result[setter] = (function (value){
        setValues(function (previous){
          let next = Object.assign({},previous);
          next[name] = (((typeof value) == "function") ? value(previous[name]) : value);
          return next;
        });
      });
    });
    return result;
  },[signature]);
  return Object.assign({},values,setters);
}