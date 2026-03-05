import requests
from django.conf import settings
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Task, Assignment, Submission, UserProfile, FundedAccount, Notification
from .serializers import TaskSerializer, AssignmentSerializer, SubmissionSerializer, UserProfileSerializer, FundedAccountSerializer, NotificationSerializer

SR_API = settings.SR_GLOBAL_API_BASE


# ─── Helper: extract SR user from token ───────────────────────────────────────

def get_sr_user(request):
    """Validate the Bearer token by checking our local UserProfile cache."""
    auth = request.headers.get('Authorization', '')
    if not auth.startswith('Bearer '):
        return None, None
    token = auth.split(' ', 1)[1]
    # Find user profile by checking if this token was stored during login
    sr_user_id = request.headers.get('X-SR-User-Id')
    if sr_user_id:
        try:
            profile = UserProfile.objects.get(sr_user_id=int(sr_user_id))
            return profile, token
        except UserProfile.DoesNotExist:
            return None, token
    return None, token


# ─── Auth Proxy ────────────────────────────────────────────────────────────────

@api_view(['POST'])
def auth_register(request):
    """Proxy registration to SR Global FX API."""
    payload = {
        'name': request.data.get('name', ''),
        'email': request.data.get('email', ''),
        'password': request.data.get('password', ''),
        'phone': request.data.get('phone', ''),
        'country': request.data.get('country', 'India'),
    }

    try:
        resp = requests.post(f'{SR_API}/register', data=payload, timeout=15)
        try:
            data = resp.json()
        except requests.exceptions.JSONDecodeError:
            return Response({'status': 502, 'msg': f'SR API returned invalid response (HTTP {resp.status_code}). Content snippet: {resp.text[:50]}...'}, status=502)
    except Exception as e:
        return Response({'status': 500, 'msg': f'SR API connection error: {str(e)}'}, status=500)

    if data.get('status') == 200:
        # Auto-login after registration
        try:
            login_resp = requests.post(f'{SR_API}/login', data={
                'email': payload['email'],
                'password': payload['password'],
            }, timeout=15)
            try:
                login_data = login_resp.json()
            except requests.exceptions.JSONDecodeError:
                login_data = {}

            if login_data.get('status') == 200:
                user_data = login_data['data']

                # Create or update local user profile cache
                profile, _ = UserProfile.objects.update_or_create(
                    sr_user_id=user_data['id'],
                    defaults={
                        'name': user_data.get('name', ''),
                        'email': user_data.get('email', ''),
                        'phone': user_data.get('phone', ''),
                        'country': user_data.get('country', ''),
                        'role': 'user',
                    }
                )

                return Response({
                    'status': 200,
                    'msg': 'Registration successful',
                    'data': {
                        'token': user_data['token'],
                        'user': {
                            'id': user_data['id'],
                            'name': user_data.get('name', ''),
                            'email': user_data.get('email', ''),
                            'phone': user_data.get('phone', ''),
                            'country': user_data.get('country', ''),
                            'role': profile.role,
                        }
                    }
                })
        except Exception:
            pass

        return Response(data)
    else:
        return Response(data, status=400)


@api_view(['POST'])
def auth_login(request):
    """Proxy login to SR Global FX API."""
    payload = {
        'email': request.data.get('email', ''),
        'password': request.data.get('password', ''),
    }

    try:
        resp = requests.post(f'{SR_API}/login', data=payload, timeout=15)
        try:
            data = resp.json()
        except requests.exceptions.JSONDecodeError:
            return Response({'status': 502, 'msg': f'SR API returned invalid response (HTTP {resp.status_code}). Content snippet: {resp.text[:50]}...'}, status=502)
    except Exception as e:
        return Response({'status': 500, 'msg': f'SR API connection error: {str(e)}'}, status=500)

    if data.get('status') == 200:
        user_data = data['data']

        # Create or update local user profile cache
        profile, _ = UserProfile.objects.update_or_create(
            sr_user_id=user_data['id'],
            defaults={
                'name': user_data.get('name', ''),
                'email': user_data.get('email', ''),
                'phone': user_data.get('phone', ''),
                'country': user_data.get('country', ''),
            }
        )

        return Response({
            'status': 200,
            'msg': 'Login successful',
            'data': {
                'token': user_data['token'],
                'user': {
                    'id': user_data['id'],
                    'name': user_data.get('name', ''),
                    'email': user_data.get('email', ''),
                    'phone': user_data.get('phone', ''),
                    'country': user_data.get('country', ''),
                    'role': profile.role,
                    'balance': float(profile.balance),
                    'totalEarnings': float(profile.total_earnings),
                    'status': profile.status,
                }
            }
        })
    else:
        return Response({
            'status': 401,
            'msg': data.get('msg', 'Invalid credentials'),
        }, status=401)


