from django.db import models


class Contact(models.Model):
	name = models.CharField(max_length=127)
	email = models.EmailField()
	message = models.TextField()
