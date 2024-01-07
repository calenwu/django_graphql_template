import graphene
import json
import requests

from django.conf import settings
from core.exceptions import FormException
from core.models import Contact
from core.forms import ContactForm
from core.utils import create_all_error


class Contact(graphene.Mutation):
	"""
	Contact mutation
	"""
	class Arguments:
		name = graphene.String()
		email = graphene.String()
		message = graphene.String()
		recaptcha = graphene.String()

	success = graphene.Boolean()

	@classmethod
	def mutate(cls, root, info, name: str, email: str, message: str, recaptcha: str):
		form = ContactForm({
			'name': name,
			'email': email,
			'message': message,
		})
		if form.is_valid():
			r = requests.post(
				'https://www.google.com/recaptcha/api/siteverify',
				data={
					'secret': settings.RECAPTCHA_SECRET_KEY,
					'response': recaptcha,
				}
			)
			if r.json()['success']:
				form.save(info.context)
				# noinspection PyArgumentList
				return Contact(success=True)
			return Exception(create_all_error('Your message was not sent, you believe you are a robot.'))
		raise FormException(json.dumps(form.errors.as_json()))


class Mutation(graphene.ObjectType):
	"""
	Mutations for the core
	"""
	contact = Contact.Field()


class Query(graphene.ObjectType):
	"""
	Queries for the User model
	"""
	timezones = graphene.List(graphene.List(graphene.String))

	def resolve_timezones(root, info, **kwargs):
		return settings.ALL_TIMEZONES
