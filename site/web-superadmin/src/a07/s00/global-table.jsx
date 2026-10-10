import * as ReactNative from 'react-native'

import * as ext_table from '@statstrade/edge/lib/js/react/ext-table.js'

import * as ext_model from '@statstrade/edge/lib/js/react/ext-model.js'

// statstrade-superadmin.a07.s00.global-table/tableImpl [9] 
export function tableImpl(table,fields){
  let spec = [table,{"data":fields}];
  return {
    "base":{"list":{"spec":spec},"data":{"spec":spec}},
    "call":{},
    "cached":{}
  };
}

// statstrade-superadmin.a07.s00.global-table/useTableRows [18] 
export function useTableRows(table,fields,context){
  let impl = tableImpl(table,fields);
  let view = ext_table.useListView(impl,"data",{"defaultArgs":[],"defaultOutput":[]},context,{});
  let rows = ext_model.listenSuccess(view,[],{"remote":"always","default":[]});
  return {rows,view};
}

// statstrade-superadmin.a07.s00.global-table/TableList [36] 
export function TableList({title,subtitle,rows}){
  let records = rows || [];
  let cards = records.map(function (row){
    return (
      <ReactNative.View
        key={row["id"]}
        style={{"paddingVertical":10,"borderBottomWidth":1}}>
        <ReactNative.Text style={{"fontWeight":"600"}}>
          {row["title"] || row["name"] || row["key"] || row["code"] || row["id"]}
        </ReactNative.Text>
        <ReactNative.Text style={{"fontFamily":"monospace","fontSize":12}}>{JSON.stringify(row)}</ReactNative.Text>
      </ReactNative.View>);
  });
  return (
    <ReactNative.View style={{"flex":1,"padding":12}}>
      <ReactNative.Text style={{"fontSize":20,"fontWeight":"700","marginBottom":4}}>{title}</ReactNative.Text>
      <ReactNative.Text style={{"fontSize":12,"opacity":0.7,"marginBottom":12}}>{subtitle || ""}</ReactNative.Text>
      {(records.length > 0) ? cards : (
        <ReactNative.Text style={{"paddingVertical":12}}>No records found.</ReactNative.Text>)}
    </ReactNative.View>);
}