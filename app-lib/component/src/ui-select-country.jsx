import {Check,ChevronDown,ChevronUp,Users} from '@tamagui/lucide-icons'

import * as T from 'tamagui'

import React from 'react'

import * as ReactQuery from '@tanstack/react-query'

import * as sb from '@statstrade/edge/remote/util-supabase.jsx'

// statsui.basic.ui-select-country/list-countries [18] 
export function list_countries(){
  return sb.getClient().schema("szn_type").from("Country").select("*").order("title");
}

// statsui.basic.ui-select-country/SelectCountryBase [29] 
export function SelectCountryBase({value,onChange,queryFn = list_countries}){
  let countriesQuery = ReactQuery.useQuery({
    "queryKey":["list_countries"],
    "queryFn":queryFn,
    "enabled":true
  });
  let countries = (countriesQuery.data && countriesQuery.data.data) || [];
  let items = React.useMemo(function (){
    return countries.map(function (c,i){
      return (
        <T.Select.Item index={i} key={c.code} value={c.code}>
          <T.Select.ItemText>{c.title}</T.Select.ItemText>
          <T.Select.ItemIndicator marginLeft="auto"><Check size={16}/></T.Select.ItemIndicator>
        </T.Select.Item>);
    });
  },[countries]);
  return (
    <T.Select
      value={value || ""}
      onValueChange={onChange}
      disablePreventBodyScroll={true}>
      <T.Select.Trigger iconAfter={ChevronDown}><T.Select.Value placeholder="Select Country"/></T.Select.Trigger>
      <T.Select.Content zIndex={200000}>
        <T.Select.ScrollUpButton><ChevronUp size={20}/></T.Select.ScrollUpButton>
        <T.Select.Viewport
          animation="quick"
          animateOnly={["transform","opacity"]}
          enterStyle={{"opacity":0,"scale":0.9}}
          exitStyle={{"opacity":0,"scale":0.9}}
          minWidth={200}>
          <T.Select.Group>
            <T.Select.Label padding="$2" color="$color11" fontSize="$3">Countries</T.Select.Label>
            {items}
          </T.Select.Group>
        </T.Select.Viewport>
        <T.Select.ScrollDownButton><ChevronDown size={20}/></T.Select.ScrollDownButton>
      </T.Select.Content>
    </T.Select>);
}

// statsui.basic.ui-select-country/SelectCountry [86] 
export var SelectCountry = React.memo(SelectCountryBase);