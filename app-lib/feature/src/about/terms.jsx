import * as T from 'tamagui'

import * as uis from '@statstrade/component/ui-section.jsx'

// statstrade-web.feature.about.terms/TermsScreen [10] 
export function TermsScreen(){
  return (
    <uis.MinFrameCenter>
      <T.YStack gap="$4" paddingBottom="$10">
        <T.H1>Terms of Service</T.H1>
        <T.Paragraph>Last updated: December 2024</T.Paragraph>
        <T.H2>1. Acceptance of Terms</T.H2>
        <T.Paragraph>
          By accessing or using our platform, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
        </T.Paragraph>
        <T.H2>2. Use of Service</T.H2>
        <T.Paragraph>
          You must follow any policies made available to you within the Services. You may use our Services only as permitted by law, including applicable export and re-export control laws and regulations.
        </T.Paragraph>
        <T.H2>3. User Accounts</T.H2>
        <T.Paragraph>
          When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
        </T.Paragraph>
        <T.H2>4. Intellectual Property</T.H2>
        <T.Paragraph>
          The Service and its original content, features, and functionality are and will remain the exclusive property of our company and its licensors.
        </T.Paragraph>
        <T.H2>5. Termination</T.H2>
        <T.Paragraph>
          We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
        </T.Paragraph>
        <T.H2>6. Limitation of Liability</T.H2>
        <T.Paragraph>
          In no event shall we be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
        </T.Paragraph>
        <T.H2>7. Governing Law</T.H2>
        <T.Paragraph>
          These Terms shall be governed and construed in accordance with the laws of Australia, without regard to its conflict of law provisions.
        </T.Paragraph>
      </T.YStack>
    </uis.MinFrameCenter>);
}

export default TermsScreen