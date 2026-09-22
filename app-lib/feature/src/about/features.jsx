import 
  {ArrowRight,BarChart3,CheckCircle2,Cloud,Code,Database,Globe,Lock,Mail,Monitor,Palette,Plug,Settings,Share2,Shield,Smartphone,Sparkles,TrendingUp,Users,Zap}
 from '@tamagui/lucide-icons'

import React from 'react'

import * as T from 'tamagui'

import * as landing_common from '@statstrade/feature/landing/landing-common.jsx'

import * as follow_up from '@statstrade/feature/landing/landing-follow-up.jsx'

import * as ui from '@statstrade/component/ui-common.jsx'

// statstrade-web.feature.about.features/featureCategories [17] 
export var featureCategories = [
  {
  "id":"builder",
  "icon":Palette,
  "title":"Campaign Builder",
  "description":"No-code tools to create stunning prediction markets in minutes",
  "features":[
    {
    "name":"Drag & Drop Interface",
    "description":"Intuitive visual builder for creating markets without technical knowledge",
    "highlight":"Build markets 10x faster"
  },
    {
    "name":"Brand Customization",
    "description":"Full white-label capabilities with your colors, logos, and styling",
    "highlight":"100% brand aligned"
  },
    {
    "name":"Template Library",
    "description":"Pre-built templates for common promotional campaigns and use cases",
    "highlight":"50+ ready-to-use templates"
  },
    {
    "name":"Multi-Format Markets",
    "description":"Binary predictions, multiple choice, scalar markets, and more",
    "highlight":"8+ market types"
  }
  ]
},
  {
  "id":"analytics",
  "icon":BarChart3,
  "title":"Analytics & Insights",
  "description":"Deep customer insights and campaign performance tracking",
  "features":[
    {
    "name":"Real-time Dashboard",
    "description":"Monitor engagement, participation, and trading activity as it happens",
    "highlight":"Live updates every 5 seconds"
  },
    {
    "name":"Customer Intelligence",
    "description":"Understand preferences, sentiment, and behavior through trading patterns",
    "highlight":"Predictive accuracy up to 87%"
  },
    {
    "name":"ROI Tracking",
    "description":"Measure campaign performance against your marketing objectives",
    "highlight":"Full attribution modeling"
  },
    {
    "name":"Custom Reports",
    "description":"Export data and create tailored reports for stakeholders",
    "highlight":"API-powered reporting"
  }
  ]
},
  {
  "id":"integrations",
  "icon":Plug,
  "title":"Integrations",
  "description":"Seamlessly connect with your existing marketing stack",
  "features":[
    {
    "name":"CRM Integration",
    "description":"Sync with Salesforce, HubSpot, and other CRM platforms",
    "highlight":"Bi-directional sync"
  },
    {
    "name":"Email Marketing",
    "description":"Connect with Mailchimp, SendGrid, and email service providers",
    "highlight":"Automated campaigns"
  },
    {
    "name":"Social Media",
    "description":"Share markets and track engagement across social platforms",
    "highlight":"One-click sharing"
  },
    {
    "name":"Analytics Tools",
    "description":"Push data to Google Analytics, Mixpanel, Segment, and more",
    "highlight":"15+ integrations"
  }
  ]
},
  {
  "id":"security",
  "icon":Shield,
  "title":"Security & Compliance",
  "description":"Enterprise-grade security with full regulatory compliance",
  "features":[
    {
    "name":"Data Encryption",
    "description":"End-to-end encryption for all customer and transaction data",
    "highlight":"256-bit AES encryption"
  },
    {
    "name":"Compliance Ready",
    "description":"GDPR, CCPA, and international data protection compliance built-in",
    "highlight":"SOC 2 Type II certified"
  },
    {
    "name":"Access Controls",
    "description":"Role-based permissions and multi-factor authentication",
    "highlight":"Granular permissions"
  },
    {
    "name":"Audit Logs",
    "description":"Complete activity tracking and compliance documentation",
    "highlight":"Immutable audit trail"
  }
  ]
}
];

