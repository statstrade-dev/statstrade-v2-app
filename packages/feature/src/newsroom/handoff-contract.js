/** Selected public editorial content, independent of full-workspace export versions. */
export const HANDOFF_FORMAT = 'statstrade.newsroom-handoff';
export const MAX_HANDOFF_BYTES = 1000000;
const fail = message => { throw new Error('Newsroom handoff: '+message); };
function object(value,keys,path){if(!value||typeof value!=='object'||Array.isArray(value))fail(path+' must be an object');for(const k of Object.keys(value))if(!keys.includes(k))fail(path+'.'+k+' is not allowed');for(const k of keys)if(!(k in value))fail(path+'.'+k+' is required');return value;}
function text(value,path,max=4000,empty=false){if(typeof value!=='string'||value.length>max||(!empty&&!value.trim()))fail(path+' must be '+(empty?'':'nonempty ')+'text (max '+max+')');return value;}
function list(value,path,max){if(!Array.isArray(value)||value.length>max)fail(path+' must be an array (max '+max+')');return value;}
export function safeUrl(value){try{const u=new URL(value);return ['https:','http:'].includes(u.protocol)&&!u.username&&!u.password?u.href:null}catch{return null}}
function url(value,path){text(value,path,4000);if(!safeUrl(value))fail(path+' must be an HTTP(S) URL without credentials');return value;}
function unique(rows,key,path){const ids=rows.map(r=>r[key]);if(new Set(ids).size!==ids.length)fail('duplicate '+path);return new Set(ids);}
export function canonical(value){if(Array.isArray(value))return '['+value.map(canonical).join(',')+']';if(value&&typeof value==='object')return '{'+Object.keys(value).sort().map(k=>JSON.stringify(k)+':'+canonical(value[k])).join(',')+'}';return JSON.stringify(value);}
export function validateHandoff(input){
 if(new TextEncoder().encode(JSON.stringify(input)).length>MAX_HANDOFF_BYTES)fail('file exceeds 1 MB');
 const b=object(input,['format','version','source_instance','story_id','revision_id','article','prediction','sources','evidence','citations'],'bundle');
 if(b.format!==HANDOFF_FORMAT||b.version!==1)fail('unsupported format/version');
 for(const k of ['source_instance','story_id','revision_id'])text(b[k],k,200);
 const a=object(b.article,['headline','standfirst','markdown'],'article');text(a.headline,'headline',400);text(a.standfirst,'standfirst',3000,true);text(a.markdown,'markdown',100000);
 const q=object(b.prediction,['question','horizon','close_at','resolution_source','resolution_url','criteria','rationale','outcome_type','uncertainties'],'prediction');
 for(const k of ['question','horizon','resolution_source','criteria','rationale'])text(q[k],k,k==='criteria'?6000:4000);
 url(q.resolution_url,'resolution_url');text(q.close_at,'close_at',100);if(!Number.isFinite(Date.parse(q.close_at)))fail('close_at must be a date');
 if(!['decision','delivery','metric','accountability'].includes(q.outcome_type))fail('unsupported outcome type');
 for(const value of list(q.uncertainties,'uncertainties',30))text(value,'uncertainty',4000);
 const sources=list(b.sources,'sources',100),evidence=list(b.evidence,'evidence',100),citations=list(b.citations,'citations',100);
 if(!sources.length||!evidence.length||!citations.length)fail('sources, evidence and citations are required');
 for(const row of sources){object(row,['id','title','publisher','url','published_at'],'source');text(row.id,'source.id',200);text(row.title,'source.title',1000);text(row.publisher,'source.publisher',400);url(row.url,'source.url');if(row.published_at!==null&&(!Number.isSafeInteger(row.published_at)||row.published_at<0))fail('invalid source date');}
 for(const row of evidence){object(row,['id','source_id','kind','content_hash','excerpt','captured_at'],'evidence');text(row.id,'evidence.id',200);text(row.source_id,'source_id',200);text(row.content_hash,'content_hash',200);text(row.excerpt,'excerpt',10000,true);if(!['source','quote','document','dataset'].includes(row.kind))fail('private notes cannot be transferred');if(!Number.isSafeInteger(row.captured_at)||row.captured_at<0)fail('invalid capture date');}
 for(const row of citations){object(row,['evidence_id','quote'],'citation');text(row.evidence_id,'citation.evidence_id',200);if(row.quote!==null)text(row.quote,'quote',10000,true);}
 const sourceIds=unique(sources,'id','source IDs'),evidenceIds=unique(evidence,'id','evidence IDs');
 for(const row of evidence)if(!sourceIds.has(row.source_id))fail('missing source '+row.source_id);
 for(const row of citations)if(!evidenceIds.has(row.evidence_id))fail('missing citation evidence '+row.evidence_id);
 const usedEvidence=new Set(citations.map(c=>c.evidence_id));for(const row of evidence)if(!usedEvidence.has(row.id))fail('unselected evidence '+row.id);
 const usedSources=new Set(evidence.map(e=>e.source_id));for(const row of sources)if(!usedSources.has(row.id))fail('unselected source '+row.id);
 return JSON.parse(JSON.stringify(b));
}
// Rendering returns data, never HTML. Consumers render these strings through React/Svelte.
export function markdownBlocks(markdown){return String(markdown).split(/\n\s*\n/).filter(Boolean).map(block=>{const h=block.match(/^(#{1,6})\s+([\s\S]*)$/);return h?{kind:'heading',level:h[1].length,text:h[2]}:{kind:'paragraph',text:block};});}
