# Generated by Django 2.2.2 on 2020-02-10 19:55

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('website', '0008_auto_20200210_1610'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='User2',
            new_name='User',
        ),
    ]