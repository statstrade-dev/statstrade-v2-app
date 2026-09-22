import {Check,CircleAlert} from '@tamagui/lucide-icons'

import React from 'react'

import * as T from 'tamagui'

import * as kd from '@xtalk/lang/common-data.js'

import * as hook_form from '@statstrade/edge/lib/js/lib/react-hook-form.jsx'

import * as k from '@xtalk/lang/common-lib.js'

import * as ui from '@statstrade/component/ui-common.jsx'

import * as str from '@xtalk/lang/common-string.js'

// statsui.basic.ui-form/FormInputPlaceholder [22] 
export function FormInputPlaceholder({inputRef,inputLayout,displaced,children,...props}){
  let [settled,setSettled] = React.useState(false);
  let [layout,setLayout] = React.useState();
  let scale = 0.8;
  let translateX = 5;
  let translateY = layout ? (-7 - (scale * layout.height)) : 0;
  React.useEffect(function (){
    new Promise(function (resolve,reject){
      setTimeout(function (){
        new Promise(function (inner_resolve){
          inner_resolve((function (){
            setSettled(displaced);
          })());
        }).then(function (value){
          resolve(value);
        }).catch(function (err){
          reject(err);
        });
      },200);
    });
  },[displaced]);
  return (
    <T.Text
      transform={displaced ? [{"translateY":translateY},{"translateX":translateX}] : [
          {
                "translateY":(layout && inputLayout) ? ((62 - layout.height) / 2) : 20
              },
          {"translateX":25}
        ]}
      animation={["200ms",{"transform":{"overshootClamping":true}}]}
      color="$color"
      onPress={function (){
          !displaced ? inputRef.current.focus() : null;
        }}
      top={0}
      opacity={displaced ? 1 : 0.3}
      fontWeight={settled ? "600" : null}
      onLayout={function ({nativeEvent}){
          setLayout(nativeEvent.layout);
        }}
      textAlign="left"
      position="absolute"
      fontSize={displaced ? "15px" : "20px"}
      animateOnly={["fontSize","opacity","transform"]}
      backgroundColor="$white0"
      left={0}
      {...props}>
      {k.is_stringp(children) ? str.to_uppercase(children) : children}
    </T.Text>);
}

// statsui.basic.ui-form/FormInputTitle [82] 
export function FormInputTitle({children,...props}){
  return (
    <T.Text
      color="$color"
      top={-24}
      opacity={1}
      fontWeight="600"
      textAlign="left"
      position="absolute"
      fontSize="$3"
      backgroundColor="$white0"
      left={5}
      {...props}>
      {k.is_stringp(children) ? str.to_uppercase(children) : children}
    </T.Text>);
}

// statsui.basic.ui-form/FormInputErrorTag [104] 
export function FormInputErrorTag({error = {},focused,...props}){
  let {message} = error;
  let [display,setDisplay] = React.useState(message);
  React.useEffect(function (){
    if(kd.is_emptyp(message) && kd.not_emptyp(display)){
      new Promise(function (resolve,reject){
        setTimeout(function (){
          new Promise(function (inner_resolve){
            inner_resolve((function (){
              setDisplay(message);
            })());
          }).then(function (value){
            resolve(value);
          }).catch(function (err){
            reject(err);
          });
        },200);
      });
    }
    else if(kd.not_emptyp(message)){
      setDisplay(message);
    }
  },[message]);
  return (
    <T.Text
      pointerEvents={(message && focused) ? "auto" : "none"}
      transform={[{"translateY":11}]}
      animation="quick"
      color="$color1"
      borderRadius={5}
      bottom={0}
      borderColor="$color12"
      paddingHorizontal={15}
      paddingVertical={5}
      opacity={(message && focused) ? 1 : 0}
      zIndex={100}
      right={15}
      position="absolute"
      fontSize="11px"
      animateOnly={["opacity","fontSize","transform"]}
      backgroundColor="$color12"
      {...props}>{display}
    </T.Text>);
}

