import * as T from 'tamagui'

import React from 'react'

import {Building2,CreditCard,UserRoundCog} from '@tamagui/lucide-icons'

import * as group_system from '@statstrade/web-superadmin/groups/a03/s01-system.jsx'

import * as group_shell from '@statstrade/web-superadmin/groups/a00/s01-shell.jsx'

import * as group_market from '@statstrade/web-superadmin/groups/a04/s01-market.jsx'

import * as group_newsroom from '@statstrade/web-superadmin/groups/a05/s01/t01-newsroom.jsx'

import * as group_integrations from '@statstrade/web-superadmin/groups/a04/s02-integrations.jsx'

import * as sb from '@statstrade/edge/remote/util-supabase.jsx'

import * as group_users from '@statstrade/web-superadmin/groups/a01/s02-users.jsx'

import * as group_organisations from '@statstrade/web-superadmin/groups/a02/s02-organisations.jsx'

import * as group_tables from '@statstrade/web-superadmin/groups/a00/s02-tables.jsx'

import * as ext_page from '@statstrade/edge/lib/js/react/ext-page.js'

import * as group_catalog from '@statstrade/web-superadmin/groups/a03/s02-catalog.jsx'

import * as group_inventory from '@statstrade/web-superadmin/groups/a03/s03-inventory.jsx'

import * as global_table from '@statstrade/web-superadmin/a03/s03/global-table.jsx'

import * as page_core from '@xtalk/substrate/page-core.js'

import * as group_user_operations from '@statstrade/web-superadmin/groups/a02/s01-user-operations.jsx'

import * as substrate from '@statstrade/web-superadmin/lib/substrate-worker.jsx'

import * as group_billing from '@statstrade/web-superadmin/groups/a02/s03-billing.jsx'

import * as group_global from '@statstrade/web-superadmin/groups/a03/s01/t01-global.jsx'

// statstrade-superadmin.adminweb.workspace/WORKSPACE-GROUPS [511] 
export var WORKSPACE_GROUPS = {
  "super/system/swap":group_market.Group,
  "super/system/service":group_integrations.Group,
  "super/global":group_global.Group,
  "user":group_user_operations.Group,
  "super/admin/newsroom":group_newsroom.Group,
  "billing":group_billing.Group,
  "organisation":group_organisations.Group,
  "super/system/room":group_market.Group,
  "super":group_system.Group,
  "super/admin/organisation":group_organisations.Group,
  "super/system/template":group_catalog.Group,
  "super/admin/user":group_users.Group,
  "room":group_market.Group,
  "chain":group_inventory.Group
};

