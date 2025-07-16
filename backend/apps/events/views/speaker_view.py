from rest_framework import status, permissions
from core.middleware.authentication import TokenAuthentication
from core.middleware.permission import IsEventCreatorOrOrgAdmin
from services.speaker.speaker_service import SpeakerService
from utils.view.custom_api_views import CustomAPIView
from apps.events.serializers.event_serializer import SpeakerCreateSerializer
from drf_spectacular.utils import extend_schema


@extend_schema(tags=["Speakers"])
class CreateSpeakerAPIView(CustomAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsEventCreatorOrOrgAdmin]

    def post(self, request, event_id):
        serializer = SpeakerCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Use service to create speaker (event is already available from permission check)
        data = SpeakerService.create_speaker(
            event=request.event,
            validated_data=serializer.validated_data
        )
        
        return self.success_response(
            message="Speaker created successfully",
            data=data,
            status_code=status.HTTP_201_CREATED
        )


@extend_schema(tags=["Speakers"])
class SpeakerListAPIView(CustomAPIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request, event_id):
        # Use service to get speakers
        data = SpeakerService.get_event_speakers(event_id=event_id)
        
        return self.success_response(
            message="Speakers retrieved successfully",
            data=data
        )


@extend_schema(tags=["Speakers"])
class SpeakerDetailAPIView(CustomAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsEventCreatorOrOrgAdmin]

    def get(self, request, event_id, speaker_id):
        serializer = SpeakerCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Use service to update speaker (event is already available from permission check)
        data = SpeakerService.get_event_speaker_details(
            event_id=event_id,
            speaker_id=speaker_id
        )
        
        return self.success_response(
            message="Speaker details fetched successfully",
            data=data
        )
    
    def put(self, request, event_id, speaker_id):
        serializer = SpeakerCreateSerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        
        # Update Speaker Information (full update)
        data = SpeakerService.update_speaker(
            event=request.event,
            speaker_id=speaker_id,
            validated_data=serializer.validated_data
        )
        
        return self.success_response(
            message="Speaker updated successfully",
            data=data
        )


    def delete(self, request, event_id, speaker_id):
        # Use service to delete speaker (event is already available from permission check)
        SpeakerService.delete_speaker(
            event=request.event,
            speaker_id=speaker_id
        )
        
        return self.success_response(
            message="Speaker deleted successfully"
        )
