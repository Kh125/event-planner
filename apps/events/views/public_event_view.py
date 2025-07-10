from django.db.models import Q
from django.utils import timezone
from utils.view.custom_api_views import CustomAPIView
from apps.events.serializers.event_serializer import PublicEventSerializer, EventSerializer
from apps.events.models import Event, EventStatus
from drf_spectacular.utils import extend_schema
from django.shortcuts import get_object_or_404


@extend_schema(tags=["Public Events"])
class PublicEventListAPIView(CustomAPIView):
     """Public endpoint for discovering events (no authentication required)"""
     authentication_classes = []
     permission_classes = []

     def get(self, request):
          """Get list of published public events with search and filters"""
          
          # Base queryset - only published, public events
          queryset = Event.objects.filter(
               status=EventStatus.PUBLISHED,
               is_public=True
          ).order_by('start_datetime')
          
          # Search functionality
          search = request.query_params.get('search', '').strip()
          
          if search:
               queryset = queryset.filter(
                    Q(name__icontains=search) |
                    Q(description__icontains=search) |
                    Q(venue_name__icontains=search) |
                    Q(venue_address__icontains=search)
               )
          
          # Filter by location/city
          location = request.query_params.get('location', '').strip()
          
          if location:
               queryset = queryset.filter(
                    Q(venue_address__icontains=location) |
                    Q(venue_name__icontains=location)
               )
          
          # Filter by date range
          date_from = request.query_params.get('date_from')
          date_to = request.query_params.get('date_to')
          
          if date_from:
               try:
                    from datetime import datetime
                    date_from = datetime.fromisoformat(date_from.replace('Z', '+00:00'))
                    queryset = queryset.filter(start_datetime__gte=date_from)
               except ValueError:
                    pass
                    
          if date_to:
               try:
                    from datetime import datetime
                    date_to = datetime.fromisoformat(date_to.replace('Z', '+00:00'))
                    queryset = queryset.filter(start_datetime__lte=date_to)
               except ValueError:
                    pass
          
          # Filter by availability
          show_full = request.query_params.get('show_full', 'true').lower()
          
          if show_full == 'false':
               # Only show events with available spots
               # This would need raw SQL or annotations for exact implementation
               pass
          
          # Filter upcoming events only
          upcoming_only = request.query_params.get('upcoming_only', 'true').lower()
          
          if upcoming_only == 'true':
               queryset = queryset.filter(start_datetime__gt=timezone.now())
          
          # Pagination
          page_size = min(int(request.query_params.get('page_size', 20)), 100)
          page = int(request.query_params.get('page', 1))
          start = (page - 1) * page_size
          end = start + page_size
          
          total_count = queryset.count()
          events = queryset[start:end]
          
          serializer = PublicEventSerializer(events, many=True)
          
          return self.success_response(
               message="Public events retrieved successfully",
               data={
                    'events': serializer.data,
                    'pagination': {
                         'total_count': total_count,
                         'page': page,
                         'page_size': page_size,
                         'has_next': end < total_count,
                         'has_previous': page > 1
                    }
               }
          )

@extend_schema(tags=["Public Events"])
class PublicEventDetailAPIView(CustomAPIView):
     """Public endpoint for event details (no authentication required)"""
     authentication_classes = []
     permission_classes = []

     def get(self, request, event_id):
          """Get public event details with sessions and speakers"""
          
          # Get published, public event
          event = get_object_or_404(
               Event,
               id=event_id,
               status=EventStatus.PUBLISHED,
               is_public=True
          )
          
          serializer = EventSerializer(event)
          
          return self.success_response(
               message="Event details retrieved successfully",
               data=serializer.data
          )


@extend_schema(tags=["Public Events"])
class PublicEventScheduleAPIView(CustomAPIView):
     """Public endpoint for event schedule/sessions (no authentication required)"""
     authentication_classes = []
     permission_classes = []

     def get(self, request, event_id):
          """Get public event schedule (sessions grouped by day)"""
          
          # Get published, public event
          event = get_object_or_404(
               Event,
               id=event_id,
               status=EventStatus.PUBLISHED,
               is_public=True
          )
          
          # Get sessions grouped by day
          from apps.events.serializers.event_serializer import SessionDetailsSerializer
          from collections import defaultdict
          
          sessions = event.sessions.select_related('speaker').order_by('start_time')
          serializer = SessionDetailsSerializer(sessions, many=True)
          
          # Group sessions by date
          schedule_by_day = defaultdict(list)
          
          for session_data in serializer.data:
               # Extract date from start_time
               start_time = session_data['start_time']
               date_str = start_time.split('T')[0]  # Get YYYY-MM-DD part
               schedule_by_day[date_str].append(session_data)
          
          return self.success_response(
               message="Event schedule retrieved successfully",
               data={
                    'event': {
                         'id': event.id,
                         'name': event.name,
                         'start_datetime': event.start_datetime,
                         'end_datetime': event.end_datetime,
                         'venue_name': event.venue_name,
                         'venue_address': event.venue_address
                    },
                    'schedule': dict(schedule_by_day)
               }
          )

@extend_schema(tags=["Public Events"])
class EventSearchAPIView(CustomAPIView):
     """Advanced event search endpoint"""
     authentication_classes = []
     permission_classes = []

     def get(self, request):
          """Advanced search for events with multiple filters"""
          
          # Base queryset
          queryset = Event.objects.filter(
               status=EventStatus.PUBLISHED,
               is_public=True,
               start_datetime__gt=timezone.now()  # Only upcoming events
          )
          
          # Text search across multiple fields
          q = request.query_params.get('q', '').strip()
          if q:
               queryset = queryset.filter(
                    Q(name__icontains=q) |
                    Q(description__icontains=q) |
                    Q(venue_name__icontains=q) |
                    Q(speakers__full_name__icontains=q) |
                    Q(sessions__title__icontains=q)
               ).distinct()
          
          # Category/type filtering (could be added as a field later)
          event_type = request.query_params.get('type')
          if event_type:
               # For now, search in description or title
               queryset = queryset.filter(
                    Q(name__icontains=event_type) |
                    Q(description__icontains=event_type)
               )
          
          # Capacity filtering
          min_capacity = request.query_params.get('min_capacity')
          max_capacity = request.query_params.get('max_capacity')
          
          if min_capacity:
               try:
                    queryset = queryset.filter(capacity__gte=int(min_capacity))
               except ValueError:
                    pass
                    
          if max_capacity:
               try:
                    queryset = queryset.filter(capacity__lte=int(max_capacity))
               except ValueError:
                    pass
          
          # Sort options
          sort_by = request.query_params.get('sort_by', 'date')
          if sort_by == 'date':
               queryset = queryset.order_by('start_datetime')
          elif sort_by == 'name':
               queryset = queryset.order_by('name')
          elif sort_by == 'capacity':
               queryset = queryset.order_by('-capacity')
          
          # Limit results
          limit = min(int(request.query_params.get('limit', 50)), 100)
          queryset = queryset[:limit]
          
          serializer = PublicEventSerializer(queryset, many=True)
          
          return self.success_response(
               message="Search results retrieved successfully",
               data={
                    'query': q,
                    'results_count': len(serializer.data),
                    'events': serializer.data
               }
          )
