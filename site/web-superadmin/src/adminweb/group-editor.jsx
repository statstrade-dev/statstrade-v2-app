import React from 'react'

import * as T from 'tamagui'

// statstrade-superadmin.adminweb.group-editor/fieldValues [9] 
export function fieldValues(row,fields){
  let out = {};
  fields.forEach(function (field){
    let value = row[field];
    if((field == "value_json") && ((typeof value) == "string")){
      try{
        value = JSON.parse(value);
      }
      catch(_){
        null;
      }
    }
    out[field] = ((field == "value_json") ? JSON.stringify(value,null,2) : (row[field] || ""));
  });
  return out;
}

// statstrade-superadmin.adminweb.group-editor/changes [21] 
export function changes(original,values,fields){
  let out = {};
  fields.forEach(function (field){
    if(!(original[field] == values[field])){
      out[field] = values[field];
    }
  });
  return out;
}

// statstrade-superadmin.adminweb.group-editor/searchRows [28] 
export function searchRows(rows,query,fields){
  let text = query.trim().toLowerCase();
  return rows.filter(function (row){
    return fields.some(function (field){
      return String(row[field] || "").toLowerCase().includes(text);
    });
  });
}

// statstrade-superadmin.adminweb.group-editor/useRecordEditor [34] 
export function useRecordEditor(rows,id_field,fields){
  let [selected_id,set_selected] = React.useState(null);
  let [base,set_base] = React.useState(null);
  let [values,set_values] = React.useState(null);
  let [pending,set_pending] = React.useState(null);
  let selected = selected_id || ((rows.length > 0) ? rows[0][id_field] : null);
  let row = rows.find(function (item){
    return item[id_field] == selected;
  });
  let original = base ? fieldValues(base,fields) : {};
  let dirty = values && (Object.keys(changes(original,values,fields)).length > 0);
  let adopt = function (record){
    set_base(record ? JSON.parse(JSON.stringify(record)) : null);
    set_values(record ? fieldValues(record,fields) : null);
  };
  React.useEffect(function (){
    if(!dirty || !values){
      if(row){
        adopt(row);
      }
      else{
        set_selected((rows.length > 0) ? rows[0][id_field] : null);
        adopt((rows.length > 0) ? rows[0] : null);
      }
    }
  },[JSON.stringify(rows),selected,values == null]);
  let choose = function (id){
    if(dirty){
      set_pending(id);
    }
    else{
      set_selected(id);
      adopt(rows.find(function (item){
        return item[id_field] == id;
      }));
    }
  };
  let discard = function (){
    let id = pending || selected;
    set_pending(null);
    set_selected(id);
    adopt(rows.find(function (item){
      return item[id_field] == id;
    }));
  };
  return {
    "selected":selected,
    "values":values || {},
    "cancel":function (){
        set_pending(null);
      },
    "discard":discard,
    "dirty":dirty,
    "base":base,
    "accept":function (){
        set_values(null);
      },
    "patch":changes(original,values || {},fields),
    "choose":choose,
    "row":row,
    "set":function (field,value){
        let next = Object.assign({},values);
        next[field] = value;
        set_values(next);
      },
    "pending":pending
  };
}

// statstrade-superadmin.adminweb.group-editor/SelectionPrompt [68] 
export function SelectionPrompt({editor}){
  return editor["pending"] ? (
    <T.YStack gap="$2" accessibilityRole="alert">
      <T.Text>Discard unsaved changes and switch records?</T.Text>
      <T.XStack gap="$2">
        <T.Button onPress={editor["discard"]}>Discard and switch</T.Button>
        <T.Button onPress={editor["cancel"]}>Keep editing</T.Button>
      </T.XStack>
    </T.YStack>) : null;
}

// statstrade-superadmin.adminweb.group-editor/PageStatus [76] 
export function PageStatus({page}){
  return (
    <T.YStack gap="$2" padding="$4">
      <T.Text accessibilityLiveRegion="polite">
        {(page["status"] == "loading") ? "Loading records…" : "Unable to load records."}
      </T.Text>
      {page["error"] ? (
        <T.Text accessibilityRole="alert" color="$red10">{page["error"]}</T.Text>) : null}
      {(page["status"] == "error") ? (
        <T.Button
          onPress={function (){
              page["controller"].start();
            }}>Retry
        </T.Button>) : null}
    </T.YStack>);
}

// statstrade-superadmin.adminweb.group-editor/PageMessages [84] 
export function PageMessages({page}){
  return (
    <T.YStack gap="$2">
      {page["notice"] ? (
        <T.Text accessibilityLiveRegion="polite">{page["notice"]}</T.Text>) : null}
      {page["error"] ? (
        <T.Text accessibilityRole="alert" color="$red10">{page["error"]}</T.Text>) : null}
    </T.YStack>);
}