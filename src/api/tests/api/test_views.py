from collections import OrderedDict

from django.test import TestCase

from rest_framework.exceptions import ErrorDetail
from rest_framework.request import Request
from rest_framework.test import APIRequestFactory

from testapp.api.views import UniqueWordList
from testapp.models import Word

factory = APIRequestFactory()


class UniqueWordListTests(TestCase):

    def setUp(self):
        self.view = UniqueWordList.as_view()

    def test_view_invalid_methods(self):
        # Only GET should be supported
        request = factory.post('/', {}, content_type='application/json')
        response = self.view(request)
        self.assertEqual(response.status_code, 405)
        self.assertEqual(
            response.data,
            {'detail': ErrorDetail(string='Method "POST" not allowed.', code='method_not_allowed')}
        )
        request = factory.put('/', {}, content_type='application/json')
        response = self.view(request)
        self.assertEqual(response.status_code, 405)
        self.assertEqual(
            response.data,
            {'detail': ErrorDetail(string='Method "PUT" not allowed.', code='method_not_allowed')}
        )
        request = factory.patch('/', {}, content_type='application/json')
        response = self.view(request)
        self.assertEqual(response.status_code, 405)
        self.assertEqual(
            response.data,
            {'detail': ErrorDetail(string='Method "PATCH" not allowed.', code='method_not_allowed')}
        )
        request = factory.delete('/', {}, content_type='application/json')
        response = self.view(request)
        self.assertEqual(response.status_code, 405)
        self.assertEqual(
            response.data,
            {'detail': ErrorDetail(string='Method "DELETE" not allowed.', code='method_not_allowed')}
        )

    def test_view_no_data(self):
        request = factory.get('/', content_type='application/json')
        response = self.view(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [])

    def test_view_with_data(self):
        Word.objects.create(value="test")
        request = factory.get('/', content_type='application/json')
        response = self.view(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.data,
            [OrderedDict([('value', "test"), ('num_occurrences', 1)])]
        )
