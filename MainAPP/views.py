from django.contrib.auth.decorators import login_required
from django.core import urlresolvers
from django.http import HttpResponseRedirect
from django.shortcuts import render
from . import hardcode, queries


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


@login_required()
def poll(request):
    if request.method == 'POST':
        if queries.PollFinish(request.user) is True:
            return HttpResponseRedirect(urlresolvers.reverse('canvas'))
        msg.generate_msg(
            request=request, state=msg.RED,
            title=msg.errors_list['title']['500'],
            body=msg.errors_list['body']['ticket'])
    result = ''
    return render(
        request,
        'poll.html',
        {"result": result}
    )


@login_required()
def canvas(request):
    result = ''
    return render(
        request,
        'canvas.html',
        {"result": result}
    )


@login_required()
def share(request):
    result = queries.Share(user=request.user)

    return render(
        request,
        'share.html',
        {"result": result}
    )
