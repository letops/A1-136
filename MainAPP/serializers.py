from . import models
from rest_framework import serializers
from easy_thumbnails import files


class FullSafeUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CustomUser
        fields = (
            'id',
            'username',
            'nickname',
            'first_name',
            'last_name',
            'email',
            'avatar',
            'birthday',
            'description',
            'gender',
            'step',
            'occupation',
            'edition_date',
            'is_active',
            'is_staff',
            'is_superuser',
        )


class CanvasImagesSerializer(serializers.ModelSerializer):
    urls = serializers.SerializerMethodField('get_image_thumbnail')

    class Meta:
        model = models.IsometricImage
        fields = (
            'urls',  # FIXME: Potential fix, because it displays "urls" in all images
        )

    def get_image_thumbnail(self, obj):
        return {
            alias: files.get_thumbnailer(obj.image)[alias].url for alias in files.aliases.all()
        }


class CanvasClustersSerializer(serializers.ModelSerializer):
    isometric_images = CanvasImagesSerializer(many=True, read_only=True)

    class Meta:
        model = models.Cluster
        fields = (
            'name',
            'isometric_images'
        )


class CanvasCategoriesSerializer(serializers.ModelSerializer):
    clusters = CanvasClustersSerializer(many=True, read_only=True)

    class Meta:
        model = models.Category
        fields = (
            'id',
            'name',
            'clusters'
        )


class CanvasUserCacheSerializer(serializers.ModelSerializer):
    isometric_image = CanvasImagesSerializer(many=False, read_only=True)

    class Meta:
        model = models.Position
        fields = (
            'column',
            'row',
            'isometric_image'
        )
