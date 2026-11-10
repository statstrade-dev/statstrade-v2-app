\set ON_ERROR_STOP on
BEGIN;
CREATE SCHEMA IF NOT EXISTS stats_fn_web;
CREATE SCHEMA IF NOT EXISTS stats_rpc;
\ir ../../../resources/statsdb/web-main/instagram-webhook.sql

SET LOCAL ROLE service_role;
DO $$
DECLARE result jsonb;
BEGIN
 result := stats_rpc.web_instagram_events('1144842521271734','99999999999999999999',
  '[{"key":"message:statstrade-integration-fixture","kind":"message","data":{"text":"Hello 🦘"}},{"key":"comment:statstrade-integration-fixture","kind":"comment","data":{"text":"LINK"}}]');
 IF result->>'inserted'<>'2' THEN RAISE EXCEPTION 'batch did not persist'; END IF;
 result := stats_rpc.web_instagram_events('1144842521271734','99999999999999999999',
  '[{"key":"message:statstrade-integration-fixture","kind":"message","data":{"text":"Hello 🦘"}}]');
 IF result->>'inserted'<>'0' THEN RAISE EXCEPTION 'replay inserted duplicate'; END IF;
 -- The same provider event in another configured account remains independent.
 result := stats_rpc.web_instagram_events('1144842521271734','99999999999999999998',
  '[{"key":"message:statstrade-integration-fixture","kind":"message","data":{"text":"Hello"}}]');
 IF result->>'inserted'<>'1' THEN RAISE EXCEPTION 'account scopes collided'; END IF;
 BEGIN
  PERFORM stats_rpc.web_instagram_events('1144842521271734','99999999999999999999',
   '[{"key":"message:must-rollback","kind":"message","data":{}},{"kind":"message","data":{}}]');
  RAISE EXCEPTION 'invalid batch accepted';
 EXCEPTION WHEN invalid_parameter_value THEN NULL;
 END;
 IF EXISTS(SELECT 1 FROM stats_fn_web.instagram_event WHERE event_key='message:must-rollback') THEN
  RAISE EXCEPTION 'partial batch persisted';
 END IF;
END $$;
RESET ROLE;

SET LOCAL ROLE anon;
DO $$ BEGIN
 BEGIN
  PERFORM stats_rpc.web_instagram_events('1','2','[]');
  RAISE EXCEPTION 'anon can ingest';
 EXCEPTION WHEN insufficient_privilege THEN NULL;
 END;
 BEGIN
  PERFORM 1 FROM stats_fn_web.instagram_event;
  RAISE EXCEPTION 'anon can read';
 EXCEPTION WHEN insufficient_privilege THEN NULL;
 END;
END $$;
RESET ROLE;
SET LOCAL ROLE authenticated;
DO $$ BEGIN
 BEGIN
  PERFORM stats_rpc.web_instagram_events('1','2','[]');
  RAISE EXCEPTION 'authenticated can ingest';
 EXCEPTION WHEN insufficient_privilege THEN NULL;
 END;
 BEGIN
  PERFORM 1 FROM stats_fn_web.instagram_event;
  RAISE EXCEPTION 'authenticated can read';
 EXCEPTION WHEN insufficient_privilege THEN NULL;
 END;
END $$;
RESET ROLE;
ROLLBACK;
