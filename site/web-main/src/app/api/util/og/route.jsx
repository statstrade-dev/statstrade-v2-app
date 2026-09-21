import {ImageResponse} from '@vercel/og'

// sznui.package.nextjs.app.api.util.og.route/GET [9] 
export async function GET(request){
  let {searchParams} = request.nextUrl;
  let title = searchParams.get("title") || "Statstrade";
  let description = searchParams.get("description") || "Turn every opinion into engagement.";
  return new ImageResponse((
    <div
      style={{
          "width":"100%",
          "flexDirection":"column",
          "letterSpacing":-2,
          "justifyContent":"center",
          "fontWeight":700,
          "backgroundImage":"linear-gradient(to bottom, #dbf4ff, #fff1f1)",
          "textAlign":"center",
          "display":"flex",
          "fontSize":60,
          "height":"100%",
          "alignItems":"center"
        }}>
      <div
        style={{
            "backgroundImage":"linear-gradient(90deg, rgb(0, 124, 240), rgb(0, 223, 216))",
            "backgroundClip":"text",
            "_webkit_background_clip":"text",
            "color":"transparent"
          }}>{title}
      </div>
      <div
        style={{
            "backgroundImage":"linear-gradient(90deg, rgb(121, 40, 202), rgb(255, 0, 128))",
            "backgroundClip":"text",
            "_webkit_background_clip":"text",
            "color":"transparent",
            "fontSize":40,
            "marginTop":30
          }}>{description}
      </div>
    </div>),{"width":1200,"height":630});
}