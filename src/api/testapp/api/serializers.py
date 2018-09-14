from django.utils.translation import ugettext_lazy as _

from rest_framework import serializers


class UniqueWordSerializer(serializers.Serializer):
    """
    Serializer for returning a unique word, along with the number of
    occurrences of it in the db.

    We don't use a model serializer here as it's meant to be used in
    conjunction with `Word.objects.unique_with_counts()` which returns
    a dictionary of values, rather that model data.
    """
    value = serializers.CharField()
    num_occurrences = serializers.IntegerField()
