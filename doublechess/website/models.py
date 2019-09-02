from django.db import models
from django.contrib.auth.models import User

# Create Models here
# Each class is its own table
# Attributes are fields

class User2(models.Model):
    username = models.CharField(max_length=100) 
    password = models.TextField()
