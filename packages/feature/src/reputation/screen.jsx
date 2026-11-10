import React from 'react'

import * as T from 'tamagui'

import * as model from '@statstrade/feature/reputation/model.jsx'

import * as global_store from '@statstrade/edge/global-store.jsx'

import * as page_api from '@statstrade/edge/substrate/page-api.jsx'

// statstrade-web.feature.reputation.screen/styles [11] 
export var styles = "\n.rep{--accent:#b7193e;max-width:1200px;margin:0 auto;padding:32px 24px 72px;color:var(--color,#22212b);font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif}\n.rep *{box-sizing:border-box}.rep button,.rep input,.rep select,.rep textarea{font:inherit}.rep a{color:var(--accent)}\n.rep h1{font-size:32px;letter-spacing:-1px;margin:8px 0}.rep h2{font-size:21px;margin:0 0 16px}.rep h3{font-size:16px;margin:0 0 8px}.rep p{line-height:1.6;margin:8px 0}.rep small,.rep .muted{color:#6c6878;font-size:13px}.rep .eyebrow{font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:var(--accent);font-weight:700}\n.rep .row{display:flex;gap:12px;align-items:center;flex-wrap:wrap}.rep .between{justify-content:space-between}.rep .grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.rep .two{grid-template-columns:repeat(2,minmax(0,1fr))}.rep .card{padding:22px;border:1px solid #e5e1e7;border-radius:12px;background:var(--background,#fff);min-width:0}.rep .section{margin-top:28px}.rep .banner{padding:14px 18px;background:#fff6e8;color:#624512;border:1px solid #efddb9;border-radius:10px;margin-bottom:24px}.rep .notice{padding:14px 18px;background:#f5f3f7;border-radius:8px;color:#55515e}.rep .error{color:#a11136;background:#fff0f3;padding:12px;border-radius:8px}.rep .tabs{display:flex;flex-wrap:wrap;border-bottom:1px solid #e5e1e7;gap:4px;margin:24px 0}.rep .tabs button{border:0;border-bottom:3px solid transparent;border-radius:0;background:transparent;padding:14px 16px;color:inherit;cursor:pointer}.rep .tabs button[aria-selected=true]{border-color:var(--accent);color:var(--accent);font-weight:700}\n.rep label{display:block;font-size:13px;font-weight:600;margin:12px 0 6px}.rep input:not([type=checkbox]),.rep select,.rep textarea{width:100%;padding:10px 12px;border:1px solid #c9c3ce;border-radius:6px;background:var(--background,#fff);color:inherit}.rep textarea{min-height:74px}.rep button:disabled{cursor:not-allowed;opacity:.55}.rep .badge{display:inline-block;border:1px solid #ddd7e2;border-radius:20px;padding:4px 10px;font-size:11px;white-space:nowrap}.rep .amount{font-size:27px;font-weight:700;letter-spacing:-.5px}.rep .stat{padding:12px 0}.rep .bar{height:5px;border-radius:5px;background:#eee9ef;overflow:hidden;margin:12px 0}.rep .fill{height:100%;background:var(--accent)}.rep .list-row{padding:16px 0;border-top:1px solid #eee9ef}.rep .receipt{max-width:640px;margin:24px auto}.rep .receipt-header{padding:24px;background:#f9edf1;border-radius:9px;margin-bottom:16px;color:#8e1231}.rep .empty{padding:36px 20px;text-align:center;border:1px dashed #d7d0dd;border-radius:10px}.rep .link-button{border:0;background:none;padding:0;text-align:left;color:var(--accent);cursor:pointer}.rep .checkbox{display:flex;gap:8px;align-items:center;margin:12px 0}.rep :focus-visible{outline:3px solid #a43b62;outline-offset:3px}.rep .pair{display:flex;justify-content:space-between;gap:16px;padding:10px 0;border-bottom:1px solid #eee9ef}.rep .full{grid-column:1/-1}.rep .subtle{background:#faf8fb}.rep .delta{color:#22744b}.rep .brand-picker{min-width:180px}\n@media(max-width:760px){.rep{padding:20px 14px 50px}.rep h1{font-size:26px}.rep .grid,.rep .two{grid-template-columns:1fr}.rep .tabs button{padding:12px 9px;font-size:13px}.rep .card{padding:17px}.rep .row.between{align-items:flex-start}}\n";

// statstrade-web.feature.reputation.screen/Button [20] 
export function Button({children,onPress,disabled,secondary,ariaLabel}){
  return (
    <button
      onClick={onPress}
      disabled={disabled}
      aria-label={ariaLabel}
      type="button"
      className={secondary ? "st-secondary-button" : "st-primary-button"}>{children}
    </button>);
}

// statstrade-web.feature.reputation.screen/Empty [24] 
export function Empty({title,text}){
  return (
    <div className="empty"><h3>{title}</h3><p className="muted">{text}</p></div>);
}

