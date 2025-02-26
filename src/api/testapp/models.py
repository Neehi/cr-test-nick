from django.core import validators
from django.db import models
from django.db.models import Count
from django.db.models.functions import Lower
from django.utils.translation import ugettext_lazy as _


class WordQuerySet(models.QuerySet):
    def unique(self):
        """
        Return a list of case insensitive unique words.

        An alternate method is to force the word to lowercase on the save
        method, but there's always the chance the save can be bypassed, so
        this acts as a more convenient (though less efficient) coverall.
        """
        return (
            self.extra(select={'value': "LOWER(value)"})
                .values('value')
                .distinct()
        )

    def unique_with_counts(self):
        return self.unique().annotate(num_occurrences=Count('id'))


class Word(models.Model):
    """
    An occurence of a word found in a sentence.

    A word in this instance is considered to be any alphanumeric character and
    the characters @, #, _, -. All other characters are considered to be some
    form of whitespace of separator and an occurence of them within a word
    will cause the word to fail validation. This combination of allowed
    characters can easily be changed by modifying the validator on the
    value field.

    A count of how many times a word has been used can be obtained by counting
    how many times the word appears in the table.

        Example:
            qs = Word.objects.filter(value="test").count()

    A list of all unique words, along with a count of how many times each has
    appeared, can be obtained by simply using an annotated query set.

        Example:
            qs = Word.objects.annotate(num_occurences=Count('value'))

    """
    value = models.CharField(
        _("value"),
        max_length=50,
        blank=False,
        null=False,
        db_index=True,
        help_text=_(
            "Required. Letters, digits and @/#/-/_ only."
        ),
        validators=[
            validators.RegexValidator(
                r'^[\w@#-_]+$',
            ),
        ],
    )

    objects = WordQuerySet().as_manager()

    class Meta:
        ordering = ['value', ]

    def __str__(self):
        """
        Return the word itself as the string representation.
        """
        return self.value
