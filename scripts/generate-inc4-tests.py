#!/usr/bin/env python3
"""Generate Increment 4 acceptance test files from interface design AC mapping."""
from __future__ import annotations

import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "tests" / "returning-customers"

# (folder, story, tier, tests: list of (ac_num, test_name_suffix))
STORIES = [
    (
        "auth/register-account",
        "Register Account",
        [
            ("server", [
                (2, "creates unverified account and confirmation"),
                (3, "duplicate email enumeration-safe error"),
                (4, "password requirements block creation"),
            ]),
            ("client", [
                (1, "form collects credentials with requirements visible"),
                (2, "creates unverified account and confirmation"),
                (3, "duplicate email enumeration-safe error"),
                (4, "password requirements block creation"),
            ]),
        ],
    ),
    (
        "auth/send-email-verification",
        "Send Email Verification",
        [
            ("server", [
                (1, "email with unique link sent"),
                (2, "expired link resend offered"),
                (3, "queued retry messaging on confirmation"),
            ]),
        ],
    ),
    (
        "auth/verify-email-address",
        "Verify Email Address",
        [
            ("server", [
                (1, "valid link verifies account"),
                (2, "used link idempotent message"),
                (3, "expired link resend action"),
            ]),
            ("client", [
                (1, "valid link verifies account"),
                (2, "used link idempotent message"),
                (3, "expired link resend action"),
            ]),
        ],
    ),
    (
        "auth/log-in",
        "Log In",
        [
            ("server", [
                (1, "session created and redirect"),
                (2, "generic credential error"),
                (3, "unverified blocked with resend"),
                (4, "guest cart merge sums quantities"),
            ]),
            ("client", [
                (1, "session created and redirect"),
                (2, "generic credential error"),
                (3, "unverified blocked with resend"),
            ]),
        ],
    ),
    (
        "auth/log-out",
        "Log Out",
        [
            ("server", [
                (1, "current session invalidated"),
                (2, "single device vs log out everywhere"),
            ]),
            ("client", [
                (1, "current session invalidated"),
                (2, "single device vs log out everywhere"),
            ]),
        ],
    ),
    (
        "auth/reset-password",
        "Reset Password",
        [
            ("server", [
                (1, "enumeration-safe confirmation"),
                (2, "valid link opens form"),
                (3, "password update invalidates sessions"),
                (4, "expired or used link rejected"),
            ]),
            ("client", [
                (1, "enumeration-safe confirmation"),
                (2, "valid link opens form"),
                (3, "password update invalidates sessions"),
                (4, "expired or used link rejected"),
            ]),
        ],
    ),
    (
        "session/maintain-session-across-devices",
        "Maintain Session Across Devices",
        [
            ("server", [
                (1, "concurrent sessions"),
                (2, "expiry redirect preserves cart"),
                (3, "password reset cascade"),
            ]),
        ],
    ),
    (
        "address-book/save-delivery-address",
        "Save Delivery Address",
        [
            ("server", [
                (1, "checkout save opt-in"),
                (2, "first address auto-default"),
                (3, "additional entry non-destructive"),
            ]),
            ("client", [
                (1, "checkout save opt-in"),
                (2, "first address auto-default"),
                (3, "additional entry non-destructive"),
            ]),
        ],
    ),
    (
        "address-book/manage-saved-addresses",
        "Manage Saved Addresses",
        [
            ("server", [
                (1, "list with default indicator"),
                (2, "edit persists to checkout"),
                (3, "delete default prompts new default"),
                (4, "set default demotes previous"),
            ]),
            ("client", [
                (1, "list with default indicator"),
                (2, "edit persists to checkout"),
                (3, "delete default prompts new default"),
                (4, "set default demotes previous"),
            ]),
        ],
    ),
    (
        "payment/save-payment-method",
        "Save Payment Method",
        [
            ("server", [
                (1, "checkout save via token"),
                (2, "display metadata without raw card"),
                (3, "second method retains first default"),
            ]),
            ("client", [
                (1, "checkout save via token"),
                (2, "display metadata without raw card"),
                (3, "second method retains first default"),
            ]),
        ],
    ),
    (
        "payment/manage-saved-payment-methods",
        "Manage Saved Payment Methods",
        [
            ("server", [
                (1, "list with default indicator"),
                (2, "remove default prompts new default"),
                (3, "set default demotes previous"),
            ]),
            ("client", [
                (1, "list with default indicator"),
                (2, "remove default prompts new default"),
                (3, "set default demotes previous"),
            ]),
        ],
    ),
    (
        "checkout/select-saved-address-at-checkout",
        "Select Saved Address at Checkout",
        [
            ("server", [
                (1, "list with default pre-selected"),
                (2, "selection auto-fills and advances"),
                (4, "guest manual only preserved"),
            ]),
            ("client", [
                (1, "list with default pre-selected"),
                (2, "selection auto-fills and advances"),
                (3, "different address with save opt-in"),
                (4, "guest manual only preserved"),
            ]),
        ],
    ),
    (
        "checkout/select-saved-payment-method-at-checkout",
        "Select Saved Payment Method at Checkout",
        [
            ("server", [
                (1, "list with default pre-selected"),
                (2, "token charge with confirmation"),
                (4, "expired token not charged"),
            ]),
            ("client", [
                (1, "list with default pre-selected"),
                (2, "token charge with confirmation"),
                (3, "manual entry with save opt-in"),
                (4, "expired token not charged"),
            ]),
        ],
    ),
    (
        "order-history/view-order-history",
        "View Order History",
        [
            ("server", [
                (1, "list most recent first"),
                (2, "full order detail"),
                (3, "empty state"),
                (4, "guest order retroactive association"),
            ]),
            ("client", [
                (1, "list most recent first"),
                (2, "full order detail"),
                (3, "empty state"),
                (4, "guest order retroactive association"),
            ]),
        ],
    ),
    (
        "wishlist/manage-wishlist",
        "Manage Wishlist",
        [
            ("server", [
                (1, "add toggles control state"),
                (2, "list with stock availability"),
                (3, "add to cart retains wishlist item"),
                (4, "remove resets product control"),
            ]),
            ("client", [
                (1, "add toggles control state"),
                (2, "list with stock availability"),
                (3, "add to cart retains wishlist item"),
                (4, "remove resets product control"),
                (5, "guest dismissible prompt"),
            ]),
        ],
    ),
    (
        "order-history/reorder-previous-purchase",
        "Reorder Previous Purchase",
        [
            ("server", [
                (1, "reorder navigates to cart"),
                (2, "delisted partial success message"),
                (3, "out of stock warning options"),
                (4, "merge sums quantities"),
            ]),
            ("client", [
                (1, "reorder navigates to cart"),
                (2, "delisted partial success message"),
                (3, "out of stock warning options"),
                (4, "merge sums quantities"),
            ]),
        ],
    ),
]


