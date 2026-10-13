import * as server from '../impersonation-routes.js'

export var runtime = "nodejs";

export async function GET(request){
  return server.createSuperImpersonationHandlers(null).token(request);
}