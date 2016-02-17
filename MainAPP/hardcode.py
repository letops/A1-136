from django.utils.translation import ugettext as _ug
import os

user_middlename_length = 45
user_mothersname_length = 45
user_nickname_length = 45
user_default_photo = "avatars/no-img.jpg"
GENDER_UNKNOWN = 0
GENDER_FEMALE = 1
GENDER_MALE = 2
GENDER_OTHER = 2
GENDER = (
    (GENDER_UNKNOWN, _ug('Prefer not to say')),
    (GENDER_MALE, _ug('Male')),
    (GENDER_FEMALE, _ug('Female')),
    (GENDER_OTHER, _ug('Other'))
)


def user_avatar_upload(instance, filename):
    fn, ext = os.path.splitext(filename)
    return "avatars/{id}{ext}".format(id=instance.pk, ext=ext)
