from django.test import TestCase
from django.utils.translation import ugettext_lazy as _

from testapp.models import Word


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
        word_2 = Word.objects.create(value="test")
        self.assertEqual(Word.objects.count(), 2)

    def test_default_ordering(self):
        # Default ordering should be default alphabetic with lowercase coming
        # before uppercase
        last_word = Word.objects.create(value="Ztest")
        first_word = Word.objects.create(value="Atest")
        Word.objects.create(value="ztest")
        self.assertEqual(Word.objects.first(), first_word)
        self.assertEqual(Word.objects.last(), last_word)