// statstrade-superadmin.adminweb.workspace/WORKSPACES [527] 
export var WORKSPACES = {
  "user":[
    {
    "table":"User",
    "title":"Users",
    "fields":[
      "id",
      "handle",
      "first_name",
      "last_name",
      "is_active",
      "type",
      "country_code",
      "city",
      "is_official",
      "is_onboarded",
      "time_created",
      "time_updated"
    ]
  },
    {
    "table":"AccessRole",
    "title":"Access roles",
    "fields":[
      "class_table",
      "class_context",
      "access",
      "member",
      "level",
      "scope",
      "is_active",
      "is_public",
      "time_created",
      "time_updated"
    ]
  },
    {
    "table":"PlatformGrant",
    "title":"Platform grants",
    "fields":[
      "id",
      "user",
      "level",
      "status",
      "scopes",
      "expires_at",
      "granted_by",
      "reason",
      "time_created",
      "time_updated"
    ]
  },
    {
    "table":"AccessRequest",
    "title":"Access requests",
    "fields":[
      "class_table",
      "class_context",
      "access",
      "from",
      "reply",
      "status",
      "log",
      "time_created",
      "time_updated"
    ]
  },
    {
    "table":"AccessInviteInternal",
    "title":"Internal invitations",
    "fields":[
      "class_table",
      "class_context",
      "access",
      "to",
      "from",
      "status",
      "detail",
      "log",
      "time_created",
      "time_updated"
    ]
  },
    {
    "table":"Wallet",
    "title":"Wallets",
    "fields":["id","billing_mode","is_active","time_created"]
  },
    {
    "table":"Token",
    "title":"Tokens",
    "fields":[
      "id",
      "name",
      "code",
      "title",
      "type",
      "symbol",
      "native",
      "decimal",
      "issuer",
      "is_archived",
      "time_created"
    ]
  },
    {
    "table":"TokenAllowance",
    "title":"Token allowances",
    "fields":["id","token","playable","owner","spender","amount","time_created"]
  },
    {
    "table":"Asset",
    "title":"Assets",
    "fields":["id","wallet","token","playable","balance","time_created"]
  },
    {
    "table":"AssetTx",
    "title":"Asset transactions",
    "fields":["id","asset","type","amount","balance","ref_id","time_created"]
  },
    {
    "table":"WalletAddress",
    "title":"Wallet addresses",
    "fields":["id","wallet","address","time_created"]
  },
    {
    "table":"Activity",
    "title":"Activity",
    "fields":["id","class_table","class_ref","time_created"]
  },
    {
    "table":"Starred",
    "title":"Starred records",
    "fields":["id","class_table","class_ref","time_created"]
  }
  ],
  "organisation":[
    {
    "table":"Org",
    "title":"Organizations",
    "fields":[
      "id",
      "name",
      "title",
      "description",
      "category",
      "location",
      "website",
      "is_nonprofit",
      "is_academic",
      "is_archived",
      "time_created",
      "time_updated"
    ]
  },
    {
    "table":"OrgSettings",
    "title":"Organization settings",
    "fields":[
      "id",
      "org",
      "timezone",
      "is_discoverable",
      "allow_followers",
      "show_activity",
      "governance",
      "notifications",
      "time_updated"
    ]
  },
    {
    "table":"Campaign",
    "title":"Campaigns",
    "fields":[
      "id",
      "owner",
      "code",
      "title",
      "status",
      "is_prime",
      "is_template",
      "time_start",
      "time_end",
      "is_archived",
      "time_created"
    ]
  },
    {
    "table":"TopicAllocation",
    "title":"Topic allocations",
    "fields":[
      "id",
      "topic",
      "wallet",
      "command_id",
      "status",
      "purchased_shares",
      "bonus_shares",
      "issued_shares",
      "base_price",
      "total_spend",
      "vesting_progress",
      "bonus_rate",
      "vesting_type",
      "quote",
      "submitted_at",
      "time_created",
      "time_updated"
    ]
  },
    {
    "table":"TopicCall",
    "title":"Topic calls",
    "fields":[
      "id",
      "user",
      "topic",
      "prospect",
      "command_id",
      "points",
      "conviction",
      "status",
      "submitted_at",
      "time_created",
      "time_updated"
    ]
  },
    {
    "table":"OrgRewardBudget",
    "title":"Reward budgets",
    "fields":[
      "id",
      "org",
      "token",
      "playable",
      "limit",
      "reserved",
      "awarded",
      "status",
      "starts_at",
      "ends_at",
      "time_created",
      "time_updated"
    ]
  },
    {
    "table":"OrgRewardLedger",
    "title":"Reward ledger",
    "fields":[
      "id",
      "org",
      "budget",
      "user",
      "task_class",
      "task",
      "contest_award",
      "asset_tx",
      "type",
      "amount",
      "balance",
      "source_type",
      "source_ref",
      "occurred_at",
      "time_created"
    ]
  },
    {
    "table":"OrgBillingInvoice",
    "title":"Organization invoices",
    "fields":[
      "id",
      "class_table",
      "account",
      "amount_due_cents",
      "amount_paid_cents",
      "currency",
      "status",
      "period_start",
      "period_end",
      "issued_at",
      "due_at",
      "finalized_at",
      "paid_at",
      "time_created",
      "time_updated"
    ]
  },
    {
    "table":"OrgBillingPayment",
    "title":"Organization payments",
    "fields":[
      "id",
      "class_table",
      "account",
      "payment_type",
      "amount_cents",
      "currency",
      "invoice_class",
      "invoice",
      "status",
      "provider",
      "occurred_at",
      "time_created"
    ]
  }
  ],
  "brand":[
    {
    "table":"Social",
    "title":"Social profiles",
    "fields":[
      "id",
      "class_table",
      "class_ref",
      "publishing_policy",
      "time_created"
    ]
  },
    {
    "table":"SocialConnection",
    "title":"Social connections",
    "fields":[
      "id",
      "social",
      "provider",
      "provider_account_id",
      "status",
      "permissions",
      "time_created",
      "time_updated"
    ]
  },
    {
    "table":"SocialHandle",
    "title":"Social handles",
    "fields":[
      "id",
      "social",
      "type",
      "handle",
      "is_verified",
      "verified_at",
      "time_created"
    ]
  },
    {
    "table":"SocialPublication",
    "title":"Social publications",
    "fields":[
      "id",
      "variant",
      "connection",
      "status",
      "scheduled_at",
      "published_at",
      "permalink",
      "attempts",
      "time_created"
    ]
  },
    {
    "table":"SocialVariant",
    "title":"Social content variants",
    "fields":["id","content","channel","format","caption","time_created"]
  },
    {
    "table":"SocialAsset",
    "title":"Social assets",
    "fields":[
      "id",
      "content",
      "bucket",
      "object_path",
      "role",
      "position",
      "alt_text",
      "provenance",
      "time_created",
      "time_updated"
    ]
  },
    {
    "table":"SocialContent",
    "title":"Social content",
    "fields":[
      "id",
      "title",
      "org",
      "author",
      "target_table",
      "target_ref",
      "status",
      "message",
      "call_to_action",
      "source",
      "source_ref",
      "tags",
      "is_archived",
      "time_created",
      "time_updated"
    ]
  }
  ],
  "room":[
    {
    "table":"Topic",
    "title":"Topics",
    "fields":[
      "id",
      "code",
      "title",
      "campaign",
      "status",
      "token",
      "playable",
      "time_open",
      "time_close",
      "is_archived",
      "time_created"
    ]
  },
    {
    "table":"Prospect",
    "title":"Prospects",
    "fields":[
      "id",
      "name",
      "title",
      "topic",
      "token",
      "playable",
      "shares",
      "holdings",
      "result",
      "payout_total",
      "time_created"
    ]
  },
    {
    "table":"ProspectOrder",
    "title":"Prospect orders",
    "fields":[
      "id",
      "prospect",
      "wallet",
      "side",
      "status",
      "price",
      "amount",
      "unfilled",
      "time_created",
      "time_updated"
    ]
  },
    {
    "table":"ProspectStake",
    "title":"Prospect stakes",
    "fields":[
      "id",
      "prospect",
      "wallet",
      "shares",
      "spend",
      "payout",
      "claim",
      "time_created",
      "time_updated"
    ]
  },
    {
    "table":"ProspectMarketSnapshot",
    "title":"Market snapshots",
    "fields":[
      "id",
      "prospect",
      "captured_at",
      "probability",
      "volume",
      "participants",
      "market_state",
      "source"
    ]
  },
    {
    "table":"TopicAllocation",
    "title":"Topic allocations",
    "fields":[
      "id",
      "topic",
      "wallet",
      "status",
      "purchased_shares",
      "bonus_shares",
      "issued_shares",
      "base_price",
      "total_spend",
      "vesting_progress",
      "bonus_rate",
      "vesting_type",
      "submitted_at",
      "time_created"
    ]
  },
    {
    "table":"TopicCall",
    "title":"Topic calls",
    "fields":[
      "id",
      "user",
      "topic",
      "prospect",
      "points",
      "conviction",
      "status",
      "submitted_at",
      "time_created"
    ]
  },
    {
    "table":"ProspectOrderStrike",
    "title":"Order strikes",
    "fields":[
      "prospect",
      "id",
      "ask_order",
      "ask_wallet",
      "bid_order",
      "bid_wallet",
      "status",
      "completion",
      "amount",
      "position",
      "time_created",
      "time_updated"
    ]
  },
    {
    "table":"ProspectStakeTx",
    "title":"Stake transactions",
    "fields":[
      "id",
      "allocation",
      "prospect",
      "wallet",
      "type",
      "purchased_shares",
      "bonus_shares",
      "shares_delta",
      "escrow_delta",
      "spend_delta",
      "payout_delta",
      "shares_balance",
      "escrow_balance",
      "spend_balance",
      "payout_balance",
      "time_created"
    ]
  },
    {
    "table":"ActivityLog",
    "title":"Activity log",
    "fields":[
      "class_table",
      "class_context",
      "activity",
      "action",
      "actor_id",
      "actor_type",
      "detail",
      "time_created"
    ]
  },
    {
    "table":"Lock",
    "title":"Locks",
    "fields":[
      "id",
      "class_table",
      "class_context",
      "class_ref",
      "value",
      "time_created"
    ]
  },
    {
    "table":"LockLog",
    "title":"Lock history",
    "fields":[
      "class_table",
      "class_context",
      "lock",
      "reason",
      "action",
      "detail",
      "time_created"
    ]
  },
    {
    "table":"ItemTx",
    "title":"Item transactions",
    "fields":["id","item","type","ref_id","detail","time_created"]
  }
  ],
  "chain":[
    {
    "table":"Token",
    "title":"Tokens",
    "fields":[
      "id",
      "name",
      "code",
      "title",
      "type",
      "symbol",
      "native",
      "decimal",
      "issuer",
      "is_archived",
      "time_created"
    ]
  },
    {
    "table":"TokenAllowance",
    "title":"Token allowances",
    "fields":["id","token","playable","owner","spender","amount","time_created"]
  },
    {
    "table":"Asset",
    "title":"Assets",
    "fields":["id","wallet","token","playable","balance","time_created"]
  },
    {
    "table":"AssetTx",
    "title":"Asset transactions",
    "fields":["id","asset","type","amount","balance","ref_id","time_created"]
  },
    {
    "table":"WalletAddress",
    "title":"Wallet addresses",
    "fields":["id","wallet","address","time_created"]
  },
    {
    "table":"TokenSupply",
    "title":"Token supplies",
    "fields":["id","token","playable","balance","time_created","time_updated"]
  },
    {
    "table":"TokenErc20Option",
    "title":"ERC-20 options",
    "fields":[
      "id",
      "token",
      "playable",
      "contract_address",
      "chain_id",
      "decimals",
      "total_supply",
      "is_burnable",
      "is_mintable",
      "is_soulbound",
      "is_enabled",
      "standard",
      "time_created",
      "time_updated"
    ]
  },
    {
    "table":"Op",
    "title":"Operations",
    "fields":["id","time","tag","user_id"]
  },
    {
    "table":"Lock",
    "title":"Locks",
    "fields":[
      "id",
      "class_table",
      "class_context",
      "class_ref",
      "value",
      "time_created"
    ]
  },
    {
    "table":"LockLog",
    "title":"Lock history",
    "fields":[
      "class_table",
      "class_context",
      "lock",
      "reason",
      "action",
      "time_created"
    ]
  },
    {
    "table":"Item",
    "title":"Items",
    "fields":[
      "id",
      "wallet",
      "type",
      "playable",
      "key",
      "time_created",
      "time_updated"
    ]
  },
    {
    "table":"ItemTx",
    "title":"Item transactions",
    "fields":["id","item","type","ref_id","time_created"]
  }
  ],
  "super":[
    {
    "table":"Global",
    "title":"Global configuration",
    "fields":[
      "id",
      "class_table",
      "class_context",
      "key",
      "value",
      "value_json",
      "default_json",
      "schema",
      "revision",
      "title",
      "description",
      "visibility",
      "lifecycle",
      "status",
      "is_registered",
      "rev",
      "op_created",
      "op_updated",
      "time_created",
      "time_updated"
    ]
  },
    {
    "table":"PlatformGrant",
    "title":"Platform grants",
    "fields":[
      "id",
      "user",
      "level",
      "status",
      "scopes",
      "expires_at",
      "granted_by",
      "reason",
      "time_created"
    ]
  },
    {
    "table":"SystemCatalogItem",
    "title":"System catalog",
    "fields":[
      "id",
      "code",
      "title",
      "item_type",
      "category",
      "status",
      "time_created",
      "time_updated"
    ]
  },
    {
    "table":"IntegrationProvider",
    "title":"Integrations",
    "fields":[
      "id",
      "name",
      "provider_type",
      "status",
      "last_check_at",
      "latency_ms",
      "events_today",
      "error_rate",
      "created_by"
    ]
  },
    {
    "table":"ComputeConnection",
    "title":"Compute connections",
    "fields":[
      "id",
      "owner_type",
      "owner_ref",
      "name",
      "model",
      "status",
      "capabilities",
      "created_by",
      "time_created"
    ]
  },
    {
    "table":"SafetyCase",
    "title":"Safety cases",
    "fields":[
      "id",
      "case_kind",
      "title",
      "target_type",
      "target_id",
      "priority",
      "status",
      "report_count",
      "assigned_to",
      "risk_score",
      "summary",
      "first_seen",
      "last_seen",
      "time_updated"
    ]
  },
    {
    "table":"ComplianceRecord",
    "title":"Compliance records",
    "fields":[
      "id",
      "kind",
      "status",
      "owner",
      "purpose",
      "source",
      "due_at",
      "completed_at",
      "released_at",
      "time_created"
    ]
  },
    {
    "table":"AuditLog",
    "title":"Audit log",
    "fields":["class_table","class_context","audit","entry","time_created"]
  },
    {
    "table":"SystemPlatformApproval",
    "title":"Platform approvals",
    "fields":[
      "id",
      "class_table",
      "target_user",
      "kind",
      "status",
      "source",
      "requested_by",
      "requested_at",
      "reason",
      "current_grant",
      "grant_proposal",
      "decision_note",
      "decided_by",
      "decided_at",
      "time_created",
      "time_updated"
    ]
  },
    {
    "table":"SafetyCaseEvent",
    "title":"Safety case events",
    "fields":[
      "class_table",
      "class_context",
      "case",
      "event_kind",
      "evidence_type",
      "title",
      "actor",
      "occurred_at",
      "time_created"
    ]
  },
    {
    "table":"SupportCase",
    "title":"Support cases",
    "fields":[
      "id",
      "subject_type",
      "subject_id",
      "title",
      "category",
      "priority",
      "status",
      "owner",
      "sla_due_at",
      "resolved_at",
      "time_created",
      "time_updated"
    ]
  },
    {
    "table":"IntegrationEvent",
    "title":"Integration events",
    "fields":[
      "id",
      "class_table",
      "provider",
      "event_kind",
      "provider_event_id",
      "event_type",
      "target",
      "status",
      "response_code",
      "attempts",
      "next_retry_at",
      "received_at",
      "processed_at",
      "replay_count",
      "time_created"
    ]
  },
    {
    "table":"ComputeUsage",
    "title":"Compute usage",
    "fields":[
      "id",
      "wallet",
      "token",
      "playable",
      "amount",
      "input_units",
      "output_units",
      "cached_units",
      "reasoning_units",
      "subject_type",
      "subject_ref",
      "connection",
      "workflow_run",
      "billing_mode",
      "rate_version",
      "occurred_at",
      "time_created",
      "time_updated"
    ]
  },
    {
    "table":"ComputeTopup",
    "title":"Compute top-ups",
    "fields":[
      "id",
      "wallet",
      "token",
      "playable",
      "amount",
      "source_type",
      "source_ref",
      "occurred_at",
      "time_created",
      "time_updated"
    ]
  },
    {
    "table":"McpConnection",
    "title":"MCP connections",
    "fields":[
      "id",
      "class_table",
      "class_context",
      "class_ref",
      "client_name",
      "client_type",
      "status",
      "scopes",
      "resources",
      "approval_policy",
      "created_by",
      "last_used_at",
      "revoked_at",
      "time_created"
    ]
  },
    {
    "table":"McpApproval",
    "title":"MCP approvals",
    "fields":[
      "class_table",
      "class_context",
      "connection",
      "operation",
      "target",
      "summary",
      "status",
      "requested_by",
      "requested_at",
      "expires_at",
      "decided_by",
      "decided_at",
      "decision_note",
      "time_created"
    ]
  }
  ],
  "billing":[
    {
    "table":"OrgBillingInvoice",
    "title":"Organization invoices",
    "fields":[
      "id",
      "class_table",
      "account",
      "amount_due_cents",
      "amount_paid_cents",
      "currency",
      "status",
      "period_start",
      "period_end",
      "issued_at",
      "due_at",
      "finalized_at",
      "paid_at",
      "time_created",
      "time_updated"
    ]
  },
    {
    "table":"OrgBillingPayment",
    "title":"Organization payments",
    "fields":[
      "id",
      "class_table",
      "account",
      "payment_type",
      "amount_cents",
      "currency",
      "invoice_class",
      "invoice",
      "status",
      "provider",
      "occurred_at",
      "time_created"
    ]
  }
  ]
};

