from rest_framework import serializers

from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

    def to_representation(self, instance):
        rep = super(NotificationSerializer, self).to_representation(instance)
        rep['photo'] = instance.sender.photo
        rep['sender'] = instance.sender.username
        return rep
