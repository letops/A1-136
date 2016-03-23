from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import ugettext as _ug
from easy_thumbnails.fields import ThumbnailerImageField
from . import hardcode


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
    step = models.IntegerField(
        default=hardcode.STEP_UNKNOWN,
        choices=hardcode.STEPS,
        blank=False,
        null=False,
        verbose_name=_ug('Step')
    )
    occupation = models.CharField(
        max_length=hardcode.user_occupation_length,
        blank=True,
        null=True,
        verbose_name=_ug('Occupation')
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


class Category(models.Model):
    name = models.CharField(
        max_length=hardcode.category_name_length,
        blank=False,
        null=False,
        verbose_name=_ug('Name')
    )
    edition_date = models.DateTimeField(
        auto_now=True,
        verbose_name=_ug('Last edition date')
    )
    hidden = models.BooleanField(
        default=False,
        blank=True,
        null=False,
        verbose_name=_ug('Hidden')
    )

    class Meta:
        verbose_name = _ug('Category')
        verbose_name_plural = _ug('Categories')
        permissions = (
            ('query_category', 'Can query Category'),
            ('list_category', 'Can list Categories'),
        )

    def delete(self, *args):
        if self.hidden is True:
            super(Category, self).delete(*args)
        else:
            self.hidden = True
            self.save()

    def __str__(self):
        return "{name}".format(name=self.name)


class Cluster(models.Model):
    name = models.CharField(
        max_length=hardcode.cluster_name_length,
        blank=False,
        null=False,
        verbose_name=_ug('Name')
    )
    categories = models.ManyToManyField(
        Category,
        related_name='clusters',
        verbose_name=_ug('Categories')
    )
    edition_date = models.DateTimeField(
        auto_now=True,
        verbose_name=_ug('Last edition date')
    )
    hidden = models.BooleanField(
        default=False,
        blank=True,
        null=False,
        verbose_name=_ug('Hidden')
    )

    class Meta:
        verbose_name = _ug('Cluster')
        verbose_name_plural = _ug('Clusters')
        permissions = (
            ('query_cluster', 'Can query Cluster'),
            ('list_cluster', 'Can list Clusters'),
        )

    def delete(self, *args):
        if self.hidden is True:
            super(Cluster, self).delete(*args)
        else:
            self.hidden = True
            self.save()

    def __str__(self):
        return "{name}".format(name=self.name)


class Position(models.Model):
    user = models.ForeignKey(
        CustomUser,
        related_name='positions',
        blank=False,
        null=False,
        verbose_name=_ug('User')
    )
    isometric_image = models.ForeignKey(
        'IsometricImage',
        related_name='positions',
        blank=False,
        null=False,
        verbose_name=_ug('Isometric Image')
    )
    row = models.IntegerField(
        blank=False,
        null=False,
        verbose_name=_ug('Row')
    )
    column = models.IntegerField(
        blank=False,
        null=False,
        verbose_name=_ug('Column')
    )
    creation_date = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_ug('Creation date')
    )

    class Meta:
        verbose_name = _ug('Position')
        verbose_name_plural = _ug('Positions')
        permissions = (
            ('query_position', 'Can query Position'),
            ('list_position', 'Can list Positions'),
        )

    def __str__(self):
        return "{user} - {isometric_image} ({column},{row})".format(
            user=self.user, isometric_image=self.isometric_image,
            column=self.column, row=self.row
        )