// statstrade-web.feature.reputation.screen/Receipt [27] 
export function Receipt({award,brand,onClose}){
  return (
    <section className="card receipt" aria-label="Award receipt">
      <div className="row between">
        <span className="eyebrow">Award receipt</span>
        <Button secondary={true} onPress={onClose}>Close</Button>
      </div>
      <div className="receipt-header section">
        <h2>{award.title}</h2>
        <p>
          {((award.status == "fulfilled") ? "Awarded by " : "Recorded by ") + brand.title}
        </p>
        <span className="badge">{award.status}</span>
      </div>
      {(award.lines || []).map(function (line,index){
        return (
          <div className="pair" key={index}>
            <span>{line.label}</span>
            <strong>
              {((line.amount > 0) ? "+" : "") + model.number_label(line.amount)}
            </strong>
          </div>);
      })}
      {!(null == award.rating_after) ? (
        <div className="notice section">
          <strong>Skill rating</strong>
          <p>
            {model.number_label(award.rating_before) + " → " + model.number_label(award.rating_after)}
          </p>
          <small>Published score · separate from earned points</small>
        </div>) : null}
      {award.extra ? (
        <div className="section">
          <h3>Additional reward</h3>
          <p>{award.extra}</p>
          <small>Eligibility and fulfilment follow the recorded award.</small>
        </div>) : null}
      {award.explanation ? (
        <p className="notice section">{award.explanation}</p>) : null}
      <div className="section">
        <small>{"Record: " + award.id}</small>
        {award.policy_version ? (
          <p className="muted">{"Policy version: " + award.policy_version}</p>) : null}
      </div>
      <p className="muted section">
        Each line represents a recorded award. Points of different types are not added into a single balance.
      </p>
    </section>);
}

// statstrade-web.feature.reputation.screen/MemberProfile [38] 
export function MemberProfile({data,configuration}){
  let [selected,setSelected] = React.useState(null);
  let [receipt,setReceipt] = React.useState(null);
  let ownAwards = data.awards.filter(function (award){
    return !data.scopeUserId || (award.user_id == data.scopeUserId);
  });
  let cards = model.aspect_cards(configuration,data.assets,data.tokens,data.configs,data.scores);
  let visible = cards.filter(function (c){
    return !c.archived || !(null == c.balance) || !(null == c.lifetime_earned) || !(null == c.rating);
  });
  let detail = cards.find(function (c){
    return c.id == selected;
  });
  if(receipt){
    return (
      <Receipt
        award={receipt}
        brand={data.brand}
        onClose={function (){
            setReceipt(null);
          }}/>);
  }
  if(detail){
    return (
      <section className="section">
        <Button
          secondary={true}
          onPress={function (){
              setSelected(null);
            }}>← All expertise
        </Button>
        <div className="card section">
          <span className="eyebrow">{data.brand.title + " · " + detail.kind}</span>
          <h1>{detail.name}</h1>
          <p>{detail.description}</p>
          <div className="grid section">
            <div>
              <small>Lifetime earned points</small>
              <div className="amount">{model.number_label(detail.lifetime_earned)}</div>
              <small>Historical total · never reduced by spending or expiry</small>
            </div>
            <div>
              <small>Current point balance</small>
              <div className="amount">{model.number_label(detail.balance)}</div>
            </div>
            <div>
              <small>Published skill rating</small>
              <div className="amount">{model.number_label(detail.rating)}</div>
              <small>
                {detail.samples ? (detail.samples + " scored predictions") : "No published rating"}
              </small>
            </div>
          </div>
          <p className="notice section">
            Ratings follow this brand’s published scoring policy. Historical awards keep the rule that applied when they were issued.
          </p>
        </div>
        <h2 className="section">Contributing predictions & awards</h2>
        {(data.history || []).some(function (h){
          return h.category_id == detail.id;
        }) ? (
          <div className="card">
            {data.history.filter(function (h){
              return h.category_id == detail.id;
            }).map(function (h,index){
              return (
                <div className="list-row" key={index}>
                  <h3>{h.title}</h3>
                  <p>{h.probability}</p>
                  <p>
                    {h.outcome + " · +" + model.number_label(h.points) + " " + detail.name + " points"}
                  </p>
                  {h.award_ref ? (
                    <Button
                      secondary={true}
                      onPress={function (){
                          setReceipt(data.awards.find(function (a){
                            return a.id == h.award_ref;
                          }));
                        }}>View contributing award
                    </Button>) : (
                    <a href={"/questions/" + h.question_id}>View prediction</a>)}
                </div>);
            })}
          </div>) : (
          <Empty
            title="Aspect history"
            text="A category total alone cannot identify contributing predictions. A published aspect history is required to list them here."/>)}
      </section>);
  }
  return (
    <section>
      <div className="row between section">
        <div>
          <span className="eyebrow">Member reputation</span>
          <h1>Your expertise</h1>
          <p className="muted">Earned points and published skill, side by side.</p>
        </div>
        <div className="brand-picker">
          <label htmlFor="reputation-brand">Awarding brand</label>
          <select
            id="reputation-brand"
            value={data.brand.id}
            onChange={function (){
                
              }}><option value={data.brand.id}>{data.brand.title}</option>
          </select>
        </div>
      </div>
      {["subject","forecast"].map(function (kind){
        let items = visible.filter(function (c){
          return c.kind == kind;
        });
        return (
          <div key={kind} className="section">
            <h2>
              {(kind == "subject") ? "Subject expertise" : "Forecasting strengths"}
            </h2>
            {(items.length == 0) ? (
              <Empty
                title="No aspects published yet"
                text="This brand controls the categories and their earning rules."/>) : (
              <div className="grid">
                {items.map(function (c){
                  return (
                    <article className="card" key={c.id}>
                      <div className="row between">
                        <button
                          className="link-button"
                          onClick={function (){
                              setSelected(c.id);
                            }}><h3>{c.name}</h3>
                        </button>
                        {c.archived ? (
                          <span className="badge">Archived</span>) : null}
                      </div>
                      <small>{"Awarded by " + data.brand.title}</small>
                      <div className="stat">
                        <div className="amount">{model.number_label(c.lifetime_earned)}</div>
                        <small>Lifetime earned points</small>
                      </div>
                      <p className="muted">{"Current balance: " + model.number_label(c.balance)}</p>
                      {(!(null == c.rating) && (c.scale_max > 0)) ? (
                        <div className="bar" aria-hidden={true}>
                          <div
                            className="fill"
                            style={{
                                "width":Math.max(0,Math.min(100,100 * (c.rating / c.scale_max))) + "%",
                                "background":c.color
                              }}/>
                        </div>) : null}
                      <div className="row between">
                        <span>
                          {(null == c.rating) ? "Not rated" : ("Skill " + model.number_label(c.rating))}
                        </span>
                        <small>
                          {c.samples ? (c.samples + " predictions" + (c.provisional ? " · provisional" : "")) : "No published score"}
                        </small>
                      </div>
                    </article>);
                })}
              </div>)}
          </div>);
      })}
      <h2 className="section">Recent awards</h2>
      {(ownAwards.length == 0) ? (
        <Empty
          title="No published awards"
          text="Your confirmed awards will identify the issuing brand and each individual point type."/>) : (
        <div className="card">
          {ownAwards.map(function (award){
            return (
              <div className="list-row row between" key={award.id}>
                <div>
                  <h3>{award.title}</h3>
                  <small>{"Awarded by " + data.brand.title + " · " + award.status}</small>
                </div>
                <Button
                  secondary={true}
                  onPress={function (){
                      setReceipt(award);
                    }}>View breakdown
                </Button>
              </div>);
          })}
        </div>)}
    </section>);
}