// statstrade-superadmin.adminweb.workspace/WORKSPACE-AREA-SPECS [528] 
export var WORKSPACE_AREA_SPECS = {
  "user":[
    {
    "key":"personal",
    "number":"A02.S04",
    "title":"Personal",
    "href":"/a02/s04-personal",
    "tables":["User","Activity","Starred"]
  },
    {
    "key":"account",
    "number":"A02.S05",
    "title":"Account",
    "href":"/a02/s05-account",
    "tables":[
      "AccessRole",
      "PlatformGrant",
      "AccessRequest",
      "AccessInviteInternal",
      "Wallet"
    ]
  },
    {
    "key":"crypto",
    "number":"A02.S06",
    "title":"Crypto",
    "href":"/a02/s06-crypto",
    "tables":[
      "Wallet",
      "Token",
      "TokenAllowance",
      "Asset",
      "AssetTx",
      "WalletAddress"
    ]
  }
  ],
  "room":[
    {
    "key":"swap",
    "number":"A04.S02",
    "title":"Swap",
    "href":"/a04/s02-swap",
    "tables":[
      "ProspectOrder",
      "ProspectStake",
      "ProspectMarketSnapshot",
      "ProspectOrderStrike",
      "ProspectStakeTx",
      "ActivityLog",
      "Lock",
      "LockLog",
      "ItemTx"
    ]
  },
    {
    "key":"vault",
    "number":"A04.S03",
    "title":"Vault",
    "href":"/a04/s03-vault",
    "tables":[
      "TopicAllocation",
      "TopicCall",
      "ActivityLog",
      "Lock",
      "LockLog",
      "ItemTx"
    ]
  },
    {
    "key":"prediction",
    "number":"A04.S04",
    "title":"Prediction",
    "href":"/a04/s04-prediction",
    "tables":[
      "Topic",
      "Prospect",
      "ProspectOrder",
      "ProspectStake",
      "ProspectMarketSnapshot",
      "TopicAllocation",
      "TopicCall",
      "ProspectOrderStrike",
      "ProspectStakeTx",
      "ActivityLog",
      "Lock",
      "LockLog",
      "ItemTx"
    ]
  }
  ],
  "super":[
    {
    "key":"global",
    "number":"A03.S03",
    "title":"Global",
    "href":"/a03/s03-index",
    "tables":[]
  },
    {
    "key":"admin",
    "number":"A03.S04",
    "title":"Admin",
    "href":"/a03/s04-admin",
    "tables":[
      "PlatformGrant",
      "SafetyCase",
      "ComplianceRecord",
      "AuditLog",
      "SystemPlatformApproval",
      "SafetyCaseEvent",
      "SupportCase"
    ]
  },
    {
    "key":"system",
    "number":"A03.S05",
    "title":"System",
    "href":"/a03/s05-system",
    "tables":[
      "SystemCatalogItem",
      "IntegrationProvider",
      "ComputeConnection",
      "IntegrationEvent",
      "ComputeUsage",
      "ComputeTopup",
      "McpConnection",
      "McpApproval"
    ]
  },
    {
    "key":"admin/user",
    "number":"A03.S06",
    "title":"Admin users",
    "href":"/a03/s06-admin-user",
    "source-section":"user",
    "tables":[
      "User",
      "AccessRole",
      "PlatformGrant",
      "AccessRequest",
      "AccessInviteInternal"
    ]
  },
    {
    "key":"admin/organisation",
    "number":"A03.S07",
    "title":"Admin organizations",
    "href":"/a03/s07-admin-organisation",
    "source-section":"organisation",
    "tables":[
      "Org",
      "OrgSettings",
      "Campaign",
      "TopicAllocation",
      "TopicCall",
      "OrgRewardBudget",
      "OrgRewardLedger",
      "OrgBillingInvoice",
      "OrgBillingPayment"
    ]
  },
    {
    "key":"admin/newsroom",
    "number":"A03.S14",
    "title":"Newsroom imports",
    "href":"/newsroom/imports",
    "tables":[]
  },
    {
    "key":"admin/campaign",
    "number":"A03.S08",
    "title":"Campaigns",
    "href":"/a03/s08-admin-campaign",
    "source-section":"organisation",
    "tables":["Campaign"]
  },
    {
    "key":"system/service",
    "number":"A03.S09",
    "title":"Services",
    "href":"/a03/s09-service",
    "source-section":"super",
    "tables":[
      "IntegrationProvider",
      "ComputeConnection",
      "IntegrationEvent",
      "ComputeUsage",
      "ComputeTopup"
    ]
  },
    {
    "key":"system/template",
    "number":"A03.S10",
    "title":"Templates",
    "href":"/a03/s10-template",
    "source-section":"super",
    "tables":["SystemCatalogItem"]
  },
    {
    "key":"system/room",
    "number":"A03.S11",
    "title":"System rooms",
    "href":"/a03/s11-system-room",
    "source-section":"room",
    "tables":["Topic","Prospect"]
  },
    {
    "key":"system/swap",
    "number":"A03.S12",
    "title":"System swap",
    "href":"/a03/s12-system-swap",
    "source-section":"room",
    "tables":[
      "ProspectOrder",
      "ProspectStake",
      "ProspectMarketSnapshot",
      "ProspectOrderStrike",
      "ProspectStakeTx",
      "ActivityLog",
      "Lock",
      "LockLog",
      "ItemTx"
    ]
  },
    {
    "key":"system/brand",
    "number":"A03.S13",
    "title":"System brands",
    "href":"/a03/s13-system-brand",
    "source-section":"brand",
    "tables":[
      "Social",
      "SocialConnection",
      "SocialHandle",
      "SocialPublication",
      "SocialVariant",
      "SocialAsset",
      "SocialContent"
    ]
  }
  ]
};