// statstrade-web.feature.about.features/featureTechnicals [87] 
export var featureTechnicals = [
  {
  "icon":Zap,
  "title":"99.9% Uptime",
  "description":"Enterprise SLA guarantees"
},
  {
  "icon":Globe,
  "title":"Global CDN",
  "description":"Fast loading worldwide"
},
  {
  "icon":Code,
  "title":"REST API",
  "description":"Full programmatic access"
},
  {
  "icon":Database,
  "title":"Real-time Data",
  "description":"WebSocket connections"
},
  {
  "icon":Cloud,
  "title":"Auto-scaling",
  "description":"Handle any traffic spike"
},
  {
  "icon":Lock,
  "title":"ISO 27001",
  "description":"Security certified"
}
];

// statstrade-web.feature.about.features/featurePlatform [95] 
export var featurePlatform = [
  {
  "category":"Distribution Channels",
  "items":[
    {"name":"Embedded Widgets","available":true},
    {"name":"Standalone Landing Pages","available":true},
    {"name":"Mobile App SDK","available":true},
    {"name":"Email Campaigns","available":true},
    {"name":"QR Code Generation","available":true},
    {"name":"Social Media Cards","available":true}
  ]
},
  {
  "category":"Token & Rewards",
  "items":[
    {"name":"Custom Token Creation","available":true},
    {"name":"Reward Distribution","available":true},
    {"name":"Leaderboards","available":true},
    {"name":"Virtual Wallets","available":true},
    {"name":"Redemption System","available":true},
    {"name":"Prize Pools","available":true}
  ]
},
  {
  "category":"Market Management",
  "items":[
    {"name":"Automated Resolution","available":true},
    {"name":"Manual Override","available":true},
    {"name":"Market Pausing","available":true},
    {"name":"Liquidity Controls","available":true},
    {"name":"Fee Configuration","available":true},
    {"name":"Multi-token Support","available":true}
  ]
},
  {
  "category":"Team Collaboration",
  "items":[
    {"name":"Multi-user Accounts","available":true},
    {"name":"Role Permissions","available":true},
    {"name":"Approval Workflows","available":true},
    {"name":"Comments & Notes","available":true},
    {"name":"Activity Feed","available":true},
    {"name":"Slack Integration","available":true}
  ]
}
];

// statstrade-web.feature.about.features/FeaturesCategoryCard [129] 
export function FeaturesCategoryCard({data,index}){
  let IconComponent = data.icon;
  return (
    <T.View gap={48}>
      <T.YStack>
        <T.XStack gap="$4" alignItems="center">
          <IconComponent marginBottom={16} height={32} width={32} color="$color12"/>
          <T.H2 marginBottom={16}>{data.title}</T.H2>
        </T.XStack>
        <T.Text marginBottom={32}>{data.description}</T.Text>
        <T.XStack
          display="grid"
          gap="$3"
          gridTemplateColumns="repeat(2, minmax(0, 1fr))"
          alignItems="center"
          flexDirection={((index % 2) == 1) ? "row-reverse" : "row"}
          $md={{"gridTemplateColumns":"repeat(1, minmax(0, 1fr))"}}>
          {data.features.map(function (feature){
            return (
              <T.Card
                key={feature.name}
                backgroundColor="$color1"
                borderWidth={2}
                padding={24}
                transition="all 0.2s ease-in-out"
                hoverStyle={{"borderColor":"$color8"}}>
                <T.View
                  display="flex"
                  alignItems="flex-start"
                  justifyContent="space-between"
                  gap={16}>
                  <T.View flex={1}>
                    <T.H3 marginBottom={8}>{feature.name}</T.H3>
                    <T.Text>{feature.description}</T.Text>
                  </T.View>
                  <ui.Badge variant="secondary" flexShrink={0}>{feature.highlight}</ui.Badge>
                </T.View>
              </T.Card>);
          })}
        </T.XStack>
      </T.YStack>
    </T.View>);
}

