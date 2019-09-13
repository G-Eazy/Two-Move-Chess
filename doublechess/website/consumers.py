import json
import asyncio
from channels.consumer import AsyncConsumer

class ChessConsumer(AsyncConsumer):
    async def websocket_connect(self, event):
        print("connected", event, flush=True)
        print(self.scope["user"], flush=True)
        await self.send({
            "type":"websocket.accept"
        })

        await asyncio.sleep(2)
        await self.send({
            "type": "websocket.send",
            "text": "jajaja"
        })

    async def websocket_receive(self, event):
        print("receive", event, flush=True)
    
    async def websocket_disconnect(self, event):
        print("disconnected", event, flush=True)

