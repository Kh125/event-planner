from rest_framework import status
from core.middleware.authentication import TokenAuthentication
from core.middleware.permission import IsEventCreatorOrOrgAdmin
from services.session.session_service import SessionService
from utils.view.custom_api_views import CustomAPIView
from apps.events.serializers.event_serializer import SessionCreateSerializer
from drf_spectacular.utils import extend_schema


@extend_schema(tags=["Sessions"])
class CreateSessionAPIView(CustomAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsEventCreatorOrOrgAdmin]

    def post(self, request, event_id):
        serializer = SessionCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Use service to create session (event is already available from permission check)
        data = SessionService.create_session(
            event=request.event,
            validated_data=serializer.validated_data
        )
        
        return self.success_response(
            message="Session created successfully",
            data=data,
            status_code=status.HTTP_201_CREATED
        )


@extend_schema(tags=["Sessions"])
class SessionListAPIView(CustomAPIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request, event_id):
        # Use service to get sessions
        data = SessionService.get_event_sessions(event_id=event_id)
        
        return self.success_response(
            message="Sessions retrieved successfully",
            data=data
        )


@extend_schema(tags=["Sessions"])
class SessionDetailAPIView(CustomAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsEventCreatorOrOrgAdmin]

    def get(self, request, event_id, session_id):        
        # Use service to update session (event is already available from permission check)
        data = SessionService.get_event_session_by_id(
            event_id=event_id,
            session_id=session_id,
        )
        
        return self.success_response(
            message="Session details retrieved successfully",
            data=data
        )

    def put(self, request, event_id, session_id):
        serializer = SessionCreateSerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        
        # Use service to update session (event is already available from permission check)
        data = SessionService.update_session(
            event=request.event,
            session_id=session_id,
            validated_data=serializer.validated_data
        )
        
        return self.success_response(
            message="Session updated successfully",
            data=data
        )

    def delete(self, request, event_id, session_id):
        # Use service to delete session (event is already available from permission check)
        SessionService.delete_session(
            event=request.event,
            session_id=session_id
        )
        
        return self.success_response(
            message="Session deleted successfully"
        )
