from apps.users.models import Role
from core.constants import DEFAULT_ROLES

class RoleService:
     @staticmethod
     def ensure_default_roles():
          for role in DEFAULT_ROLES:
               Role.objects.get_or_create(name=role["name"], defaults={"label": role["label"]})