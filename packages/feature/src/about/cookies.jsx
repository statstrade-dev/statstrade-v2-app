import * as T from 'tamagui'

import * as uis from '@statstrade/component/ui-section.jsx'

// statstrade-web.feature.about.cookies/CookiesScreen [10] 
export function CookiesScreen(){
  return (
    <uis.MinFrameCenter>
      <T.YStack gap="$4" paddingBottom="$10">
        <T.H1>Cookie Policy</T.H1>
        <T.Paragraph>Last updated: December 2024</T.Paragraph>
        <T.H2>1. What Are Cookies</T.H2>
        <T.Paragraph>
          Cookies are small text files that are placed on your computer or mobile device by websites that you visit. They are widely used in order to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
        </T.Paragraph>
        <T.H2>2. How We Use Cookies</T.H2>
        <T.Paragraph>
          We use cookies for a variety of reasons detailed below. Unfortunately in most cases there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site.
        </T.Paragraph>
        <T.YStack paddingLeft="$4">
          <T.Paragraph>
            • Essential Cookies: Necessary for the website to function properly.
          </T.Paragraph>
          <T.Paragraph>
            • Analytics Cookies: Help us understand how visitors interact with the website.
          </T.Paragraph>
          <T.Paragraph>
            • Functionality Cookies: Allow the website to remember choices you make.
          </T.Paragraph>
        </T.YStack>
        <T.H2>3. Disabling Cookies</T.H2>
        <T.Paragraph>
          You can prevent the setting of cookies by adjusting the settings on your browser (see your browser Help for how to do this). Be aware that disabling cookies will affect the functionality of this and many other websites that you visit.
        </T.Paragraph>
        <T.H2>4. Third Party Cookies</T.H2>
        <T.Paragraph>
          In some special cases we also use cookies provided by trusted third parties. This site likely uses Google Analytics which is one of the most widespread and trusted analytics solution on the web for helping us to understand how you use the site and ways that we can improve your experience.
        </T.Paragraph>
      </T.YStack>
    </uis.MinFrameCenter>);
}

export default CookiesScreen