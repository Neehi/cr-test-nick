from django.urls import path

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.reverse import reverse

from .views import UniqueWordList


@api_view(['GET'])
@permission_classes(())
def api_root(request, format=None):
    return Response({
        'unique-words': reverse(
            'unique-word-list',
            request=request,
            format=format
        ),
    })


urlpatterns = [
    path(
        r'',
        api_root,
        name='api-root'
    ),
    path(
        r'unique-words/',
        UniqueWordList.as_view(),
        name='unique-word-list'
    ),
]
