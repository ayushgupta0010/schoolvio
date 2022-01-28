from django.contrib import admin

from .models import Post, Like


class PostAdmin(admin.ModelAdmin):
    list_display = ['user', 'description', 'timestamp']


class LikeAdmin(admin.ModelAdmin):
    list_display = ['user', 'post', 'timestamp']


admin.site.register(Post, PostAdmin)
admin.site.register(Like, LikeAdmin)