// statstrade-superadmin.adminweb.workspace/ADMINWEB-NAVIGATION-SPECS [529] 
export var ADMINWEB_NAVIGATION_SPECS = [
  {
  "id":"operations",
  "number":"A01",
  "label":"operations",
  "items":[
    {
    "section":"overview",
    "number":"A01.S01",
    "href":"/a01/s01-index",
    "label":"Overview"
  },
    {
    "section":"health",
    "number":"A01.S02",
    "href":"/a01/s02-health",
    "label":"Health"
  },
    {
    "section":"access",
    "number":"A01.S03",
    "href":"/a01/s03-access",
    "label":"Access"
  },
    {
    "section":"approvals",
    "number":"A01.S04",
    "href":"/a01/s04-approvals",
    "label":"Approvals"
  },
    {
    "section":"audit",
    "number":"A01.S05",
    "href":"/a01/s05-audit",
    "label":"Audit"
  }
  ]
},
  {
  "id":"accounts",
  "number":"A02",
  "label":"accounts & billing",
  "items":[
    {
    "section":"user",
    "number":"A02.S01",
    "href":"/a02/s01-user",
    "label":"User operations",
    "icon":"manage_accounts",
    "index-label":"User operations"
  },
    {
    "section":"organisation",
    "number":"A02.S02",
    "href":"/a02/s02-organisation",
    "label":"Organisations",
    "icon":"business",
    "index-label":"Organisations"
  },
    {
    "section":"billing",
    "number":"A02.S03",
    "href":"/a02/s03-billing",
    "label":"Billing operations",
    "icon":"payments",
    "index-label":"Billing operations"
  }
  ]
},
  {
  "id":"control-plane",
  "number":"A03",
  "label":"control plane",
  "items":[
    {
    "section":"chain",
    "number":"A03.S01",
    "href":"/a03/s01-chain",
    "label":"Chain",
    "index-label":"Tokens and assets"
  },
    {
    "section":"super",
    "number":"A03.S02",
    "href":"/a03/s02-system",
    "label":"System",
    "index-label":"Platform administration"
  },
    {
    "section":"global",
    "number":"A03.S03",
    "href":"/a03/s03-index",
    "label":"Global data",
    "index-label":"Global data"
  }
  ]
},
  {
  "id":"network",
  "number":"A04",
  "label":"network operations",
  "items":[
    {
    "section":"room",
    "number":"A04.S01",
    "href":"/a04/s01-markets",
    "label":"Markets",
    "index-label":"Topics and markets"
  }
  ]
},
  {
  "id":"governance",
  "number":"A05",
  "label":"governance & delivery",
  "items":[
    {
    "section":"brand",
    "number":"A05.S01",
    "href":"/a05/s01-brand",
    "label":"Brand",
    "index-label":"Social and brand"
  }
  ]
}
];

