import 
  {ArrowRight,Award,BarChart3,Building2,Check,ChevronDown,Globe,Headphones,HelpCircle,Rocket,Shield,Sparkles,TrendingUp,Users,X,Zap}
 from '@tamagui/lucide-icons'

import React from 'react'

import * as T from 'tamagui'

import * as landing_common from '@statstrade/feature/landing/landing-common.jsx'

import * as follow_up from '@statstrade/feature/landing/landing-follow-up.jsx'

import * as ui from '@statstrade/component/ui-common.jsx'

// statstrade-web.feature.about.pricing/pricingTiers [18] 
export var pricingTiers = [
  {
  "description":"For starting out",
  "features":{
    "integrations":"Email integration",
    "participants":"Unlimited participants",
    "support":"Community support",
    "campaigns":"1 active campaign",
    "analytics":"Basic analytics dashboard",
    "team":"1 user",
    "training":false,
    "apis":false,
    "customDomain":false,
    "whiteLabel":false,
    "tokens":"Standard token templates",
    "sla":false,
    "customization":"Basic branding",
    "markets":"5 markets per campaign"
  },
  "monthlyPrice":0,
  "name":"Starter",
  "featured":false,
  "icon":Rocket,
  "yearlyPrice":0,
  "id":"starter",
  "cta":"Start Free",
  "limits":[
    "1 active campaign at a time",
    "Max 1,000 participants per campaign",
    "5 markets per campaign",
    "7-day data retention"
  ]
},
  {
  "description":"For growing marketing teams",
  "features":{
    "integrations":"Full integration suite",
    "participants":"Unlimited participants",
    "support":"Priority email & chat support",
    "campaigns":"5 active campaigns",
    "analytics":"Advanced analytics & reporting",
    "team":"5 team members",
    "training":"Onboarding session",
    "apis":true,
    "customDomain":true,
    "whiteLabel":true,
    "tokens":"Custom token creation",
    "sla":"99.9% uptime SLA",
    "customization":"Full branding & white-label",
    "markets":"20 markets per campaign"
  },
  "monthlyPrice":50,
  "name":"Professional",
  "featured":true,
  "icon":TrendingUp,
  "yearlyPrice":4990,
  "id":"professional",
  "savings":"Save $998/year",
  "cta":"Start Free Trial",
  "limits":[
    "10 concurrent campaigns",
    "50K participants per campaign",
    "Unlimited markets",
    "1-year data retention"
  ]
},
  {
  "description":"For large-scale deployments",
  "features":{
    "integrations":"Custom integrations",
    "participants":"Unlimited participants",
    "support":"24/7 dedicated support",
    "campaigns":"Unlimited campaigns",
    "analytics":"Custom analytics & BI tools",
    "team":"Unlimited team members",
    "training":"Dedicated success manager",
    "apis":true,
    "customDomain":true,
    "whiteLabel":true,
    "tokens":"Advanced tokenomics",
    "sla":"99.99% uptime SLA",
    "customization":"Enterprise white-label",
    "markets":"Unlimited markets"
  },
  "customFeatures":[
    "Dedicated account manager",
    "Custom contract terms",
    "Volume discounts available",
    "Private cloud deployment option"
  ],
  "monthlyPrice":null,
  "name":"Enterprise",
  "featured":false,
  "icon":Building2,
  "yearlyPrice":null,
  "id":"enterprise",
  "cta":"Contact Sales",
  "limits":[
    "Unlimited everything",
    "Custom data retention",
    "Dedicated infrastructure",
    "SLA guarantees"
  ]
}
];

