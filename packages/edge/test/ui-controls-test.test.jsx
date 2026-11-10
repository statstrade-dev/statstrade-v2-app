import {renderToStaticMarkup} from 'react-dom/server'

import * as vitest from 'vitest'

import React from 'react'

import * as controls from '@statstrade/edge/ui-controls.jsx'

// statsui.edge.ui-controls-test/test-ui-controls [5] 
vitest.it("supports defaults, optional controls and collection values",function (){
  let captured = null;
  let Probe = function (){
    captured = controls.useControls([
      ["showOrgSelector",false],
      ["selected",new Set(["one"])],
      "currentError"
    ]);
    return null;
  };
  renderToStaticMarkup(React.createElement(Probe,{}));
  vitest.expect(captured.showOrgSelector).toBe(false);
  vitest.expect(captured.selected.has("one")).toBe(true);
  vitest.expect(captured.currentError).toBeNull();
  vitest.expect(typeof captured.setShowOrgSelector).toBe("function");
  vitest.expect(typeof captured.setCurrentError).toBe("function");
});