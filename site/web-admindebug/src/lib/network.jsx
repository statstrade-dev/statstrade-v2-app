import React from 'react'

import * as substrate from '@statstrade/web-admindebug/lib/substrate.jsx'

import * as bus from '@xtalk/substrate/substrate.js'

// statstrade-admindebug.lib.network/SPACE [6] 
export var SPACE = "statstrade-network";

// statstrade-admindebug.lib.network/SIGNAL [7] 
export var SIGNAL = "network.changed";

// statstrade-admindebug.lib.network/reduceEvent [9] 
export function reduceEvent(state,event){
  let floor = Math.max(state.floor,event.floor || 0);
  let entries = state.entries.filter(function (entry){
    return entry.revision > floor;
  });
  let incoming = (event.type == "upsert") ? [event.entry] : (event.entries || []);
  incoming.forEach(function (entry){
    if(entry.revision > floor){
      let found = entries.find(function (old){
        return old.id == entry.id;
      });
      if(!found || (entry.revision >= found.revision)){
        entries = entries.filter(function (old){
          return !(old.id == entry.id);
        });
        entries.push(entry);
      }
    }
  });
  entries.sort(function (a,b){
    return b.id - a.id;
  });
  return {"entries":entries.slice(0,150),"floor":floor};
}

// statstrade-admindebug.lib.network/useNetwork [22] 
export function useNetwork(resource){
  let empty = {"entries":[],"floor":0};
  let latest = React.useRef(empty);
  let pausedRef = React.useRef(false);
  let [history,setHistory] = React.useState(empty);
  let [paused,setPaused] = React.useState(false);
  let [ready,setReady] = React.useState(false);
  let [error,setError] = React.useState(null);
  React.useEffect(function (){
    let active = true;
    let client = resource.client;
    let id = "network-" + Math.random().toString(36).slice(2);
    let receive = function (event){
      if(active){
        latest.current = reduceEvent(latest.current,event);
        if(!pausedRef.current){
          setHistory(latest.current);
        }
      }
    };
    bus.register_trigger(client,SIGNAL,function (_space,stream,_node){
      receive(stream.data);
      return true;
    },null);
    let setup = async function (){
      await bus.subscribe(client,SPACE,SIGNAL,id,{});
      let snapshot = await bus.request(client,null,"@statstrade-debug/network-snapshot",[],{});
      if(active){
        receive(snapshot);
        setReady(true);
        setError(null);
      }
    };
    let pending = setup().catch(function (){
      if(active){
        setError(
          "Network tracing is unavailable. Reload this tab to reconnect the debug worker."
        );
      }
    });
    return function (){
      active = false;
      pending.then(function (){
        return bus.unsubscribe(client,SPACE,SIGNAL,id,{});
      }).catch(function (){
        return null;
      }).finally(function (){
        bus.unregister_trigger(client,SIGNAL);
      });
    };
  },[resource]);
  let toggle = function (){
    pausedRef.current = !pausedRef.current;
    setPaused(pausedRef.current);
    if(!pausedRef.current){
      setHistory(latest.current);
    }
  };
  let clear = async function (){
    try{
      let event = await bus.request(resource.client,null,"@statstrade-debug/network-clear",[],{});
      latest.current = reduceEvent(latest.current,event);
      setHistory(latest.current);
    }
    catch(_){
      setError("Unable to clear the worker request log.");
    }
  };
  return {
    "entries":history.entries,
    "paused":paused,
    "ready":ready,
    "error":error,
    "toggle":toggle,
    "clear":clear
  };
}

// statstrade-admindebug.lib.network/matches [64] 
export function matches(entry,query,category,failed){
  return ((category == "All") || (category == entry.category)) && (!failed || (entry.status == 0) || (entry.status >= 400)) && (entry.method + " " + entry.url + " " + (entry.rpc || "") + " " + (entry.status || "")).toLowerCase().includes(query.toLowerCase());
}

