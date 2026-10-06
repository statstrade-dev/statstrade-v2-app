import {renderToStaticMarkup} from 'react-dom/server'

import * as vitest from 'vitest'

import React from 'react'

import * as frame from '@statstrade/component/layout/common/frame-profile.jsx'

// statsui.basic.layout.common.frame-profile-test/test-profile-editor-menu-link [17] 
vitest.describe("MenuIconLink",function (){
  vitest.it("exposes the profile editor link and label",function (){
    let markup = renderToStaticMarkup(
      React.createElement(frame.MenuIconLink,{"link":"/profile","text":"Edit Profile"})
    );
    vitest.expect(markup).toContain("href=\"/profile\"");
    vitest.expect(markup).toContain("Edit Profile");
  });
});