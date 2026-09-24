import * as sb from '@statstrade/edge/remote/util-supabase.jsx'

// statsui.edge.remote.api-service/service-organisation-change-tier [8] 
export function service_organisation_change_tier({organisation_id,tier},options = {}){
  return sb.callRemote(
    "service_organisation_change_tier",
    {"organisation_id":organisation_id,"tier":tier},
    options
  );
}

// statsui.edge.remote.api-service/service-save-billing-invoice [15] 
export function service_save_billing_invoice({
  organisation_id,
  external_id,
  amount,
  currency,
  status,
  time_start,
  time_end,
  customer_id,
  subscription_id,
  invoice_url
},options = {}){
  return sb.callRemote("service_save_billing_invoice",{
    "m":{
        external_id,
        amount,
        currency,
        status,
        time_start,
        time_end,
        customer_id,
        subscription_id,
        invoice_url
      },
    "organisation_id":organisation_id
  },options);
}