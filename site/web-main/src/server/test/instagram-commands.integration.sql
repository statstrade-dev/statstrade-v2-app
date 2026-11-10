\set ON_ERROR_STOP on
BEGIN;
CREATE SCHEMA IF NOT EXISTS stats_fn_web;
CREATE SCHEMA IF NOT EXISTS stats_rpc;
\ir ../../../resources/statsdb/web-main/instagram-webhook.sql
\ir ../../../resources/statsdb/web-main/instagram-commands.sql
SET LOCAL ROLE service_role;
DO $$
DECLARE stamp bigint=(extract(epoch FROM clock_timestamp())*1000)::bigint; result jsonb; n integer;
BEGIN
 PERFORM stats_rpc.web_instagram_events('901','902',jsonb_build_array(
  jsonb_build_object('key','message:ping','kind','message','data',jsonb_build_object('sender_id','903','timestamp',stamp,'text',' /PING ')),
  jsonb_build_object('key','message:echo','kind','message','data',jsonb_build_object('sender_id','903','timestamp',stamp,'text',E'/echo Hello 🦘\nworld')),
  jsonb_build_object('key','message:unknown','kind','message','data',jsonb_build_object('sender_id','903','timestamp',stamp,'text','/pingpong')),
  jsonb_build_object('key','message:old','kind','message','data',jsonb_build_object('sender_id','903','timestamp',stamp-86400001,'text','/ping')),
  jsonb_build_object('key','message:before-activation','kind','message','data',jsonb_build_object('sender_id','903','timestamp',stamp-120000,'text','/ping')),
  jsonb_build_object('key','message:future','kind','message','data',jsonb_build_object('sender_id','903','timestamp',stamp+120000,'text','/ping')),
  jsonb_build_object('key','message:self','kind','message','data',jsonb_build_object('sender_id','902','timestamp',stamp,'text','/ping')),
  jsonb_build_object('key','comment:ping','kind','comment','data',jsonb_build_object('sender_id','903','timestamp',stamp,'text','/ping'))));
 result=stats_rpc.web_instagram_commands_claim('901','902',clock_timestamp()-interval '1 minute');
 IF jsonb_array_length(result)<>2 OR NOT result @> '[{"event_key":"message:ping","text":"Pong! 🏓"}]'
    OR NOT result @> jsonb_build_array(jsonb_build_object('event_key','message:echo','text',E'Hello 🦘\nworld')) THEN
  RAISE EXCEPTION 'command replies incorrect: %',result;
 END IF;
 IF stats_rpc.web_instagram_commands_claim('901','902',clock_timestamp()-interval '1 minute')<>'[]' THEN RAISE EXCEPTION 'duplicate reservations'; END IF;
 IF stats_rpc.web_instagram_commands_claim('901','999',clock_timestamp()-interval '1 minute')<>'[]' THEN RAISE EXCEPTION 'cross-account replies'; END IF;
 PERFORM stats_rpc.web_instagram_reply_finish('901','902','message:ping','sent','provider-fixture',NULL);
 IF stats_rpc.web_instagram_reply_finish('901','902','message:ping','failed',NULL,'bad')->>'updated'<>'false' THEN RAISE EXCEPTION 'sent reply changed'; END IF;
 -- Five sends per sender per minute, including concurrent reservation safety.
 FOR n IN 1..4 LOOP
  PERFORM stats_rpc.web_instagram_events('901','902',jsonb_build_array(jsonb_build_object('key','message:rate-'||n,'kind','message','data',jsonb_build_object('sender_id','903','timestamp',stamp,'text','/ping'))));
 END LOOP;
 result=stats_rpc.web_instagram_commands_claim('901','902',clock_timestamp()-interval '1 minute');
 IF jsonb_array_length(result)<>3 OR (SELECT count(*) FROM stats_fn_web.instagram_reply WHERE app_id='901' AND status='rate_limited')<>1 THEN RAISE EXCEPTION 'sender rate limit failed'; END IF;
 PERFORM stats_rpc.web_instagram_events('901','902',jsonb_build_array(
  jsonb_build_object('key','message:usage','kind','message','data',jsonb_build_object('sender_id','904','timestamp',stamp,'text','/echo')),
  jsonb_build_object('key','message:long','kind','message','data',jsonb_build_object('sender_id','904','timestamp',stamp,'text','/echo '||repeat('🦘',251)))));
 result=stats_rpc.web_instagram_commands_claim('901','902',clock_timestamp()-interval '1 minute');
 IF NOT result @> '[{"event_key":"message:usage","text":"Usage: /echo <text>"},{"event_key":"message:long","text":"Please keep /echo text to 1,000 UTF-8 bytes."}]' THEN RAISE EXCEPTION 'usage/UTF8 limit failed'; END IF;
 UPDATE stats_fn_web.instagram_reply SET created_at=clock_timestamp()-interval '6 minutes' WHERE app_id='901' AND status='sending';
 result=stats_rpc.web_instagram_commands_claim('901','902',clock_timestamp()-interval '1 minute');
 IF result<>'[]'
    OR EXISTS(SELECT 1 FROM stats_fn_web.instagram_reply WHERE app_id='901' AND status='sending') THEN RAISE EXCEPTION 'interrupted sends retried'; END IF;
END $$;
RESET ROLE;
SET LOCAL ROLE anon;
DO $$ BEGIN
 BEGIN PERFORM stats_rpc.web_instagram_commands_claim('901','902',clock_timestamp()); RAISE EXCEPTION 'anon can send'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN PERFORM 1 FROM stats_fn_web.instagram_reply; RAISE EXCEPTION 'anon can read'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END $$;
RESET ROLE;
SET LOCAL ROLE authenticated;
DO $$ BEGIN
 BEGIN PERFORM stats_rpc.web_instagram_reply_finish('901','902','x','sent','id',NULL); RAISE EXCEPTION 'member can complete replies'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN PERFORM 1 FROM stats_fn_web.instagram_reply; RAISE EXCEPTION 'member can read'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END $$;
RESET ROLE;
ROLLBACK;
