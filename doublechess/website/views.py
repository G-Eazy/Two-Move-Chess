from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib import messages
from .forms import UserRegisterForm, UserUpdateForm, ProfileUpdateForm
from django.contrib.auth import logout
from .models import Profile, User

import json
from django.http import JsonResponse
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import login_required

challenges = []

def homepage(request):
    context = {}
    return render(request, 'website/homepage.html', context)

def tutorial(request):
    context = {}
    return render(request, 'website/tutorial.html', context)

def twoplayer(request): 
    context = {}
    return render(request, 'website/twoplayer.html', context)

def analysis(request):
    context = {}
    return render(request, 'website/analysis.html', context)

def players(request):
    players_db = User.objects.all()
    context = {'players': players_db}

    return render(request, 'website/players.html', context)

def debug(request):
    return HttpResponse("<h1>DEBUG</h1>")


def security(request):
    return render(request, 'website/security.txt')

def playonline(request):

    print("playonline request happened", flush=True)

    if request.method == 'POST':
        data = request.POST.dict()
        starttime = data["starttime"]
        increment = data["increment"]
        print(data, flush=True)
        try:
            starttime = int(starttime)
            increment = int(increment)
        except ValueError:
            return JsonResponse({"error": "Start time and increment have to be integers!"})
        
        if(starttime > 999 or starttime < 1):
            return JsonResponse({"error": "Start time has to be between 1 and 999 minutes!" })

    return render(request, 'website/gameselect.html')

def register(request):

    if request.method == 'POST':
        print("user-request post", flush=True)
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            messages.success(request, f'Account created for {username}!')
            return redirect('login')
        else:
            print("Invalid form")
    else: 
        form = UserRegisterForm()
    
    context = {'form':form}
    return render(request, 'website/register.html', context)
    

def login(request):

    if request.method == 'POST':

        form = AuthenticationForm(data=request.POST)
        if form.is_valid():
            return HttpResponse("Congrats, you are logged in")
        else:
            form = AuthenticationForm()
            login_error = "Invalid username or password"
            context = {'login_error':login_error, 'form':form}


    else:
        form = AuthenticationForm()
        context = {'form':form}

    return render(request, 'website/login.html', context)

def my_logout(request):
    print("Håkon inserts code here", flush=True)
    logout(request) 
    return render(request, 'website/logout.html')



@login_required
def profile(request):
    if request.method == 'POST':
        #u_form = UserUpdateForm(request.POST, instance=request.user)
        p_form = ProfileUpdateForm(request.POST, request.FILES)
        #if u_form.is_valid() and p_form.is_valid():
        if p_form.is_valid():
            #u_form.save()
            p_form.save()
            messages.success(request, f'Your account has been updated.')
            return redirect('profile')
    else:
        #u_form = UserUpdateForm(instance=request.user)
        p_form = ProfileUpdateForm()


    context = {
        #'u_form': u_form,
        'p_form': p_form
    }
    return render(request, 'website/profile.html', context)

def settings(request):
    return render(request, 'website/settings.html')