@api_view(['GET'])
def auth_me(request):
    """Get current user profile from local cache."""
    profile, token = get_sr_user(request)
    if not profile:
        return Response({'status': 401, 'msg': 'Unauthorized'}, status=401)

    return Response({
        'status': 200,
        'data': {
            'id': profile.sr_user_id,
            'name': profile.name,
            'email': profile.email,
            'phone': profile.phone,
            'country': profile.country,
            'role': profile.role,
            'balance': float(profile.balance),
            'totalEarnings': float(profile.total_earnings),
            'status': profile.status,
        }
    })


# ─── MT5 Proxy ─────────────────────────────────────────────────────────────────

@api_view(['GET'])
def group_list(request):
    """Proxy group list from SR Global FX."""
    _, token = get_sr_user(request)
    if not token:
        return Response({'status': 401, 'msg': 'Unauthorized'}, status=401)

    try:
        resp = requests.get(f'{SR_API}/grouplist', headers={
            'Authorization': f'Bearer {token}'
        }, timeout=15)
        try:
            return Response(resp.json())
        except requests.exceptions.JSONDecodeError:
            return Response({'status': 502, 'msg': f'SR API invalid response (HTTP {resp.status_code})'}, status=502)
    except Exception as e:
        return Response({'status': 500, 'msg': str(e)}, status=500)


@api_view(['POST'])
def create_mt5_account(request):
    """Proxy MT5 account creation to SR Global FX."""
    profile, token = get_sr_user(request)
    if not token:
        return Response({'status': 401, 'msg': 'Unauthorized'}, status=401)

    payload = {
        'group': request.data.get('group', 'SR\\STANDARD'),
        'leverage': request.data.get('leverage', '100'),
        'main_password': request.data.get('main_password', ''),
        'investor_password': request.data.get('investor_password', ''),
    }

    def try_create(auth_token):
        """Attempt MT5 account creation with given token."""
        resp = requests.post(f'{SR_API}/openliveaccount', data=payload, headers={
            'Authorization': f'Bearer {auth_token}'
        }, timeout=15)
        return resp

    try:
        # First attempt with existing token
        resp = try_create(token)

        # Check if response is HTML (token expired / session invalid)
        content_type = resp.headers.get('Content-Type', '')
        if 'text/html' in content_type:
            # Token expired — re-login to get a fresh token
            if profile:
                # We don't have the user's password stored, so we can't re-auth
                return Response({
                    'status': 401,
                    'msg': 'Session expired. Please logout and login again, then retry.'
                }, status=401)

        data = resp.json()

        # If SR API says unauthorized, inform the user
        if data.get('status') == 401:
            return Response({
                'status': 401,
                'msg': data.get('msg', 'Session expired. Please logout and login again.')
            }, status=401)

        return Response(data)
    except requests.exceptions.JSONDecodeError:
        return Response({
            'status': 502,
            'msg': 'SR Global FX returned an invalid response. Please try again later.'
        }, status=502)
    except Exception as e:
        return Response({'status': 500, 'msg': str(e)}, status=500)


# ─── Tasks ─────────────────────────────────────────────────────────────────────

@api_view(['GET', 'POST'])
def task_list(request):
    if request.method == 'GET':
        tasks = Task.objects.filter(status='active').order_by('-created_at')
        serializer = TaskSerializer(tasks, many=True)
        return Response({'status': 200, 'data': serializer.data})

    elif request.method == 'POST':
        # Admin only
        profile, _ = get_sr_user(request)
        if not profile or profile.role != 'admin':
            return Response({'status': 403, 'msg': 'Admin access required'}, status=403)

        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'status': 200, 'data': serializer.data}, status=201)
        return Response({'status': 400, 'msg': serializer.errors}, status=400)


@api_view(['GET', 'DELETE'])
def task_detail(request, pk):
    try:
        task = Task.objects.get(pk=pk)
    except Task.DoesNotExist:
        return Response({'status': 404, 'msg': 'Task not found'}, status=404)

    if request.method == 'GET':
        serializer = TaskSerializer(task)
        return Response({'status': 200, 'data': serializer.data})

    elif request.method == 'DELETE':
        profile, _ = get_sr_user(request)
        if not profile or profile.role != 'admin':
            return Response({'status': 403, 'msg': 'Admin access required'}, status=403)
        task.delete()
        return Response({'status': 200, 'msg': 'Task deleted'})


