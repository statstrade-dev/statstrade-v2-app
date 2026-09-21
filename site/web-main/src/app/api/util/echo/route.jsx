// sznui.package.nextjs.app.api.util.echo.route/POST [9] 
export async function POST(request){
  let input = await request.json();
  return Response.json(input);
}