// statstrade-web.feature.reputation.screen/CategoryEditor [81] 
export function CategoryEditor({value,categories,tokens,configs,onSave,onCancel}){
  let [form,setForm] = React.useState(value);
  let [error,setError] = React.useState(null);
  function change(key,value){
    let next = Object.assign({},form);
    next[key] = value;
    setForm(next);
  }
  return (
    <section className="card section" aria-label="Category editor">
      <h2>{form.id ? "Edit category" : "New category"}</h2>
      <div className="grid two">
        <div>
          <label htmlFor="category-name">Name</label>
          <T.Input
            id="category-name"
            value={form.name}
            maxLength={100}
            onChangeText={function (v){
                change("name",v);
              }}
            required={true}/>
        </div>
        <div>
          <label htmlFor="category-kind">Kind</label>
          <select
            id="category-kind"
            value={form.kind}
            onChange={function (e){
                change("kind",e.target.value);
              }}>
            <option value="subject">Subject expertise</option>
            <option value="forecast">Forecasting aspect</option>
          </select>
        </div>
        {(form.kind == "forecast") ? (
          <div>
            <label htmlFor="category-metric">Skill metric</label>
            <select
              id="category-metric"
              value={form.metric || (["accuracy","early-insight","consistency","calibration"].includes(form.id) ? form.id : "accuracy")}
              onChange={function (e){
                  change("metric",e.target.value);
                }}>
              {["accuracy","early-insight","consistency","calibration"].map(function (metric){
                return (
                  <option key={metric} value={metric}>{metric}</option>);
              })}
            </select>
          </div>) : null}
        <div>
          <label htmlFor="category-parent">Parent category</label>
          <select
            id="category-parent"
            value={form.parent_id || ""}
            onChange={function (e){
                change("parent_id",e.target.value || null);
              }}>
            <option value="">No parent</option>
            {categories.filter(function (c){
              return !(c.id == form.id) && (c.kind == form.kind);
            }).map(function (c){
              return (
                <option key={c.id} value={c.id}>{c.name}</option>);
            })}
          </select>
        </div>
        <div>
          <label htmlFor="category-colour">Colour</label>
          <input
            id="category-colour"
            type="color"
            value={form.color}
            onChange={function (e){
                change("color",e.target.value);
              }}/>
        </div>
        <div className="full">
          <label htmlFor="category-description">What this recognises</label>
          <T.TextArea
            id="category-description"
            value={form.description}
            maxLength={500}
            onChangeText={function (v){
                change("description",v);
              }}/>
        </div>
        <div>
          <label htmlFor="category-token">Point type</label>
          <select
            id="category-token"
            value={form.token_id || ""}
            onChange={function (e){
                change("token_id",e.target.value || null);
              }}>
            <option value="">Not linked yet</option>
            {tokens.map(function (t){
              return (
                <option value={t.id} key={t.id}>{t.title || t.name}</option>);
            })}
          </select>
        </div>
        <div>
          <label htmlFor="category-playable">Playable context</label>
          <select
            id="category-playable"
            value={form.playable_id || ""}
            onChange={function (e){
                change("playable_id",e.target.value || null);
              }}>
            <option value="">Not linked yet</option>
            {configs.filter(function (c){
              return c.token_id == form.token_id;
            }).map(function (c){
              return (
                <option key={c.token_id + ":" + c.playable_id} value={c.playable_id}>{(c.display && c.display.label) || c.playable_id}</option>);
            })}
          </select>
        </div>
      </div>
      {error ? (
        <p className="error" role="alert">{error}</p>) : null}
      <div className="row section">
        <Button
          onPress={function (){
              try{
                onSave(((form.kind == "forecast") && !form.metric) ? Object.assign({},form,{
                  "metric":["accuracy","early-insight","consistency","calibration"].includes(form.id) ? form.id : "accuracy"
                }) : form);
              }
              catch(e){
                setError(e.message);
              }
            }}>Apply category
        </Button>
        <Button secondary={true} onPress={onCancel}>Cancel</Button>
      </div>
    </section>);
}

