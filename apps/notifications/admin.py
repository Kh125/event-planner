from django.contrib import admin
from apps.notifications.models import Notification, NotificationTemplate


@admin.register(NotificationTemplate)
class NotificationTemplateAdmin(admin.ModelAdmin):
    list_display = ['type', 'channel', 'is_active', 'created_at']
    list_filter = ['type', 'channel', 'is_active']
    search_fields = ['type', 'subject_template']
    

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
     list_display = ['type', 'recipient_email', 'status', 'sent_at', 'created_at']
     list_filter = ['type', 'channel', 'status', 'created_at']
     search_fields = ['recipient_email', 'subject']
     readonly_fields = ['created_at', 'updated_at', 'sent_at', 'delivered_at']
     
     fieldsets = (
          ('Basic Info', {
               'fields': ('type', 'channel', 'status')
          }),
          ('Recipient', {
               'fields': ('recipient_email', 'recipient_user')
          }),
          ('Content', {
               'fields': ('subject', 'message')
          }),
          ('Related Objects', {
               'fields': ('event', 'organization', 'invitation'),
               'classes': ('collapse',)
          }),
          ('Status & Timing', {
               'fields': ('sent_at', 'delivered_at', 'error_message')
          }),
          ('Metadata', {
               'fields': ('metadata',),
               'classes': ('collapse',)
          }),
          ('Timestamps', {
               'fields': ('created_at', 'updated_at'),
               'classes': ('collapse',)
          })
     )