@api_view(['POST'])
def task_claim(request, pk):
    """User claims a task — creates an assignment."""
    profile, _ = get_sr_user(request)
    if not profile:
        return Response({'status': 401, 'msg': 'Unauthorized'}, status=401)

    try:
        task = Task.objects.get(pk=pk)
    except Task.DoesNotExist:
        return Response({'status': 404, 'msg': 'Task not found'}, status=404)

    assignment, created = Assignment.objects.get_or_create(
        task=task,
        sr_user_id=profile.sr_user_id,
        defaults={
            'sr_user_name': profile.name,
            'sr_user_email': profile.email,
            'status': 'pending',
        }
    )

    if created:
        Notification.objects.create(
            sr_user_id=profile.sr_user_id,
            type='task_assigned',
            title='Task Claimed',
            message=f'You have claimed the task: {task.title}. Complete it to earn ${task.reward}!',
        )

    serializer = AssignmentSerializer(assignment)
    return Response({
        'status': 200,
        'msg': 'Task claimed' if created else 'Already claimed',
        'data': serializer.data,
    })


# ─── Assignments ───────────────────────────────────────────────────────────────

@api_view(['GET'])
def assignment_list(request):
    profile, _ = get_sr_user(request)
    if not profile:
        return Response({'status': 401, 'msg': 'Unauthorized'}, status=401)

    if profile.role == 'admin':
        assignments = Assignment.objects.all().order_by('-assigned_at')
    else:
        assignments = Assignment.objects.filter(sr_user_id=profile.sr_user_id).order_by('-assigned_at')

    serializer = AssignmentSerializer(assignments, many=True)
    return Response({'status': 200, 'data': serializer.data})


@api_view(['POST'])
def admin_assign_task(request):
    """Admin assigns a task to a specific user."""
    profile, _ = get_sr_user(request)
    if not profile or profile.role != 'admin':
        return Response({'status': 403, 'msg': 'Admin access required'}, status=403)

    task_id = request.data.get('task_id')
    sr_user_id = request.data.get('sr_user_id')

    try:
        task = Task.objects.get(pk=task_id)
    except Task.DoesNotExist:
        return Response({'status': 404, 'msg': 'Task not found'}, status=404)

    try:
        target = UserProfile.objects.get(sr_user_id=sr_user_id)
    except UserProfile.DoesNotExist:
        return Response({'status': 404, 'msg': 'User not found'}, status=404)

    assignment, created = Assignment.objects.get_or_create(
        task=task,
        sr_user_id=target.sr_user_id,
        defaults={
            'sr_user_name': target.name,
            'sr_user_email': target.email,
            'status': 'pending',
        }
    )

    if created:
        Notification.objects.create(
            sr_user_id=target.sr_user_id,
            type='task_assigned',
            title='New Task Assigned',
            message=f'You have been assigned the task: {task.title}. Reward: ${task.reward}',
        )

    serializer = AssignmentSerializer(assignment)
    return Response({'status': 200, 'data': serializer.data})


# ─── Submissions ───────────────────────────────────────────────────────────────

@api_view(['GET', 'POST'])
def submission_list(request):
    profile, _ = get_sr_user(request)
    if not profile:
        return Response({'status': 401, 'msg': 'Unauthorized'}, status=401)

    if request.method == 'GET':
        if profile.role == 'admin':
            subs = Submission.objects.all().order_by('-submitted_at')
        else:
            subs = Submission.objects.filter(sr_user_id=profile.sr_user_id).order_by('-submitted_at')
        serializer = SubmissionSerializer(subs, many=True)
        return Response({'status': 200, 'data': serializer.data})

    elif request.method == 'POST':
        assignment_id = request.data.get('assignment_id')
        try:
            assignment = Assignment.objects.get(pk=assignment_id, sr_user_id=profile.sr_user_id)
        except Assignment.DoesNotExist:
            return Response({'status': 404, 'msg': 'Assignment not found'}, status=404)

        # Update assignment status
        if assignment.status in ('pending', 'rejected'):
            assignment.status = 'in_progress'
        assignment.status = 'submitted'
        assignment.save()

        submission = Submission.objects.create(
            assignment=assignment,
            task=assignment.task,
            sr_user_id=profile.sr_user_id,
            proof_url=request.data.get('proof_url', ''),
            notes=request.data.get('notes', ''),
            status='pending',
        )

        serializer = SubmissionSerializer(submission)
        return Response({'status': 200, 'data': serializer.data}, status=201)