// statstrade-web.feature.about.features/FeaturesScreenCustomers [181] 
export function FeaturesScreenCustomers(){
  return (
    <T.View
      width="100%"
      maxWidth={1280}
      marginHorizontal="auto"
      paddingHorizontal={16}>
      <T.View marginBottom={64} textAlign="center">
        <T.H2 marginBottom={16} fontSize={48} $md={{"fontSize":36}}>Reach customers everywhere</T.H2>
        <T.Text
          marginHorizontal="auto"
          maxWidth={640}
          fontSize={20}
          color="$mutedForeground">
          Deploy your campaigns across web, mobile, email, and social media
        </T.Text>
      </T.View>
      <T.View
        display="grid"
        gap={32}
        gridTemplateColumns="repeat(3, minmax(0, 1fr))"
        $md={{"gridTemplateColumns":"repeat(1, minmax(0, 1fr))"}}>
        <T.Card
          hover_BorderColor="$color12/50"
          hover_ShadowOpacity={0.2}
          transition="all 0.2s ease-in-out"
          hover_ShadowRadius={16}
          borderWidth={2}
          padding={32}
          textAlign="center"
          hover_ShadowColor="$shadow"
          hover_ShadowOffset={{"width":0,"height":8}}>
          <Monitor
            marginHorizontal="auto"
            marginBottom={16}
            height={48}
            width={48}
            color="$color12"/>
          <T.H3 marginBottom={8}>Web Platform</T.H3>
          <T.Text marginBottom={16} color="$mutedForeground">Embed markets on your website or use our hosted pages</T.Text>
          <ul spaceY={8} textAlign="left" color="$mutedForeground">
            <li display="flex" alignItems="center" gap={8}>
              <CheckCircle2 height={16} width={16} color="$green600"/>
              Responsive design
            </li>
            <li display="flex" alignItems="center" gap={8}>
              <CheckCircle2 height={16} width={16} color="$green600"/>
              Custom domains
            </li>
            <li display="flex" alignItems="center" gap={8}>
              <CheckCircle2 height={16} width={16} color="$green600"/>
              JavaScript SDK
            </li>
          </ul>
        </T.Card>
        <T.Card
          hover_BorderColor="$color12/50"
          hover_ShadowOpacity={0.2}
          transition="all 0.2s ease-in-out"
          hover_ShadowRadius={16}
          borderWidth={2}
          padding={32}
          textAlign="center"
          hover_ShadowColor="$shadow"
          hover_ShadowOffset={{"width":0,"height":8}}>
          <Smartphone
            marginHorizontal="auto"
            marginBottom={16}
            height={48}
            width={48}
            color="$color12"/>
          <T.H3 marginBottom={8}>Mobile Apps</T.H3>
          <T.Text marginBottom={16} color="$mutedForeground">Native iOS and Android SDKs for seamless mobile experiences</T.Text>
          <ul spaceY={8} textAlign="left" color="$mutedForeground">
            <li display="flex" alignItems="center" gap={8}>
              <CheckCircle2 height={16} width={16} color="$green600"/>
              Native performance
            </li>
            <li display="flex" alignItems="center" gap={8}>
              <CheckCircle2 height={16} width={16} color="$green600"/>
              Push notifications
            </li>
            <li display="flex" alignItems="center" gap={8}>
              <CheckCircle2 height={16} width={16} color="$green600"/>
              Offline support
            </li>
          </ul>
        </T.Card>
        <T.Card
          hover_BorderColor="$color12/50"
          hover_ShadowOpacity={0.2}
          transition="all 0.2s ease-in-out"
          hover_ShadowRadius={16}
          borderWidth={2}
          padding={32}
          textAlign="center"
          hover_ShadowColor="$shadow"
          hover_ShadowOffset={{"width":0,"height":8}}>
          <Mail
            marginHorizontal="auto"
            marginBottom={16}
            height={48}
            width={48}
            color="$color12"/>
          <T.H3 marginBottom={8}>Email & Social</T.H3>
          <T.Text marginBottom={16} color="$mutedForeground">Drive traffic through email campaigns and social sharing</T.Text>
          <ul spaceY={8} textAlign="left" color="$mutedForeground">
            <li display="flex" alignItems="center" gap={8}>
              <CheckCircle2 height={16} width={16} color="$green600"/>
              Email templates
            </li>
            <li display="flex" alignItems="center" gap={8}>
              <CheckCircle2 height={16} width={16} color="$green600"/>
              Social cards
            </li>
            <li display="flex" alignItems="center" gap={8}>
              <CheckCircle2 height={16} width={16} color="$green600"/>
              UTM tracking
            </li>
          </ul>
        </T.Card>
      </T.View>
    </T.View>);
}

