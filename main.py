from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from pydantic import BaseModel

# uvicorn main:app --reload --port 8001
app = FastAPI()


@app.get("/hello")
async def root():
    return {"message": "Hello World"}

@app.post('/login')
def login():
    pass

@app.post('/logout')
def logout():
    pass

@app.post('/save/')
def save():
    pass

@app.post('/validate/')
def validate():
    pass

@app.post('/publish')
def publish():
    # The sample app
    return {"success": True}


def in_whitelist(to_number):
    
    white_list = [
        "+16462461260",
        "+19178554229",
        "+15676741096",
        "+15033299390",
        "+19177277893",
        "+15516669363",
        "+15033299390"
    ]

    return to_number in white_list

@app.post('/journeybuilder/execute')
def execute(body: dict):
    print('hi')
    print(body)
    arguments = body['inArguments'][0]

    accountSid = arguments["accountSid"]
    authToken = arguments["authToken"]
    to = arguments["recipient_mobile"]
    messagingService = arguments["messagingService"]
    body = arguments["body"]

    #const client = require('twilio')(accountSid, authToken);

    if in_whitelist(to):
        print('do the twilio part here')
    # client.messages
    # .create({
    # body: body,
    #       messagingService: messagingService,
    # to: to,
    # from: '469335'
    # })
    # .then(message= > console.log(message.sid))
    # .done();
    # console.log("created the message");
    # }
    else:
        print(to, "not in whitelist")
        raise HTTPException(status_code=500, detail="recipient_mobile not in whitelist")



    # sample payload
    # {inArguments:
    #      [{accountSid: 'zzz',
    #        authToken: 'zzz',
    #        messagingService: 'zzz',
    #        body: 'Zeel test: appointment state changed for dev+davidball+recipient_emailzeelcom@zeel.com',
    #        eventDefinitionKey: 'APIEvent-78d88eca-20c6-3847-a332-16ee4e90fa2b',
    #        contact_key: 'dev+davidball+recipient_emailzeelcom@zeel.com',
    #        recipient_mobile: '+1zzz'}],
    #  outArguments: [],
    #  activityObjectID: 'zzz',
    #  journeyId: 'zzz',
    #  activityId: 'zzz',
    #  definitionInstanceId: 'zzz',
    #  activityInstanceId: 'zzz',
    #  keyValue: 'dev+davidball+recipient_emailzeelcom@zeel.com',
    #  mode: 0}

    return {"success":True}



app.mount("/", StaticFiles(directory="public", html = True), name="static")
