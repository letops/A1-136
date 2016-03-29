from django.core.files.uploadedfile import SimpleUploadedFile
from django.db.models import Prefetch
from easy_thumbnails import files
import io
from PIL import Image
import sys
from . import models


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


def CanvasUserPositionSave(user, isometric_pk, row, column):
    print('{} {} {} {}'.format(user, isometric_pk, row, column))
    saved = False
    position, created = models.Position.objects.update_or_create(
        user=user,
        row=row,
        column=column,
        defaults={
            'isometric_image': models.IsometricImage.objects.get(
                pk=isometric_pk)
        }
    )
    print('{}'.format(position))
    position.save()
    return True


def Share(user):
    size = 270
    render = None
    updated = []

    render, created = models.Render.objects.get_or_create(user=user)
    positions = user.positions.prefetch_related(
        Prefetch(
           'isometric_image',
           queryset=models.IsometricImage.objects.filter(hidden=False)
        ),
    ).all()

    if created is False:
        updated = positions.filter(edition_date__gt=render.edition_date)

    if created is True or len(updated) > 0:
        temporal = io.BytesIO()
        image_render = Image.new("RGB", (size*4, size*4), "white")

        for position in positions:
            image_render.paste(Image.open(
                files.get_thumbnailer(position.isometric_image.image)[
                    '{size}px'.format(size=size)
                ]), (int(position.column*size), int(position.row*size))
            )

        image_render.save(temporal, format="png")  # save the content to temp
        temporal.seek(0)
        suf = SimpleUploadedFile('temporal',
                                 temporal.read(),
                                 content_type='image/png')
        render.image.save(suf.name+'.png', suf, save=False)

        render.save()

    return render.image.url