def slug(name: str) -> str:
    return name.lower().replace(" ", "-")


def server_body(story: str, ac: int, suffix: str) -> str:
    title = f"{story} — AC {ac}: {suffix}"
    return f'''/**
 * {story} — server tests (Increment 4)
 */
import {{ describe, it, beforeEach, afterEach, expect }} from 'vitest';
import {{ ReturningCustomersServerHelper }} from '../../helpers/returning-customers.server';
import {{ ReturningCustomersBase }} from '../../helpers/returning-customers.base';

describe('{story}', () => {{
  const helper = new ReturningCustomersServerHelper();

  beforeEach(async () => {{ await helper.seed(); }});
  afterEach(async () => {{ await helper.cleanup(); }});

  it('{title}', async () => {{
    await helper.runServerScenario('{story}', {ac});
  }});
}});
'''


def client_body(story: str, ac: int, suffix: str) -> str:
    title = f"{story} — AC {ac}: {suffix}"
    return f'''/**
 * {story} — client tests (Increment 4)
 */
import {{ describe, it, beforeEach, afterEach }} from 'vitest';
import {{ ReturningCustomersClientHelper }} from '../../helpers/returning-customers.client';
import {{ ReturningCustomersBase }} from '../../helpers/returning-customers.base';

describe('{story}', () => {{
  const helper = new ReturningCustomersClientHelper();

  beforeEach(async () => {{ await helper.seed(); }});
  afterEach(async () => {{ await helper.cleanup(); }});

  it('{title}', async () => {{
    await helper.runClientScenario('{story}', {ac});
  }});
}});
'''


def main() -> None:
    count = 0
    for folder, story, tiers in STORIES:
        base_name = slug(story.split()[-1] if " " in story else story)
        # use full story slug
        file_slug = "-".join(story.lower().split())
        for tier, tests in tiers:
            ext = "server.test.ts" if tier == "server" else "client.test.tsx"
            path = OUT / folder / f"{file_slug}_{ext}"
            path.parent.mkdir(parents=True, exist_ok=True)
            parts = []
            for ac, suffix in tests:
                if tier == "server":
                    parts.append(server_body(story, ac, suffix))
                else:
                    parts.append(client_body(story, ac, suffix))
            # merge into single file with one describe block
            if tier == "server":
                header = f'''/**
 * {story} — server tests (Increment 4)
 */
import {{ describe, it, beforeEach, afterEach }} from 'vitest';
import {{ ReturningCustomersServerHelper }} from '../../helpers/returning-customers.server';

describe('{story}', () => {{
  const helper = new ReturningCustomersServerHelper();

  beforeEach(async () => {{ await helper.seed(); }});
  afterEach(async () => {{ await helper.cleanup(); }});

'''
                body = ""
                for ac, suffix in tests:
                    title = f"{story} — AC {ac}: {suffix}"
                    body += f"  it('{title}', async () => {{\n    await helper.runServerScenario('{story}', {ac});\n  }});\n\n"
                content = header + body + "});\n"
            else:
                header = f'''/**
 * {story} — client tests (Increment 4)
 */
import {{ describe, it, beforeEach, afterEach }} from 'vitest';
import {{ ReturningCustomersClientHelper }} from '../../helpers/returning-customers.client';

describe('{story}', () => {{
  const helper = new ReturningCustomersClientHelper();

  beforeEach(async () => {{ await helper.seed(); }});
  afterEach(async () => {{ await helper.cleanup(); }});

'''
                body = ""
                for ac, suffix in tests:
                    title = f"{story} — AC {ac}: {suffix}"
                    body += f"  it('{title}', async () => {{\n    await helper.runClientScenario('{story}', {ac});\n  }});\n\n"
                content = header + body + "});\n"
            path.write_text(content, encoding="utf-8")
            count += len(tests)
            print(f"Wrote {path} ({len(tests)} tests)")
    print(f"Total tests generated: {count}")


if __name__ == "__main__":
    main()
