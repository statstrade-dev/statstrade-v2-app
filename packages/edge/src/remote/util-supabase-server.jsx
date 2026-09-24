// statsui.edge.remote.util-supabase-server/getServerSideProps [15] 
export async function getServerSideProps(context){
  let supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,{
    "cookies":{
        "getAll":function (){
            return Object.keys(context.req.cookies).map(function (name){
              return {name,"value":context.req.cookies[name]};
            });
          },
        "setAll":function (cookiesToSet){
            context.res.setHeader("Set-Cookie",cookiesToSet.map(function ({name,options,value}){
              return serializeCookieHeader(name,value,options);
            }));
          }
      }
  });
  let {data} = await supabase.auth.getUser();
  return {"props":{"user":data.user}};
}