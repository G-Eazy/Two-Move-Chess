import json
import asyncio
from channels.consumer import SyncConsumer
from channels.exceptions import StopConsumer

class GameplayConsumer(SyncConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def websocket_connect(self, event):
        
        self.username = str(self.scope["user"])
        print(f"Gameplay connect: {self.username}", flush=True)

        if self.username != 'AnonymousUser':
            connections.add_gameplay_connection(self)

        self.send({
            "type":"websocket.accept"
        })
       

    def websocket_receive(self, event):
        data = event.get("text", None)
        if data is not None:
            dict_data = json.loads(data)
            print(f"Gameplay receive: {dict_data}", flush=True)

    
    def websocket_disconnect(self, event):
        print(f"Gameplay disconnect: {self.username}", flush=True)

        if self.username != 'AnonymousUser':
            connections.remove_gameplay_connection(self)

        raise StopConsumer

class PlayOnlineConsumer(SyncConsumer):
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def websocket_connect(self, event):
        
        self.username = str(self.scope["user"])
        print(f"PlayOnline connect: {self.username}", flush=True)

        if self.username != 'AnonymousUser':
            connections.add_playonline_connection(self)
            self.send({
                "type":"websocket.accept"
            })

      
    def websocket_receive(self, event):
        data = event.get("text", None)
        if data is not None:
            dict_data = json.loads(data)
            print(f"PlayOnline receive got {dict_data}", flush=True)
            if dict_data["request_type"] == 'challenge':
                connections.add_challenge(self.username, dict_data["starttime"], dict_data["increment"])
            elif dict_data["request_type"] == 'get_challenges':
                connections.sendChallenges(self)

    
    def websocket_disconnect(self, event):
        print(f"PlayOnline disconnect: {self.username}", flush=True)

        if self.username != 'AnonymousUser':
            connections.remove_playonline_connection(self)

        raise StopConsumer

class GenericConsumer(SyncConsumer):
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def websocket_connect(self, event):
        
        self.username = str(self.scope["user"])
        print(f"Generic connect: {self.username}", flush=True)

        if self.username != 'AnonymousUser':
            connections.add_generic_connection(self)

        self.send({
            "type":"websocket.accept"
        })
       

    def websocket_receive(self, event):
        data = event.get("text", None)
        if data is not None:
            dict_data = json.loads(data)
            print(f"Generic receive {dict_data}", flush=True)

    
    def websocket_disconnect(self, event):
        print(f"Generic disconnect: {self.username}", flush=True)

        if self.username != 'AnonymousUser':
            connections.remove_generic_connection(self)

        raise StopConsumer

class Connections:

    def __init__(self):
        self.gameplay_conns = {}
        self.playonline_conns = {}
        self.generic_conns = {}
        self.challenges = {}

    def add_gameplay_connection(self, consumer):
        self.gameplay_conns[consumer.username] = consumer

    def add_playonline_connection(self, consumer):
        self.playonline_conns[consumer.username] = consumer

    def add_generic_connection(self, consumer):
        self.generic_conns[consumer.username] = consumer

    def add_challenge(self, username, starttime, increment):
        
        try:
            starttime = int(starttime)
            increment = int(increment)

            if starttime < 1 or starttime > 300:
                self.playonline_conns[username].send({
                    "type": "websocket.send",
                    "text": json.dumps({
                        "type" : "error", 
                        "text" : "The starttime has to be between 1 and 300 minutes"
                    })
                })
                return
            if increment < 0 or increment > 300:
                self.playonline_conns[username].send({
                    "type": "websocket.send",
                    "text": json.dumps({
                        "type" : "error", 
                        "text" : "The increment has to be between 0 and 300 seconds"
                    })
                })
                return

        except ValueError:
            if username in self.playonline_conns:
                self.playonline_conns[username].send({
                    "type": "websocket.send",
                    "text": json.dumps({
                        "type" : "error", 
                        "text" : "The starttime and the increments have to be integers"
                    })
                })
                return
        
        self.challenges[username] = {"starttime": starttime, "increment": increment}

        for user in self.playonline_conns.values():
            self.sendChallenges(user)

        self.playonline_conns[username].send({
            "type": "websocket.send",
            "text": json.dumps({
                "type": "message", 
                "text": "Challenge successfully created!"
            })
        })

    # user: user, not key
    def sendChallenges(self, user):
        user.send({
                "type": "websocket.send",
                "text": json.dumps({
                    "type": "challenge",
                    "challenges": self.challenges
                })
        })

    def remove_gameplay_connection(self, consumer):
        del self.gameplay_conns[consumer.username]

    def remove_playonline_connection(self, consumer):
        del self.playonline_conns[consumer.username]

    def remove_generic_connection(self, consumer):
        del self.generic_conns[consumer.username]


    

connections = Connections()