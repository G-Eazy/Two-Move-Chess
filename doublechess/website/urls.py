from django.urls import path

from . import views

urlpatterns = [
    path('', views.homepage, name='homepage'),
    path('tutorial/', views.tutorial, name='tutorial'),
    path('debug/', views.debug, name='debug'),
    path('twoplayer/', views.twoplayer, name='twoplayer'),
    path('analysis/', views.analysis, name='analysis'),
    path('user/', views.user, name='user')
]

