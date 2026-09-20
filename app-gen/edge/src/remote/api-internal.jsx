// sznui.lib.edge.remote.api-internal/stripe-status [8] 
export function stripe_status(body,options = {}){
  return fetch("/api/stripe/status",{
    "method":"POST",
    "headers":{"Content-Type":"application/json"},
    "body":JSON.stringify(body)
  }).then(function (res){
    return res.json();
  });
}

// sznui.lib.edge.remote.api-internal/stripe-checkout [17] 
export function stripe_checkout(body,options = {}){
  return fetch("/api/stripe/checkout",{
    "method":"POST",
    "headers":{"Content-Type":"application/json"},
    "body":JSON.stringify(body)
  }).then(function (res){
    return res.json();
  });
}