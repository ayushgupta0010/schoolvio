from celery import shared_task
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from graphql_auth.constants import TokenAction
from graphql_auth.exceptions import UserAlreadyVerified
from graphql_auth.utils import get_token

from core.settings import GRAPHQL_AUTH, DEFAULT_FROM_EMAIL
from notification.models import Notification
from notification.tasks import send_notif, send_push_notification

User = get_user_model()

token_actions = {
    'send_activation_email': TokenAction.ACTIVATION,
    'resend_activation_email': TokenAction.ACTIVATION,
    'send_password_reset_email': TokenAction.PASSWORD_RESET,
}

templates = {
    'send_activation_email': 'email/activation_email.html',
    'resend_activation_email': 'email/activation_email.html',
    'send_password_reset_email': 'email/password_reset_email.html',
}

subjects = {
    'send_activation_email': 'Please activate your account',
    'resend_activation_email': 'Please activate your account',
    'send_password_reset_email': 'Reset your password',
}


@shared_task
def follow_notifier(sender_id, recipient_id, msg, username, is_online, token):
    notif = Notification.objects.create(
        sender_id=sender_id,
        recipient_id=recipient_id,
        message=msg,
        notifUrl=f'/profile/{username}'
    )
    send_notif(notif) if is_online else send_push_notification.delay([token], 'New Follower', msg)
    return 'Done'


@shared_task
def graphql_auth_async_email(func, args):
    info = args[0]
    func_str = str(func)
    username = func_str[func_str.find(':') + 2:func_str.find('-') - 1]
    user = User.objects.get(username=username)
    mail_func = 'send_activation_email'

    if 'resend_activation_email' in func_str:
        if user.status.verified:
            raise UserAlreadyVerified
        mail_func = 'resend_activation_email'
    elif 'send_password_reset_email' in func_str:
        mail_func = 'send_password_reset_email'

    token = get_token(user, token_actions[mail_func])
    email_context = {
        'token': token,
        'username': user.username,
        **GRAPHQL_AUTH['EMAIL_TEMPLATE_VARIABLES']
    }
    recipient_list = args[1] if len(args) > 1 else [user.email]
    mailer.delay(email_context, recipient_list, templates[mail_func], subjects[mail_func])


@shared_task
def mailer(email_context, recipient_list, template, subject):
    html_message = render_to_string(template, email_context)
    message = strip_tags(html_message)
    send_mail(
        subject=subject,
        from_email=DEFAULT_FROM_EMAIL,
        message=message,
        html_message=html_message,
        recipient_list=recipient_list,
        fail_silently=False,
    )
