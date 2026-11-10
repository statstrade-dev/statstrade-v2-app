import {handleBilling} from '@statstrade/web-main/server/billing.mjs'

export var runtime = "nodejs";

export async function POST(request,context){
  let params = await context.params;
  return handleBilling(request,params.operation);
}