// statstrade-web.feature.about.pricing/pricingCompare [110] 
export var pricingCompare = [
  {
  "category":"Campaign Management",
  "icon":Rocket,
  "features":[
    {
    "name":"Active campaigns",
    "starter":"1",
    "professional":"10",
    "enterprise":"Unlimited"
  },
    {
    "name":"Markets per campaign",
    "starter":"5",
    "professional":"Unlimited",
    "enterprise":"Unlimited"
  },
    {
    "name":"Campaign templates",
    "starter":true,
    "professional":true,
    "enterprise":true
  },
    {
    "name":"Scheduled publishing",
    "starter":false,
    "professional":true,
    "enterprise":true
  },
    {
    "name":"A/B testing",
    "starter":false,
    "professional":true,
    "enterprise":true
  },
    {
    "name":"Campaign cloning",
    "starter":false,
    "professional":true,
    "enterprise":true
  }
  ]
},
  {
  "category":"Participant Management",
  "icon":Users,
  "features":[
    {
    "name":"Max participants",
    "starter":"1,000",
    "professional":"50,000",
    "enterprise":"Unlimited"
  },
    {
    "name":"User authentication",
    "starter":true,
    "professional":true,
    "enterprise":true
  },
    {
    "name":"SSO integration",
    "starter":false,
    "professional":false,
    "enterprise":true
  },
    {
    "name":"Participant segmentation",
    "starter":false,
    "professional":true,
    "enterprise":true
  },
    {
    "name":"Custom user roles",
    "starter":false,
    "professional":true,
    "enterprise":true
  },
    {
    "name":"Automated rewards",
    "starter":false,
    "professional":true,
    "enterprise":true
  }
  ]
},
  {
  "category":"Analytics & Insights",
  "icon":BarChart3,
  "features":[
    {
    "name":"Real-time dashboard",
    "starter":true,
    "professional":true,
    "enterprise":true
  },
    {
    "name":"Data retention",
    "starter":"7 days",
    "professional":"1 year",
    "enterprise":"Custom"
  },
    {
    "name":"Custom reports",
    "starter":false,
    "professional":true,
    "enterprise":true
  },
    {
    "name":"Export capabilities",
    "starter":"CSV",
    "professional":"CSV, PDF, Excel",
    "enterprise":"All formats"
  },
    {
    "name":"API access",
    "starter":false,
    "professional":true,
    "enterprise":true
  },
    {
    "name":"Predictive analytics",
    "starter":false,
    "professional":false,
    "enterprise":true
  }
  ]
},
  {
  "category":"Branding & Customization",
  "icon":Sparkles,
  "features":[
    {
    "name":"Custom branding",
    "starter":"Basic",
    "professional":"Full",
    "enterprise":"Enterprise"
  },
    {
    "name":"White-label",
    "starter":false,
    "professional":true,
    "enterprise":true
  },
    {
    "name":"Custom domain",
    "starter":false,
    "professional":true,
    "enterprise":true
  },
    {
    "name":"Email templates",
    "starter":"Standard",
    "professional":"Custom",
    "enterprise":"Custom"
  },
    {
    "name":"Mobile app branding",
    "starter":false,
    "professional":false,
    "enterprise":true
  },
    {
    "name":"Custom UI/UX",
    "starter":false,
    "professional":false,
    "enterprise":true
  }
  ]
},
  {
  "category":"Integrations",
  "icon":Globe,
  "features":[
    {
    "name":"Email marketing",
    "starter":true,
    "professional":true,
    "enterprise":true
  },
    {
    "name":"CRM integration",
    "starter":false,
    "professional":true,
    "enterprise":true
  },
    {
    "name":"Social media",
    "starter":false,
    "professional":true,
    "enterprise":true
  },
    {
    "name":"Analytics tools",
    "starter":false,
    "professional":true,
    "enterprise":true
  },
    {
    "name":"Slack/Teams",
    "starter":false,
    "professional":true,
    "enterprise":true
  },
    {
    "name":"Custom webhooks",
    "starter":false,
    "professional":true,
    "enterprise":true
  }
  ]
},
  {
  "category":"Support & Services",
  "icon":Headphones,
  "features":[
    {
    "name":"Support channels",
    "starter":"Community",
    "professional":"Email & Chat",
    "enterprise":"24/7 Phone"
  },
    {
    "name":"Response time",
    "starter":"48 hours",
    "professional":"4 hours",
    "enterprise":"1 hour"
  },
    {
    "name":"Onboarding",
    "starter":"Self-service",
    "professional":"Guided",
    "enterprise":"Dedicated"
  },
    {
    "name":"Training sessions",
    "starter":false,
    "professional":"1 session",
    "enterprise":"Unlimited"
  },
    {
    "name":"Success manager",
    "starter":false,
    "professional":false,
    "enterprise":true
  },
    {
    "name":"SLA guarantee",
    "starter":false,
    "professional":"99.9%",
    "enterprise":"99.99%"
  }
  ]
}
];

