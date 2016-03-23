from django.db.models import Prefetch
from . import models
# import Image as PillowImaging


def CanvasCategories(user, filters=None):
    # TODO:
    # Dado el usuario, es necesario obtener las respuestas seleccionadas para
    # poder determinar las imágenes a mostrar, pero debido a que existen
    # preguntas que se ordenan por prioridad, será necesario esperar a que
    # Diana nos indique la forma de calcular la categoría a partir de dicho
    # tipo de preguntas. Por lo mientras se usará un DUMMY
    categories = models.Category.objects.filter(hidden=False).prefetch_related(
        Prefetch(
            'clusters',
            queryset=models.Cluster.objects.filter(hidden=False)
        ),
        Prefetch(
           'clusters__isometric_images',
           queryset=models.IsometricImage.objects.filter(hidden=False)
        ),
    )
    return categories


def CanvasUserCache(user, filters=None):
    positions = user.positions.prefetch_related(
        Prefetch(
           'isometric_image',
           queryset=models.IsometricImage.objects.filter(hidden=False)
        ),
    )
    return positions


def Share(user):
    # TODO!!
    positions = user.positions
    if len(positions) > 0:
        pass
    else:
        pass
    result = ''
    return result
