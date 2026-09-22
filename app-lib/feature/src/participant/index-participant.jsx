import * as participant_dashboard from '@statstrade/feature/participant/dashboard.jsx'

// statstrade-web.feature.participant.index-participant/IndexUserScreen [16] 
export function IndexUserScreen(props){
  let {currentUser} = props;
  return (
    <participant_dashboard.ParticipantDashboard/>);
}