// statstrade-superadmin.adminweb.workspace/ADMINWEB-SECTION-SPECS [530] 
export var ADMINWEB_SECTION_SPECS = [
  {
  "section":"overview",
  "number":"A01.S01",
  "href":"/a01/s01-index",
  "label":"Overview"
},
  {
  "section":"health",
  "number":"A01.S02",
  "href":"/a01/s02-health",
  "label":"Health"
},
  {
  "section":"access",
  "number":"A01.S03",
  "href":"/a01/s03-access",
  "label":"Access"
},
  {
  "section":"approvals",
  "number":"A01.S04",
  "href":"/a01/s04-approvals",
  "label":"Approvals"
},
  {
  "section":"audit",
  "number":"A01.S05",
  "href":"/a01/s05-audit",
  "label":"Audit"
},
  {
  "section":"user",
  "number":"A02.S01",
  "href":"/a02/s01-user",
  "label":"User operations",
  "icon":"manage_accounts",
  "index-label":"User operations"
},
  {
  "section":"organisation",
  "number":"A02.S02",
  "href":"/a02/s02-organisation",
  "label":"Organisations",
  "icon":"business",
  "index-label":"Organisations"
},
  {
  "section":"billing",
  "number":"A02.S03",
  "href":"/a02/s03-billing",
  "label":"Billing operations",
  "icon":"payments",
  "index-label":"Billing operations"
},
  {
  "section":"chain",
  "number":"A03.S01",
  "href":"/a03/s01-chain",
  "label":"Chain",
  "index-label":"Tokens and assets"
},
  {
  "section":"super",
  "number":"A03.S02",
  "href":"/a03/s02-system",
  "label":"System",
  "index-label":"Platform administration"
},
  {
  "section":"global",
  "number":"A03.S03",
  "href":"/a03/s03-index",
  "label":"Global data",
  "index-label":"Global data"
},
  {
  "section":"room",
  "number":"A04.S01",
  "href":"/a04/s01-markets",
  "label":"Markets",
  "index-label":"Topics and markets"
},
  {
  "section":"brand",
  "number":"A05.S01",
  "href":"/a05/s01-brand",
  "label":"Brand",
  "index-label":"Social and brand"
}
];

// statstrade-superadmin.adminweb.workspace/WORKSPACE-PAGE-NUMBERS-SPEC [531] 
export var WORKSPACE_PAGE_NUMBERS_SPEC = {
  "user/crypto":"A02.S06",
  "super/system/brand":"A03.S13",
  "super/admin":"A03.S04",
  "super/admin/campaign":"A03.S08",
  "super/system/swap":"A03.S12",
  "brand":"A05.S01",
  "super/system/service":"A03.S09",
  "health":"A01.S02",
  "user/account":"A02.S05",
  "access":"A01.S03",
  "super/global":"A03.S03",
  "user":"A02.S01",
  "room/prediction":"A04.S04",
  "super/admin/newsroom":"A03.S14",
  "billing":"A02.S03",
  "organisation":"A02.S02",
  "super/system/room":"A03.S11",
  "super":"A03.S02",
  "approvals":"A01.S04",
  "overview":"A01.S01",
  "super/admin/organisation":"A03.S07",
  "room/swap":"A04.S02",
  "user/personal":"A02.S04",
  "audit":"A01.S05",
  "super/system/template":"A03.S10",
  "room/vault":"A04.S03",
  "super/admin/user":"A03.S06",
  "room":"A04.S01",
  "super/system":"A03.S05",
  "global":"A03.S03",
  "chain":"A03.S01"
};

// statstrade-superadmin.adminweb.workspace/WORKSPACE-PAGE-HREFS-SPEC [532] 
export var WORKSPACE_PAGE_HREFS_SPEC = {
  "user/crypto":"/a02/s06-crypto",
  "super/system/brand":"/a03/s13-system-brand",
  "super/admin":"/a03/s04-admin",
  "super/admin/campaign":"/a03/s08-admin-campaign",
  "super/system/swap":"/a03/s12-system-swap",
  "brand":"/a05/s01-brand",
  "super/system/service":"/a03/s09-service",
  "health":"/a01/s02-health",
  "user/account":"/a02/s05-account",
  "access":"/a01/s03-access",
  "super/global":"/a03/s03-index",
  "user":"/a02/s01-user",
  "room/prediction":"/a04/s04-prediction",
  "super/admin/newsroom":"/newsroom/imports",
  "billing":"/a02/s03-billing",
  "organisation":"/a02/s02-organisation",
  "super/system/room":"/a03/s11-system-room",
  "super":"/a03/s02-system",
  "approvals":"/a01/s04-approvals",
  "overview":"/a01/s01-index",
  "super/admin/organisation":"/a03/s07-admin-organisation",
  "room/swap":"/a04/s02-swap",
  "user/personal":"/a02/s04-personal",
  "audit":"/a01/s05-audit",
  "super/system/template":"/a03/s10-template",
  "room/vault":"/a04/s03-vault",
  "super/admin/user":"/a03/s06-admin-user",
  "room":"/a04/s01-markets",
  "super/system":"/a03/s05-system",
  "global":"/a03/s03-index",
  "chain":"/a03/s01-chain"
};

