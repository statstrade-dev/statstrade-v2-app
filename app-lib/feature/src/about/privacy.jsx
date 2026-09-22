import * as T from 'tamagui'

import * as uis from '@statstrade/component/ui-section.jsx'

// statstrade-web.feature.about.privacy/PrivacyScreen [10] 
export function PrivacyScreen(){
  return (
    <uis.MinFrameCenter>
      <T.YStack gap="$4" paddingBottom="$10">
        <T.H1>Privacy Policy</T.H1>
        <T.Paragraph>Last updated: December 2024</T.Paragraph>
        <T.H2>1. Information We Collect</T.H2>
        <T.Paragraph>
          We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, items requested (for delivery services), delivery notes, and other information you choose to provide.
        </T.Paragraph>
        <T.H2>2. How We Use Your Information</T.H2>
        <T.Paragraph>
          We use the information we collect to provide, maintain, and improve our services, such as to:
        </T.Paragraph>
        <T.YStack paddingLeft="$4">
          <T.Paragraph>• Provide and deliver products and services;</T.Paragraph>
          <T.Paragraph>• Process transactions and send related information;</T.Paragraph>
          <T.Paragraph>
            • Send you technical notices, updates, security alerts, and support and administrative messages.
          </T.Paragraph>
        </T.YStack>
        <T.H2>3. Sharing of Information</T.H2>
        <T.Paragraph>
          We may share the information we collect about you as described in this Statement or as described at the time of collection or sharing, including as follows:
        </T.Paragraph>
        <T.YStack paddingLeft="$4">
          <T.Paragraph>
            • With third party vendors, consultants and other service providers who need access to such information to carry out work on our behalf;
          </T.Paragraph>
          <T.Paragraph>
            • In response to a request for information if we believe disclosure is in accordance with any applicable law, regulation or legal process.
          </T.Paragraph>
        </T.YStack>
        <T.H2>4. Security</T.H2>
        <T.Paragraph>
          We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.
        </T.Paragraph>
        <T.H2>5. Changes to the Policy</T.H2>
        <T.Paragraph>
          We may revise this Privacy Policy from time to time. If we make changes, we will notify you by revising the date at the top of the policy and, in some cases, we may provide you with additional notice.
        </T.Paragraph>
      </T.YStack>
    </uis.MinFrameCenter>);
}

export default PrivacyScreen