@api_view(['POST'])
def submission_approve(request, pk):
    profile, _ = get_sr_user(request)
    if not profile or profile.role != 'admin':
        return Response({'status': 403, 'msg': 'Admin access required'}, status=403)

    try:
        submission = Submission.objects.get(pk=pk)
    except Submission.DoesNotExist:
        return Response({'status': 404, 'msg': 'Submission not found'}, status=404)

    submission.status = 'approved'
    submission.reviewed_at = timezone.now()
    submission.save()

    # Update assignment
    submission.assignment.status = 'completed'
    submission.assignment.save()

    # Add reward to user profile
    try:
        user_profile = UserProfile.objects.get(sr_user_id=submission.sr_user_id)
        reward = submission.task.reward
        user_profile.balance += reward
        user_profile.total_earnings += reward
        user_profile.save()
    except UserProfile.DoesNotExist:
        pass

    # Notify user
    Notification.objects.create(
        sr_user_id=submission.sr_user_id,
        type='submission_approved',
        title='Submission Approved! 🎉',
        message=f'Your submission for "{submission.task.title}" has been approved. ${submission.task.reward} has been added to your balance.',
    )

    return Response({'status': 200, 'msg': 'Submission approved'})


@api_view(['POST'])
def submission_reject(request, pk):
    profile, _ = get_sr_user(request)
    if not profile or profile.role != 'admin':
        return Response({'status': 403, 'msg': 'Admin access required'}, status=403)

    try:
        submission = Submission.objects.get(pk=pk)
    except Submission.DoesNotExist:
        return Response({'status': 404, 'msg': 'Submission not found'}, status=404)

    submission.status = 'rejected'
    submission.rejection_reason = request.data.get('reason', '')
    submission.reviewed_at = timezone.now()
    submission.save()

    submission.assignment.status = 'rejected'
    submission.assignment.save()

    # Notify user
    reason = request.data.get('reason', 'No reason provided')
    Notification.objects.create(
        sr_user_id=submission.sr_user_id,
        type='submission_rejected',
        title='Submission Rejected',
        message=f'Your submission for "{submission.task.title}" was rejected. Reason: {reason}',
    )

    return Response({'status': 200, 'msg': 'Submission rejected'})


# ─── Admin Stats ───────────────────────────────────────────────────────────────

@api_view(['GET'])
def admin_stats(request):
    profile, _ = get_sr_user(request)
    if not profile or profile.role != 'admin':
        return Response({'status': 403, 'msg': 'Admin access required'}, status=403)

    users = UserProfile.objects.filter(role='user')
    tasks = Task.objects.all()
    submissions = Submission.objects.all()
    assignments = Assignment.objects.all()

    return Response({
        'status': 200,
        'data': {
            'totalUsers': users.count(),
            'activeTasks': tasks.filter(status='active').count(),
            'pendingSubmissions': submissions.filter(status='pending').count(),
            'completedTasks': assignments.filter(status='completed').count(),
            'totalPaidOut': float(sum(u.total_earnings for u in users)),
        }
    })


@api_view(['GET'])
def admin_users(request):
    profile, _ = get_sr_user(request)
    if not profile or profile.role != 'admin':
        return Response({'status': 403, 'msg': 'Admin access required'}, status=403)

    users = UserProfile.objects.filter(role='user').order_by('-created_at')
    serializer = UserProfileSerializer(users, many=True)
    return Response({'status': 200, 'data': serializer.data})


@api_view(['PATCH'])
def admin_toggle_user_status(request, sr_user_id):
    profile, _ = get_sr_user(request)
    if not profile or profile.role != 'admin':
        return Response({'status': 403, 'msg': 'Admin access required'}, status=403)

    try:
        target = UserProfile.objects.get(sr_user_id=sr_user_id)
    except UserProfile.DoesNotExist:
        return Response({'status': 404, 'msg': 'User not found'}, status=404)

    target.status = 'inactive' if target.status == 'active' else 'active'
    target.save()

    return Response({'status': 200, 'msg': f'User status changed to {target.status}'})


# ─── User Stats ────────────────────────────────────────────────────────────────

