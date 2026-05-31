import sys

f = open(r'C:\dev\abd-pet-store-demo\docs\end-to-end\specification\architecture-reference.md', 'r', encoding='utf-8-sig')
content = f.read()
f.close()

em = chr(0xe2) + chr(0x20ac) + chr(0x201d)
en = chr(0xe2) + chr(0x20ac) + chr(0x201c)

# Add security notes after the staff appointment/pet routes line
staff_security_marker = 'Staff appointment and pet-management routes'
idx = content.find(staff_security_marker)
if idx == -1:
    print('ERROR: security marker not found')
    sys.exit(1)

eol = content.find('\n', idx)

inc7_security = """
- **Return initiation account-gated** " `POST /api/account/orders/:orderNumber/returns` requires `SessionMiddleware.requireVerifiedCustomer`; only the order owner (or guest via in-store path) can initiate a return.
- **Staff return routes** " `GET /api/staff/orders/lookup` and `POST /api/staff/returns` are currently unauthenticated (same spike deferral as order queue and appointment staff routes); role-based staff-identity gate deferred.
- **Staff order lookup enumeration-safe** " `GET /api/staff/orders/lookup` returns generic 404 on email mismatch (same pattern as guest order status lookup); no information leak about whether an order exists.
- **Refund status account-scoped** " `GET /api/account/orders/:orderNumber/refund-status` returns refund data only for the authenticated customer's own orders.
- **Return label download scoped** " `GET /api/account/orders/:orderNumber/returns/:returnId/label` requires session and ownership validation; label PDFs are not publicly accessible."""

# Replace em dash placeholder with actual
inc7_security = inc7_security.replace(' " ', ' ' + em + ' ')

content = content[:eol] + '\n' + inc7_security + content[eol:]
print('Security section updated')

f = open(r'C:\dev\abd-pet-store-demo\docs\end-to-end\specification\architecture-reference.md', 'w', encoding='utf-8-sig')
f.write(content)
f.close()
print('File saved.')
