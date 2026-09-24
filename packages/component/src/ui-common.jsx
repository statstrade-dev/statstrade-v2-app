import Color from 'color'

import {Check,House,Menu,Moon,Sun} from '@tamagui/lucide-icons'

import * as T from 'tamagui'

import * as TToast from '@tamagui/toast'

import * as TToken from '@tamagui/get-token'

import * as ReactNative from 'react-native'

import RNVideo from 'react-native-video'

import React from 'react'

import * as kd from '@xtalk/lang/common-data.js'

import * as k from '@xtalk/lang/common-lib.js'

// statsui.basic.ui-common/t [21] 
export var t = k.identity;

// statsui.basic.ui-common/useWindowDimensions [24] 
export var useWindowDimensions = ReactNative.useWindowDimensions;

// statsui.basic.ui-common/Pressable [28] 
export var Pressable = ReactNative.Pressable;

// statsui.basic.ui-common/Badge [32] 
export function Badge({
  color = "$color1",
  backgroundColor = "$color12",
  children,
  icon,
  ...props
}){
  return (
    <T.XStack
      alignContent="center"
      backgroundColor={backgroundColor}
      borderRadius="$3"
      color={color}
      gap="$2"
      paddingHorizontal="$4"
      paddingVertical="$2"
      {...props}>
      {icon ? React.createElement(icon,{"color":color,"height":12,"width":12}) : null}
      <T.Text color={color} fontSize="$1">{children}</T.Text>
    </T.XStack>);
}

// statsui.basic.ui-common/patchDiff [59] 
export function patchDiff(before,diff){
  let out = {...before};
  for(let [key,op] of Object.entries(diff)){
    let [opsym,opval] = op;
    if((opsym == "+") || (opsym == "%")){
      out[key] = opval;
    }
    else if(opsym == "-"){
      delete out[key];
    }
    else if(opsym == ">"){
      out[key] = patchDiff(out[key] || {},opval);
    }
  };
  return out;
}

// statsui.basic.ui-common/patchDiffs [81] 
export function patchDiffs(diffs,init = {}){
  return diffs.reduce(patchDiff,init);
}

// statsui.basic.ui-common/getColor [87] 
export function getColor(s){
  let h = 0;
  let i = 0;
  while(i < s.length){
    h = (s.charCodeAt(i) + ((h << 5) - h));
    i = (i + 1);
  }
  let colors = [
    "$red10",
    "$orange10",
    "$yellow10",
    "$green10",
    "$blue10",
    "$purple10",
    "$pink10",
    "$indigo10"
  ];
  return colors[Math.abs(h)];
}

// statsui.basic.ui-common/useRemoteCheck [104] 
export function useRemoteCheck({form,field,value,check_fn,message,current_value}){
  React.useEffect(function (){
    if(value && (value.length > 2)){
      if(current_value && (value == current_value)){
        form.clearErrors(field);
        return;
      }
      form.clearErrors(field);
      let timer = setTimeout(async function (){
        try{
          let res = await check_fn(value);
          if(res){
            form.setError(field,{"type":"manual","message":message});
          }
          else{
            form.clearErrors(field);
          }
        }
        catch(e){
          console.error(e);
        }
      },500);
      return function (){
        clearTimeout(timer);
      };
    }
  },[value,current_value]);
  return;
}

// statsui.basic.ui-common/wrapCheck [131] 
export function wrapCheck(checkFn,returnFn = (function (out){
  return !out;
}),successFn = k.F){
  let prev = null;
  return async function check(current){
    if(prev == current){
      return true;
    }
    prev = current;
    if(successFn()){
      return true;
    }
    let {data,error} = await checkFn(current);
    if(!error){
      return !data;
    }
    return true;
  };
}

// statsui.basic.ui-common/useThemeColors [157] 
export function useThemeColors(colors){
  let theme = T.useTheme();
  return React.useMemo(function (){
    return kd.arr_foldl(colors,function (obj,color){
      let [key,token] = color;
      let val = Color(
        token.startsWith("$") ? kd.get_in(theme,[token,"val"]) : token
      );
      if(val){
        obj[key] = val;
      }
      return obj;
    },{});
  },[theme,colors]);
}

// statsui.basic.ui-common/Link [185] 
export var Link = T.styled(T.Anchor,{
  "textDecorationLine":"none",
  "cursor":"pointer",
  "hoverStyle":{"textDecorationLine":"underline"}
});

