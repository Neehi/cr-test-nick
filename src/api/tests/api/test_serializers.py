from django.test import TestCase

from rest_framework.request import Request

from testapp.api.serializers import (
    CreateUniqueWordSerializer,
    UniqueWordSerializer
)
from testapp.models import Word


class UniqueWordSerializerTests(TestCase):

    def test_expected_fields(self):
        serializer = UniqueWordSerializer()
        self.assertEqual(
            list(serializer.data.keys()),
            ['value', 'num_occurrences', ]
        )

    def test_empty_serializer(self):
        serializer = UniqueWordSerializer()
        self.assertEqual(
            serializer.data,
            {'value': '', 'num_occurrences': None}
        )

    def test_valid_serializer(self):
        # `validated_data` should match the input data and `data` should
        # remian untouched
        serializer = UniqueWordSerializer(
            data={'value': "test", 'num_occurrences': 1}
        )
        self.assertTrue(serializer.is_valid())
        self.assertEqual(
            set(serializer.validated_data),
            set({'value': "test", 'num_occurrences': 1})
        )
        self.assertEqual(
            serializer.data,
            {'value': "test", 'num_occurrences': 1}
        )

    def test_invalid_serializer(self):
        # `validated_data` should be empty and `data` should be untouched
        serializer = UniqueWordSerializer(
            data={'value': 1}
        )
        self.assertFalse(serializer.is_valid())
        self.assertEqual(serializer.validated_data, {})
        self.assertEqual(serializer.data, {'value': 1})


class CreateUniqueWordSerializerTests(TestCase):

    def test_expected_fields(self):
        serializer = CreateUniqueWordSerializer()
        self.assertEqual(list(serializer.data.keys()), ['sentence', ])

    def test_empty_serializer(self):
        serializer = CreateUniqueWordSerializer()
        self.assertEqual(serializer.data, {'sentence': "", })

    def test_valid_data(self):
        serializer = CreateUniqueWordSerializer(data={'sentence': "This is a test"})
        self.assertTrue(serializer.is_valid())
        self.assertEqual(set(serializer.validated_data), set({'sentence': "This is a test"}))
        self.assertEqual(serializer.data, {})  # write only so no data?

    def test_invalid_data(self):
        # Check field name and data type
        serializer = CreateUniqueWordSerializer(data={'value': "This is a test"})
        self.assertFalse(serializer.is_valid())
        self.assertEqual(serializer.validated_data, {})
        self.assertEqual(serializer.data, {}) # Should be empty
        serializer = CreateUniqueWordSerializer(data={'sentence': []})
        self.assertFalse(serializer.is_valid())
        self.assertEqual(serializer.validated_data, {})
        self.assertEqual(serializer.data, {'sentence': []})

    def test_serializer_create(self):
        # Check the serializer saves properly and returns the expected results
        serializer = CreateUniqueWordSerializer(
            data={'sentence': "This is a test"}
        )
        self.assertTrue(serializer.is_valid())
        serializer.create(serializer.validated_data)
        # Check it saved correctly
        self.assertEqual(Word.objects.all().count(), 4)
        self.assertEqual(
            list(Word.objects.unique_with_counts()),
            [
                {'value': "a", 'num_occurrences': 1},
                {'value': "is", 'num_occurrences': 1},
                {'value': "test", 'num_occurrences': 1},
                {'value': "this", 'num_occurrences': 1},
            ]
        )
