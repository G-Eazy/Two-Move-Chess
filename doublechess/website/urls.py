from django.urls import path, include
from django.contrib.auth import views as auth_views
from django.conf import settings
from . import views

from django.conf.urls.static import static

urlpatterns = [
    path('', views.homepage, name='homepage'),
    path('tutorial/', views.tutorial, name='tutorial'),
    path('debug/', views.debug, name='debug'),
    path('twoplayer/', views.twoplayer, name='twoplayer'),
    path('analysis/', views.analysis, name='analysis'),
    path('.well-known/security.txt', views.security, name='security'),
    path('register/', views.register, name='register'),
    path('login/', auth_views.LoginView.as_view(template_name='website/login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(template_name='website/logout.html'), name='logout'),
    path('profile/', views.profile, name='profile'),
    path('playonline/', views.playonline, name="playonline"),

]

# for debug mode
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# for launch
# https://docs.djangoproject.com/en/2.2/howto/static-files/
