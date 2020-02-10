from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from channels.auth import AuthMiddlewareStack
from django.conf.urls import url
from website.consumers import GameplayConsumer
from website.consumers import PlayOnlineConsumer
from website.consumers import GenericConsumer

application = ProtocolTypeRouter({
    'websocket': AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter(
                [
                    url(r'^twoplayer/', GameplayConsumer),
                    url(r'^playonline/', PlayOnlineConsumer),
                    url(r'', GenericConsumer)
                ]
            )
        )
    )
})