// statsui.basic.ui-common/dynamicInput [216] 
export var dynamicInput = React.lazy;

// statsui.basic.ui-common/Image [238] 
export function Image({origWidth = 1,origHeight = 1,source,containerProps,...props}){
  let [width,setWidth] = React.useState(0);
  let height = (width * origHeight) / origWidth;
  let handleLayout = function (e){
    let {width} = e.nativeEvent.layout;
    setWidth(width);
  };
  return (
    <T.View
      flex={1}
      height={height}
      onLayout={handleLayout}
      width={width}
      {...containerProps}>
      <ReactNative.Image
        source={source}
        style={{
            "bottom":0,
            "height":height,
            "left":0,
            "position":"absolute",
            "right":0,
            "top":0,
            "width":width
          }}
        {...props}/>
    </T.View>);
}

// statsui.basic.ui-common/Video [263] 
export function Video({
  origWidth = 1,
  origHeight = 1,
  style,
  source,
  containerProps,
  ...props
}){
  let [width,setWidth] = React.useState(0);
  let height = (width * origHeight) / origWidth;
  let handleLayout = function (e){
    let {width} = e.nativeEvent.layout;
    setWidth(width);
  };
  return (
    <T.View
      flex={1}
      height={height}
      onLayout={handleLayout}
      width={width}
      {...containerProps}>
      <RNVideo
        source={source}
        style={{"height":height,"width":width,...style}}
        {...props}/>
    </T.View>);
}

// statsui.basic.ui-common/Tooltip [287] 
export function Tooltip({children,noArrow,hide,content,contentProps,...props}){
  return (
    <T.Tooltip delay={0} restMs={10} {...props}>
      <T.Tooltip.Trigger asChild={true}>{children}</T.Tooltip.Trigger>
      {!hide ? (
        <T.Tooltip.Content
          y={-2}
          animation={["quick",{"opacity":{"overshootClamping":true}}]}
          scale={0.8}
          enterStyle={{"opacity":0,"scale":0.3,"x":0,"y":5}}
          opacity={1}
          exitStyle={{"opacity":0,"scale":0.3,"x":0,"y":5}}
          zIndex={1000000000000}
          x={0}
          backgroundColor="$color1"
          {...contentProps}>
          {!noArrow ? (
            <T.Tooltip.Arrow/>) : null}
          {k.is_stringp(content) ? (
            <T.Text>{content}</T.Text>) : content}
        </T.Tooltip.Content>) : null}
    </T.Tooltip>);
}

// statsui.basic.ui-common/withTooltip [317] 
export function withTooltip(tooltip,tooltipProps,element){
  return tooltip ? (
    <Tooltip content={tooltip} {...tooltipProps}>{element}</Tooltip>) : element;
}

// statsui.basic.ui-common/Pad [331] 
export function Pad(props){
  return (
    <T.View flex={1} {...props}/>);
}

// statsui.basic.ui-common/Horizontal [346] 
export function Horizontal(props){
  return (
    <T.XStack
      borderBottomWidth={1}
      borderColor="$color2"
      flex={1}
      height={1}
      width="100%"
      {...props}/>);
}

// statsui.basic.ui-common/HorizontalText [355] 
export function HorizontalText({text,textProps,borderColor = "$color2",...props}){
  return (
    <T.XStack
      alignItems="center"
      gap="$5"
      justifyContent="center"
      marginVertical="$5"
      {...props}>
      <T.XStack
        height={1}
        flex={1}
        borderColor={borderColor}
        borderBottomWidth={1}/>
      <T.H6 fontSize="$4" {...textProps}>{text}</T.H6>
      <T.XStack
        height={1}
        flex={1}
        borderColor={borderColor}
        borderBottomWidth={1}/>
    </T.XStack>);
}

// statsui.basic.ui-common/BUTTON_HOVER_SCALE [382] 
export var BUTTON_HOVER_SCALE = 1.02;

// statsui.basic.ui-common/BUTTON_HOVER_OPACITY [383] 
export var BUTTON_HOVER_OPACITY = 1.0;

// statsui.basic.ui-common/BUTTON_PRESS_SCALE [384] 
export var BUTTON_PRESS_SCALE = 0.98;

// statsui.basic.ui-common/BUTTON_PRESS_OPACITY [385] 
export var BUTTON_PRESS_OPACITY = 0.9;

// statsui.basic.ui-common/BUTTON_ANIMATION [386] 
export var BUTTON_ANIMATION = "quick";