// statstrade-web.feature.reputation.screen/Categories [102] 
export function Categories({configuration,setConfiguration,data,canEdit}){
  let [editing,setEditing] = React.useState(null);
  function update(rows){
    setConfiguration(Object.assign({},configuration,{"categories":rows}));
  }
  return (
    <section>
      <div className="row between">
        <div>
          <h2>Your category catalogue</h2>
          <p className="muted">
            Subjects and forecasting aspects belong to your brand. Archive categories to keep their award history.
          </p>
        </div>
        <Button
          disabled={!canEdit}
          onPress={function (){
              setEditing({
                "id":null,
                "name":"",
                "kind":"subject",
                "description":"",
                "color":"#b7193e",
                "parent_id":null,
                "archived":false
              });
            }}>+ New category
        </Button>
      </div>
      {editing ? (
        <CategoryEditor
          key={editing.id || "new"}
          value={editing}
          categories={configuration.categories}
          tokens={data.tokens}
          configs={data.configs}
          onCancel={function (){
              setEditing(null);
            }}
          onSave={function (form){
              update(model.category_save(configuration.categories,form));
              setEditing(null);
            }}/>) : null}
      {(configuration.categories.length == 0) ? (
        <div className="empty section">
          <h3>Start with your own categories</h3>
          <p>
            Create your first category, or use an editable template with eight subjects and four forecasting aspects.
          </p>
          <Button
            secondary={true}
            disabled={!canEdit}
            onPress={function (){
                update(model.starter_categories());
              }}>Use starter template
          </Button>
        </div>) : (
        <div className="card section">
          {configuration.categories.map(function (c,index){
            let parent = configuration.categories.find(function (p){
              return p.id == c.parent_id;
            });
            return (
              <div className="list-row row between" key={c.id}>
                <div>
                  <div className="row">
                    <span
                      style={{"width":10,"height":10,"borderRadius":10,"background":c.color}}/>
                    <h3>{c.name}</h3>
                    <span className="badge">{c.archived ? "Archived" : c.kind}</span>
                  </div>
                  <small>
                    {c.parent_id ? ("Specialisation of " + (parent ? parent.name : "Unavailable category")) : (c.description || "No description")}
                  </small>
                </div>
                <div className="row">
                  <Button
                    secondary={true}
                    ariaLabel={"Move " + c.name + " up"}
                    disabled={!canEdit || (index == 0)}
                    onPress={function (){
                        update(model.reorder_category(configuration.categories,c.id,-1));
                      }}>↑
                  </Button>
                  <Button
                    secondary={true}
                    ariaLabel={"Move " + c.name + " down"}
                    disabled={!canEdit || (index == (configuration.categories.length - 1))}
                    onPress={function (){
                        update(model.reorder_category(configuration.categories,c.id,1));
                      }}>↓
                  </Button>
                  <Button
                    secondary={true}
                    ariaLabel={"Edit " + c.name}
                    disabled={!canEdit}
                    onPress={function (){
                        setEditing(c);
                      }}>Edit
                  </Button>
                  <Button
                    secondary={true}
                    ariaLabel={(c.archived ? "Restore " : "Archive ") + c.name}
                    disabled={!canEdit}
                    onPress={function (){
                        update(model.category_save(
                          configuration.categories,
                          Object.assign({},c,{"archived":!c.archived})
                        ));
                      }}>{c.archived ? "Restore" : "Archive"}
                  </Button>
                </div>
              </div>);
          })}
        </div>)}
    </section>);
}

