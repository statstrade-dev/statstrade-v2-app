import React from 'react'

import * as page_api from '@statstrade/edge/substrate/page-api.jsx'

// statstrade-web.feature.reputation.spending-settings/SpendingSettings [3] 
export function SpendingSettings(){
  let api = page_api.usePageApi("spending");
  let [daily,setDaily] = React.useState("250");
  let [cap,setCap] = React.useState("2500");
  let [economy,setEconomy] = React.useState("");
  let [enabled,setEnabled] = React.useState(true);
  let [error,setError] = React.useState(null);
  let [message,setMessage] = React.useState(null);
  let policy = api.data.policy;
  React.useEffect(function (){
    if(policy){
      setDaily(String(policy.daily_amount));
      setCap(String(policy.bank_cap));
      setEnabled(policy.enabled);
      setEconomy(policy.token_id + ":" + policy.playable_id);
    }
  },[JSON.stringify(policy)]);
  return (
    <section className="card section">
      <p className="st-kicker">Spending economy</p>
      <h2>Daily points bank</h2>
      <p>
        Spending points fund pool predictions. Reputation categories use separate reward allocations. Credits accrue on Melbourne calendar days, including days away. Winnings can exceed the daily bank cap.
      </p>
      <form
        className="st-spending-settings"
        onSubmit={function (event){
            event.preventDefault();
            setError(null);
            setMessage(null);
            let ids = economy.split(":");
            api.mutations.save_spending.mutateAsync({
              "configuration":{
                    "token_id":ids[0],
                    "playable_id":ids[1],
                    "daily_amount":Number(daily),
                    "bank_cap":Number(cap),
                    "enabled":enabled
                  }
            }).then(function (){
              setMessage("Spending bank saved.");
            }).catch(function (e){
              setError(e.message);
            });
          }}>
        <label htmlFor="spending-economy">Points token / playable</label>
        <select
          id="spending-economy"
          required={true}
          disabled={Boolean(policy)}
          value={economy}
          onChange={function (e){
              setEconomy(e.target.value);
            }}>
          <option value="">Choose a spending economy</option>
          {(api.data.economies || []).map(function (row){
            return (
              <option
                key={row.token_id + row.playable_id}
                value={row.token_id + ":" + row.playable_id}>{row.title}
              </option>);
          })}
        </select>
        <label htmlFor="daily-amount">Daily points</label>
        <input
          id="daily-amount"
          type="number"
          min={0}
          max={1000000}
          required={true}
          value={daily}
          onChange={function (e){
              setDaily(e.target.value);
            }}/>
        <label htmlFor="bank-cap">Daily bank cap</label>
        <input
          id="bank-cap"
          type="number"
          min={0}
          max={1000000000}
          required={true}
          value={cap}
          onChange={function (e){
              setCap(e.target.value);
            }}/>
        <label>
          <input
            type="checkbox"
            checked={enabled}
            onChange={function (e){
                setEnabled(e.target.checked);
              }}/>
           Enable daily accrual and purchases
        </label>
        <button
          className="st-primary-button"
          type="submit"
          disabled={api.busy || !(api.owner.status == "ready")}>Save spending bank
        </button>
      </form>
      {error ? (
        <p role="alert">{error}</p>) : null}
      {message ? (
        <p role="status">{message}</p>) : null}
    </section>);
}