// statsui.basic.ui-common/ButtonNormal [388] 
export function ButtonNormal({
  color = "$color12",
  backgroundColor = "$color3",
  fade = 0.1,
  tooltip,
  tooltipProps,
  ...props
}){
  let colors = useThemeColors([["primary",color],["secondary",backgroundColor]]);
  let primaryColor = colors.primary.string();
  let secondaryColor = colors.secondary.string();
  return withTooltip(tooltip,tooltipProps,(
    <T.Button
      animation={BUTTON_ANIMATION}
      color={primaryColor}
      pressStyle={{
          "backgroundColor":secondaryColor,
          "color":primaryColor,
          "opacity":BUTTON_PRESS_OPACITY,
          "scale":BUTTON_PRESS_SCALE
        }}
      hoverStyle={{
          "backgroundColor":secondaryColor,
          "color":primaryColor,
          "filter":"brightness(1.1)",
          "opacity":BUTTON_HOVER_OPACITY,
          "scale":BUTTON_HOVER_SCALE
        }}
      borderWidth={0}
      size="$4"
      disabledStyle={{
          "backgroundColor":secondaryColor,
          "color":primaryColor,
          "opacity":0.4,
          "scale":1
        }}
      fontSize="15px"
      backgroundColor={secondaryColor}
      {...props}/>));
}

// statsui.basic.ui-common/ButtonContrast [428] 
export function ButtonContrast({
  color = "$color12",
  backgroundColor = "$color1",
  fade = 0.1,
  tooltip,
  tooltipProps,
  ...props
}){
  let colors = useThemeColors([["primary",color],["background",backgroundColor]]);
  let primaryColor = colors.primary.fade(0.2).string();
  let borderColor = color;
  let hoverColor = backgroundColor;
  return withTooltip(tooltip,tooltipProps,(
    <T.Button
      color={primaryColor}
      pressStyle={{
          "borderColor":borderColor,
          "color":primaryColor,
          "opacity":BUTTON_PRESS_OPACITY
        }}
      variant="outlined"
      borderColor={borderColor}
      hoverStyle={{
          "backgroundColor":hoverColor,
          "borderColor":borderColor,
          "color":primaryColor,
          "filter":"brightness(1.1)",
          "opacity":BUTTON_HOVER_OPACITY,
          "scale":BUTTON_HOVER_SCALE
        }}
      borderWidth={1}
      size="$4"
      disabledStyle={{
          "borderColor":primaryColor,
          "color":primaryColor,
          "opacity":0.7,
          "scale":1
        }}
      fontSize="15px"
      {...props}/>));
}

// statsui.basic.ui-common/ButtonOutlined [469] 
export function ButtonOutlined({
  color = "$color11",
  backgroundColor = "$color1",
  fade = 0.1,
  tooltip,
  tooltipProps,
  ...props
}){
  let colors = useThemeColors([["primary",color],["background",backgroundColor]]);
  let primaryColor = colors.primary.fade(0.2).string();
  let borderColor = colors.primary.fade(0.9).string();
  let hoverColor = colors.background.fade(0.6).string();
  return withTooltip(tooltip,tooltipProps,(
    <T.Button
      color={primaryColor}
      pressStyle={{
          "borderColor":borderColor,
          "color":primaryColor,
          "opacity":BUTTON_PRESS_OPACITY
        }}
      variant="outlined"
      scale={BUTTON_HOVER_SCALE}
      borderColor={borderColor}
      borderWidth={1}
      size="$4"
      filter="brightness(1.1)"
      opacity={BUTTON_HOVER_OPACITY}
      disabledStyle={{
          "borderColor":primaryColor,
          "color":primaryColor,
          "opacity":0.7,
          "scale":1
        }}
      fontSize="15px"
      backgroundColor={hoverColor}
      {...props}/>));
}

