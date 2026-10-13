import * as impl_supabase from '@statstrade/edge/lib/xt/db/system/impl-supabase.jsx'

import * as main_client from '@statstrade/edge/lib/xt/db/system/main-client.jsx'

import * as impl_memory from '@statstrade/edge/lib/xt/db/system/impl-memory.jsx'

import * as impl_sqlite from '@statstrade/edge/lib/xt/db/system/impl-sqlite.jsx'

import * as impl_postgres from '@statstrade/edge/lib/xt/db/system/impl-postgres.jsx'

// xt.db.system.main/create-impl [14] 
export function create_impl(type,defaults,schema,lookup){
  let client = main_client.create_client(type,defaults);
  if(type == "memory"){
    return impl_memory.impl_memory(schema,lookup);
  }
  else if(type == "sqlite"){
    return impl_sqlite.impl_sqlite(client,schema,lookup);
  }
  else if(type == "postgres"){
    return impl_postgres.impl_postgres(client,schema,lookup);
  }
  else if(type == "supabase"){
    return impl_supabase.impl_supabase(client,schema,lookup);
  }
}

// xt.db.system.main/create-impl-init [35] 
export function create_impl_init(impl){
  let {lookup,schema} = impl;
  let type = impl["::"];
  if(type == "xt.db.system.impl_sqlite/ImplSqlite"){
    return impl_sqlite.impl_sqlite_init(impl);
  }
  else if(type == "xt.db.system.impl_postgres/ImplPostgres"){
    return impl_postgres.impl_postgres_init(impl);
  }
  else{
    return Promise.resolve().then(function (){
      return impl;
    });
  }
}