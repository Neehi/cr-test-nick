import re

from django.utils.translation import ugettext_lazy as _

from rest_framework import serializers

from ..models import Word


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


class CreateUniqueWordSerializer(serializers.Serializer):
    """
    Serializer for splitting a sentence into individual words and saving them
    to the database.

    This could just as easily be part of `UniqueWordSerializer` and in some
    ways would be simpler, but for our purposes, keeping this separate
    simplifies the use and testing of the serializers.
    """
    regex = re.compile(r"(\w[\w']*\w|\w)")
    sentence = serializers.CharField(write_only=True)

    # TODO: Remove if not needed
    # def save(self, **kwargs):
    #     validated_data = dict(
    #         list(self.validated_data.items()) +
    #         list(kwargs.items())
    #     )
    #     create(validated_data)

    def create(self, validated_data):
        # Use regex instead of `split`, as we need to allow for punctuation,
        # use of apostrophes, etc.
        sentence = validated_data.pop('sentence')
        words = CreateUniqueWordSerializer.regex.findall(sentence)
        for word in words:
            Word.objects.create(value=word)
        # No instance returns here
