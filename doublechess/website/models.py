from django.db import models
from django.contrib.auth.models import User
from PIL import Image

import json

# Create Models here


# Each class is its own table
# Attributes are fields

class User2(models.Model):
    username = models.CharField(max_length=100) 
    password = models.TextField() # max length?


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

class Game(models.Model):
    # game_id = models.IntegerField()  id is created automatically
    white_player = models.TextField()         # Maybe use this? models.ForeignKey(User)
    black_player = models.TextField()         #               models.ForeignKey(User)
    white_rating = models.IntegerField()
    black_rating = models.IntegerField()
    moves = models.TextField()   # maybe we want our own datatypes for the three attributes below
    winner = models.TextField()
    end_result = models.TextField()     # win/lose/draw method: Regicide, timeout, resignation, stalemate, draw
    start_time = models.IntegerField()
    increment  = models.IntegerField()
    date_played = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        game_dict = {
            'white_player' : self.white_player,
            'black_player' : self.black_player,
            'white_rating' : self.white_rating,
            'black_rating' : self.black_rating,
            'moves' : self.moves,
            'winner' : self.winner,
            'end_result' : self.end_result,
            'start_time' : self.start_time,
            'increment' : self.increment,
            'date_played' : str(self.date_played)
        }
        json_dump = json.dumps(game_dict)
        return json_dump