// statsui.basic.ui-common/ButtonInverse [507] 
export function ButtonInverse({
  color = "$color11",
  backgroundColor = "$color1",
  tooltip,
  tooltipProps,
  ...props
}){
  let colors = useThemeColors([["primary",color],["text",backgroundColor]]);
  let colorPrimary = colors.primary.string();
  let colorText = colors.text.string();
  return withTooltip(tooltip,tooltipProps,(
    <T.Button
      animation={BUTTON_ANIMATION}
      color="$color1"
      pressStyle={{
          "backgroundColor":colorPrimary,
          "color":colorText,
          "opacity":BUTTON_PRESS_OPACITY,
          "scale":BUTTON_PRESS_SCALE
        }}
      hoverStyle={{
          "backgroundColor":colorPrimary,
          "color":colorText,
          "filter":"brightness(1.1)",
          "opacity":BUTTON_HOVER_OPACITY,
          "scale":BUTTON_HOVER_SCALE
        }}
      size="$4"
      disabledStyle={{"opacity":0.3,"scale":1}}
      fontSize="15px"
      backgroundColor={colorPrimary}
      {...props}/>));
}

// statsui.basic.ui-common/ButtonLink [539] 
export function ButtonLink({
  href = "#",
  active,
  disabled,
  children,
  anchorProps,
  onPress,
  tooltip,
  tooltipProps,
  ...props
}){
  return withTooltip(tooltip,tooltipProps,(
    <T.Anchor
      hoverStyle={{
          "cursor":disabled ? "text" : "painter",
          "textDecorationLine":"underline"
        }}
      href={href || "#"}
      textDecorationLine="none"
      width="fit-content"
      disabled={disabled}
      {...anchorProps}>
      <T.Button
        animation={BUTTON_ANIMATION}
        color={disabled ? "$color7" : "$color10"}
        pressStyle={{"scale":BUTTON_PRESS_SCALE}}
        disabled={disabled}
        variant="outlined"
        borderWidth={0}
        size="$4"
        fontWeight="400"
        fontSize="15px"
        onPress={onPress}
        {...props}>{children}
      </T.Button>
    </T.Anchor>));
}

// statsui.basic.ui-common/ButtonSwitch [577] 
export function ButtonSwitch({
  checked,
  setChecked,
  color,
  iconOn,
  iconOff,
  backgroundColor,
  onViewProps,
  offViewProps,
  tooltip,
  tooltipProps,
  size = "$8",
  ...props
}){
  let thumbSize = T.getVariableValue(TToken.getSize(size));
  let iconSize = 0.4 * thumbSize;
  return withTooltip(tooltip,tooltipProps,(
    <ReactNative.Pressable
      onPress={function (){
          setChecked(!checked);
        }}
      style={{"height":thumbSize,"width":thumbSize}}>
      <T.View
        borderRadius="$10"
        overflow="hidden"
        shadowRadius="$4"
        shadowOpacity={0.5}
        flex={1}
        justifyContent="center"
        backgroundColor={backgroundColor}
        shadowOffset={{"height":0,"width":"$4"}}
        alignItems="center"
        margin="$1"
        {...props}>
        <T.AnimatePresence exitBeforeEnter={true} custom={{"direction":-1}}>
          <T.YStack
            transform={[
                {"scale":!checked ? 1 : 0},
                {"translateX":!checked ? 0 : thumbSize}
              ]}
            animation="200ms"
            key="on"
            width="full"
            justifyContent="center"
            opacity={checked ? 0 : 1}
            position="absolute"
            backgroundColor={backgroundColor}
            height="full"
            alignItems="center"
            {...onViewProps}>
            {React.createElement(iconOn,{"size":iconSize,"color":color})}
          </T.YStack>
          <T.YStack
            transform={[
                {"scale":checked ? 1 : 0},
                {"translateX":checked ? 0 : (-thumbSize)},
                {"rotate":checked ? "0deg" : "-90deg"}
              ]}
            animation="200ms"
            key="off"
            width="full"
            justifyContent="center"
            position="absolute"
            height="full"
            alignItems="center"
            {...offViewProps}>
            {React.createElement(iconOff,{"size":iconSize,"color":color})}
          </T.YStack>
        </T.AnimatePresence>
      </T.View>
    </ReactNative.Pressable>));
}

// statsui.basic.ui-common/HomeAction [656] 
export function HomeAction({href,tooltipProps,...props}){
  return (
    <Link href={href || "/"} cursor="pointer" marginTop={5} padding={0}><House color="$color12" {...props}/></Link>);
}

// statsui.basic.ui-common/ThemeGlobalContext [676] 
export var ThemeGlobalContext = React.createContext(null);

// statsui.basic.ui-common/useThemeGlobal [679] 
export function useThemeGlobal(){
  return React.useContext(ThemeGlobalContext);
}

// statsui.basic.ui-common/ApiContext [686] 
export var ApiContext = React.createContext(null);