// statstrade-superadmin.adminweb.workspace/WORKSPACE-POSTGREST-REFS [533] 
export var WORKSPACE_POSTGREST_REFS = {
  "TokenSupply":["token","playable"],
  "ComputeUsage":["wallet","token","playable","connection"],
  "Campaign":[
    "owner",
    "parent",
    "token",
    "playable",
    "starred",
    "wallet",
    "access",
    "tasks",
    "feeds",
    "apikeys",
    "lock",
    "rev"
  ],
  "OrgSettings":["org"],
  "ComplianceRecord":["owner"],
  "OrgRewardLedger":["org","budget","user","task","contest_award","asset_tx"],
  "Social":[],
  "ItemTx":["item"],
  "Asset":["wallet","token","playable"],
  "SupportCase":["owner"],
  "ComputeConnection":["credit_token","credit_playable"],
  "ProspectStakeTx":["allocation","prospect","wallet"],
  "ProspectMarketSnapshot":["prospect"],
  "AccessInviteInternal":["access","to","from"],
  "ProspectStake":["prospect","wallet"],
  "McpApproval":["connection","requested_by","decided_by"],
  "McpConnection":["created_by"],
  "Activity":[],
  "User":["starred","wallet","social","lock","rev"],
  "IntegrationEvent":["provider"],
  "OrgRewardBudget":["org","token","playable"],
  "Topic":[
    "campaign",
    "token",
    "playable",
    "starred",
    "tasks",
    "feeds",
    "apikeys",
    "lock",
    "rev"
  ],
  "ComputeTopup":["wallet","token","playable"],
  "WalletAddress":["wallet"],
  "Org":[
    "starred",
    "wallet",
    "social",
    "access",
    "tasks",
    "apikeys",
    "lock",
    "rev"
  ],
  "TokenErc20Option":["token","playable"],
  "Op":[],
  "SocialAsset":["content"],
  "OrgBillingInvoice":["account"],
  "OrgBillingPayment":["account","invoice"],
  "TopicCall":["user","topic","prospect"],
  "SystemPlatformApproval":["target_user","requested_by","decided_by"],
  "SocialPublication":["variant","connection"],
  "IntegrationProvider":["created_by"],
  "PlatformGrant":["user","granted_by"],
  "SystemCatalogItem":[],
  "LockLog":["lock"],
  "AccessRole":["access","member"],
  "Prospect":["token","playable","topic"],
  "AuditLog":["audit"],
  "SafetyCaseEvent":["case","actor"],
  "SocialVariant":["content"],
  "Wallet":[],
  "SafetyCase":["reporter","assigned_to"],
  "TopicAllocation":["topic","wallet"],
  "SocialConnection":["social"],
  "Lock":[],
  "TokenAllowance":["token","playable"],
  "ProspectOrder":["prospect","wallet"],
  "ActivityLog":["activity"],
  "Item":["wallet","type","playable"],
  "Token":["issuer"],
  "Global":["rev"],
  "SocialHandle":["social"],
  "Starred":[],
  "AccessRequest":["access","from","reply"],
  "ProspectOrderStrike":["prospect","ask_order","ask_wallet","bid_order","bid_wallet"],
  "SocialContent":["org","author"],
  "AssetTx":["asset"]
};

// statstrade-superadmin.adminweb.workspace/ADMIN-ACTIONS [534] 
export var ADMIN_ACTIONS = {
  "actions":{
    "check-super":{
      "rpc-spec":{
        "id":"check-is-super",
        "schema":"stats_rpc",
        "input":[],
        "return":"boolean",
        "flags":{}
      }
    }
  }
};

// statstrade-superadmin.adminweb.workspace/getPageNumber [536] 
export function getPageNumber(section,area){
  let key = area ? (section + "/" + area) : section;
  return WORKSPACE_PAGE_NUMBERS_SPEC[key];
}

// statstrade-superadmin.adminweb.workspace/getTabNumber [542] 
export function getTabNumber(section,area,tab_index){
  let page_number = getPageNumber(section,area);
  let digits = tab_index.toString();
  let padded = (tab_index < 10) ? ("0" + digits) : digits;
  return page_number ? (page_number + ".T" + padded) : null;
}

// statstrade-superadmin.adminweb.workspace/shellRouteModel [550] 
export function shellRouteModel(section,area){
  return {
    "handler":function (_context){
        return {"section":section,"area":area};
      },
    "defaults":{"args":[],"output":[]},
    "options":{}
  };
}

