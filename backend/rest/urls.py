from django.urls import path
from django.views.decorators.cache import cache_page

from . import views

urlpatterns = [
    path('count', cache_page(1200)(views.CountView.as_view())),
    path('fcmToken/<slug:username>', views.UserFCMTokenView.as_view()),
    path('people/<slug:username>', cache_page(3600)(views.PeopleView.as_view())),
    path('search/byName/<slug:name>', cache_page(600)(views.SearchByNameView.as_view())),
    path('search/byUsername/<slug:username>', cache_page(600)(views.SearchByUsernameView.as_view())),
    path('search/byQuestion/<slug:question>', cache_page(600)(views.SearchByQuestionView.as_view())),
    path('search/inSpecific/<slug:school>/<slug:search>', cache_page(600)(views.SearchInSpecificSchool.as_view())),
]
