from rest_framework.authentication import BaseAuthentication, get_authorization_header
from rest_framework import exceptions
from django.contrib.auth import get_user_model
from utils.token.jwt import TokenUtil

User = get_user_model()

class TokenAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth = get_authorization_header(request=request).split()
        
        if auth and len(auth) == 2:
            try:
                decoded_token = TokenUtil.decode_access_token(auth[1])

                # Find user from database and return 
                user = User.objects.get(pk=decoded_token['user_id'])

                return (user, None)
            except User.DoesNotExist:
                raise exceptions.PermissionDenied("Unauthenticated")
            except Exception as e:
                raise exceptions.PermissionDenied(f"Unauthenticated")

        raise exceptions.PermissionDenied("Unauthenticated")