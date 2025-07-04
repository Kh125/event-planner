from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..serializers.register_serializer import RegisterOrganizationOwnerSerializer

class RegisterOrganizationOwnerView(APIView):
     def post(self, request):
          serializer = RegisterOrganizationOwnerSerializer(data=request.data)
          
          if serializer.is_valid():
               user = serializer.save()
          
               return Response({
                    "message": "Registration successful",
                    "email": user.email,
                    "role": user.role,
               }, status=status.HTTP_201_CREATED)
          
          return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