// statsui.basic.ui-form/FormInputErrorCheck [145] 
export function FormInputErrorCheck({
  inputRef,
  inputLayout,
  fieldState,
  focused,
  hideCheck,
  error = {},
  ...props
}){
  let {message} = error;
  let displayError = !hideCheck && (fieldState.isTouched || fieldState.isDirty) && fieldState.invalid && !focused;
  let displaySuccess = !hideCheck && fieldState.isDirty && !fieldState.invalid;
  let topVar = ((inputLayout ? inputLayout.height : 40) - 18) / 2;
  let {current} = ui.useThemeGlobal();
  let isLight = current == "light";
  let colorSuccess = isLight ? "$green7" : "$green10";
  let colorError = isLight ? "$red7" : "$red10";
  return (
    <T.AnimatePresence>
      {displayError ? (
        <T.View
          pointerEvents="none"
          animation="200ms"
          key="error"
          top={topVar}
          enterStyle={{"opacity":0,"x":30}}
          opacity={1}
          exitStyle={{"opacity":0,"x":30}}
          right={15}
          position="absolute">
          <T.View>
            <CircleAlert
              borderRadius={15}
              color={colorError}
              size="$1"
              zIndex={100}
              {...props}/>
          </T.View>
        </T.View>) : null}
      {displaySuccess ? (
        <T.View
          pointerEvents="none"
          animation="200ms"
          key="error"
          top={topVar}
          enterStyle={{"opacity":0,"x":30}}
          opacity={1}
          exitStyle={{"opacity":0,"x":30}}
          right={15}
          position="absolute">
          <T.View>
            <Check
              borderRadius={15}
              color={colorSuccess}
              cursor="pointer"
              size="$1"
              zIndex={100}
              {...props}/>
          </T.View>
        </T.View>) : null}
    </T.AnimatePresence>);
}

// statsui.basic.ui-form/FormInputRender [214] 
export function FormInputRender({
  input,
  placeholder,
  component = T.Input,
  renderComponent,
  title,
  hideTitle,
  hideError,
  hideCheck,
  dynamicPlaceholder,
  inputRef,
  transform = k.identity,
  ...props
}){
  let {field,fieldState} = input;
  let {onBlur,onChange,value} = field;
  let {error} = fieldState;
  let [focused,setFocused] = React.useState(false);
  let [displaced,setDisplaced] = React.useState(!dynamicPlaceholder || (focused || kd.not_emptyp(value)));
  let internalRef = React.useRef();
  let finalRef = inputRef || internalRef;
  let [inputLayout,setInputLayout] = React.useState();
  React.useEffect(function (){
    if(!dynamicPlaceholder){
      if(!displaced){
        setDisplaced(true);
      }
      return;
    }
    if(displaced && !focused && kd.is_emptyp(value)){
      setDisplaced(false);
    }
    if(!displaced && (focused || kd.not_emptyp(value))){
      setDisplaced(true);
    }
  },[focused,value,displaced,dynamicPlaceholder]);
  let colors = ui.useThemeColors([["primary","$color12"]]);
  let primaryColor = colors.primary.string();
  let borderColor = "$color8";
  let hoverColor = colors.primary.fade(0.7).string();
  return (
    <T.YStack>
      <T.XStack>
        {!hideTitle ? (!dynamicPlaceholder ? (
          <FormInputTitle>{title || placeholder}</FormInputTitle>) : (
          <FormInputPlaceholder
            inputRef={finalRef}
            inputLayout={inputLayout}
            displaced={displaced}>{title || placeholder}
          </FormInputPlaceholder>)) : null}
      </T.XStack>
      {renderComponent ? renderComponent({error,onBlur,onChange,value}) : React.createElement(component,{
        "placeholderTextColor":colors.primary.fade(0.8).string(),
        "placeholder":dynamicPlaceholder ? "" : placeholder,
        "onChangeText":onChange,
        "ref":finalRef,
        "borderColor":borderColor,
        "value":transform(value) || "",
        "onBlur":function (e){
          setFocused(false);
          onBlur(e);
        },
        "hoverStyle":{"borderColor":hoverColor},
        "size":"$5",
        "onLayout":function ({nativeEvent}){
          setInputLayout(nativeEvent.layout);
        },
        "fontSize":"$4",
        "backgroundColor":(error && !focused) ? "transparent" : "$color1",
        "onFocus":function (){
          setFocused(true);
        },
        ...props
      })}
      <FormInputErrorCheck
        error={error}
        focused={focused}
        fieldState={fieldState}
        inputRef={inputRef}
        inputLayout={inputLayout}
        hideCheck={hideCheck}/>
      {!hideError ? (
        <FormInputErrorTag error={error} focused={focused} inputLayout={inputLayout}/>) : null}
    </T.YStack>);
}

