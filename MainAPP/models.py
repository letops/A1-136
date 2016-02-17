from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import ugettext as _ug
from easy_thumbnails.fields import ThumbnailerImageField
from MainAPP import hardcode


# Custom user which inherits from an AbstractUser and uses the code in
#  backends.py to authenticate and validate permissions
class CustomUser(AbstractUser):
    middle_name = models.CharField(
        max_length=hardcode.user_middlename_length,
        blank=True,
        null=True,
        verbose_name=_ug('Middle Name')
    )
    mothers_name = models.CharField(
        max_length=hardcode.user_mothersname_length,
        blank=True,
        null=True,
        verbose_name=_ug('Mothers Name')
    )
    nickname = models.CharField(
        max_length=hardcode.user_nickname_length,
        blank=True,
        null=True,
        verbose_name=_ug('Nickname')
    )
    avatar = ThumbnailerImageField(
        upload_to=hardcode.user_avatar_upload,
        default=hardcode.user_default_photo,
        blank=True,
        null=True,
        verbose_name=_ug('Profile picture')
    )
    birthday = models.DateField(
        blank=True,
        null=True,
        verbose_name=_ug('Birthday')
    )
    gender = models.IntegerField(
        default=hardcode.GENDER_UNKNOWN,
        choices=hardcode.GENDER,
        blank=True,
        null=True,
        verbose_name=_ug('Gender')
    )
    edition_date = models.DateTimeField(
        auto_now=True,
        verbose_name=_ug('Last edition date')
    )

    class Meta:
        verbose_name = _ug('User')
        verbose_name_plural = _ug('Users')
        permissions = (
            ('query_customuser', 'Can query User'),
            ('list_customuser', 'Can list User'),
        )

    def save(self, *args, **kwargs):
        if self.pk is None:
            avatar = self.avatar
            self.avatar = None
            super(CustomUser, self).save(*args, **kwargs)
            self.avatar = avatar
        super(CustomUser, self).save(*args, **kwargs)

    def delete(self, *args):
        if self.active is False:
            super(CustomUser, self).delete(*args)
        else:
            self.active = False
            self.save()

    def __str__(self):
        return "%s - %s %s" % (self.username, self.first_name, self.last_name)

    def get_full_name(self):
        full_name = '%s %s %s %s' % (self.first_name, self.middle_name,
                                     self.last_name, self.mothers_name)
        return full_name.strip()

    def get_username(self):
        return "%s" % self.username

    def get_nickname(self):
        return "%s" % self.nickname

    def get_short_name(self):
        if self.nickname is None or self.nickname == '':
            return "%s" % self.username
        return self.get_nickname()
