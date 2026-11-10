\set ON_ERROR_STOP on
BEGIN;
CREATE SCHEMA IF NOT EXISTS stats_fn_web;
CREATE SCHEMA IF NOT EXISTS stats_rpc;
\ir ../../../resources/statsdb/web-main/instagram-webhook.sql
\ir ../../../resources/statsdb/web-main/instagram-commands.sql
\ir ../../../resources/statsdb/web-main/instagram-menu.sql
SET LOCAL ROLE service_role;
DO $$
DECLARE stamp bigint=(extract(epoch FROM clock_timestamp())*1000)::bigint; result jsonb='[]'; batch jsonb; n integer;
BEGIN
 PERFORM stats_rpc.web_instagram_events('801','802',jsonb_build_array(
  jsonb_build_object('key','message:ping','kind','message','data',jsonb_build_object('sender_id','901','timestamp',stamp-120000,'text',' /PING ')),
  jsonb_build_object('key','message:echo','kind','message','data',jsonb_build_object('sender_id','902','timestamp',stamp,'text','/echo exact')),
  jsonb_build_object('key','message:hello','kind','message','data',jsonb_build_object('sender_id','903','timestamp',stamp,'text','hello')),
  jsonb_build_object('key','message:unknown','kind','message','data',jsonb_build_object('sender_id','904','timestamp',stamp,'text','/pingpong')),
  jsonb_build_object('key','message:help','kind','message','data',jsonb_build_object('sender_id','905','timestamp',stamp,'text','/help')),
  jsonb_build_object('key','message:photo','kind','message','data',jsonb_build_object('sender_id','906','timestamp',stamp,'text',NULL,'attachment_types',jsonb_build_array('image'))),
  jsonb_build_object('key','message:video','kind','message','data',jsonb_build_object('sender_id','907','timestamp',stamp,'text',' ','attachment_types',jsonb_build_array('video'))),
  jsonb_build_object('key','message:blank','kind','message','data',jsonb_build_object('sender_id','908','timestamp',stamp,'text',E' \n\t','attachment_types','[]'::jsonb)),
  jsonb_build_object('key','message:old-menu','kind','message','data',jsonb_build_object('sender_id','909','timestamp',stamp-120000,'text','old hello')),
  jsonb_build_object('key','message:self','kind','message','data',jsonb_build_object('sender_id','802','timestamp',stamp,'text','hello')),
  jsonb_build_object('key','message:stale','kind','message','data',jsonb_build_object('sender_id','910','timestamp',stamp-86400001,'text','hello')),
  jsonb_build_object('key','message:future','kind','message','data',jsonb_build_object('sender_id','911','timestamp',stamp+120000,'text','hello')),
  jsonb_build_object('key','comment:hello','kind','comment','data',jsonb_build_object('sender_id','912','timestamp',stamp,'text','hello'))));
 FOR n IN 1..3 LOOP
  batch=stats_rpc.web_instagram_dm_claim('801','802',clock_timestamp()-interval '10 minutes',clock_timestamp()-interval '1 minute');
  IF jsonb_array_length(batch)>5 THEN RAISE EXCEPTION 'batch limit lost'; END IF;
  result=result||batch;
 END LOOP;
 IF jsonb_array_length(result)<>7 OR NOT result @> '[{"event_key":"message:ping","text":"Pong! 🏓"},{"event_key":"message:echo","text":"exact"}]' THEN
  RAISE EXCEPTION 'DM/default command dispatch failed: %',result;
 END IF;
 IF (SELECT count(*) FROM jsonb_array_elements(result) r WHERE r->>'event_key' IN ('message:hello','message:unknown','message:help','message:photo','message:video')
     AND position('/ping' in r->>'text')>0 AND position('/echo <text>' in r->>'text')>0 AND position('/help' in r->>'text')>0)<>5 THEN
  RAISE EXCEPTION 'menu missing for an input type';
 END IF;
 IF (SELECT count(DISTINCT r->>'text') FROM jsonb_array_elements(result) r WHERE r->>'event_key' IN ('message:hello','message:unknown','message:help','message:photo','message:video'))<>1 THEN
  RAISE EXCEPTION 'default menus differ';
 END IF;
 IF stats_rpc.web_instagram_dm_claim('801','802',clock_timestamp()-interval '10 minutes',clock_timestamp()-interval '1 minute')<>'[]' THEN RAISE EXCEPTION 'menu replayed'; END IF;
 IF stats_rpc.web_instagram_dm_claim('801','999',clock_timestamp()-interval '10 minutes',clock_timestamp()-interval '1 minute')<>'[]' THEN RAISE EXCEPTION 'cross-account menu'; END IF;
 PERFORM stats_rpc.web_instagram_events('801','802',jsonb_build_array(
  jsonb_build_object('key','message:disabled-menu','kind','message','data',jsonb_build_object('sender_id','913','timestamp',stamp,'text','hello')),
  jsonb_build_object('key','message:enabled-command','kind','message','data',jsonb_build_object('sender_id','914','timestamp',stamp,'text','/ping'))));
 batch=stats_rpc.web_instagram_dm_claim('801','802',clock_timestamp()-interval '10 minutes',NULL);
 IF jsonb_array_length(batch)<>1 OR NOT batch @> '[{"event_key":"message:enabled-command","text":"Pong! 🏓"}]' THEN RAISE EXCEPTION 'menu disable broke commands'; END IF;
 batch=stats_rpc.web_instagram_dm_claim('801','802',clock_timestamp()-interval '10 minutes',clock_timestamp()-interval '1 minute');
 IF jsonb_array_length(batch)<>1 OR batch->0->>'event_key'<>'message:disabled-menu' THEN RAISE EXCEPTION 'menu activation failed'; END IF;
END $$;
RESET ROLE;
SET LOCAL ROLE anon;
DO $$ BEGIN
 BEGIN PERFORM stats_rpc.web_instagram_dm_claim('801','802',clock_timestamp(),NULL); RAISE EXCEPTION 'anon can dispatch'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END $$;
RESET ROLE;
SET LOCAL ROLE authenticated;
DO $$ BEGIN
 BEGIN PERFORM stats_rpc.web_instagram_dm_claim('801','802',clock_timestamp(),NULL); RAISE EXCEPTION 'member can dispatch'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END $$;
RESET ROLE;
ROLLBACK;