// statstrade-web.feature.about.features/FeaturesScreen [240] 
export function FeaturesScreen(){
  return (
    <React.Fragment>
      <landing_common.TargetLink tag="top" title="Top"/>
      <landing_common.LandingFrame>
        <landing_common.LandingHeaderRow
          align="left"
          title1={ui.t("Your Platform For")}
          title2={ui.t("Successful Campaigns")}
          paragraph={ui.t(
              "A complete promotional marketing platform built for modern teams. Launch, manage, and measure prediction market campaigns at scale."
            )}/>
        <T.YStack gap="$8" $sm={{"marginHorizontal":"30px"}}>
          {featureCategories.map(function (data,index){
            let key = index;
            return (
              <FeaturesCategoryCard data={data} key={key} index={index}/>);
          })}
        </T.YStack>
      </landing_common.LandingFrame>
      <landing_common.TargetLink tag="infra" title="Infrastructure"/>
      <landing_common.LandingFrame>
        <landing_common.LandingHeaderRow
          align="left"
          title2={ui.t("Enterprise Grade Infrastructure")}
          paragraph={ui.t(
              "Built to scale with your business, backed by world-class technology"
            )}/>
        <T.YStack
          gap="$4"
          display="grid"
          gridTemplateColumns="repeat(2, minmax(0, 1fr))"
          $sm={{
              "marginHorizontal":"30px",
              "gridTemplateColumns":"repeat(1, minmax(0, 1fr))"
            }}>
          {featureTechnicals.map(function (feature){
            return (
              <T.Card
                key={feature.title}
                backgroundColor="$color1"
                transition="all 0.2s ease-in-out"
                hoverStyle={{"borderColor":"$color8"}}
                borderWidth={2}
                padding={32}
                textAlign="center">
                <feature.icon
                  marginHorizontal="auto"
                  marginBottom={16}
                  height={40}
                  width={40}
                  color="$color12"/>
                <T.H3 marginBottom={8}>{feature.title}</T.H3>
                <T.Text>{feature.description}</T.Text>
              </T.Card>);
          })}
        </T.YStack>
      </landing_common.LandingFrame>
      <landing_common.TargetLink tag="solution" title="Solution"/>
      <landing_common.LandingFrame>
        <landing_common.LandingHeaderRow
          align="left"
          title2={ui.t("Your Complete Solution")}
          paragraph={ui.t(
              "Everything you need to run world-class promotional campaigns"
            )}/>
        <T.YStack
          gap="$4"
          display="grid"
          gridTemplateColumns="repeat(2, minmax(0, 1fr))"
          $sm={{
              "marginHorizontal":"10px",
              "gridTemplateColumns":"repeat(1, minmax(0, 1fr))"
            }}>
          {featurePlatform.map(function (section){
            return (
              <T.Card
                key={section.category}
                backgroundColor="$color1"
                padding={24}
                transition="all 0.2s ease-in-out"
                hoverStyle={{"borderColor":"$color8"}}>
                <T.H4 marginBottom={24} borderBottomWidth={1} paddingBottom={12}>{section.category}</T.H4>
                <T.YStack gap="$2">
                  {section.items.map(function (item){
                    return (
                      <T.XStack key={item.name} display="flex" alignItems="center" gap={12}>
                        <CheckCircle2 height={20} width={20} flexShrink={0} color="$green8"/>
                        <T.Text>{item.name}</T.Text>
                      </T.XStack>);
                  })}
                </T.YStack>
              </T.Card>);
          })}
        </T.YStack>
      </landing_common.LandingFrame>
      <landing_common.TargetLink tag="follow-up" title="Contact Us"/>
      <follow_up.LandingFollowUp
        title1="Ready to Start?"
        title2="We're Waiting"
        paragraph="Start your free trial today. No credit card required."/>
    </React.Fragment>);
}