from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib import messages
from .forms import UserRegisterForm
import json
from django.http import JsonResponse

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

        if(increment > 999 or increment < 0):
            return JsonResponse({"error": "Increment has to be between 0 and 999 seconds!"})

        challenges.append((starttime, increment))

        return JsonResponse({"success": "challenge created successfully", "challenges":challenges})

    return render(request, 'website/gameselect.html')

def user(request):
    return render(request, '/website/user.html')