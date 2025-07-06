from rest_framework.permissions import BasePermission
from core.constants import ROLES

class OwnerPermission(BasePermission):
    allowed_roles = [ROLES]

    def has_permission(self, request, view):
        user_role = str(getattr(request.user, 'role', None))

        if user_role in self.allowed_roles:
            return True
        
        return False

class AdminPermission(BasePermission):
    allowed_roles = [ROLES.ORG_ADMIN]

    def has_permission(self, request, view):
        user_role = str(getattr(request.user, 'role', None))

        if user_role in self.allowed_roles:
            return True

        return False

class MemberPermission(BasePermission):
    allowed_roles = [ROLES.MEMBER]

    def has_permission(self, request, view):
        user_role = str(getattr(request.user, 'role', None))

        if user_role in self.allowed_roles:
            return True
        
        return False

class OwnerOrAdminPermission(BasePermission):
    allowed_roles = [ROLES.ORG_OWNER, ROLES.ORG_ADMIN]

    def has_permission(self, request, view):
        user_role = str(getattr(request.user, 'role', None))

        if user_role in self.allowed_roles:
            return True
        
        return False

class AllUserPermission(BasePermission):
    allowed_roles = [ROLES.ORG_OWNER, ROLES.ORG_ADMIN, ROLES.MEMBER]

    def has_permission(self, request, view):
        user_role = str(getattr(request.user, 'role', None))

        if user_role in self.allowed_roles:
            return True
        
        return False

# class IsCompanyAdminOrSuperadminForJobPost(BasePermission):
#     """
#     Custom permission to allow Admin/Superadmin to manage JobPosts belonging to their company.
#     For a single JobPost instance or a list related to a company.
#     """
#     def has_permission(self, request, view):
#         user = request.user
#         if not (user.is_authenticated and user.role and user.role.name in [ROLES.ADMIN, ROLES.SUPERADMIN]):
#             return False

#         return True

#     def has_object_permission(self, request, view, obj):
#         user = request.user
#         return user.is_authenticated and user.role and user.role.name in [ROLES.ADMIN, ROLES.SUPERADMIN] and user.company == obj.posted_by.company