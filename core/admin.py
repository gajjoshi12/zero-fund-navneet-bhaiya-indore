from django.contrib import admin
from .models import Task, Assignment, Submission, UserProfile, FundedAccount, Notification


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'reward', 'status', 'deadline', 'created_at']
    list_filter = ['status']


@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ['id', 'task', 'sr_user_id', 'sr_user_name', 'status', 'assigned_at']
    list_filter = ['status']


@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ['id', 'task', 'sr_user_id', 'status', 'submitted_at']
    list_filter = ['status']


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['sr_user_id', 'name', 'email', 'role', 'balance', 'total_earnings', 'status']
    list_filter = ['role', 'status']


@admin.register(FundedAccount)
class FundedAccountAdmin(admin.ModelAdmin):
    list_display = ['login_id', 'sr_user_id', 'account_size', 'profit_split', 'status', 'is_live', 'created_at']
    list_filter = ['status', 'is_live', 'account_type']


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['sr_user_id', 'type', 'title', 'is_read', 'created_at']
    list_filter = ['type', 'is_read']

