
class ROLES:
    ORG_OWNER = 'org_owner'
    ORG_ADMIN = 'org_admin'
    MEMBER = 'member'

ROLE_LIST = [
    ROLES.ORG_OWNER,
    ROLES.ORG_ADMIN,
    ROLES.MEMBER
]

DEFAULT_ROLES = [
    {
        "name": ROLES.ORG_OWNER, 
        "label": "Organization Owner"
    },
    {
        "name": ROLES.ORG_ADMIN, 
        "label": "Organization Admin"
    },
    {
        "name": ROLES.MEMBER, 
        "label": "Member"
    },
]