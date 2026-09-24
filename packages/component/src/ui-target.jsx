import {Check,ChevronDown,ChevronUp} from '@tamagui/lucide-icons'

import React from 'react'

import * as T from 'tamagui'

import * as kd from '@xtalk/lang/common-data.js'

import * as ksort from '@xtalk/lang/common-sort-by.js'

import * as ui from '@statstrade/component/ui-common.jsx'

import * as ext_box from '@statstrade/edge/lib/js/react/ext-box.jsx'

// statsui.basic.ui-target/TargetAnchor [20] 
export function TargetAnchor({box,path,tag,title}){
  let anchorRef = React.useRef(null);
  let initRef = React.useRef(false);
  React.useEffect(function (){
    ext_box.mergeData(box,[...path,tag],{"instance":anchorRef,"title":title});
    [];
  });
  return (
    <T.View
      ref={anchorRef}
      collapsable={false}
      onLayout={function ({nativeEvent}){
          if(!initRef.current){
            let {layout,target} = nativeEvent;
            let {pageX,pageY} = layout;
            ext_box.setData(box,[...path,tag,"position"],{"x":pageX,"y":pageY});
            initRef.current = true;
          }
        }}/>);
}

// statsui.basic.ui-target/targetMeasure [54] 
export function targetMeasure(scroll,target,callback){
  if(target.instance.current){
    target.instance.current.measureLayout(scroll.instance.current,function (x,y,width,height){
      callback({height,width,x,y});
    });
  }
}

// statsui.basic.ui-target/targetScrollTo [75] 
export function targetScrollTo(box,pathScroll,pathTarget,offset){
  let scroll = ext_box.getData(box,pathScroll);
  let target = ext_box.getData(box,pathTarget);
  if(scroll && target){
    targetMeasure(scroll,target,function ({height,width,x,y}){
      scroll.instance.current.scrollTo({"y":y + scroll.position.y + (offset || 0),"animated":true});
    });
  }
}

// statsui.basic.ui-target/targetMeasureAll [99] 
export function targetMeasureAll(box,scroll,pathTargets){
  let targets = ext_box.getData(box,pathTargets);
  for(let [name,target] of Object.entries(targets)){
    targetMeasure(scroll,target,function ({height,width,x,y}){
      ext_box.setData(
        box,
        [...pathTargets,name,"position"],
        {"x":x,"y":y + scroll.position.y}
      );
    });
  };
}

// statsui.basic.ui-target/TargetScrollView [116] 
export function TargetScrollView({box,children,path,pathTargets,...props}){
  let scrollRef = React.useRef();
  React.useEffect(function (){
    let scroll = {"instance":scrollRef,"position":{"x":0,"y":0}};
    ext_box.setData(box,path,scroll);
    targetMeasureAll(box,scroll,pathTargets);
  });
  return (
    <T.ScrollView
      bottom={0}
      left={0}
      onScroll={function (e){
          ext_box.setData(box,[...path,"position"],e.nativeEvent.contentOffset);
          let scroll = ext_box.getData(box,path);
          targetMeasureAll(box,scroll,pathTargets);
        }}
      position="absolute"
      ref={scrollRef}
      right={0}
      scrollEventThrottle={true}
      {...props}>{children}
    </T.ScrollView>);
}

// statsui.basic.ui-target/useTargets [145] 
export function useTargets({box,meta,pathScroll,pathTargets}){
  let targets = ext_box.listenBox(box,pathTargets,meta);
  let scrollY = ext_box.listenBox(box,[...pathScroll,"position","y"]);
  let output = React.useMemo(function (){
    let posFn = function ([k,{position}]){
      return (position ? position.y : null);
    };
    let ordered = ksort.sort_by(kd.obj_pairs(targets),[posFn]);
    let positions = ordered.map(posFn);
    let current = null;
    for(let entry of ordered){
      let [name,target] = entry;
      if(((target.position ? target.position.y : null) || -1) <= scrollY){
        current = name;
      }
      else{
        break;
      }
    };
    if(!current && kd.not_emptyp(ordered)){
      current = ordered[0].name;
    }
    return {current,ordered,positions,scrollY};
  },[scrollY,targets]);
  return output;
}

