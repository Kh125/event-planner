from rest_framework.permissions import BasePermission
from rest_framework.permissions import BasePermission
from rest_framework.exceptions import NotFound
from apps.events.models import Event
from apps.users.models import CustomUser
from core.constants import ROLES

class OwnerPermission(BasePermission):
    allowed_roles = [ROLES.ORG_OWNER]

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


class IsOrganizationOwner(BasePermission):
    """
    Permission to check if user is the owner of organization
    """
    
    def has_permission(self, request, view):
        user_role = str(getattr(request.user, 'role', None))

        if user_role in self.allowed_roles:
            return True
        
        return False

    def has_object_permission(self, request, view, obj):
        user: CustomUser = request.user
        
        return user.role and user.role.name == ROLES.ORG_OWNER and obj.created_by == user

class IsEventCreatorOrOrgAdmin(BasePermission):
    """
    Permission to check if user is the event creator or organization admin
    """
    
    def has_permission(self, request, view):
        # Must be authenticated
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Get event_id from URL kwargs
        event_id = view.kwargs.get('event_id')
        
        if not event_id:
            return False
        
        try:
            event = Event.objects.get(id=event_id)
        except Event.DoesNotExist:
            raise NotFound("Event not found")
        
        # Store event in request for later use
        request.event = event
        
        # Check if user is the event creator
        if event.created_by == request.user:
            return True
        
        # Check if user is from same organization and has admin role
        if (request.user.organization == event.created_by.organization and 
            request.user.role and 
            request.user.role.name in [ROLES.ORG_OWNER, ROLES.ORG_ADMIN]):
            return True
        
        return False


class IsEventCreator(BasePermission):
    """
    Permission to check if user is the event creator only
    """
    
    def has_permission(self, request, view):
        # Must be authenticated
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Get event_id from URL kwargs
        event_id = view.kwargs.get('event_id')
        if not event_id:
            return False
        
        try:
            event = Event.objects.get(id=event_id)
        except Event.DoesNotExist:
            raise NotFound("Event not found")
        
        # Store event in request for later use
        request.event = event
        
        # Check if user is the event creator
        return event.created_by == request.user

class CanCreateEvents(BasePermission):
    """
    Permission to check if user can create events
    """
    
    def has_permission(self, request, view):
        # Must be authenticated
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Must be associated with an organization
        if not request.user.organization:
            return False
        
        # Check user role permissions
        if request.user.role and request.user.role.name in [ROLES.ORG_OWNER, ROLES.ORG_ADMIN]:
            return True
        
        return False


class IsOrganizationMember(BasePermission):
    """
    Permission to check if user belongs to the same organization as the event
    """
    
    def has_permission(self, request, view):
        # Must be authenticated
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Get event_id from URL kwargs
        event_id = view.kwargs.get('event_id')
        if not event_id:
            return False
        
        try:
            event = Event.objects.get(id=event_id)
        except Event.DoesNotExist:
            raise NotFound("Event not found")
        
        # Store event in request for later use
        request.event = event
        
        # Check if user belongs to the same organization
        return (request.user.organization and 
                request.user.organization == event.created_by.organization)


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