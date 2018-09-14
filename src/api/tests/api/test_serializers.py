from django.test import TestCase

from rest_framework.request import Request

from testapp.api.serializers import UniqueWordSerializer


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