// statstrade-web.feature.reputation.screen/Points [125] 
export function Points({data}){
  return (
    <section>
      <div className="row between">
        <div>
          <h2>Points & playable experiences</h2>
          <p className="muted">
            A point type and its playable context identify a balance. Category labels do not create new balances.
          </p>
        </div>
        <a href="/manage/tokens">Manage brand tokens →</a>
      </div>
      {(data.configs.length == 0) ? (
        <Empty
          title="No configured point types"
          text="Configure a brand token and playable context, then link them to a category."/>) : (
        <div className="grid section">
          {data.configs.map(function (c,index){
            let token = data.tokens.find(function (t){
              return t.id == c.token_id;
            });
            return (
              <div className="card" key={index}>
                <span className="badge">{c.status}</span>
                <h3 className="section">
                  {(token && token.title) || (token && token.name) || "Point type"}
                </h3>
                <p>{(c.display && c.display.label) || "Configured playable"}</p>
                <div className="pair">
                  <small>Transfers</small>
                  <span>{c.is_transferable ? "Allowed" : "Not transferable"}</span>
                </div>
                <div className="pair">
                  <small>Earning limit</small>
                  <span>
                    {(c.earn_limits && c.earn_limits.maximum) ? (model.number_label(c.earn_limits.maximum) + " / " + c.earn_limits.period) : "Not specified"}
                  </span>
                </div>
                <small>
                  Access opportunities and awardable items follow their own eligibility and fulfilment rules.
                </small>
              </div>);
          })}
        </div>)}
    </section>);
}

// statstrade-web.feature.reputation.screen/Rules [137] 
export function Rules({configuration,setConfiguration,canEdit,onActivate}){
  let [name,setName] = React.useState("");
  let [category,setCategory] = React.useState("");
  let [base,setBase] = React.useState("10");
  let [cap,setCap] = React.useState("5");
  let [error,setError] = React.useState(null);
  function add(){
    setError(null);
    if(!Number.isFinite(Number(base)) || (Number(base) <= 0) || !Number.isFinite(Number(cap)) || (Number(cap) < 0)){
      setError(
        "Enter a positive base amount and a non-negative bonus cap."
      );
      return;
    }
    setConfiguration(Object.assign({},configuration,{
      "rules":configuration.rules.concat([
            {
                "id":"rule-" + Date.now(),
                "name":name.trim(),
                "status":"draft",
                "event":"resolved_correct_call",
                "category_id":category,
                "base_amount":Number(base),
                "bonus_cap":Number(cap),
                "forecast_policy":"history_requested"
              }
          ])
    }));
    setName("");
  }
  return (
    <section>
      <h2>Earning rules</h2>
      <p className="notice">
        Save a draft before activation. Active rules are snapshotted when a future question is enrolled; edits never change awards already recorded.
      </p>
      <div className="card section">
        <h3>Draft a correct-call rule</h3>
        <div className="grid two">
          <div>
            <label htmlFor="rule-name">Rule name</label>
            <T.Input
              id="rule-name"
              value={name}
              onChangeText={setName}
              maxLength={100}/>
          </div>
          <div>
            <label htmlFor="rule-category">Award aspect</label>
            <select
              id="rule-category"
              value={category}
              onChange={function (e){
                  setCategory(e.target.value);
                }}>
              <option value="">Choose a linked aspect</option>
              {configuration.categories.filter(function (c){
                return !c.archived && c.token_id && c.playable_id;
              }).map(function (c){
                return (
                  <option key={c.id} value={c.id}>{c.name}</option>);
              })}
            </select>
          </div>
          <div>
            <label htmlFor="rule-base">Base win points</label>
            <input
              id="rule-base"
              type="number"
              min="0.01"
              step="any"
              value={base}
              onChange={function (e){
                  setBase(e.target.value);
                }}/>
          </div>
          <div>
            <label htmlFor="rule-cap">Maximum bonus points</label>
            <input
              id="rule-cap"
              type="number"
              min="0"
              step="any"
              value={cap}
              onChange={function (e){
                  setCap(e.target.value);
                }}/>
          </div>
        </div>
        <p className="muted">
          Requested policy: explicit probability forecasts and forecast history, with a capped bonus. A history-based scorer must be connected before activation; the existing last-before-lock policy is not presented as history scoring.
        </p>
        {error ? (
          <p role="alert" className="error">{error}</p>) : null}
        <Button
          disabled={!canEdit || !name.trim() || !category}
          onPress={add}>Add draft rule
        </Button>
      </div>
      {configuration.rules.map(function (rule){
        let aspect = configuration.categories.find(function (c){
          return c.id == rule.category_id;
        });
        return (
          <div className="card section" key={rule.id}>
            <div className="row between">
              <h3>{rule.name}</h3>
              <span className="badge">{rule.status || "draft"}</span>
            </div>
            <p>
              {aspect ? (aspect.name + " · " + model.number_label(rule.base_amount) + " base points + up to " + model.number_label(rule.bonus_cap) + " bonus points") : "Choose a configured aspect before activation."}
            </p>
            <p className="muted">
              Trigger: resolved correct call. Point amounts are draft instructions, not an active scoring policy.
            </p>
            <Button
              secondary={true}
              disabled={!canEdit}
              onPress={function (){
                  setConfiguration(Object.assign({},configuration,{
                    "rules":configuration.rules.filter(function (r){
                          return !(r.id == rule.id);
                        })
                  }));
                }}>Remove draft
            </Button>
            {onActivate ? (
              <Button
                disabled={!canEdit || (rule.status == "active")}
                onPress={function (){
                    onActivate(rule.id);
                  }}>{(rule.status == "active") ? "Active" : "Activate rule"}
              </Button>) : null}
          </div>);
      })}
    </section>);
}

