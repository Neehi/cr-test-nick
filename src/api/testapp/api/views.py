from rest_framework import generics

from .serializers import UniqueWordSerializer
from ..models import Word


class UniqueWordList(generics.ListAPIView):
    """
    get: Get a list unique words with count of occurrences
    """
    queryset = Word.objects.unique_with_counts()
    serializer_class = UniqueWordSerializer
    pagination_class = None  # No need for pagination
    permission_classes = ()  # No need to restrict access to the list
