from django.utils.translation import ugettext as _ug
import os

user_middlename_length = 45
user_mothersname_length = 45
user_nickname_length = 45
user_default_photo = "avatars/no-img.jpg"
user_occupation_length = 100
GENDER_UNKNOWN = 0
GENDER_FEMALE = 1
GENDER_MALE = 2
GENDER_OTHER = 3
GENDER = (
    (GENDER_UNKNOWN, _ug('Prefer not to say')),
    (GENDER_MALE, _ug('Male')),
    (GENDER_FEMALE, _ug('Female')),
    (GENDER_OTHER, _ug('Other'))
)
STEP_UNKNOWN = 0
STEP_POLL = 1
STEP_CANVAS = 2
STEP_DONE = 3
STEPS = (
    (STEP_UNKNOWN, _ug('Unknown')),
    (STEP_POLL, _ug('Poll')),
    (STEP_CANVAS, _ug('Canvas')),
    (STEP_DONE, _ug('Done'))
)

category_name_length = 50

cluster_name_length = 50

isometric_image_photo = "isometrics/no-img.jpg"

render_image_photo = "renders/no-img.jpg"

question_text_length = 200
question_description_length = 400
STYLE_RADIO = 0
STYLE_PRIORITY = 1
STYLES = (
    (STYLE_RADIO, _ug('Radio')),
    (STYLE_PRIORITY, _ug('Priority')),
)

answer_text_length = 50


def user_avatar_upload(instance, filename):
    fn, ext = os.path.splitext(filename)
    return "avatars/{id}{ext}".format(id=instance.pk, ext=ext)


def isometric_image_upload(instance, filename):
    fn, ext = os.path.splitext(filename)
    return "isometrics/{id}{ext}".format(id=instance.pk, ext=ext)


def render_image_upload(instance, filename):
    fn, ext = os.path.splitext(filename)
    return "renders/{id}{ext}".format(id=instance.pk, ext=ext)