// statstrade-web.feature.reputation.screen/Awards [169] 
export function Awards({data}){
  let [receipt,setReceipt] = React.useState(null);
  let [recipient,setRecipient] = React.useState("");
  let [reason,setReason] = React.useState("");
  let [review,setReview] = React.useState(false);
  let [command,setCommand] = React.useState(null);
  let [issuing,setIssuing] = React.useState(false);
  let [issueError,setIssueError] = React.useState(null);
  let [categoryId,setCategoryId] = React.useState("");
  let categories = model.programme(data.brand)["categories"];
  let [budgetId,setBudgetId] = React.useState("");
  let [amount,setAmount] = React.useState("10");
  let budget = data.budgets.find(function (b){
    return b.id == budgetId;
  });
  let token = budget && data.tokens.find(function (t){
    return t.id == budget.token_id;
  });
  let available = budget && (budget.limit - budget.awarded - budget.reserved);
  let valid = budget && (budget.status == "active") && Number.isFinite(Number(amount)) && (Number(amount) > 0) && (Number(amount) <= available);
  if(receipt){
    return (
      <Receipt
        award={receipt}
        brand={data.brand}
        onClose={function (){
            setReceipt(null);
          }}/>);
  }
  return (
    <section>
      <h2>Awards & budgets</h2>
      {data.grantReward ? (
        <a href="/manage/reputation/budgets">Manage budgets</a>) : null}
      <div className="grid section">
        {data.budgets.map(function (b){
          return (
            <div className="card" key={b.id}>
              <span className="badge">{b.status}</span>
              <h3 className="section">Award budget</h3>
              <div className="pair">
                <span>Budget limit</span>
                <strong>{model.number_label(b.limit)}</strong>
              </div>
              <div className="pair">
                <span>Already awarded</span>
                <strong>{model.number_label(b.awarded)}</strong>
              </div>
              <div className="pair">
                <span>Reserved</span>
                <strong>{model.number_label(b.reserved)}</strong>
              </div>
              <small>
                Reservations and available spend must be confirmed by the issuing service.
              </small>
            </div>);
        })}
      </div>
      {(data.budgets.length == 0) ? (
        <Empty
          title="No budget summary available"
          text="A private, brand-scoped budget read is required before spending can be shown."/>) : null}
      <div className="card section">
        <h3>Manual award</h3>
        <p className="muted">
          Choose a recipient, point budget and reason. Awards are recorded with a permanent transaction receipt.
        </p>
        <label htmlFor="award-recipient">Recipient handle</label>
        <T.Input
          id="award-recipient"
          value={recipient}
          onChangeText={function (v){
              setRecipient(v);
              setReview(false);
            }}/>
        {data.grantReward ? (
          <div>
            <label htmlFor="award-category">Award aspect</label>
            <select
              id="award-category"
              value={categoryId}
              onChange={function (e){
                  setCategoryId(e.target.value);
                  setReview(false);
                }}>
              <option value="">Choose an aspect</option>
              {categories.filter(function (c){
                return budget && !c.archived && (c.token_id == budget.token_id) && (c.playable_id == budget.playable_id);
              }).map(function (c){
                return (
                  <option key={c.id} value={c.id}>{c.name}</option>);
              })}
            </select>
          </div>) : null}
        <label htmlFor="award-reason">Reason</label>
        <T.TextArea
          id="award-reason"
          value={reason}
          onChangeText={function (v){
              setReason(v);
              setReview(false);
            }}/>
        <div className="grid two">
          <div>
            <label htmlFor="award-budget">Point type & budget</label>
            <select
              id="award-budget"
              value={budgetId}
              onChange={function (e){
                  setBudgetId(e.target.value);
                  setReview(false);
                }}>
              <option value="">Choose a budget</option>
              {data.budgets.map(function (b){
                let t = data.tokens.find(function (t){
                  return t.id == b.token_id;
                });
                return (
                  <option key={b.id} value={b.id}>
                    {((t && t.title) || (t && t.name) || b.token_id) + " · " + b.status}
                  </option>);
              })}
            </select>
          </div>
          <div>
            <label htmlFor="award-amount">Point amount</label>
            <input
              id="award-amount"
              type="number"
              min="0.01"
              step="any"
              value={amount}
              onChange={function (e){
                  setAmount(e.target.value);
                  setReview(false);
                }}/>
          </div>
        </div>
        {budget ? (
          <p className="muted">
            {"Available after reservations: " + model.number_label(available) + ". " + (valid ? "" : "Amount must be positive, within budget, and use an active budget.")}
          </p>) : null}
        <Button
          secondary={true}
          disabled={!data.canManage || !valid || (data.grantReward && !categoryId) || !recipient.trim() || !reason.trim()}
          onPress={function (){
              setCommand(crypto.randomUUID());
              setReview(true);
            }}>Review award setup
        </Button>
        {review ? (
          <div className="notice section">
            <strong>{"Recipient: " + recipient}</strong>
            <p>{reason}</p>
            <p>{"Issuer: " + data.brand.title}</p>
            <p>
              {model.number_label(Number(amount)) + " " + ((token && token.title) || (token && token.name) || "points")}
            </p>
            <p>
              {"Budget after this proposed award: " + model.number_label(available - Number(amount))}
            </p>
            <p>
              {data.grantReward ? "Confirming issues this award. The server checks access, recipient eligibility and remaining budget atomically." : "Preview only. No reward will be issued."}
            </p>
            {issueError ? (
              <p role="alert" className="error">{issueError}</p>) : null}
            <Button
              disabled={issuing || !data.grantReward || !valid}
              onPress={function (){
                  setIssuing(true);
                  setIssueError(null);
                  data.grantReward({
                    "recipient":recipient,
                    "budget_id":budgetId,
                    "amount":Number(amount),
                    "reason":reason,
                    "category_id":categoryId,
                    "command":command
                  }).then(function (){
                    setReview(false);
                    setRecipient("");
                    setReason("");
                  }).catch(function (e){
                    setIssueError(e.message);
                  }).finally(function (){
                    setIssuing(false);
                  });
                }}>
              {data.grantReward ? (issuing ? "Issuing…" : "Confirm award") : "Issuing unavailable"}
            </Button>
          </div>) : null}
      </div>
      <h2 className="section">Award history</h2>
      {(data.awards.length == 0) ? (
        <Empty
          title="No award history available"
          text="A reward is shown only after its issuing record is available."/>) : (
        <div className="card">
          {data.awards.map(function (award){
            return (
              <div className="list-row row between" key={award.id}>
                <div>
                  <h3>{award.title}</h3>
                  <small>{data.brand.title + " · " + award.status}</small>
                </div>
                <Button
                  secondary={true}
                  onPress={function (){
                      setReceipt(award);
                    }}>Inspect award
                </Button>
              </div>);
          })}
        </div>)}
    </section>);
}

