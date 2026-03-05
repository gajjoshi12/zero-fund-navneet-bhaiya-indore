from django.urls import path
from . import views

urlpatterns = [
    # Auth proxy
    path('auth/register/', views.auth_register),
    path('auth/login/', views.auth_login),
    path('auth/me/', views.auth_me),

    # MT5 proxy
    path('groups/', views.group_list),
    path('mt5/create/', views.create_mt5_account),

    # Tasks
    path('tasks/', views.task_list),
    path('tasks/<int:pk>/', views.task_detail),
    path('tasks/<int:pk>/claim/', views.task_claim),

    # Assignments
    path('assignments/', views.assignment_list),
    path('assignments/assign/', views.admin_assign_task),

    # Submissions
    path('submissions/', views.submission_list),
    path('submissions/<int:pk>/approve/', views.submission_approve),
    path('submissions/<int:pk>/reject/', views.submission_reject),

    # Funded Accounts
    path('funded-accounts/', views.funded_accounts_list),

    # Notifications
    path('notifications/', views.notifications_list),
    path('notifications/<int:pk>/read/', views.notifications_read),
    path('notifications/read-all/', views.notifications_read_all),

    # Profile
    path('profile/update/', views.profile_update),

    # Stats
    path('stats/admin/', views.admin_stats),
    path('stats/user/', views.user_stats),

    # Admin user management
    path('admin/users/', views.admin_users),
    path('admin/users/<int:sr_user_id>/status/', views.admin_toggle_user_status),
]