// statsui.basic.ui-target/TargetNavBarIndicator [183] 
export function TargetNavBarIndicator({position}){
  return (
    <T.View
      transform={[{"translateX":position}]}
      animation="200ms"
      borderRadius={2}
      top={10}
      width="5px"
      background="$accent3"
      enterStyle={{"opacity":0,"scole":0.5}}
      opacity={0.7}
      exitStyle={{"opacity":0,"scole":0.5}}
      zIndex={-1}
      position="absolute"
      animateOnly={["transform"]}
      height="5px"
      left="-2px"/>);
}

// statsui.basic.ui-target/TargetNavBar [205] 
export function TargetNavBar({id,box,href,pathScroll,pathTargets,linkProps,...props}){
  let [position,setPosition] = React.useState(0);
  let meta = id ? {"nav.id":id} : null;
  let {current,ordered,positions,scrollY} = useTargets({box,meta,pathScroll,pathTargets});
  let targetRefs = React.useRef({});
  React.useEffect(function (){
    for(let [name,layout] of Object.entries(targetRefs.current)){
      if(name == current){
        let {width,x} = layout;
        setPosition(x + (width / 2));
      }
    };
  },[current]);
  let renderTarget = React.useCallback(function ([name,{title}]){
    return (
      <ui.ButtonLink
        buttonProps={{"hoverStyle":{"scale":1.05,"textDecoration":"none"}}}
        color="$color12"
        key={name}
        fontFamily="monospace"
        fontWeight={(name == current) ? "600" : "100"}
        fontSize="14px"
        anchorProps={{
            "onLayout":function ({nativeEvent}){
                      targetRefs.current[name] = nativeEvent.layout;
                    },
            "onPress":function (e){
                      targetScrollTo(box,pathScroll,[...pathTargets,name],2);
                    }
          }}
        backgroundColor="$color1"
        href={href + "#/" + name}
        height="2px"
        {...linkProps}>{title}
      </ui.ButtonLink>);
  },[current,box,href,linkProps,pathScroll,pathTargets]);
  return !kd.is_emptyp(ordered) ? (
    <T.XStack gap="$1" {...props}>
      <TargetNavBarIndicator position={position}/>
      {ordered.map(renderTarget)}
    </T.XStack>) : null;
}

// statsui.basic.ui-target/TargetDropdown [264] 
export function TargetDropdown({id,box,pathScroll,pathTargets,...props}){
  let meta = id ? {"nav.id":id} : null;
  let {current,ordered,positions,scrollY} = useTargets({box,meta,pathScroll,pathTargets});
  let renderTarget = React.useCallback(function ([name,{title}]){
    return (
      <T.Select.Item
        key={name}
        value={name}
        cursor="pointer"
        hoverStyle={{"backgroundColor":"$color02","opacity":0.8}}>
        <T.Select.ItemText
          color="$accent11"
          fontSize="13px"
          hoverStyle={{"opacity":0.8,"scale":1.02}}
          pressStyle={{"scale":0.98}}>{title}
        </T.Select.ItemText>
        <T.Select.ItemIndicator><Check size={20} color="$accent11"/></T.Select.ItemIndicator>
      </T.Select.Item>);
  },[]);
  return !kd.is_emptyp(ordered) ? (
    <T.Select
      value={current}
      onValueChange={function (name){
          targetScrollTo(box,pathScroll,[...pathTargets,name],2);
        }}>
      <T.Select.Trigger
        width={150}
        paddingVertical={7}
        marginHorizontal={0}
        backgroundColor="$background0"
        borderColor="$accent11"
        iconAfter={(
            <ChevronDown size={20} color="$accent11"/>)}
        hoverStyle={{"borderColor":"$accent11","color":"$accent11","scale":1.02}}
        pressStyle={{"borderColor":"$accent11","color":"$accent11","scale":0.98}}><T.Select.Value color="$accent11" fontSize="13px"/>
      </T.Select.Trigger>
      <T.Select.Content>
        <T.Select.ScrollUpButton
          alignItems="center"
          justifyContent="center"
          width="100%"
          height="$3">
          <T.YStack><ChevronUp size={20} color="$accent11"/></T.YStack>
        </T.Select.ScrollUpButton>
        <T.Select.Viewport marginTop={5} width={150} borderColor="$accent11">
          <T.Select.Group>{ordered.map(renderTarget)}</T.Select.Group>
        </T.Select.Viewport>
        <T.Select.ScrollDownButton
          alignItems="center"
          justifyContent="center"
          width="100%"
          height="$3">
          <T.YStack><ChevronDown size={20} color="$accent11"/></T.YStack>
        </T.Select.ScrollDownButton>
      </T.Select.Content>
    </T.Select>) : null;
}