// statsui.basic.ui-common/useApiContext [688] 
export function useApiContext(){
  return React.useContext(ApiContext);
}

// statsui.basic.ui-common/ThemeSwitch [694] 
export function ThemeSwitch({...props}){
  let {current,setCurrent} = useThemeGlobal();
  let changed = React.useMemo(function (){
    return (current == "light") ? "dark" : "light";
  },[current]);
  return (
    <ButtonSwitch
      checked={"dark" == current}
      color="$color12"
      iconOff={Moon}
      iconOn={Sun}
      opacity={(current == "light") ? 1 : 1}
      setChecked={function (){
          setCurrent(changed);
        }}
      size="$6"
      {...props}/>);
}

// statsui.basic.ui-common/Checkbox [725] 
export function Checkbox({tooltip,tooltipProps,...props}){
  return withTooltip(tooltip,tooltipProps,(
    <T.Checkbox {...props}><T.Checkbox.Indicator><Check/></T.Checkbox.Indicator></T.Checkbox>));
}

// statsui.basic.ui-common/PopoverMenu [744] 
export function PopoverMenu({
  open,
  onOpenChange,
  icon,
  button,
  buttonProps,
  contentProps,
  arrowProps,
  triggerProps,
  children,
  ...props
}){
  return (
    <T.Popover
      allowFlip={true}
      onOpenChange={onOpenChange}
      open={open}
      resize={true}
      size="$6"
      stayInFrame={true}
      {...props}>
      <T.PopoverTrigger asChild={true} {...triggerProps}>
        {button || (
          <T.Button icon={icon} {...buttonProps}/>)}
      </T.PopoverTrigger>
      <T.PopoverContent
        elevation={5}
        animation={["quick",{"opacity":{"overshootClamping":true}}]}
        borderColor="$borderColor"
        borderWidth={1}
        enterStyle={{"opacity":0,"y":-10}}
        elevate={true}
        padding="$4"
        exitStyle={{"opacity":0,"y":-10}}
        {...contentProps}>
        <T.PopoverArrow borderColor="$borderColor" borderWidth={1} {...arrowProps}/>
        {children}
      </T.PopoverContent>
    </T.Popover>);
}

// statsui.basic.ui-common/Dropdown [786] 
export function Dropdown({
  value,
  itemProps,
  triggerProps,
  viewportProps,
  valueprops,
  renderValue,
  options,
  ...props
}){
  let renderTarget = React.useCallback(function (item){
    let name = null;
    let icon = null;
    let title = null;
    if(Array.isArray(item)){
      [name,{icon,title}] = item;
    }
    else{
      [{icon,id,label}] = [item];
      name = id;
      title = label;
      if(!name && item.value){
        name = item.value;
      }
      if(!title && item.text){
        title = item.text;
      }
    }
    return (
      <T.Select.Item
        alignItems="center"
        cursor="pointer"
        hoverStyle={{"backgroundColor":"$color02","opacity":0.8}}
        key={name}
        value={name}
        {...itemProps}>
        <T.XStack gap="$2" alignItems="center" justifyContent="center">
          {icon}
          {title ? (
            <T.Select.ItemText
              color="$color"
              fontSize="10px"
              fontWeight="600"
              hoverStyle={{"opacity":0.8,"scale":1.02}}
              pressStyle={{"scale":0.98}}>{title}
            </T.Select.ItemText>) : null}
        </T.XStack>
        <T.Select.ItemIndicator><Check size={20} color="$color"/></T.Select.ItemIndicator>
      </T.Select.Item>);
  },[]);
  return (
    <T.Select
      alignItems="start"
      justifyContent="start"
      value={value}
      {...props}>
      <T.Select.Trigger {...triggerProps}>
        {renderValue ? React.createElement(renderValue,{value}) : (
          <T.Select.Value color="$color" fontSize="13px"/>)}
      </T.Select.Trigger>
      <T.Select.Content>
        <T.Select.Viewport {...viewportProps}>
          <T.Select.Group>{options.map(renderTarget)}</T.Select.Group>
        </T.Select.Viewport>
      </T.Select.Content>
    </T.Select>);
}

// statsui.basic.ui-common/useToastController [856] 
export var useToastController = TToast.useToastController;

