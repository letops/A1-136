from django.contrib.auth.decorators import login_required
from django.core import urlresolvers
from django.http import HttpResponseRedirect
from django.shortcuts import render
import .hardcode


# Create your views here.
@login_required()
def home(request):
    if request.user.step in (hardcode.STEP_UNKNOWN, hardcode.STEP_POLL):
        return HttpResponseRedirect(urlresolvers.reverse('login'))
    elif request.user.step == hardcode.STEP_CANVAS:
        return HttpResponseRedirect(urlresolvers.reverse('login'))
    elif request.user.step == hardcode.STEP_DONE:
        return HttpResponseRedirect(urlresolvers.reverse('login'))
    else:
        return HttpResponseRedirect(urlresolvers.reverse('login'))