// statstrade-admindebug.lib.network/Panel [70] 
export function Panel(){
  let provider = substrate.useSubstrateContext();
  let network = useNetwork(provider.resource);
  let [query,setQuery] = React.useState("");
  let [category,setCategory] = React.useState("All");
  let [failed,setFailed] = React.useState(false);
  let [selected,setSelected] = React.useState(null);
  let entries = network.entries.filter(function (entry){
    return matches(entry,query,category,failed);
  });
  let detail = network.entries.find(function (entry){
    return entry.id == selected;
  });
  return (
    <section
      className="card wide network-panel"
      aria-label="SharedWorker network">
      <div className="network-heading">
        <h2>Network</h2>
        <span className="small" role="status">
          {(network.paused ? "Display paused" : (network.ready ? "Live · SharedWorker" : "Connecting…")) + " · " + entries.length + " / " + network.entries.length + " requests"}
        </span>
      </div>
      <p className="small">
        Worker API traffic from all connected tabs · latest 150 requests · auth payloads omitted · credentials redacted
      </p>
      <div className="network-controls">
        <input
          type="search"
          aria-label="Filter network requests"
          placeholder="Filter endpoint, RPC or status…"
          value={query}
          onChange={function (e){
              setQuery(e.target.value);
            }}/>
        <select
          aria-label="Network request category"
          value={category}
          onChange={function (e){
              setCategory(e.target.value);
            }}>
          {["All","RPC","REST","Auth","GraphQL"].map(function (kind){
            return (
              <option key={kind} value={kind}>{kind}</option>);
          })}
        </select>
        <label className="network-errors">
          <input
            type="checkbox"
            checked={failed}
            onChange={function (e){
                setFailed(e.target.checked);
              }}/>
          Failed only
        </label>
        <button
          type="button"
          disabled={!network.ready}
          onClick={network.toggle}>{network.paused ? "Resume display" : "Pause display"}
        </button>
        <button
          type="button"
          disabled={!network.ready}
          onClick={network.clear}>Clear log
        </button>
      </div>
      {network.error && (
        <p role="alert" className="negative">{network.error}</p>)}
      <div className="network-table scroll">
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Method</th>
              <th>Type</th>
              <th>Endpoint / RPC</th>
              <th>Status</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(function (entry){
              return (
                <tr
                  key={entry.id}
                  className={(entry.id == selected) ? "network-selected" : ""}>
                  <td>{new Date(entry.time).toLocaleTimeString()}</td>
                  <td>{entry.method}</td>
                  <td>{entry.category}</td>
                  <td>
                    <button
                      type="button"
                      className="network-endpoint"
                      onClick={function (){
                          setSelected(entry.id);
                        }}>{entry.rpc || entry.path}
                    </button>
                  </td>
                  <td
                    className={((entry.status == 0) || (entry.status >= 400)) ? "negative" : ""}>
                    {entry.pending ? "Pending" : ((entry.status == 0) ? "Error" : entry.status)}
                  </td>
                  <td>{entry.pending ? "—" : (entry.duration + " ms")}</td>
                </tr>);
            })}
          </tbody>
        </table>
      </div>
      {(entries.length == 0) && (
        <p className="small">
          No matching requests. Sign in or choose a market to generate API traffic.
        </p>)}
      {detail && (
        <div className="network-details">
          <h3>{detail.method + " " + (detail.rpc || detail.path)}</h3>
          <p className="small">{detail.url}</p>
          {detail.error && (
            <p role="alert" className="negative">{detail.error}</p>)}
          <div className="network-payloads">
            <div>
              <h4>Request</h4>
              <pre aria-label="Network request details">{JSON.stringify(detail.request,null,2)}</pre>
            </div>
            <div>
              <h4>Response</h4>
              <pre aria-label="Network response details">{JSON.stringify(detail.response,null,2)}</pre>
            </div>
          </div>
        </div>)}
    </section>);
}