# Generated by Django 2.2.2 on 2019-09-23 11:50

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('website', '0003_auto_20190923_1150'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chessgame',
            name='black',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='white', to='website.Profile'),
        ),
        migrations.AlterField(
            model_name='chessgame',
            name='white',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='black', to='website.Profile'),
        ),
    ]