// statstrade-web.feature.about.pricing/pricingFAQs [166] 
export var pricingFAQs = [
  {
  "question":"Can I upgrade or downgrade my plan at any time?",
  "answer":"Yes! You can upgrade your plan at any time and the change takes effect immediately. When downgrading, the change will take effect at the end of your current billing cycle to ensure you get the most value from your current plan."
},
  {
  "question":"What happens if I exceed my participant limit?",
  "answer":"If you approach your participant limit, we'll notify you in advance. You can upgrade your plan or purchase additional participant capacity as needed. We'll never cut off an active campaign mid-flight."
},
  {
  "question":"Is there a setup fee?",
  "answer":"No setup fees for any plan. The Professional plan includes a complimentary onboarding session, and Enterprise customers receive dedicated implementation support at no additional cost."
},
  {
  "question":"What payment methods do you accept?",
  "answer":"We accept all major credit cards (Visa, Mastercard, American Express) and ACH transfers for annual plans. Enterprise customers can also arrange invoice billing and custom payment terms."
},
  {
  "question":"Do you offer discounts for non-profits or educational institutions?",
  "answer":"Yes! We offer special pricing for qualified non-profit organizations and educational institutions. Contact our sales team to learn more about our discount programs."
},
  {
  "question":"What is your refund policy?",
  "answer":"We offer a 14-day money-back guarantee on all paid plans. If you're not satisfied within the first 14 days, we'll provide a full refund, no questions asked."
},
  {
  "question":"Can I try the Professional plan before committing?",
  "answer":"Absolutely! All paid plans come with a 14-day free trial. No credit card required to start your trial, and you can upgrade or cancel at any time."
},
  {
  "question":"What's included in the Enterprise plan?",
  "answer":"Enterprise plans are fully customizable based on your needs. This includes unlimited campaigns and participants, dedicated infrastructure, custom integrations, 24/7 support, a dedicated success manager, and flexible contract terms. Contact us for a custom quote."
}
];

// statstrade-web.feature.about.pricing/pricingAddons [184] 
export var pricingAddons = [
  {
  "name":"Additional Participants",
  "description":"Expand your reach beyond plan limits",
  "price":"$99/mo per 10,000 participants",
  "icon":Users
},
  {
  "name":"Priority Support",
  "description":"Upgrade to 24/7 phone support",
  "price":"$199/mo",
  "icon":Headphones
},
  {
  "name":"Custom Integration",
  "description":"Build bespoke integrations",
  "price":"Starting at $2,500",
  "icon":Globe
},
  {
  "name":"Professional Services",
  "description":"Campaign design and management",
  "price":"$150/hr",
  "icon":Award
}
];

// statstrade-web.feature.about.pricing/PricingCompareCard [202] 
export function PricingCompareCard({data}){
  let IconComponent = data.icon;
  return (
    <T.View marginBottom={32}>
      <T.XStack
        marginBottom={16}
        display="flex"
        alignItems="center"
        gap={8}
        borderBottomWidth={1}
        paddingBottom={12}>
        <IconComponent height={20} width={20} color="$color12"/>
        <T.H3 fontSize={20}>{data.category}</T.H3>
      </T.XStack>
      <T.View spaceY={8}>
        {data.features.map(function (feature){
          return (
            <T.View
              key={feature.name}
              display="grid"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              gap={16}
              borderRadius={8}
              backgroundColor="$background"
              padding={16}
              hoverStyle={{"backgroundColor":"$color3"}}>
              <T.Text gridColumn="span 1 / span 1" fontSize={14}>{feature.name}</T.Text>
              <T.Text textAlign="center">
                {((typeof feature.starter) == "boolean") ? (feature.starter ? (
                  <Check marginHorizontal="auto" height={20} width={20} color="$green8"/>) : (
                  <X marginHorizontal="auto" height={20} width={20}/>)) : (
                  <T.Text fontSize={14}>{feature.starter}</T.Text>)}
              </T.Text>
              <T.Text textAlign="center">
                {((typeof feature.professional) == "boolean") ? (feature.professional ? (
                  <Check marginHorizontal="auto" height={20} width={20} color="$green8"/>) : (
                  <X marginHorizontal="auto" height={20} width={20}/>)) : (
                  <T.Text fontSize={14}>{feature.professional}</T.Text>)}
              </T.Text>
              <T.Text textAlign="center">
                {((typeof feature.enterprise) == "boolean") ? (feature.enterprise ? (
                  <Check marginHorizontal="auto" height={20} width={20} color="$green8"/>) : (
                  <X marginHorizontal="auto" height={20} width={20}/>)) : (
                  <T.Text fontSize={14}>{feature.enterprise}</T.Text>)}
              </T.Text>
            </T.View>);
        })}
      </T.View>
    </T.View>);
}

