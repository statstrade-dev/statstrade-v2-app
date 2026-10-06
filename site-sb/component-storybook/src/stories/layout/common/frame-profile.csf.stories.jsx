import React from 'react';

import { MenuIconLink } from '@statstrade/component/layout/common/frame-profile.jsx';

export default {
  title: 'Packages/Component/Profile Menu',
  component: MenuIconLink,
  parameters: {
    layout: 'centered',
  },
};

export function EditProfileLink() {
  return <MenuIconLink link="/profile" text="Edit Profile" />;
}
