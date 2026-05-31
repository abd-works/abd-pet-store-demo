import sys

f = open(r'C:\dev\abd-pet-store-demo\docs\end-to-end\specification\architecture-reference.md', 'r', encoding='utf-8-sig')
content = f.read()
f.close()

em = chr(0xe2) + chr(0x20ac) + chr(0x201d)
en = chr(0xe2) + chr(0x20ac) + chr(0x201c)

# Add E2E paths after the last Increment 6 E2E line
e2e_end_marker = 'Mechanism-specific examples are embedded in each mechanism section above.'
idx = content.find(e2e_end_marker)
if idx == -1:
    print('ERROR: E2E end marker not found')
    sys.exit(1)

arrow = ' ' + em + ' '
lines = [
    f'- *Order history*{arrow}select eligible order{arrow}"Return" button{arrow}select items, reason, condition{arrow}submit *return request*',
    f'- *Return request* submitted{arrow}*return label* PDF + *return QR code* generated{arrow}shown on confirmation page + emailed',
    f'- Order outside *return window*{arrow}"Return" action hidden/disabled with reason',
    f'- Items already returned{arrow}shown as "return in progress"; remaining items still returnable',
    f'- *Return* received + inspected{arrow}*refund* routes through *original payment vendor*{arrow}*refund status* shows "processing"',
    f'- *Refund* completed by vendor{arrow}*refund status* shows "completed"{arrow}"refund completed" notification sent',
    f'- *Refund* vendor transient error{arrow}*refund retry* scheduled{arrow}customer sees "processing"{arrow}retry exhaustion escalates to "requires review"',
    f'- Staff dashboard{arrow}order lookup by number/email{arrow}"Start Return"{arrow}submit *in-store return*{arrow}*refund* triggered',
    f'- *In-store return* on ineligible item{arrow}ineligibility reason shown{arrow}*manager override* with approval{arrow}return proceeds',
    f'- Guest order *in-store return*{arrow}order number + guest email lookup; refund routing works; no account visibility',
    f'- "Return received" notification{arrow}email sent on warehouse receipt; email failure queued without blocking return status',
    f'- "Refund under review" notification{arrow}email with support contact guidance on retry exhaustion',
]

inc7_e2e = '\nIncrement 7 E2E paths (from [`acceptance-criteria.md`](../end-to-end/exploration/acceptance-criteria.md)):\n\n'
inc7_e2e += '\n'.join(lines) + '\n\n'

content = content[:idx] + inc7_e2e + content[idx:]
print('E2E paths added')

f = open(r'C:\dev\abd-pet-store-demo\docs\end-to-end\specification\architecture-reference.md', 'w', encoding='utf-8-sig')
f.write(content)
f.close()
print('File saved.')
