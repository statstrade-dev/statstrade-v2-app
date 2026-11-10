import * as server from '../impersonation-routes.js'

export var runtime = "nodejs";

export async function POST(request){
  return server.createSuperImpersonationHandlers(null).start(request);
}