// statsui.basic.ui-form/FormInput [322] 
export function FormInput({
  control,
  field,
  title,
  placeholder,
  hideTitle,
  hideError,
  formProps,
  viewProps,
  titleProps,
  renderComponent,
  transform = k.identity,
  dynamicPlaceholder = false,
  component = T.Input,
  ...props
}){
  return (
    <hook_form.FormController
      name={field}
      control={control}
      render={function (input){
          return (
            <T.YStack gap="$3" marginVertical="$2" {...viewProps}>
              <FormInputRender
                input={input}
                transform={transform}
                renderComponent={renderComponent}
                placeholder={placeholder}
                dynamicPlaceholder={dynamicPlaceholder}
                component={component}
                hideTitle={hideTitle}
                title={title}
                hideError={hideError}
                {...props}/>
            </T.YStack>);
        }}
      {...formProps}/>);
}

// statsui.basic.ui-form/FormCheckbox [363] 
export function FormCheckbox({control,field,title,disabled,...props}){
  return (
    <hook_form.FormController
      name={field}
      control={control}
      render={function (input){
          let {field,fieldState} = input;
          let {onChange,value} = field;
          return (
            <T.XStack gap="$3" alignItems="center" marginVertical="$2" {...props}>
              <T.Checkbox
                id={field.name}
                size="$5"
                checked={value}
                disabled={disabled}
                onCheckedChange={onChange}><T.Checkbox.Indicator><Check/></T.Checkbox.Indicator>
              </T.Checkbox>
              <T.Label htmlFor={field.name} fontSize="$4">{title}</T.Label>
            </T.XStack>);
        }}/>);
}

// statsui.basic.ui-form/FormError [398] 
export function FormError({error,viewProps,...props}){
  return error ? (
    <T.AnimatePresence>
      <T.YStack
        animation={["bouncy",{"opacity":{"overshootClamping":true}}]}
        enterStyle={{"opacity":0,"y":-40,"scole":0.95}}
        exitStyle={{"opacity":0,"y":-40,"scole":0.95}}
        opacity={1}
        scale={1}
        y={-30}>
        <T.XStack
          marginTop="$4"
          padding="$3"
          borderRadius="$3"
          borderWidth={1}
          borderColor="$red7"
          {...viewProps}>
          <T.Text color="$red7" fontSize="$3" {...props}>{str.to_uppercase(error.message || "Unknown Error")}</T.Text>
        </T.XStack>
      </T.YStack>
    </T.AnimatePresence>) : null;
}

// statsui.basic.ui-form/FormTagSelect [431] 
export function FormTagSelect({title,options,selected,onToggle,themeColor = "$purple",...props}){
  return (
    <T.YStack gap="$3" {...props}>
      {title ? (
        <T.Text
          fontSize="$3"
          color="$color11"
          fontWeight="600"
          textTransform="uppercase">{title}
        </T.Text>) : null}
      <T.XStack flexWrap="wrap" gap="$2" width="100%">
        {options.map(function (item){
          let {id,label,icon} = item;
          let isSelected = selected.has(id);
          return (
            <T.Button
              animation="quick"
              color={isSelected ? (themeColor + "6") : "$color11"}
              onPress={function (){
                  onToggle(id);
                }}
              pressStyle={{"scale":0.98}}
              key={id}
              borderRadius="$3"
              scale={isSelected ? 1.02 : 1}
              borderColor={isSelected ? (themeColor + "12") : "$color4"}
              flexBasis="45%"
              icon={icon}
              hoverStyle={{
                  "borderColor":isSelected ? (themeColor + "9") : "$color6",
                  "backgroundColor":isSelected ? (themeColor + "12") : "$color3"
                }}
              borderWidth={1}
              size="$4"
              backgroundColor={isSelected ? (themeColor + "12") : "$color2"}
              flexGrow={1}>{label}
            </T.Button>);
        })}
      </T.XStack>
    </T.YStack>);
}