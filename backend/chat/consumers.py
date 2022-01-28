import json

from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model

from . import db_funcs

User = get_user_model()


class Consumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.username = self.scope['url_route']['kwargs']['username']
        await self.channel_layer.group_add(self.username, self.channel_name)
        await self.accept()
        await db_funcs.set_live_status(self.username, is_online=True)

    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.username, self.channel_name)
        await db_funcs.set_live_status(self.username, is_online=False)

    async def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        types = {
            'new_chat': self.save_new_chat,
            'get_chats': self.get_chats,
            'get_contacts': self.get_contacts,
            'get_notifications': self.get_notifications,
            'read_notif': self.read_notif,
        }
        await types[data['type']](data)

    async def new_chat(self, event):
        await self.send(text_data=json.dumps(event))

    async def new_notif(self, event):
        await self.send(text_data=json.dumps(event))

    async def new_contact(self, event):
        await self.send(text_data=json.dumps(event))

    async def user_live_status(self, event):
        await self.send(text_data=json.dumps(event))

    async def get_chats(self, data):
        chats = await db_funcs.get_chats_in_group(data['group'])
        await self.send(text_data=json.dumps({'type': 'get_chats', 'chats': chats}))

    async def get_contacts(self, data):
        contacts = await db_funcs.get_contacts_for_user(self.username)
        await self.send(text_data=json.dumps({'type': 'get_contacts', 'contacts': contacts}))

    async def get_notifications(self, data):
        notifs = await db_funcs.get_notifs_for_user(self.username)
        await self.send(text_data=json.dumps({'type': 'get_notifications', 'notifs': notifs}))

    async def save_new_chat(self, data):
        del data['type']
        chat = await db_funcs.create_chat(**data)
        users = await db_funcs.get_contacts_in_group(chat['group'])
        for user in users:
            await self.channel_layer.group_send(f'{user}', {'type': 'new_chat', 'chat': chat})

    async def read_notif(self, data):
        await db_funcs.mark_notif_read(data['id'])