// statstrade-web.feature.reputation.screen/ReputationWorkspace [222] 
export function ReputationWorkspace({data,preview,onSave}){
  let [view,setView] = React.useState("manage");
  let [activeTab,setTab] = React.useState("categories");
  let [configuration,setConfiguration] = React.useState(model.programme(data.brand));
  let [saved,setSaved] = React.useState(JSON.stringify(model.programme(data.brand)));
  let [busy,setBusy] = React.useState(false);
  let [message,setMessage] = React.useState(null);
  let [error,setError] = React.useState(null);
  let canEdit = data.canManage && !busy;
  let dirty = !(saved == JSON.stringify(configuration));
  function activate(id){
    setError(null);
    setBusy(true);
    data.activateRule(id).then(function (brand){
      let next = model.programme(brand);
      setConfiguration(next);
      setSaved(JSON.stringify(next));
    }).catch(function (e){
      setError(e.message);
    }).finally(function (){
      setBusy(false);
    });
  }
  function save(){
    if(!preview && !onSave){
      setError("Configuration saving is unavailable.");
      return;
    }
    setBusy(true);
    setError(null);
    setMessage(null);
    Promise.resolve().then(function (){
      model.validate_categories(configuration.categories);
      if(onSave){
        return onSave(configuration);
      }
    }).then(function (){
      setSaved(JSON.stringify(configuration));
      setMessage(
        preview ? "Preview updated for this session. No live brand data was changed." : "Brand programme configuration saved. Award rules remain drafts."
      );
    }).catch(function (e){
      setError(e.message);
    }).finally(function (){
      setBusy(false);
    });
  }
  React.useEffect(function (){
    function warn(e){
      if(dirty){
        e.preventDefault();
        e.returnValue = "";
      }
    }
    window.addEventListener("beforeunload",warn);
    return function (){
      window.removeEventListener("beforeunload",warn);
    };
  },[dirty]);
  return (
    <div className="rep">
      <style>{styles}</style>
      {preview ? (
        <div className="banner" role="status">
          <strong>Interactive design preview</strong>
           · Sample AusPolitics data. Edits last for this session only; no points or rewards are issued.
        </div>) : null}
      <div className="row between">
        <div>
          <span className="eyebrow">{data.brand.title + " / Brand programme"}</span>
          <h1>Reputation & rewards</h1>
          <p className="muted">
            Categories, point types and award policies owned by your brand.
          </p>
        </div>
        <div className="row">
          <Button
            secondary={!(view == "manage")}
            onPress={function (){
                setView("manage");
              }}>Brand manager
          </Button>
          <Button
            secondary={!(view == "member")}
            onPress={function (){
                setView("member");
              }}>Member profile
          </Button>
        </div>
      </div>
      {data.notice ? (
        <p className="notice section">{data.notice}</p>) : null}
      {!data.canManage ? (
        <p className="notice section">
          Read-only programme. Only an active brand owner or administrator can save changes.
        </p>) : null}
      {error ? (
        <p className="error" role="alert">{error}</p>) : null}
      {message ? (
        <p className="notice" role="status">{message}</p>) : null}
      {(view == "member") ? (
        <MemberProfile data={data} configuration={configuration}/>) : (
        <div>
          <div
            className="tabs"
            role="tablist"
            aria-label="Reputation administration">
            {[
              {"id":"categories","label":"Categories"},
              {"id":"points","label":"Points & playables"},
              {"id":"rules","label":"Earning rules"},
              {"id":"awards","label":"Awards & budgets"}
            ].map(function (t){
              return (
                <button
                  type="button"
                  role="tab"
                  key={t.id}
                  id={"tab-" + t.id}
                  aria-controls={"panel-" + t.id}
                  aria-selected={activeTab == t.id}
                  onKeyDown={function (e){
                      if(["ArrowLeft","ArrowRight","Home","End"].includes(e.key)){
                        e.preventDefault();
                        let ids = ["categories","points","rules","awards"];
                        let index = ids.indexOf(activeTab);
                        let next = (e.key == "Home") ? 0 : ((e.key == "End") ? 3 : ((index + ((e.key == "ArrowRight") ? 1 : 3)) % 4));
                        let id = ids[next];
                        setTab(id);
                        document.getElementById("tab-" + id).focus();
                      }
                    }}
                  onClick={function (){
                      setTab(t.id);
                    }}>{t.label}
                </button>);
            })}
          </div>
          <div
            role="tabpanel"
            id={"panel-" + activeTab}
            aria-labelledby={"tab-" + activeTab}>
            {(activeTab == "categories") ? (
              <Categories
                configuration={configuration}
                setConfiguration={setConfiguration}
                data={data}
                canEdit={canEdit}/>) : ((activeTab == "points") ? (
              <Points data={data}/>) : ((activeTab == "rules") ? (
              <Rules
                configuration={configuration}
                setConfiguration={setConfiguration}
                canEdit={canEdit}
                onActivate={(data.activateRule && !dirty) ? activate : null}/>) : (
              <Awards data={data}/>)))}
          </div>
          <div className="row between card section subtle">
            <div>
              <strong>
                {dirty ? "Unsaved configuration" : "Programme configuration"}
              </strong>
              <p className="muted">
                Category changes preserve identifiers and historical award records.
              </p>
            </div>
            <Button disabled={!canEdit || !dirty} onPress={save}>{busy ? "Saving…" : "Save programme"}</Button>
          </div>
        </div>)}
    </div>);
}

