from rest_framework import generics, status
from rest_framework.response import Response

from ..models import Word
from .serializers import CreateUniqueWordSerializer, UniqueWordSerializer


class UniqueWordList(generics.ListCreateAPIView):
    """
    get: Get a list unique words with count of occurrences
    post: Split a sentence into words and save in the database
    """
    queryset = Word.objects.unique_with_counts()
    pagination_class = None  # No need for pagination
    permission_classes = ()  # No need to restrict access to the list

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateUniqueWordSerializer
        return UniqueWordSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        # Return with 200 as 201 doesn't seem right in this instance, as we're
        # not creating an actual instance - ideally would return a list of
        # added words or simply return `self.list()` for the new complete list
        return Response(None, status=status.HTTP_200_OK)

    def perform_create(self, serializer):
        # Call create directly as we're not returning an instance
        serializer.create(serializer.validated_data)
