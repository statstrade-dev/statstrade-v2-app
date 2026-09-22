const tree = require("@xtalk/lang/common-tree.js")

const data = require("@xtalk/lang/common-data.js")

const sort_by = require("@xtalk/lang/common-sort-by.js")

const lib = require("@xtalk/lang/common-lib.js")

const math = require("@xtalk/lang/common-math.js")

const string = require("@xtalk/lang/common-string.js")

function identity(x){
  return lib.identity(x);
}

function T(x){
  return lib.T(x);
}

function F(x){
  return lib.F(x);
}

function nilp(x){
  return null == x;
}

function not_nilp(x){
  return lib.not_nilp(x);
}

function is_numberp(x){
  return lib.is_numberp(x);
}

function is_stringp(x){
  return lib.is_stringp(x);
}

function to_string(x){
  return lib.to_string(x);
}

function to_number(x){
  return lib.to_number(x);
}

function div(x,y){
  return lib.div(x,y);
}

function lt(x,y){
  return lib.lt(x,y);
}

function lte(x,y){
  return lib.lte(x,y);
}

function gte(x,y){
  return lib.gte(x,y);
}

function gt(x,y){
  return lib.gt(x,y);
}

function eq(x,y){
  return lib.eq(x,y);
}

function arrp(x){
  return lib.is_arrayp(x);
}

function objp(x){
  return lib.is_objectp(x);
}

function fnp(x){
  return lib.is_functionp(x);
}

function is_booleanp(x){
  return lib.is_booleanp(x);
}

function is_integerp(x){
  return lib.is_integerp(x);
}

function split(s,tok){
  return string.split(s,tok);
}

function join(s,arr){
  return string.join(s,arr);
}

function replace(s,tok,replacement){
  return string.replace(s,tok,replacement);
}

function to_uppercase(s){
  return string.to_uppercase(s);
}

function to_lowercase(s){
  return string.to_lowercase(s);
}

function to_fixed(n,digits){
  return string.to_fixed(n,digits);
}

function trim(s){
  return string.trim(s);
}

function starts_withp(s,match){
  return string.starts_withp(s,match);
}

function ends_withp(s,match){
  return string.ends_withp(s,match);
}

function capitalize(s){
  return string.capitalize(s);
}

function decapitalize(s){
  return string.decapitalize(s);
}

function tag_string(tag){
  return string.tag_string(tag);
}

function is_emptyp(x){
  return data.is_emptyp(x);
}

function not_emptyp(x){
  return data.not_emptyp(x);
}

function first(x){
  return data.first(x);
}

function second(x){
  return data.second(x);
}

function last(x){
  return data.last(x);
}

function arrayify(x){
  return data.arrayify(x);
}

function arr_append(x,y){
  return data.arr_concat(x,y);
}

function arr_filter(x,f){
  return data.arr_filter(x,f);
}

function arr_foldl(x,f,init){
  return data.arr_foldl(x,f,init);
}

function arr_group_by(x,f){
  return data.arr_group_by(x,f);
}

function arr_juxt(x,f,g){
  return data.arr_juxt(x,f,g);
}

function arr_map(x,f){
  return data.arr_map(x,f);
}

function arr_mapcat(x,f){
  return data.arr_mapcat(x,f);
}

function arr_omit(x,i){
  return data.arr_omit(x,i);
}

function arr_range(x){
  return data.arr_range(x);
}

function arr_repeat(x,n){
  return data.arr_repeat(x,n);
}

function arr_reverse(x){
  return data.arr_reverse(x);
}

function arr_rslice(x,a,b){
  return data.arr_rslice(x,a,b);
}

function arr_slice(x,a,b){
  return data.arr_slice(x,a,b);
}

function arr_some(x,f){
  return data.arr_some(x,f);
}

function arr_sort(x,f,c){
  return data.arr_sort(x,f,c);
}

function get_in(x,path){
  return data.get_in(x,path);
}

function id_fn(x){
  return data.id_fn(x);
}

function key_fn(x){
  return data.key_fn(x);
}

function obj_assign(x,y){
  return data.obj_assign(x,y);
}

function obj_assign_nested(x,y){
  return data.obj_assign_nested(x,y);
}