// statstrade-superadmin.adminweb.workspace/AdminwebShell [559] 
export function AdminwebShell({section,area,children}){
  let provider_state = substrate.useSubstrateContext();
  let resource = provider_state["resource"];
  let node = resource["client"];
  let space_id = substrate.pageSpaceId(
    resource["scope-id"],
    "shell/superadmin/" + section + "/" + (area || "root")
  );
  let group_id = group_shell.Group["id"];
  let route_model = React.useMemo(function (){
    return shellRouteModel(section,area);
  },[section,area]);
  let route_output = ext_page.listenModelOutput(node,space_id,[group_id,"route"],["output"],null);
  let route = route_output["current"] || {"section":section,"area":area};
  let active_section = route["section"] || section;
  let active_area = route["area"] || area;
  React.useEffect(function (){
    page_core.group_add_attach(node,space_id,group_id,{"route":route_model});
    let refresh = async function (){
      try{
        await ext_page.refreshModel(node,space_id,[group_id,"route"],{});
      }
      catch(_){
        null;
      }
    };
    refresh();
    return function (){
      page_core.group_remove(node,space_id,group_id);
    };
  },[node,space_id,group_id,route_model]);
  let groups = ADMINWEB_NAVIGATION_SPECS;
  let area_links = WORKSPACE_AREA_SPECS[section] || [];
  let icon_map = {
    "manage_accounts":UserRoundCog,
    "business":Building2,
    "payments":CreditCard
  };
  return (
    <T.XStack flex={1} minHeight="100vh" alignItems="stretch">
      <T.YStack
        width="clamp(180px, 24vw, 280px)"
        minWidth={0}
        flexShrink={0}
        gap="$2"
        padding="$3"
        borderRightWidth={1}
        borderColor="$borderColor"
        overflowY="auto">
        <T.XStack
          alignItems="center"
          justifyContent="space-between"
          paddingBottom="$3"
          borderBottomWidth={1}
          borderColor="$borderColor">
          <T.Text fontSize="$5" fontWeight="700">Superadmin</T.Text>
          <T.Anchor href="/" color="$color10">Home</T.Anchor>
        </T.XStack>
        {groups.map(function (group){
          return (
            <T.YStack key={group["id"]} gap="$2" paddingTop="$2">
              <T.XStack alignItems="center" gap="$2">
                <T.Text
                  fontFamily="monospace"
                  fontSize="$1"
                  fontWeight="700"
                  color="$color10">{group["number"]}
                </T.Text>
                <T.Text
                  fontSize="$1"
                  fontWeight="700"
                  letterSpacing={1}
                  textTransform="uppercase"
                  color="$color10">{group["label"]}
                </T.Text>
              </T.XStack>
              {group["items"].map(function (entry){
                let selected = active_section == entry["section"];
                let Icon = icon_map[entry["icon"]];
                return (
                  <T.YStack key={entry["section"]} gap="$1">
                    <T.Anchor
                      href={entry["href"]}
                      ariaCurrent={selected ? "page" : null}
                      paddingHorizontal="$2"
                      paddingVertical="$2"
                      borderRadius="$3"
                      backgroundColor={selected ? "$color3" : "transparent"}>
                      <T.XStack alignItems="center" gap="$2">
                        {Icon ? React.createElement(Icon,{"size":17,"aria_hidden":true}) : null}
                        <T.Text fontFamily="monospace" fontSize="$2" color="$color10">{entry["number"]}</T.Text>
                        <T.Text fontWeight="600">{entry["label"]}</T.Text>
                      </T.XStack>
                    </T.Anchor>
                    {(selected && (area_links.length > 0)) ? (
                      <T.YStack gap="$1" paddingLeft="$3">
                        {area_links.map(function (area_entry){
                          let area_selected = active_area == area_entry["key"];
                          return (
                            <T.Anchor
                              key={area_entry["key"]}
                              href={area_entry["href"] || WORKSPACE_PAGE_HREFS_SPEC[section + "/" + area_entry["key"]]}
                              ariaCurrent={area_selected ? "page" : null}
                              paddingHorizontal="$2"
                              paddingVertical="$1"
                              borderRadius="$2"
                              backgroundColor={area_selected ? "$color3" : "transparent"}>
                              <T.XStack alignItems="center" gap="$2">
                                <T.Text fontFamily="monospace" fontSize="$1" color="$color10">{area_entry["number"]}</T.Text>
                                <T.Text fontSize="$2">{area_entry["title"]}</T.Text>
                              </T.XStack>
                            </T.Anchor>);
                        })}
                      </T.YStack>) : null}
                  </T.YStack>);
              })}
            </T.YStack>);
        })}
      </T.YStack>
      <T.YStack flex={1} minWidth={0}>{children}</T.YStack>
    </T.XStack>);
}

// statstrade-superadmin.adminweb.workspace/useTableRows [687] 
export function useTableRows(table,fields,context){
  let reference_fields = WORKSPACE_POSTGREST_REFS[table] || [];
  let request_fields = fields.map(function (field){
    return reference_fields.includes(field) ? (field + "_id") : field;
  });
  return global_table.useTableRows(table,request_fields,context);
}

// statstrade-superadmin.adminweb.workspace/WorkspaceContent [699] 
export function WorkspaceContent(props){
  let {area,section} = props;
  let actor_id = props["actor_id"] || props["actorId"] || props["actor-id"];
  let provider_state = substrate.useSubstrateContext();
  let resource = provider_state["resource"];
  let runtime_context = {
    "node":resource["client"],
    "group":WORKSPACE_GROUPS[section + "/" + (area || "")] || WORKSPACE_GROUPS[section] || group_tables.Group,
    "primary-id":resource["config"]["primary"]["id"],
    "space-id":substrate.pageSpaceId(
        resource["scope-id"],
        "workspace/" + section + "/" + (area || "root")
      ),
    "runtime":{
        "config":resource["config"],
        "schema":{},
        "lookup":{},
        "opts":{"realtime-enabled":false}
      }
  };
  let areas = WORKSPACE_AREA_SPECS[section] || [];
  let area_spec = areas.find(function (entry){
    return entry["key"] == area;
  }) || {};
  let source_section = area_spec["source-section"] || section;
  let section_tables = WORKSPACES[source_section] || [];
  let area_table_names = area_spec["tables"] || [];
  let tables = section_tables;
  if(area){
    tables = tables.filter(function (table){
      return area_table_names.includes(table["table"]);
    });
  }
  let [selectedIndex,setSelectedIndex] = React.useState(0);
  React.useEffect(function (){
    setSelectedIndex(0);
  },[section,area]);
  let selected = tables[selectedIndex] || tables[0];
  let {error,rows} = useTableRows(selected["table"],selected["fields"],runtime_context);
  return (
    <AdminwebShell section={section} area={area}>
      <T.YStack flex={1} gap="$3" padding="$4">
        <T.Text color="$color10">Read-only views from the current statstrade-v2 schema.</T.Text>
        <T.XStack gap="$2" flexWrap="wrap">
          {tables.map(function (table,index){
            return (
              <T.Button
                key={table["table"]}
                size="$2"
                chromeless={true}
                ariaPressed={index == selectedIndex}
                backgroundColor={(index == selectedIndex) ? "$color3" : "transparent"}
                onPress={function (){
                    setSelectedIndex(index);
                  }}>
                <T.XStack alignItems="center" gap="$2">
                  <T.Text fontFamily="monospace" fontSize="$1" color="$color10">{getTabNumber(section,area,index + 1)}</T.Text>
                  <T.Text>{table["title"]}</T.Text>
                </T.XStack>
              </T.Button>);
          })}
        </T.XStack>
        <T.Text fontSize="$5" fontWeight="600">{selected["title"]}</T.Text>
        <T.YStack gap="$2">
          {(rows || []).map(function (row,index){
            return (
              <T.YStack
                key={selected["table"] + "-" + index}
                padding="$3"
                borderWidth={1}
                borderColor="$borderColor"
                borderRadius="$3">
                <T.Text fontFamily="monospace" fontSize="$2">{JSON.stringify(row)}</T.Text>
              </T.YStack>);
          })}
        </T.YStack>
        {error ? (
          <T.Text color="$red10" accessibilityRole="alert">{error}</T.Text>) : ((0 == (rows || []).length) ? (
          <T.Text color="$color10">No records found.</T.Text>) : null)}
      </T.YStack>
    </AdminwebShell>);
}

