from django.shortcuts import render
from django.http import HttpResponse


def homepage(request):

    context = {
    }

    return render(request, 'website/homepage.html', context)

def tutorial(request):

    context = {}

    return render(request, 'website/tutorial.html', context)

def twoplayer(request): 
    context = {}
    return render(request, 'website/twoplayer.html', context)

def debug(request):
    return HttpResponse("<h1>DEBUG</h1>")