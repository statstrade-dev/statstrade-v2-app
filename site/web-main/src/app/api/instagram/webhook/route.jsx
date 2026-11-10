import {handleInstagramWebhook} from '@statstrade/web-main/server/instagram-webhook.mjs'

export var runtime = "nodejs";

export var dynamic = "force-dynamic";

export function GET(request){
  return handleInstagramWebhook(request);
}

export function POST(request){
  return handleInstagramWebhook(request);
}