// statstrade-web.feature.about.pricing/PricingFAQCard [254] 
export function PricingFAQCard({data}){
  return (
    <T.Accordion.Item value={data.question}>
      <T.Accordion.Trigger flexDirection="row" justifyContent="space-between">
        {function ({open}){
          return (
            <React.Fragment>
              <T.Paragraph>{data.question}</T.Paragraph>
              <T.Square animation="quick" rotate={open ? "180deg" : "0deg"}><ChevronDown size="$1"/></T.Square>
            </React.Fragment>);
        }}
      </T.Accordion.Trigger>
      <T.Accordion.Content><T.Paragraph>{data.answer}</T.Paragraph></T.Accordion.Content>
    </T.Accordion.Item>);
}

// statstrade-web.feature.about.pricing/PricingTiersCard [277] 
export function PricingTiersCard({data}){
  let billingCycle = "monthly";
  let IconComponent = data.icon;
  let price = data.monthlyPrice;
  let displayPrice = (price == null) ? "Custom" : ((price == 0) ? "Free" : ("$" + price));
  return (
    <T.YStack
      transform={data.featured ? [{"scale":1.02}] : [{"scale":1}]}
      borderRadius="$5"
      borderColor={data.featured ? "$color12" : "$border"}
      shadowRadius={data.featured ? 16 : 0}
      width="100%"
      shadowOpacity={data.featured ? 0.2 : 0}
      flexDirection="column"
      borderWidth={2}
      shadowColor={data.featured ? "$shadow6" : "transparent"}
      padding={32}
      position="relative"
      $md={{"transform":[{"scale":1}]}}
      backgroundColor="$color1"
      shadowOffset={data.featured ? {"width":0,"height":8} : {"width":0,"height":0}}
      height="100%">
      {data.featured ? (
        <ui.Badge
          position="absolute"
          top={-12}
          left="50%"
          icon={Zap}
          transform={[{"translateX":"-50%"}]}>Most Popular
        </ui.Badge>) : null}
      <T.YStack marginBottom={24} width="100%">
        <IconComponent marginBottom={16} height={40} width={40}/>
        <T.H3 marginBottom={8} fontSize={24}>{data.name}</T.H3>
        <T.Text fontSize="$2">{data.description}</T.Text>
      </T.YStack>
      <T.View marginBottom="$2">
        <T.XStack marginBottom={4} display="flex" alignItems="baseline" gap={8}>
          <T.Text fontSize={48}>{displayPrice}</T.Text>
          {(price != null) ? ((price != 0) ? (
            <T.Text>{"/" + ((billingCycle == "monthly") ? "mo" : "mo")}</T.Text>) : null) : null}
        </T.XStack>
        {(billingCycle == "yearly") ? ((price != null) ? ((price != 0) ? (
          <T.Text fontSize={14}>{"Billed $" + price.toLocaleString() + " annually"}</T.Text>) : null) : null) : null}
        {data.savings ? ((billingCycle == "yearly") ? (
          <ui.Badge variant="secondary" marginTop={8}>{data.savings}</ui.Badge>) : null) : null}
      </T.View>
      <T.View
        marginBottom={24}
        spaceY={12}
        borderTopWidth={1}
        paddingTop={24}>
        <T.View gap="$2">
          {[
            "participants",
            "campaigns",
            "markets",
            "customization",
            "analytics",
            "support",
            "integrations",
            "team"
          ].map(function (field){
            return (
              <T.XStack key={field} display="flex" alignItems="flex-start" gap={12}>
                <Check height={20} width={20} flexShrink={0} color="$green8"/>
                <T.Text fontSize={14}>{data.features[field]}</T.Text>
              </T.XStack>);
          })}
          {data.features.apis ? (
            <T.XStack display="flex" alignItems="flex-start" gap={12}>
              <Check height={20} width={20} flexShrink={0} color="$color12"/>
              <T.Text fontSize={14}>API access</T.Text>
            </T.XStack>) : null}
          {data.features.sla ? (
            <T.XStack display="flex" alignItems="flex-start" gap={12}>
              <Check height={20} width={20} flexShrink={0} color="$color12"/>
              <T.Text fontSize={14}>{data.features.sla}</T.Text>
            </T.XStack>) : null}
        </T.View>
      </T.View>
      {data.customFeatures ? (
        <T.YStack marginTop="auto" borderTopWidth={1} paddingTop={24} gap="$2">
          <T.Text fontSize={14}>Also includes:</T.Text>
          {data.customFeatures.map(function (feature){
            return (
              <T.Text key={feature} fontSize={14}>{"- " + feature}</T.Text>);
          })}
        </T.YStack>) : null}
    </T.YStack>);
}

