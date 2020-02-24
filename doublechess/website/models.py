from django.db import models
from django.contrib.auth.models import User
from PIL import Image
# Create Models here
# Each class is its own table
# Attributes are fields

class User2(models.Model):
    username = models.CharField(max_length=100) 
    password = models.TextField()


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    image = models.ImageField(default='default.jpg', upload_to='profile_pics')
    

    def __str__(self):
        return f'{self.user.username} Profile'

    # Overwrite models.Model save to scale images
    def save(self, *args, **kwargs):
        super(Profile, self).save(*args, **kwargs)
        
        img = Image.open(self.image.path)
        if img.height > 300 or img.width > 300:
            output_size = (300, 300)
            img.thumbnail(output_size)
            img.save(self.image.path)
