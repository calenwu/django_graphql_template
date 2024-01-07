from celery import shared_task
from datetime import timedelta
from django.utils import timezone
from allauth.account.models import EmailAddress


@shared_task
def delete_unverified_emails():
	for email in EmailAddress.objects.filter(verified=False):
		if abs(timezone.now() - email.user.date_joined) > timedelta(minutes=10):
			email.user.delete()
		else:
			email.delete()
