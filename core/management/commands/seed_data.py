from django.core.management.base import BaseCommand
from core.models import Task, UserProfile
from datetime import date, timedelta


class Command(BaseCommand):
    help = 'Seed initial task data and admin profile'

    def handle(self, *args, **options):
        # Create admin profile (will be linked when admin logs in via SR Global FX)
        admin, created = UserProfile.objects.get_or_create(
            sr_user_id=636,  # The test account from SR Global FX
            defaults={
                'name': 'Admin',
                'email': 'devapitest2@demo.com',
                'phone': '98765432102',
                'country': 'India',
                'role': 'admin',
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f'Created admin profile: {admin.email}'))
        else:
            # Ensure role is admin
            admin.role = 'admin'
            admin.save()
            self.stdout.write(self.style.WARNING(f'Admin profile already exists: {admin.email}'))

        # Create demo tasks
        tasks_data = [
            {
                'title': 'Complete Trading Challenge - Phase 1',
                'description': 'Achieve 8% profit target within the drawdown limits. Trade any instrument of your choice.',
                'reward': 500,
                'deadline': date.today() + timedelta(days=30),
                'requirements': [
                    'Minimum 5 trading days',
                    'Maximum 5% daily drawdown',
                    'Maximum 10% total drawdown',
                    '8% profit target'
                ],
            },
            {
                'title': 'Social Media Promotion',
                'description': 'Share your trading journey on social media and tag @TradeFundPro. Submit screenshot as proof.',
                'reward': 50,
                'deadline': date.today() + timedelta(days=14),
                'requirements': [
                    'Post on Instagram or Twitter',
                    'Tag @TradeFundPro',
                    'Include your trading stats',
                    'Minimum 100 followers'
                ],
            },
            {
                'title': 'Refer a Friend',
                'description': 'Refer a friend to join TradeFund Pro and earn bonus when they complete their first challenge.',
                'reward': 100,
                'deadline': date.today() + timedelta(days=45),
                'requirements': [
                    'Friend must signup using your referral link',
                    'Friend must complete a challenge',
                    'Provide friend email and signup proof'
                ],
            },
            {
                'title': 'Video Testimonial',
                'description': 'Record a 1-2 minute video testimonial about your experience with TradeFund Pro.',
                'reward': 150,
                'deadline': date.today() + timedelta(days=30),
                'requirements': [
                    'Video must be 1-2 minutes long',
                    'Good audio and video quality',
                    'Share your genuine experience',
                    'Face must be visible'
                ],
            },
        ]

        for task_data in tasks_data:
            task, created = Task.objects.get_or_create(
                title=task_data['title'],
                defaults=task_data
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created task: {task.title}'))
            else:
                self.stdout.write(self.style.WARNING(f'Task already exists: {task.title}'))

        self.stdout.write(self.style.SUCCESS('Seed data complete!'))