// statstrade-web.feature.about.pricing/PricingScreen [412] 
export function PricingScreen(){
  return (
    <React.Fragment>
      <landing_common.TargetLink tag="top" title="Top"/>
      <landing_common.LandingFrame>
        <landing_common.LandingHeaderRow
          align="left"
          title1={ui.t("Scale your Campaigns")}
          title2={ui.t("Start for Free")}
          paragraph={ui.t(
              "Grow your community engagement with our social networking tools to drive more engagement. No hidden fees, cancel anytime."
            )}><ui.Pad/>
        </landing_common.LandingHeaderRow>
        <T.YStack
          gap="$4"
          flexDirection="row"
          display="grid"
          gridTemplateColumns="repeat(3, minmax(0, 1fr))"
          $md={{
              "flexDirection":"column",
              "gridTemplateColumns":"repeat(1, minmax(0, 1fr))"
            }}>
          {pricingTiers.map(function (data,key){
            return (
              <T.YStack flex={1} minHeight="100px"><PricingTiersCard data={data} key={key}/></T.YStack>);
          })}
        </T.YStack>
      </landing_common.LandingFrame>
      <landing_common.TargetLink tag="compare" title="Comparison"/>
      <landing_common.LandingFrame>
        <landing_common.LandingHeaderRow
          align="left"
          title2={ui.t("Compare Features")}
          paragraph={ui.t("Detailed breakdown of features across all plans")}><ui.Pad/>
        </landing_common.LandingHeaderRow>
        <T.YStack $sm={{"marginHorizontal":"30px"}}>
          {pricingCompare.map(function (data,key){
            return (
              <PricingCompareCard data={data} key={key}/>);
          })}
        </T.YStack>
      </landing_common.LandingFrame>
      <landing_common.TargetLink tag="faq" title="FAQ"/>
      <landing_common.LandingFrame>
        <landing_common.LandingHeaderRow
          align="left"
          title2={ui.t("FAQ")}
          paragraph={ui.t("Everything you need to know about our pricing")}><ui.Pad/>
        </landing_common.LandingHeaderRow>
        <T.YStack $sm={{"marginHorizontal":"30px"}}>
          <T.Accordion type="single" gap="$3">
            {pricingFAQs.map(function (data,key){
              return (
                <PricingFAQCard data={data} key={key}/>);
            })}
          </T.Accordion>
        </T.YStack>
      </landing_common.LandingFrame>
      <landing_common.TargetLink tag="follow-up" title="Contact Us"/>
      <follow_up.LandingFollowUp
        title1="Ready to Start?"
        title2="We're Waiting"
        paragraph="Start your free trial today. No credit card required."/>
    </React.Fragment>);
}