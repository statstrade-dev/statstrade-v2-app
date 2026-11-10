import React from 'react'

import * as page_api from '@statstrade/edge/substrate/page-api.jsx'

// statstrade-web.feature.reputation.pool-ticket/points [3] 
export function points(value){
  return Number(value || 0).toLocaleString("en-AU",{"maximumFractionDigits":2});
}

// statstrade-web.feature.reputation.pool-ticket/PoolTicket [4] 
export function PoolTicket({api,question,open}){
  let context = React.useContext(page_api.PageContext);
  let pool = api.data.pool;
  let bank = pool.bank;
  let position = pool.position;
  let [percent,setPercent] = React.useState(50);
  let [amount,setAmount] = React.useState("");
  let [offer,setQuote] = React.useState(null);
  let [receipt,setReceipt] = React.useState(null);
  let [command,setCommand] = React.useState(null);
  let [busy,setBusy] = React.useState(false);
  let [error,setError] = React.useState(null);
  React.useEffect(function (){
    setPercent(50);
    setAmount("");
    setQuote(null);
    setReceipt(null);
    setError(null);
  },[question.id,context.actor]);
  let saved = (position && position.receipt) || receipt;
  let allocation = saved && saved.allocation;
  let canBuy = open && pool.can_buy && !saved;
  let enough = bank && (Number(amount) > 0) && (Number(amount) <= Number(bank.available));
  function editAmount(value){
    setAmount(value);
    setQuote(null);
    setError(null);
  }
  function review(){
    setBusy(true);
    setError(null);
    api.mutations.pool_quote.mutateAsync({
      "topic_id":question.id,
      "amount":Number(amount),
      "yes_percent":percent
    }).then(function (result){
      setQuote(result.data);
      setCommand(crypto.randomUUID());
    }).catch(function (e){
      setError(e.message);
    }).finally(function (){
      setBusy(false);
    });
  }
  function lock(){
    setBusy(true);
    setError(null);
    api.mutations.pool_lock.mutateAsync({"quote_id":offer.id,"command_id":command}).then(function (result){
      setReceipt(result.data);
      setQuote(null);
    }).catch(function (e){
      if((e.message || "").includes("quote-expired")){
        setQuote(null);
      }
      setError(
        e.message + " Review the allocation again if the quote has expired."
      );
    }).finally(function (){
      setBusy(false);
    });
  }
  let legs = (allocation && allocation.quote && allocation.quote.legs) || [];
  let yesOutcome = (pool.totals || []).find(function (row){
    return row.title.toLowerCase() == "yes";
  });
  let yesLeg = legs.find(function (leg){
    return yesOutcome && (leg.prospect_id == yesOutcome.id);
  });
  let split = saved ? ((Number(allocation.purchased_shares) > 0) ? Math.round(
    100 * (Number((yesLeg && yesLeg.purchased_shares) || 0) / Number(allocation.purchased_shares))
  ) : 50) : percent;
  let spend = saved ? Number(allocation.total_spend) : Number(amount);
  let yesSpend = saved ? Number((yesLeg && yesLeg.spend) || 0) : (spend * (split / 100));
  let disabled = !canBuy || busy || api.busy;
  return (
    <section
      className={"st-user-trade-ticket st-pool-ticket" + (saved ? " locked" : "")}
      aria-label="Pool prediction">
      <header className="st-user-call-section-heading">
        <div>
          <p className="st-section-label">decision / call</p>
          <h2>{saved ? "Prediction locked" : "Make a considered call."}</h2>
        </div>
        <span
          className="st-badge"
          data-tone={saved ? "success" : "signal"}>{saved ? "committed" : "draft"}
        </span>
      </header>
      <p className="st-user-trade-ticket__intro">
        Split your points between the two pools. Early entries earn bonus shares under this question’s bonus curve.
      </p>
      <div
        className="st-user-binary-control"
        aria-label="Your Yes or No allocation">
        <div className="st-user-binary-control__heading">
          <span><b>NO</b><small>{(100 - split) + "%"}</small></span>
          <strong>{(split == 50) ? "50/50 split" : (split + "% to Yes")}</strong>
          <span><small>{split + "%"}</small><b>YES</b></span>
        </div>
        <div
          className="st-user-binary-rail"
          style={{"--st-user-binary-value":split + "%"}}>
          <span className="st-user-binary-rail__fill" aria-hidden={true}/>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={split}
            disabled={disabled}
            aria-label="Points allocated to Yes (%)"
            onChange={function (e){
                setPercent(Number(e.target.value));
                setQuote(null);
                setError(null);
              }}/>
        </div>
        <div className="st-user-binary-control__scale">
          <span>all to No</span>
          <span>50/50 split</span>
          <span>all to Yes</span>
        </div>
      </div>
      <div className="st-user-trade-ticket__position" role="status">
        <span>your current position</span>
        <strong>
          {"Yes " + points(yesSpend) + " · No " + points(spend - yesSpend) + " points"}
        </strong>
        <small>
          {saved ? (points(spend) + " Auspolitics points committed") : "Allocation stays editable until you lock. Final amounts follow whole-share rounding."}
        </small>
      </div>
      <div className="st-user-trade-ticket__points">
        <div>
          <span>points behind this view</span>
          <small>
            {bank ? (points(bank.daily_amount) + " / day · bank up to " + points(bank.bank_cap)) : "Sign in to load your banked points."}
          </small>
        </div>
        {saved ? (
          <strong>{points(spend)}</strong>) : (
          <div className="st-user-point-stepper">
            <button
              type="button"
              aria-label="Remove 50 points"
              disabled={disabled || (spend <= 0)}
              onClick={function (){
                  editAmount(String(Math.max(0,spend - 50)));
                }}>−
            </button>
            <strong>{points(spend)}</strong>
            <button
              type="button"
              aria-label="Add 50 points"
              disabled={disabled || (bank && (spend >= Number(bank.available)))}
              onClick={function (){
                  editAmount(String(
                    Math.min(spend + 50,bank ? Number(bank.available) : (spend + 50))
                  ));
                }}>+
            </button>
          </div>)}
      </div>
      {saved ? null : (
        <details className="st-pool-exact-amount">
          <summary>Set an exact amount</summary>
          <label htmlFor="pool-spend">Auspolitics points to commit</label>
          <input
            min={0}
            placeholder="Choose an amount"
            disabled={disabled}
            value={amount}
            type="number"
            max={bank && bank.available}
            id="pool-spend"
            onChange={function (e){
                editAmount(e.target.value);
              }}
            step="any"/>
        </details>)}
      <section
        className="st-user-funding-preview"
        aria-label="Auspolitics spending bank">
        <div>
          <span>Auspolitics points</span>
          <strong>{bank ? points(bank.available) : "—"}</strong>
          <small>available</small>
        </div>
        <div>
          <span>committed</span>
          <strong>{bank ? points(bank.committed) : "—"}</strong>
          <small>in open questions</small>
        </div>
        <div>
          <span>claimable</span>
          <strong>{bank ? points(bank.claimable) : "—"}</strong>
          <small>settled winnings</small>
        </div>
      </section>
      <div className="st-user-trade-ticket__actions">
        {saved ? (
          <div>
            <span className="st-user-trade-ticket__locked">
              <i aria-hidden={true}>●</i>
              {(position && position.refunded) ? "Question voided · entry refunded" : "Call locked"}
            </span>
            {(position && (Number(position.claimable) > 0)) ? (
              <button
                className="st-primary-button"
                disabled={busy || api.busy}
                onClick={function (){
                    setBusy(true);
                    setError(null);
                    api.mutations.pool_claim.mutateAsync({"topic_id":question.id}).catch(function (e){
                      setError(e.message);
                    }).finally(function (){
                      setBusy(false);
                    });
                  }}>{"Claim " + points(position.claimable) + " points"}
              </button>) : null}
          </div>) : (offer ? (
          <section
            className="st-user-trade-ticket__confirm"
            aria-label="Confirm prediction">
            <span>Lock only this question?</span>
            <p className="st-pool-quote-summary">
              {points(offer.quote.total_spend) + " points · " + points(100 * offer.quote.bonus_rate) + "% early bonus"}
            </p>
            {(offer.quote.legs || []).map(function (leg){
              let outcome = (pool.totals || []).find(function (row){
                return row.id == leg.prospect_id;
              });
              return (
                <p className="st-pool-quote-leg" key={leg.prospect_id}>
                  {((outcome && outcome.title) || "Outcome") + ": " + points(leg.spend) + " points → " + points(leg.issued_shares) + " shares (" + points(leg.bonus_shares) + " bonus)"}
                </p>);
            })}
            <small>
              Points are at risk. This allocation cannot be edited or withdrawn after confirmation.
            </small>
            <div className="st-cluster">
              <button
                className="st-secondary-button"
                disabled={busy}
                onClick={function (){
                    setQuote(null);
                  }}>Cancel
              </button>
              <button
                className="st-primary-button"
                disabled={busy || api.busy || !canBuy}
                onClick={lock}>{busy ? "Locking…" : "Yes, lock it"}
              </button>
            </div>
          </section>) : (context.actor ? (
          <React.Fragment>
            <button
              className="st-primary-button"
              disabled={busy || api.busy || !canBuy || !enough}
              onClick={review}>{busy ? "Checking allocation…" : "Lock this call"}
            </button>
            <small>
              {(spend > 0) ? "Review your allocation before the final lock." : "Stage points before locking."}
            </small>
          </React.Fragment>) : (
          <a className="st-primary-button" href="/sign-in">Sign in to predict</a>)))}
        {(!canBuy && !saved) ? (
          <small>This question is not accepting pool allocations.</small>) : null}
        {error ? (
          <p role="alert" className="st-outcome-error">{error}</p>) : null}
      </div>
      {saved ? (
        <details className="st-pool-receipt">
          <summary>Allocation receipt</summary>
          {legs.map(function (leg){
            let outcome = (pool.totals || []).find(function (row){
              return row.id == leg.prospect_id;
            });
            return (
              <p key={leg.prospect_id}>
                {((outcome && outcome.title) || "Outcome") + ": " + points(leg.spend) + " points · " + points(leg.issued_shares) + " shares (" + points(leg.bonus_shares) + " bonus)"}
              </p>);
          })}
          <small>{"Receipt " + allocation.id}</small>
        </details>) : null}
      <details className="st-pool-rewards">
        <summary>Reputation & rewards</summary>
        <p>Awarded separately from your Auspolitics spending bank.</p>
        {(pool.rewards || []).map(function (reward,index){
          return (
            <p key={index}>
              {reward.category + " · " + points(reward.amount) + " " + reward.type}
            </p>);
        })}
      </details>
      <details className="st-pool-totals">
        <summary>Current pools</summary>
        {(pool.totals || []).map(function (row){
          return (
            <p key={row.id}>
              {row.title + ": " + points(row.points) + " points · " + points(row.shares) + " shares"}
            </p>);
        })}
      </details>
    </section>);
}