@api_view(['GET'])
def user_stats(request):
    profile, _ = get_sr_user(request)
    if not profile:
        return Response({'status': 401, 'msg': 'Unauthorized'}, status=401)

    assignments = Assignment.objects.filter(sr_user_id=profile.sr_user_id)
    submissions = Submission.objects.filter(sr_user_id=profile.sr_user_id)

    return Response({
        'status': 200,
        'data': {
            'assignedTasks': assignments.count(),
            'completedTasks': assignments.filter(status='completed').count(),
            'pendingTasks': assignments.filter(status__in=['pending', 'in_progress']).count(),
            'submittedTasks': submissions.count(),
            'balance': float(profile.balance),
            'totalEarnings': float(profile.total_earnings),
        }
    })


# ─── Funded Accounts ───────────────────────────────────────────────────────────

@api_view(['GET', 'POST'])
def funded_accounts_list(request):
    profile, _ = get_sr_user(request)
    if not profile:
        return Response({'status': 401, 'msg': 'Unauthorized'}, status=401)

    if request.method == 'GET':
        if profile.role == 'admin':
            accounts = FundedAccount.objects.all().order_by('-created_at')
        else:
            accounts = FundedAccount.objects.filter(sr_user_id=profile.sr_user_id).order_by('-created_at')
        serializer = FundedAccountSerializer(accounts, many=True)
        return Response({'status': 200, 'data': serializer.data})

    elif request.method == 'POST':
        account = FundedAccount.objects.create(
            sr_user_id=profile.sr_user_id,
            server=request.data.get('server', 'SRGlobalFX-Live'),
            login_id=request.data.get('login_id', ''),
            account_type=request.data.get('account_type', 'MT5'),
            account_size=request.data.get('account_size', ''),
            plan_type=request.data.get('plan_type', '1-step'),
            profit_split=request.data.get('profit_split', '85%'),
            price_paid=request.data.get('price_paid', '0'),
            leverage=request.data.get('leverage', '1:100'),
            is_live=request.data.get('is_live', False),
        )

        # Notify user
        Notification.objects.create(
            sr_user_id=profile.sr_user_id,
            type='account_created',
            title='Funded Account Created! 🚀',
            message=f'Your {account.account_size} funded account is ready. Login ID: {account.login_id}',
        )

        serializer = FundedAccountSerializer(account)
        return Response({'status': 200, 'data': serializer.data}, status=201)


# ─── Notifications ─────────────────────────────────────────────────────────────

@api_view(['GET'])
def notifications_list(request):
    profile, _ = get_sr_user(request)
    if not profile:
        return Response({'status': 401, 'msg': 'Unauthorized'}, status=401)

    notifications = Notification.objects.filter(sr_user_id=profile.sr_user_id).order_by('-created_at')[:50]
    serializer = NotificationSerializer(notifications, many=True)
    unread_count = Notification.objects.filter(sr_user_id=profile.sr_user_id, is_read=False).count()

    return Response({
        'status': 200,
        'data': serializer.data,
        'unread_count': unread_count,
    })


@api_view(['POST'])
def notifications_read(request, pk):
    profile, _ = get_sr_user(request)
    if not profile:
        return Response({'status': 401, 'msg': 'Unauthorized'}, status=401)

    try:
        notification = Notification.objects.get(pk=pk, sr_user_id=profile.sr_user_id)
    except Notification.DoesNotExist:
        return Response({'status': 404, 'msg': 'Notification not found'}, status=404)

    notification.is_read = True
    notification.save()
    return Response({'status': 200, 'msg': 'Marked as read'})


@api_view(['POST'])
def notifications_read_all(request):
    profile, _ = get_sr_user(request)
    if not profile:
        return Response({'status': 401, 'msg': 'Unauthorized'}, status=401)

    Notification.objects.filter(sr_user_id=profile.sr_user_id, is_read=False).update(is_read=True)
    return Response({'status': 200, 'msg': 'All notifications marked as read'})


# ─── Profile ───────────────────────────────────────────────────────────────────

@api_view(['PATCH'])
def profile_update(request):
    profile, _ = get_sr_user(request)
    if not profile:
        return Response({'status': 401, 'msg': 'Unauthorized'}, status=401)

    if 'name' in request.data:
        profile.name = request.data['name']
    if 'phone' in request.data:
        profile.phone = request.data['phone']
    if 'country' in request.data:
        profile.country = request.data['country']
    profile.save()

    return Response({
        'status': 200,
        'msg': 'Profile updated',
        'data': {
            'id': profile.sr_user_id,
            'name': profile.name,
            'email': profile.email,
            'phone': profile.phone,
            'country': profile.country,
            'role': profile.role,
            'balance': float(profile.balance),
            'totalEarnings': float(profile.total_earnings),
            'status': profile.status,
        }
    })