// statstrade-web.feature.reputation.screen/LiveReputationPage [281] 
export function LiveReputationPage(){
  let api = page_api.usePageApi("reputation");
  let [organisation] = global_store.useStore(["context","organisation"]);
  if(!organisation){
    return (
      <section className="rep">
        <style>{styles}</style>
        <h1>Reputation & rewards</h1>
        <p>Select a brand to manage its programme.</p>
      </section>);
  }
  if(api.owner.error && !(api.owner.status == "ready")){
    return (
      <section className="rep">
        <style>{styles}</style>
        <h1>Unable to load programme</h1>
        <p role="alert">{api.owner.error}</p>
        <Button onPress={api.refresh}>Retry</Button>
      </section>);
  }
  if(!(api.owner.status == "ready")){
    return (
      <section className="rep">
        <style>{styles}</style>
        <p role="status">Loading brand programme…</p>
      </section>);
  }
  let data = Object.assign({
    "assets":[],
    "scores":[],
    "history":[],
    "awards":[],
    "budgets":[],
    "tokens":[],
    "configs":[]
  },api.data,{
    "canManage":true,
    "capabilities":{"manual_awards":true,"automatic_awards":true}
  });
  data.awards = data.awards.map(function (row){
    return Object.assign({},row,{
      "title":(row.detail && row.detail.reason) || "Recorded reward",
      "status":(row.type == "revoke") ? "reversed" : "fulfilled",
      "lines":[
            {
                "label":(row.detail && row.detail.category_id) || "Points",
                "amount":row.amount
              }
          ]
    });
  });
  data.activateRule = async function (id){
    let result = await api.mutations.activate_rule.mutateAsync({"rule_id":id});
    return result.data;
  };
  data.grantReward = async function (values){
    let recipient = (data.members || []).find(function (m){
      return (m.handle == values.recipient) || (m.id == values.recipient);
    });
    if(!recipient){
      throw new Error("Choose an eligible member by handle or account ID.");
    }
    let result = await api.mutations.grant_reward.mutateAsync({
      "budget_id":values.budget_id,
      "user_id":recipient.id,
      "amount":values.amount,
      "idempotency_key":values.command,
      "detail":{"reason":values.reason,"category_id":values.category_id}
    });
    return result.data;
  };
  return (
    <ReputationWorkspace
      key={data.brand.id}
      data={data}
      preview={false}
      onSave={function (configuration){
          return api.mutations.save_programme.mutateAsync({
            "expected":(data.brand.detail && data.brand.detail.reputation) || {},
            "configuration":configuration
          });
        }}/>);
}

// statstrade-web.feature.reputation.screen/ReputationPreview [302] 
export function ReputationPreview(){
  let sample = React.useMemo(function (){
    return model.preview_data();
  },[]);
  return (
    <ReputationWorkspace data={sample} preview={true}/>);
}

// statstrade-web.feature.reputation.screen/ReputationPage [306] 
export function ReputationPage({preview}){
  return preview ? (
    <ReputationPreview/>) : (
    <LiveReputationPage/>);
}