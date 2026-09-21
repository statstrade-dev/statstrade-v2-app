const runtime = require("@xtalk/ui/react/view/runtime.js")

const backend = require("@xtalk/ui/react/view/backend.js")

const polyfill = require("@xtalk/ui/react/view/polyfill.js")

var runtime_create = runtime.runtime_create;

var snapshot = runtime.snapshot;

var local_set = runtime.local_set;

var render = runtime.render;

var render_node = runtime.render_node;

var View = runtime.View;

var native_registry = backend.native_registry;

var polyfill_registry = polyfill.registry;

module.exports = {
  ["runtime_create"]:runtime_create,
  ["snapshot"]:snapshot,
  ["local_set"]:local_set,
  ["render"]:render,
  ["render_node"]:render_node,
  ["View"]:View,
  ["native_registry"]:native_registry,
  ["polyfill_registry"]:polyfill_registry
}