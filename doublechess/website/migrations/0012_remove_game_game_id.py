# Generated by Django 2.2.2 on 2020-02-24 16:52

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('website', '0011_game'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='game',
            name='game_id',
        ),
    ]
