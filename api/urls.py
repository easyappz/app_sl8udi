from django.urls import path
from api.views import (
    HelloView,
    RegisterView,
    LoginView,
    MessageListView,
    MessageCreateView,
    ProfileView
)

urlpatterns = [
    path("hello/", HelloView.as_view(), name="hello"),
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("messages/", MessageListView.as_view(), name="messages-list"),
    path("messages/", MessageCreateView.as_view(), name="messages-create"),
    path("profile/", ProfileView.as_view(), name="profile"),
]
