import * as T from 'tamagui'

// statstrade-web.feature.reputation.public-summary/Aspect [5] 
export function Aspect({aspect}){
  let rating = aspect.rating;
  let aspectMetric = aspect.metric || aspect.id;
  let metric = (aspect.kind == "subject") ? "accuracy" : ((aspectMetric == "early-insight") ? "early_insight" : aspectMetric);
  let score = rating && rating[metric];
  return (
    <T.XStack gap="$3" flexWrap="wrap">
      <T.Text fontWeight="600">{aspect.name}</T.Text>
      <T.Text>
        {"Lifetime earned: " + ((null == aspect.lifetime_earned) ? "—" : aspect.lifetime_earned)}
      </T.Text>
      <T.Text>
        {!(null == score) ? ("Skill: " + Number(score).toFixed(1) + " · " + rating.samples + " predictions" + (rating.provisional ? " · provisional" : "")) : "Not rated"}
      </T.Text>
    </T.XStack>);
}

// statstrade-web.feature.reputation.public-summary/Brand [16] 
export function Brand({summary}){
  return (
    <T.YStack gap="$2">
      <T.H3>{summary.brand_title}</T.H3>
      {summary.aspects.map(function (aspect){
        return (
          <Aspect key={aspect.id} aspect={aspect}/>);
      })}
    </T.YStack>);
}

// statstrade-web.feature.reputation.public-summary/PublishedReputation [20] 
export function PublishedReputation({summaries}){
  return (
    <T.YStack
      gap="$3"
      paddingTop="$4"
      borderTopWidth={1}
      borderColor="$color5"
      aria-label="Brand reputation">
      <T.H2 fontSize="$6">Brand reputation</T.H2>
      {(summaries && (summaries.length > 0)) ? summaries.map(function (summary){
        return (
          <Brand key={summary.brand_id} summary={summary}/>);
      }) : (
        <T.Paragraph color="$color10">
          No public brand reputation summary is available for this profile yet. Earned points and skill ratings appear when the member and issuing brand publish them.
        </T.Paragraph>)}
    </T.YStack>);
}