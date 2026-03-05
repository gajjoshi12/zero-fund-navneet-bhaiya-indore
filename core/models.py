from django.db import models


class Task(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    reward = models.DecimalField(max_digits=10, decimal_places=2)
    deadline = models.DateField()
    requirements = models.JSONField(default=list)
    status = models.CharField(max_length=20, default='active', choices=[
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ])
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Assignment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('submitted', 'Submitted'),
        ('completed', 'Completed'),
        ('rejected', 'Rejected'),
    ]

    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='assignments')
    sr_user_id = models.IntegerField()  # SR Global FX user ID
    sr_user_name = models.CharField(max_length=255, blank=True, default='')
    sr_user_email = models.CharField(max_length=255, blank=True, default='')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    assigned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['task', 'sr_user_id']

    def __str__(self):
        return f"Assignment {self.id}: Task {self.task_id} -> User {self.sr_user_id}"


class Submission(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name='submissions')
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='submissions')
    sr_user_id = models.IntegerField()
    proof_url = models.TextField(blank=True, default='')
    notes = models.TextField(blank=True, default='')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    rejection_reason = models.TextField(blank=True, default='')
    submitted_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Submission {self.id}: Assignment {self.assignment_id}"


class UserProfile(models.Model):
    """Cache of SR Global FX user data for admin dashboard."""
    sr_user_id = models.IntegerField(unique=True)
    name = models.CharField(max_length=255)
    email = models.CharField(max_length=255)
    phone = models.CharField(max_length=50, blank=True, default='')
    country = models.CharField(max_length=100, blank=True, default='')
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_earnings = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    status = models.CharField(max_length=20, default='active')
    role = models.CharField(max_length=20, default='user', choices=[
        ('user', 'User'),
        ('admin', 'Admin'),
    ])
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.email})"


class FundedAccount(models.Model):
    """Stores MT5 funded account details after purchase."""
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('breached', 'Breached'),
        ('completed', 'Completed'),
        ('suspended', 'Suspended'),
    ]

    sr_user_id = models.IntegerField()
    server = models.CharField(max_length=100, default='SRGlobalFX-Live')
    login_id = models.CharField(max_length=100)
    account_type = models.CharField(max_length=20, default='MT5')
    account_size = models.CharField(max_length=50)
    plan_type = models.CharField(max_length=50, default='1-step')
    profit_split = models.CharField(max_length=20, default='85%')
    price_paid = models.CharField(max_length=50, default='0')
    leverage = models.CharField(max_length=20, default='1:100')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    is_live = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"FundedAccount {self.login_id} - User {self.sr_user_id}"


class Notification(models.Model):
    """User notifications for task updates, submissions, etc."""
    TYPE_CHOICES = [
        ('task_assigned', 'Task Assigned'),
        ('submission_approved', 'Submission Approved'),
        ('submission_rejected', 'Submission Rejected'),
        ('account_created', 'Account Created'),
        ('general', 'General'),
    ]

    sr_user_id = models.IntegerField()
    type = models.CharField(max_length=30, choices=TYPE_CHOICES, default='general')
    title = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Notification for User {self.sr_user_id}: {self.title}"