// statstrade-superadmin.adminweb.workspace/CampaignManagement [1026] 
export function CampaignManagement({section,area}){
  let [target_user_id,set_target_user_id] = React.useState("");
  let [reason,set_reason] = React.useState("");
  let [error,set_error] = React.useState(null);
  let [busy,set_busy] = React.useState(false);
  let [session] = sb.useListenSession();
  let token = (session || {})["access_token"];
  let start_impersonation = async function (){
    set_busy(true);
    set_error(null);
    try{
      if(!token){
        throw new Error("Sign in to the superadmin account first.");
      }
      let response = await fetch("/api/impersonation/start",{
        "method":"POST",
        "headers":{
                "Content-Type":"application/json",
                "Authorization":"Bearer " + token
              },
        "body":JSON.stringify({"target_user_id":target_user_id,"reason":reason})
      });
      let result = await response.json();
      if(!response["ok"]){
        throw new Error(result["error"] || "Could not start impersonation.");
      }
      let form = document.createElement("form");
      form["method"] = "POST";
      form["action"] = result["redeem_url"];
      let input = document.createElement("input");
      input["type"] = "hidden";
      input["name"] = "ticket";
      input["value"] = result["ticket"];
      form.appendChild(input);
      document["body"].appendChild(form);
      form.submit();
    }
    catch(e){
      set_error(e["message"] || "Could not start impersonation.");
    }
    finally{
      set_busy(false);
    }
  };
  return (
    <AdminwebShell section={section} area={area}>
      <T.YStack flex={1} gap="$3" padding="$4">
        <T.Text fontSize="$5" fontWeight="600">Campaign management</T.Text>
        <T.Text color="$color10">
          Impersonate a user to open their account in Statstrade Web and manage campaigns with their access.
        </T.Text>
        <T.Text fontWeight="600">Impersonate user (UUID)</T.Text>
        <T.Input
          value={target_user_id}
          placeholder="Target user UUID"
          onChangeText={function (value){
              set_target_user_id(value);
            }}/>
        <T.Text fontWeight="600">Reason for access</T.Text>
        <T.TextArea
          value={reason}
          placeholder="Support case or other reason"
          onChangeText={function (value){
              set_reason(value);
            }}/>
        <T.Text color="$color10">
          The handoff is single-use, audited, and expires after one hour.
        </T.Text>
        {error ? (
          <T.Text color="$red10" accessibilityRole="alert">{error}</T.Text>) : null}
        <T.Button
          disabled={busy || !token || (target_user_id == "") || (reason.length < 8)}
          onPress={start_impersonation}>{busy ? "Starting…" : "Impersonate"}
        </T.Button>
      </T.YStack>
    </AdminwebShell>);
}

// statstrade-superadmin.adminweb.workspace/SuperadminGate [1092] 
export function SuperadminGate({children}){
  let provider_state = substrate.useSubstrateContext();
  let resource = provider_state["resource"];
  let node = resource["client"];
  let service_id = resource["config"]["primary"]["id"] || "db/primary";
  let rpc_spec = ADMIN_ACTIONS["actions"]["check-super"]["rpc-spec"];
  let [authorization,set_authorization] = React.useState("checking");
  let check_super = React.useMemo(function (){
    return function (){
      return global_table.rpcCall(node,service_id,rpc_spec,[],{});
    };
  },[node,service_id,rpc_spec]);
  React.useEffect(function (){
    let cancelled = false;
    let verify = async function (){
      try{
        let allowed = await check_super();
        if(!cancelled){
          set_authorization((allowed == true) ? "allowed" : "denied");
        }
      }
      catch(e){
        if(!cancelled){
          set_authorization("error");
        }
      }
    };
    verify();
    return function (){
      cancelled = true;
    };
  },[check_super]);
  return (authorization == "allowed") ? children : (
    <T.YStack gap="$3" padding="$4" accessibilityLiveRegion="polite">
      {(authorization == "checking") ? (
        <T.Text color="$color10">Checking admin access...</T.Text>) : ((authorization == "denied") ? (
        <T.Text color="$red10" accessibilityRole="alert">Superadmin access is required.</T.Text>) : (
        <T.Text color="$red10" accessibilityRole="alert">Unable to verify admin access. Refresh and try again.</T.Text>))}
    </T.YStack>);
}

// statstrade-superadmin.adminweb.workspace/AdminWorkspaceGuard [1141] 
export function AdminWorkspaceGuard(props){
  let {area,section} = props;
  let actor_id = props["actor_id"] || props["actorId"] || props["actor-id"];
  let component = props["content"];
  let content = component ? (
    <AdminwebShell section={section} area={area}>{React.createElement(component,{"actor_id":actor_id})}</AdminwebShell>) : ((area == "admin/campaign") ? (
    <CampaignManagement section={section} area={area} actor_id={actor_id}/>) : (
    <WorkspaceContent section={section} area={area} actor_id={actor_id}/>));
  let requires_super = component || (section == "chain") || (section == "super") || (section == "billing");
  return requires_super ? (
    <SuperadminGate>{content}</SuperadminGate>) : content;
}

// statstrade-superadmin.adminweb.workspace/AdminWorkspace [1163] 
export function AdminWorkspace({section,area,content}){
  let [session] = sb.useListenSession();
  let current_session = session || {};
  let user = current_session["user"] || {};
  let actor_id = user["id"];
  let token = current_session["access_token"];
  return token ? (
    <AdminWorkspaceGuard
      section={section}
      area={area}
      actor_id={actor_id}
      content={content}/>) : (
    <T.YStack gap="$3" padding="$4">
      <T.Text fontSize="$5" fontWeight="600">Sign in to view admin data.</T.Text>
      <T.Anchor href="/auth/sign-in">Sign in</T.Anchor>
    </T.YStack>);
}

// statstrade-superadmin.adminweb.workspace/MODULE [1181] 
export var MODULE = {
  "WORKSPACE_GROUPS":WORKSPACE_GROUPS,
  "WORKSPACES":WORKSPACES,
  "WORKSPACE_AREA_SPECS":WORKSPACE_AREA_SPECS,
  "ADMINWEB_NAVIGATION_SPECS":ADMINWEB_NAVIGATION_SPECS,
  "ADMINWEB_SECTION_SPECS":ADMINWEB_SECTION_SPECS,
  "WORKSPACE_PAGE_NUMBERS_SPEC":WORKSPACE_PAGE_NUMBERS_SPEC,
  "WORKSPACE_PAGE_HREFS_SPEC":WORKSPACE_PAGE_HREFS_SPEC,
  "WORKSPACE_POSTGREST_REFS":WORKSPACE_POSTGREST_REFS,
  "ADMIN_ACTIONS":ADMIN_ACTIONS,
  "getPageNumber":getPageNumber,
  "getTabNumber":getTabNumber,
  "shellRouteModel":shellRouteModel,
  "AdminwebShell":AdminwebShell,
  "useTableRows":useTableRows,
  "WorkspaceContent":WorkspaceContent,
  "CampaignManagement":CampaignManagement,
  "SuperadminGate":SuperadminGate,
  "AdminWorkspaceGuard":AdminWorkspaceGuard,
  "AdminWorkspace":AdminWorkspace,
  "MODULE":MODULE
};