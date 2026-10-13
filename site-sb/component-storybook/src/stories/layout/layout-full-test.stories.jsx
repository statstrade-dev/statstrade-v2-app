import * as vitest from 'vitest'

import React from 'react'

import * as layout from '@statstrade/component/layout/layout-full.jsx'

// statsui.basic.layout.layout-full-test/test-check-expired [13] 
vitest.it("accepts future expiry and rejects past expiry",function (){
  let now = Date.now() / 1000;
  vitest.expect(layout.check_expired({"expires_at":now + 60})).toBe(true);
  vitest.expect(layout.check_expired({"expires_at":now - 60})).toBe(false);
});

// statsui.basic.layout.layout-full-test/test-layout-full-splash [22] 
vitest.it("creates a logo element with size 120",function (){
  let tree = layout.LayoutFullSplash();
  vitest.expect(React.isValidElement(tree)).toBe(true);
  vitest.expect(tree.props.children.props.children.props.size).toBe(120);
});

// statsui.basic.layout.layout-full-test/test-layout-full-auth-state [31] 
vitest.it("reports loading and authenticated states for layout routing",function (){
  vitest.expect(layout.authEntryMode(null,false)).toBe("loading");
  vitest.expect(layout.authEntryMode({"user":{"id":"user-7"}},true)).toBe("authenticated");
});

// statsui.basic.layout.layout-full-test/test-auth-entry-mode-guest [42] 
vitest.it("routes missing and non-authenticated entries to guest pages",function (){
  vitest.expect(layout.authEntryMode(null,true)).toBe("guest");
  vitest.expect(layout.authEntryMode({"user":{}},true)).toBe("guest");
});