class IsometricImage(models.Model):
    image = ThumbnailerImageField(
        upload_to=hardcode.isometric_image_upload,
        default=hardcode.isometric_image_photo,
        blank=False,
        null=False,
        verbose_name=_ug('Isometric Image')
    )
    cluster = models.ForeignKey(
        Cluster,
        related_name='isometric_images',
        blank=False,
        null=False,
        verbose_name=_ug('Cluster')
    )
    users = models.ManyToManyField(
        CustomUser,
        related_name='isometric_images',
        through=Position,
        verbose_name=_ug('Users')
    )
    edition_date = models.DateTimeField(
        auto_now=True,
        verbose_name=_ug('Last edition date')
    )
    hidden = models.BooleanField(
        default=False,
        blank=True,
        null=False,
        verbose_name=_ug('Hidden')
    )

    class Meta:
        verbose_name = _ug('Isometric Image')
        verbose_name_plural = _ug('Isometric Images')
        permissions = (
            ('query_isometricimage', 'Can query Isometric Image'),
            ('list_isometricimage', 'Can list Isometric Images'),
        )

    def save(self, *args, **kwargs):
        if self.pk is None:
            image = self.image
            self.image = None
            super(IsometricImage, self).save(*args, **kwargs)
            self.image = image
        super(IsometricImage, self).save(*args, **kwargs)

    def delete(self, *args):
        if self.hidden is True:
            super(IsometricImage, self).delete(*args)
        else:
            self.hidden = True
            self.save()

    def __str__(self):
        return "{pk}".format(pk=self.pk)


class Question(models.Model):
    text = models.CharField(
        max_length=hardcode.question_text_length,
        blank=False,
        null=False,
        verbose_name=_ug('Text')
    )
    edition_date = models.DateTimeField(
        auto_now=True,
        verbose_name=_ug('Last edition date')
    )
    hidden = models.BooleanField(
        default=False,
        blank=True,
        null=False,
        verbose_name=_ug('Hidden')
    )

    class Meta:
        verbose_name = _ug('Question')
        verbose_name_plural = _ug('Questions')
        permissions = (
            ('query_question', 'Can query Question'),
            ('list_question', 'Can list Questions'),
        )

    def delete(self, *args):
        if self.hidden is True:
            super(Question, self).delete(*args)
        else:
            self.hidden = True
            self.save()

    def __str__(self):
        return "{text}".format(text=self.text[:80])


class Selection(models.Model):
    user = models.ForeignKey(
        CustomUser,
        related_name='selections',
        blank=False,
        null=False,
        verbose_name=_ug('User')
    )
    answer = models.ForeignKey(
        'Answer',
        related_name='selections',
        blank=False,
        null=False,
        verbose_name=_ug('Answer')
    )
    creation_date = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_ug('Creation date')
    )

    class Meta:
        verbose_name = _ug('Selection')
        verbose_name_plural = _ug('Selections')
        permissions = (
            ('query_selection', 'Can query Selection'),
            ('list_selection', 'Can list Selections'),
        )

    def __str__(self):
        return "{user} - {answer}".format(user=self.user, answer=self.answer)


class Answer(models.Model):
    text = models.CharField(
        max_length=hardcode.answer_text_length,
        blank=False,
        null=False,
        verbose_name=_ug('Text')
    )
    category = models.ForeignKey(
        Category,
        related_name='answers',
        blank=False,
        null=False,
        verbose_name=_ug('Category')
    )
    question = models.ForeignKey(
        Question,
        related_name='answers',
        blank=False,
        null=False,
        verbose_name=_ug('Question')
    )
    users = models.ManyToManyField(
        CustomUser,
        related_name='answers',
        through=Selection,
        verbose_name=_ug('Users')
    )
    edition_date = models.DateTimeField(
        auto_now=True,
        verbose_name=_ug('Last edition date')
    )
    hidden = models.BooleanField(
        default=False,
        blank=True,
        null=False,
        verbose_name=_ug('Hidden')
    )

    class Meta:
        verbose_name = _ug('Answer')
        verbose_name_plural = _ug('Answers')
        permissions = (
            ('query_answer', 'Can query Answer'),
            ('list_answer', 'Can list Answers'),
        )

    def delete(self, *args):
        if self.hidden is True:
            super(Answer, self).delete(*args)
        else:
            self.hidden = True
            self.save()

    def __str__(self):
        return "{text}".format(text=self.text[:80])
