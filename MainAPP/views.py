from django.contrib.auth.decorators import login_required
from django.core import urlresolvers
from django.http import HttpResponseRedirect
from django.shortcuts import render
from . import hardcode


# Create your views here.
@login_required()
def home(request):
    step = request.user.step
    if step in (hardcode.STEP_UNKNOWN, hardcode.STEP_POLL):
        return HttpResponseRedirect(urlresolvers.reverse('poll'))
    elif step == hardcode.STEP_CANVAS:
        return HttpResponseRedirect(urlresolvers.reverse('canvas'))
    elif step == hardcode.STEP_DONE:
        return HttpResponseRedirect(urlresolvers.reverse('share'))
    else:
        return HttpResponseRedirect(urlresolvers.reverse('share'))


def poll(request):
    result = ''
    return render(
        request,
        'poll.html',
        {"result": result}
    )


def canvas(request):
    result = ''
    return render(
        request,
        'canvas.html',
        {"result": result}
    )


def share(request):
    result = ''
    return render(
        request,
        'share.html',
        {"result": result}
    )