function obj_filter(x,f){
  return data.obj_filter(x,f);
}

function obj_from_pairs(x){
  return data.obj_from_pairs(x);
}

function obj_keys(x){
  return data.obj_keys(x);
}

function obj_map(x,f){
  return data.obj_map(x,f);
}

function obj_omit(x,keys){
  return data.obj_omit(x,keys);
}

function obj_pairs(x){
  return data.obj_pairs(x);
}

function obj_pick(x,keys){
  return data.obj_pick(x,keys);
}

function template_entry(x,t,p){
  return data.template_entry(x,t,p);
}

function template_fn(t){
  return data.template_fn(t);
}

function eq_nested(x,y){
  return tree.eq_nested(x,y);
}

function walk(x,pre,post){
  return tree.tree_walk(x,pre,post);
}

function mix(x0,x1,v,f){
  return math.mix(x0,x1,v,f);
}

function lcm(x,y){
  return math.lcm(x,y);
}

function round(x){
  return math.round(x);
}

function sort_by(x,inputs){
  return sort_by.sort_by(x,inputs);
}

function sort(arr){
  let out = data.arr_clone(arr);
  data.arr_sort(out,function (x){
    return x;
  },function (x,y){
    return 0 > x.localeCompare(y);
  });
  return out;
}

module.exports = {
  ["identity"]:identity,
  ["T"]:T,
  ["F"]:F,
  ["nilp"]:nilp,
  ["not_nilp"]:not_nilp,
  ["is_numberp"]:is_numberp,
  ["is_stringp"]:is_stringp,
  ["to_string"]:to_string,
  ["to_number"]:to_number,
  ["div"]:div,
  ["lt"]:lt,
  ["lte"]:lte,
  ["gte"]:gte,
  ["gt"]:gt,
  ["eq"]:eq,
  ["arrp"]:arrp,
  ["objp"]:objp,
  ["fnp"]:fnp,
  ["is_booleanp"]:is_booleanp,
  ["is_integerp"]:is_integerp,
  ["split"]:split,
  ["join"]:join,
  ["replace"]:replace,
  ["to_uppercase"]:to_uppercase,
  ["to_lowercase"]:to_lowercase,
  ["to_fixed"]:to_fixed,
  ["trim"]:trim,
  ["starts_withp"]:starts_withp,
  ["ends_withp"]:ends_withp,
  ["capitalize"]:capitalize,
  ["decapitalize"]:decapitalize,
  ["tag_string"]:tag_string,
  ["is_emptyp"]:is_emptyp,
  ["not_emptyp"]:not_emptyp,
  ["first"]:first,
  ["second"]:second,
  ["last"]:last,
  ["arrayify"]:arrayify,
  ["arr_append"]:arr_append,
  ["arr_filter"]:arr_filter,
  ["arr_foldl"]:arr_foldl,
  ["arr_group_by"]:arr_group_by,
  ["arr_juxt"]:arr_juxt,
  ["arr_map"]:arr_map,
  ["arr_mapcat"]:arr_mapcat,
  ["arr_omit"]:arr_omit,
  ["arr_range"]:arr_range,
  ["arr_repeat"]:arr_repeat,
  ["arr_reverse"]:arr_reverse,
  ["arr_rslice"]:arr_rslice,
  ["arr_slice"]:arr_slice,
  ["arr_some"]:arr_some,
  ["arr_sort"]:arr_sort,
  ["get_in"]:get_in,
  ["id_fn"]:id_fn,
  ["key_fn"]:key_fn,
  ["obj_assign"]:obj_assign,
  ["obj_assign_nested"]:obj_assign_nested,
  ["obj_filter"]:obj_filter,
  ["obj_from_pairs"]:obj_from_pairs,
  ["obj_keys"]:obj_keys,
  ["obj_map"]:obj_map,
  ["obj_omit"]:obj_omit,
  ["obj_pairs"]:obj_pairs,
  ["obj_pick"]:obj_pick,
  ["template_entry"]:template_entry,
  ["template_fn"]:template_fn,
  ["eq_nested"]:eq_nested,
  ["walk"]:walk,
  ["mix"]:mix,
  ["lcm"]:lcm,
  ["round"]:round,
  ["sort_by"]:sort_by,
  ["sort"]:sort
}