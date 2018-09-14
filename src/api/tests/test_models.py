from django.test import TestCase
from django.utils.translation import ugettext_lazy as _

from testapp.models import Word, WordQuerySet


class WordModelTests(TestCase):

    def setUp(self):
        self.word_1 = Word(value="test")
        self.word_1.save()

    def test_value_label(self):
        field_label = self.word_1._meta.get_field('value').verbose_name
        self.assertEqual(field_label, _("value"))

    def test_value_max_length(self):
        max_length = self.word_1._meta.get_field('value').max_length
        self.assertEqual(max_length, 50)

    def test_object_name(self):
        # Object name should be the word itself
        self.assertEquals(str(self.word_1), "test")

    def test_non_unique(self):
        # Words should be stored non-unique
        self.assertEqual(Word.objects.count(), 1)
        Word.objects.create(value="test")
        self.assertEqual(Word.objects.count(), 2)

    def test_default_ordering(self):
        # Default ordering should be default alphabetic with lowercase coming
        # before uppercase
        last_word = Word.objects.create(value="Ztest")
        first_word = Word.objects.create(value="Atest")
        Word.objects.create(value="ztest")
        self.assertEqual(Word.objects.first(), first_word)
        self.assertEqual(Word.objects.last(), last_word)


class WordQuerySetTests(TestCase):

    @classmethod
    def setUpTestData(cls):
        Word.objects.create(value="test")
        Word.objects.create(value="Test")
        Word.objects.create(value="tesT")

    def test_queryset_unique(self):
        # The unique filter should return a case insensitive list of all words
        # test,Test and tesT, should all be seen by the queryset as `test`
        self.assertEqual(Word.objects.unique().count(), 1)
        self.assertEqual(list(Word.objects.unique()), [{'value': "test"}])
        Word.objects.create(value="NotTheSame") # Should be seen as different
        self.assertEqual(Word.objects.unique().count(), 2)
        self.assertEqual(
            list(Word.objects.unique()),
            [
                {'value': "notthesame"}, # Should appear first due to ordering
                {'value': "test"},
            ]
        )

    def test_queryset_unique_with_counts(self):
        # The unique filter should return a case insensitive list of all words
        # plus a count of the number of occurences of the word in the db
        # test, Test and tesT should return a single entry with 3 occurences
        self.assertEqual(Word.objects.unique_with_counts().count(), 1)
        self.assertEqual(
            list(Word.objects.unique_with_counts()),
            [{'value': "test", 'num_occurrences': 3}]
        )
        Word.objects.create(value="NotTheSame")
        self.assertEqual(Word.objects.unique_with_counts().count(), 2)
        self.assertEqual(
            list(Word.objects.unique_with_counts()),
            [
                {'value': "notthesame", 'num_occurrences': 1}, # Just the 1
                {'value': "test", 'num_occurrences': 3},
            ]
        )
