from django.urls import path
from api.views import (
    HelloView,
    RegisterView,
    LoginView,
    MessageView,
    ProfileView
)

urlpatterns = [
    path("hello/", HelloView.as_view(), name="hello"),
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("messages/", MessageView.as_view(), name="messages"),
    path("profile/", ProfileView.as_view(), name="profile"),
]
