from django.test import Client, TestCase
from django.urls import reverse

from rest_framework import status
from rest_framework.request import Request
from rest_framework.test import APIRequestFactory

from testapp.api.serializers import UniqueWordSerializer
from testapp.models import Word

client = Client()


class UrlTests(TestCase):

    def test_get_api_root(self):
        response = client.get(reverse('api-root'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.content, b'{"unique-words":"http://testserver/api/unique-words/"}')

    def test_get_unique_words(self):
        # Populate the db with some data
        Word.objects.create(value="test")
        Word.objects.create(value="Test")
        Word.objects.create(value="tesT")
        # Get data from the db
        unique_words = Word.objects.unique_with_counts()
        serializer = UniqueWordSerializer(unique_words, many=True)
        # Get the api response and check the result matches the db
        response = client.get(reverse('unique-word-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)