// statsui.basic.ui-common/Toast [859] 
export function Toast({event,...props}){
  let toast = TToast.useToastController();
  let {width} = ReactNative.useWindowDimensions();
  if(!event || event.isHandledNatively){
    return null;
  }
  return (
    <TToast.Toast
      transform={[{"translateY":-20}]}
      animation="bouncy"
      key={event.id}
      maxWidth="1000px"
      borderRadius="20px"
      scale={1}
      borderColor="$borderColor"
      minWidth="250px"
      width={width * 0.9}
      flex={1}
      duration={event.duration}
      borderWidth={1}
      enterStyle={{"opacity":0,"transform":[{"translateY":0}]}}
      opacity={0.98}
      themeInverse={true}
      exitStyle={{"opacity":0,"transform":[{"translateY":0}]}}
      viewPortName={event.viewportName}
      backgroundColor="$white12"
      minHeight="150px">
      <ReactNative.Pressable
        flex={1}
        width="100%"
        height="100%"
        onPress={function (){
            toast.hide();
          }}>
        <T.View flex={1} width="100%" height="100%" backgroundColor="red">
          <T.YStack flex={1} width="100%" height="100%">
            <T.XStack flex={1} width="100%" height="100%">
              <TToast.Toast.Title>{event.title}</TToast.Toast.Title>
              <ReactNative.View style={{"flex":1}}/>
              <TToast.Toast.Description>{new Date().toLocaleTimeString()}</TToast.Toast.Description>
            </T.XStack>
            {event.message ? (
              <TToast.Toast.Description>{event.message}</TToast.Toast.Description>) : null}
          </T.YStack>
        </T.View>
      </ReactNative.Pressable>
    </TToast.Toast>);
}

// statsui.basic.ui-common/Dialog [925] 
export function Dialog({
  title,
  description,
  open,
  onOpenChange,
  children,
  contentProps,
  descriptionProps,
  focusProps,
  overlayProps,
  titleProps,
  ...props
}){
  return (
    <T.Dialog onOpenChange={onOpenChange} open={open} {...props}>
      <T.DialogPortal>
        <T.DialogOverlay
          animateOnly={["transform","opacity"]}
          animation={["quicker",{"opacity":{"overshootClamping":true}}]}
          backgroundColor="$shadow6"
          enterStyle={{"opacity":0}}
          exitStyle={{"opacity":0}}
          key="overlay"
          {...overlayProps}/>
        <T.Dialog.FocusScope focusOnIdle={true} {...focusProps}>
          <T.DialogContent
            animation={["quicker",{"opacity":{"overshootClamping":true}}]}
            key="content"
            borderRadius="$6"
            top={80}
            overflow="hidden"
            onPointerDownOutside={function (e){
                e.preventDefault();
              }}
            enterStyle={{"opacity":0,"x":0,"y":20}}
            elevate={true}
            padding={0}
            gap="$4"
            exitStyle={{"opacity":0,"x":0,"y":10}}
            position="fixed"
            animateOnly={["transform","opacity"]}
            margin={0}
            {...contentProps}>
            <T.XStack
              backgroundColor="$accent11"
              height="50px"
              paddingHorizontal="$4"
              alignItems="center">
              {title ? (
                <T.H4 color="$color1" {...titleProps}>{title}</T.H4>) : null}
            </T.XStack>
            <T.YStack paddingHorizontal="$4" paddingBottom="$3">
              {description ? (
                <T.H5 {...descriptionProps}>{description}</T.H5>) : null}
              {children}
            </T.YStack>
          </T.DialogContent>
        </T.Dialog.FocusScope>
      </T.DialogPortal>
    </T.Dialog>);
}

// statsui.basic.ui-common/DialogConfirm [988] 
export function DialogConfirm({
  onConfirm,
  onCancel,
  confirmLabel,
  cancelLabel,
  confirmColor,
  ...props
}){
  return (
    <Dialog onOpenChange={onCancel} {...props}>
      <T.XStack gap="$3" marginTop="$4" justifyContent="flex-end">
        <ButtonNormal onPress={onCancel} size="$3">{cancelLabel || "Cancel"}</ButtonNormal>
        <ButtonNormal
          onPress={onConfirm}
          size="$3"
          backgroundColor={confirmColor || "$red10"}
          borderColor={confirmColor || "$red10"}
          hoverStyle={{"backgroundColor":"$red11","borderColor":"$red11"}}
          pressStyle={{"backgroundColor":"$red9","borderColor":"$red9"}}
          color="white">{confirmLabel || "Confirm"}
        </ButtonNormal>
      </T.XStack>
    </Dialog>);
}