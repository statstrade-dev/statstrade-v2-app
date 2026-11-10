'use client'

import React from 'react'

import * as sb from '@statstrade/edge/remote/util-supabase.jsx'

import * as substrate from '@statstrade/web-admindebug/lib/substrate.jsx'

import * as network from '@statstrade/web-admindebug/lib/network.jsx'

import * as market from '@statstrade/web-admindebug/lib/market.jsx'

// statstrade-admindebug.pages.index/EMAILS [13] 
var EMAILS = [
  "member@statstrade.test",
  "alice@statstrade.test",
  "bob@statstrade.test",
  "carol@statstrade.test",
  "dave@statstrade.test",
  "admin@statstrade.test"
];

// statstrade-admindebug.pages.index/Table [16] 
function Table({headers,rows}){
  return (
    <div className="scroll">
      <table>
        <thead>
          <tr>
            {headers.map(function (h){
              return (
                <th key={h}>{h}</th>);
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map(function (row,index){
            return (
              <tr key={index}>
                {row.map(function (value,cell){
                  return (
                    <td key={cell}>{value}</td>);
                })}
              </tr>);
          })}
        </tbody>
      </table>
    </div>);
}

// statstrade-admindebug.pages.index/Page [24] 
function Page(){
  let provider = substrate.useSubstrateContext();
  let resource = provider.resource;
  let [session] = sb.useListenSession();
  let token = session && session.access_token;
  let signedEmail = (session && session.user && session.user.email) || "";
  let [markets,setMarkets] = React.useState([]);
  let [selected,setSelected] = React.useState("");
  let [email,setEmail] = React.useState("member@statstrade.test");
  let [password,setPassword] = React.useState("Statstrade-local-123!");
  let [message,setMessage] = React.useState("");
  let [working,setWorking] = React.useState(false);
  let [side,setSide] = React.useState("buy");
  let [outcome,setOutcome] = React.useState("yes");
  let [amount,setAmount] = React.useState("1");
  let [price,setPrice] = React.useState("11");
  let data = market.useMarket(resource,selected,!!token);
  let state = data.state;
  let account = data.account;
  React.useEffect(function (){
    let active = true;
    setMarkets([]);
    setSelected("");
    if(token){
      market.listMarkets(resource).then(function (items){
        if(active){
          setMarkets(items);
          if(items.length){
            setSelected(items[0]["id"]);
          }
        }
      }).catch(function (e){
        if(active){
          setMessage(e.message || JSON.stringify(e));
        }
      });
    }
    return function (){
      active = false;
    };
  },[resource,token]);
  let login = async function (event){
    event.preventDefault();
    setWorking(true);
    try{
      let result = await sb.signInWithPassword(null,{"email":email,"password":password},{});
      if(result.error){
        throw result.error;
      }
      setMessage("Signed in through the SharedWorker.");
    }
    catch(e){
      setMessage(e.message || JSON.stringify(e));
    }
    finally{
      setWorking(false);
    }
  };
  let logout = async function (){
    setWorking(true);
    try{
      let result = await sb.signOut(null,{});
      if(result.error){
        throw result.error;
      }
      setMessage("Signed out.");
    }
    catch(e){
      setMessage(e.message || JSON.stringify(e));
    }
    finally{
      setWorking(false);
    }
  };
  let submit = async function (event){
    event.preventDefault();
    setWorking(true);
    try{
      let result = await market.trade(resource,side,selected,outcome,Number(amount),Number(price));
      setMessage(
        ((result.processed && result.processed.length) || 0) + " match(es) processed."
      );
      await data.refresh();
    }
    catch(e){
      setMessage(e.message || JSON.stringify(e));
    }
    finally{
      setWorking(false);
    }
  };
  let cancel = async function (id){
    setWorking(true);
    try{
      await market.cancel(resource,id);
      await data.refresh();
      setMessage("Order cancelled; escrow released.");
    }
    catch(e){
      setMessage(e.message || JSON.stringify(e));
    }
    finally{
      setWorking(false);
    }
  };
  return (
    <React.Fragment>
      <header>
        <span className="badge">LOCAL DEMO · PLAY POINTS</span>
        <h1>Statstrade admin debug</h1>
        <p>
          AusPolitics markets · live order matching · updates every 3 seconds
        </p>
      </header>
      <main>
        <network.Panel/>
        <section className="card wide">
          <label htmlFor="market">Market</label>
          <select
            id="market"
            value={selected}
            onChange={function (e){
                setSelected(e.target.value);
              }}>
            {markets.map(function (m){
              return (
                <option key={m.id} value={m.id}>{m.title}</option>);
            })}
          </select>
          <p role="status">
            {data.loading ? "Loading Substrate market models…" : (token ? "SharedWorker connected" : "Sign in to load markets.")}
          </p>
          <h2 id="topic-title">{state && state.topic.title}</h2>
          <p className="small">
            Eight launch markets. Six funded accounts. Substrate-backed authenticated matching on local gw-dev.
          </p>
        </section>
        <section className="card">
          <h2>Demo account</h2>
          <form onSubmit={login} className="stack">
            <div className="row">
              <div>
                <label htmlFor="email">Account</label>
                <select
                  id="email"
                  value={email}
                  onChange={function (e){
                      setEmail(e.target.value);
                    }}>
                  {EMAILS.map(function (value){
                    return (
                      <option key={value} value={value}>{value}</option>);
                  })}
                </select>
              </div>
              <div>
                <label htmlFor="password">Local demo password</label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={function (e){
                      setPassword(e.target.value);
                    }}/>
              </div>
            </div>
            <button disabled={working}>Sign in / switch account</button>
          </form>
          <button type="button" disabled={working || !token} onClick={logout}>Sign out</button>
          <p className="small">
            {signedEmail ? ("Signed in as " + signedEmail) : "Sign in to see your balance and holdings."}
          </p>
        </section>
        <section className="card">
          <h2>Your available campaign balance</h2>
          <output>{account ? Number(account.balance).toLocaleString() : "—"}</output>
          <span className="small">
            STATS play points · 8,000 initial campaign points per account, before initial shares and orders
          </span>
          <Table
            headers={["Outcome","Shares","Escrow"]}
            rows={((account && account.stakes) || []).map(function (s){
                return [s.outcome.toUpperCase(),s.shares,s.shares_escrow];
              })}/>
        </section>
        <section className="card">
          <h2>Place a limit order</h2>
          <form onSubmit={submit} className="stack">
            <div className="row">
              <div>
                <label htmlFor="side">Side</label>
                <select
                  id="side"
                  value={side}
                  onChange={function (e){
                      setSide(e.target.value);
                    }}>
                  <option value="buy">Buy</option>
                  <option value="sell">Sell</option>
                </select>
              </div>
              <div>
                <label htmlFor="outcome">Outcome</label>
                <select
                  id="outcome"
                  value={outcome}
                  onChange={function (e){
                      setOutcome(e.target.value);
                    }}>
                  <option value="yes">YES</option>
                  <option value="no">NO</option>
                </select>
              </div>
            </div>
            <div className="row">
              <div>
                <label htmlFor="amount">Whole shares</label>
                <input
                  id="amount"
                  type="number"
                  min={1}
                  max={100}
                  step={1}
                  value={amount}
                  required={true}
                  onChange={function (e){
                      setAmount(e.target.value);
                    }}/>
              </div>
              <div>
                <label htmlFor="price">Limit price (STATS)</label>
                <input
                  id="price"
                  type="number"
                  min={0.01}
                  max={1000}
                  step={0.01}
                  value={price}
                  required={true}
                  onChange={function (e){
                      setPrice(e.target.value);
                    }}/>
              </div>
            </div>
            <button disabled={!token || working || data.loading}>Submit order</button>
          </form>
          <p className="small">
            Crossing orders fill immediately; unmatched quantities remain in the book. Initial YES bids/asks are 9/11.
          </p>
          <p role="status" aria-live="polite">{data.error || message}</p>
        </section>
        <section className="card">
          <h2>Live order book</h2>
          <Table
            headers={["Outcome","Side","Price","Shares"]}
            rows={((state && state.book) || []).map(function (o){
                return [
                  o.outcome.toUpperCase(),
                  (o.side == "bid") ? "Buy" : "Sell",
                  o.price,
                  o.amount
                ];
              })}/>
        </section>
        <section className="card">
          <h2>Your open orders</h2>
          <Table
            headers={["Outcome","Side","Price","Remaining",""]}
            rows={((account && account.orders) || []).map(function (o){
                return [
                  o.outcome.toUpperCase(),
                  (o.side == "bid") ? "Buy" : "Sell",
                  o.price,
                  o.unfilled,
                  (
                      <button
                        disabled={working}
                        onClick={function (){
                            cancel(o.id);
                          }}>Cancel
                      </button>)
                ];
              })}/>
        </section>
        <section className="card">
          <h2>Recent settled trades</h2>
          <Table
            headers={["Time","Outcome","Price","Shares"]}
            rows={((state && state.trades) || []).map(function (t){
                return [
                  new Date(
                      (t.time_created > 100000000000000) ? (t.time_created / 1000) : t.time_created
                    ).toLocaleString(),
                  t.outcome.toUpperCase(),
                  t.price,
                  t.amount
                ];
              })}/>
        </section>
      </main>
    </React.Fragment>);
}

export default Page