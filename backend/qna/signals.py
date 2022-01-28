from django.core.cache import cache
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Answer, Question
from .tasks import answer_notifier, question_notifier


@receiver(post_save, sender=Answer)
def trigger_answer_notifier(sender, instance, created, **kwargs):
    if created:
        sent_by = instance.user.id
        recipient = instance.question.user.id
        msg = f'{instance.user} answered your question.'
        is_online = instance.question.user.is_online()
        token = instance.question.user.fcm.token
        answer_notifier.delay(sent_by, recipient, msg, instance.question.id, is_online, token)

        # update cache
        ans_by = instance.user.answers.all().order_by('-timestamp')
        ques_ans = instance.question.get_answers.all().order_by('-timestamp')
        cache.set(f'answer_{instance.id}', instance, None)
        cache.set(f'answers_by_{instance.user}', ans_by, None)
        cache.set(f'answer_for_question_{instance.question.id}', ques_ans, None)


@receiver(post_save, sender=Question)
def trigger_question_notifier(sender, instance, created, **kwargs):
    if created:
        sent_by = instance.user.id
        msg = f'{instance.user} asked a question. Be the first one to answer.'
        question_notifier.delay(sent_by, msg, instance.id)

        # update cache
        all_ques = Question.objects.all().order_by('-timestamp')
        ques_by_user = instance.user.questions.all().order_by('-timestamp')
        cache.set('all_questions', all_ques, None)
        cache.set(f'questions_by_{instance.user}', ques_by_user, None)
