\set ON_ERROR_STOP on
BEGIN;
CREATE SCHEMA IF NOT EXISTS stats_fn_web;
CREATE SCHEMA IF NOT EXISTS stats_rpc;
\ir ../../../resources/statsdb/web-main/instagram-connection.sql
GRANT USAGE ON SCHEMA stats_fn_web,stats_rpc TO service_role;
SET LOCAL ROLE service_role;
DO $$
DECLARE r jsonb;
BEGIN
 r:=stats_rpc.web_instagram_oauth_begin(repeat('a',64),repeat('b',64),repeat('c',64),'1144842521271734','1072833352481481','statstrade.com.au',clock_timestamp()+interval '10 minutes');
 IF r->>'created'<>'true' THEN RAISE EXCEPTION 'intent was not created'; END IF;
 r:=stats_rpc.web_instagram_oauth_begin(repeat('a',64),repeat('d',64),repeat('c',64),'1144842521271734','1072833352481481','statstrade.com.au',clock_timestamp()+interval '10 minutes');
 IF r->>'created'<>'false' THEN RAISE EXCEPTION 'ticket replay accepted'; END IF;
 r:=stats_rpc.web_instagram_oauth_consume(repeat('b',64),repeat('d',64),'1144842521271734','1072833352481481','statstrade.com.au');
 IF r->>'accepted'<>'false' THEN RAISE EXCEPTION 'wrong browser accepted'; END IF;
 r:=stats_rpc.web_instagram_oauth_consume(repeat('b',64),repeat('c',64),'1144842521271734','1072833352481481','statstrade.com.au');
 IF r->>'accepted'<>'true' THEN RAISE EXCEPTION 'valid state rejected'; END IF;
 r:=stats_rpc.web_instagram_oauth_consume(repeat('b',64),repeat('c',64),'1144842521271734','1072833352481481','statstrade.com.au');
 IF r->>'accepted'<>'false' THEN RAISE EXCEPTION 'callback replay accepted'; END IF;
 PERFORM stats_rpc.web_instagram_connection_save('1144842521271734','99999999999999999999','statstrade.com.au','v1.iv.ciphertext.tag',NULL,'["instagram_basic","instagram_manage_comments","instagram_manage_messages"]');
 r:=stats_rpc.web_instagram_connection_get('1144842521271734');
 IF r->>'username'<>'statstrade.com.au' THEN RAISE EXCEPTION 'connection not stored'; END IF;
 BEGIN
  PERFORM stats_rpc.web_instagram_connection_save('1144842521271734','99999999999999999998','statstrade.com.au','v1.iv.ciphertext.tag',NULL,'[]');
  RAISE EXCEPTION 'account replacement accepted';
 EXCEPTION WHEN invalid_parameter_value THEN NULL;
 END;
END $$;
RESET ROLE;
SET LOCAL ROLE authenticated;
DO $$ BEGIN
 BEGIN
  PERFORM stats_rpc.web_instagram_connection_get('1144842521271734');
  RAISE EXCEPTION 'browser can read credential';
 EXCEPTION WHEN insufficient_privilege THEN NULL;
 END;
 BEGIN
  PERFORM stats_rpc.web_instagram_oauth_begin(repeat('1',64),repeat('2',64),repeat('3',64),'1','2','attacker',clock_timestamp()+interval '5 minutes');
  RAISE EXCEPTION 'browser can create intent';
 EXCEPTION WHEN insufficient_privilege THEN NULL;
 END;
END $$;
RESET ROLE;
ROLLBACK;
