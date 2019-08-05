from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib import messages
from .forms import UserRegisterForm


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

def debug(request):
    return HttpResponse("<h1>DEBUG</h1>")


def security(request):
    return render(request, 'website/security.txt')

def user(request):
    
    if request.method == 'POST':
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            messages.success(request, f'Account created for {username}!')
            return redirect('homepage')
    else: 
        form = UserRegisterForm()
    context = {'form':form}
    return render(request, 'website/user.html', context)
