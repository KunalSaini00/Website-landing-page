class Connection{
    constructor(HOSTNAME="ws://localhost"){
        if(!HOSTNAME){
            throw new Error("Error DB0: The Provided HOSTNAME is invalid or null\n");
        }
        if(!HOSTNAME.toLowerCase().startsWith("ws")){
            throw new Error("Error DB2: Hostname *MUST* start with \"ws\" or \"wss\"\n");
        }

        // Protocol Values
        this.PROTOCOL={
            SIGNUP:0,
            EXISTS:1,
            LOGIN:2,
            DELETE:3,
            STORE:4,
            DLDATA:5,
            GETDATA:6,
            BYPASS:7,
        }

        this._CallbackQueueId=[
            ()=>{},
            ()=>{},
            ()=>{},
            ()=>{},
            ()=>{},
            ()=>{},
            ()=>{},
            ()=>{}
        ];

        this._ws=new WebSocket(HOSTNAME);
        this.connectionState=this._ws.readyState;
        this.connectionLog="We Are Still Connecting to server...";
        setInterval(()=>{
            this.connectionState=this._ws.readyState;
            this.connectionLog=(this.connectionState==0?"We Are Still Connecting to server...":(this.connectionState==1?"Connected to Server":(this.connectionState==2?"Could not connect to server...":"Error: the server is not opened or has been closed already")));
        });

        this._ws.addEventListener("open",()=>{
            this.onConnection(this._ws);
            this._ws.addEventListener("message",e=>{
                const data=JSON.parse(e.data);
                this.onMessage(data);
                if(data.PROTOCOL===this.PROTOCOL.SIGNUP)this._CallbackQueueId[0](data);
                if(data.PROTOCOL===this.PROTOCOL.EXISTS)this._CallbackQueueId[1](data);
                if(data.PROTOCOL===this.PROTOCOL.LOGIN)this._CallbackQueueId[2](data);
                if(data.PROTOCOL===this.PROTOCOL.DELETE)this._CallbackQueueId[3](data);
                if(data.PROTOCOL===this.PROTOCOL.STORE)this._CallbackQueueId[4](data);
                if(data.PROTOCOL===this.PROTOCOL.DLDATA)this._CallbackQueueId[5](data);
                if(data.PROTOCOL===this.PROTOCOL.GETDATA)this._CallbackQueueId[6](data);
                if(data.PROTOCOL===this.PROTOCOL.BYPASS)this._CallbackQueueId[7](data);
            });
        });

        setInterval(()=>{
            if(this.connectionState>2){
                // location.href="/reboot.html"
            }
        });
    }

    onConnection(websocket){
        // Empty function intended for use outside this API
        // Function gets called when the websocket connects to the server
    }

    onMessage(message){
        // Empty function intended for use outside this API
        // Function get called when a message is received from the server
    }

    SendProtocol(protocol){
        this._ws.send(this.CreateProtocol(protocol));
    }

    Signup(USERNAME, PASSWORD, CALLBACK){
        if(this._ws.readyState!=1){
            alert(this.connectionLog);
        }

        this._ws.send(this.CreateProtocol({
            PROTOCOL:this.PROTOCOL.SIGNUP,
            USERNAME:USERNAME,
            PASSWORD:PASSWORD
        }));

        this._AddCallback(this.PROTOCOL.SIGNUP, CALLBACK);
    }

    Login(USERNAME, PASSWORD, CALLBACK){
        window.localStorage.setItem("COOKIE", this._GetRNGString());
        if(this._ws.readyState!=1){
            alert(this.connectionLog);
        }

        this._ws.send(this.CreateProtocol({
            PROTOCOL:this.PROTOCOL.LOGIN,
            USERNAME:USERNAME,
            PASSWORD:PASSWORD,
            COOKIE:window.localStorage.getItem("COOKIE")
        }));

        this._AddCallback(this.PROTOCOL.LOGIN, CALLBACK);
    }

    LoginBypass(USERNAME, CALLBACK){
        if(this._ws.readyState!=1){
            alert(this.connectionLog);
        }

        this._ws.send(this.CreateProtocol({
            PROTOCOL:this.PROTOCOL.BYPASS,
            USERNAME:USERNAME,
            COOKIE:window.localStorage.getItem("COOKIE") 
        }));

        this._AddCallback(this.PROTOCOL.BYPASS, CALLBACK);
    }

    DeleteAccount(USERNAME, PASSWORD, CALLBACK){
        if(this._ws.readyState!=1){
            alert(this.connectionLog);;
        }

        this._ws.send(this.CreateProtocol({
            PROTOCOL:this.PROTOCOL.DELETE,
            USERNAME:USERNAME,
            PASSWORD:PASSWORD,
        }));

        this._AddCallback(this.PROTOCOL.DELETE, CALLBACK);
    }

    Exists(USERNAME, CALLBACK){
        if(this._ws.readyState!=1){
            alert(this.connectionLog);;
        }

        this._ws.send(this.CreateProtocol({
            PROTOCOL:this.PROTOCOL.EXISTS,
            USERNAME:USERNAME,
        }));

        this._AddCallback(this.PROTOCOL.EXISTS, CALLBACK);
    }

    StoreData(USERNAME, DATA, CALLBACK){
        if(this._ws.readyState!=1){
            alert(this.connectionLog);;
        }

        this._ws.send(this.CreateProtocol({
            PROTOCOL:this.PROTOCOL.STORE,
            USERNAME:USERNAME,
            COOKIE:window.localStorage.getItem("COOKIE"),
            DATA:DATA,
        }));

        this._AddCallback(this.PROTOCOL.STORE, CALLBACK);
    }

    DeleteData(USERNAME, PASSWORD, CALLBACK){
        if(this._ws.readyState!=1){
            alert(this.connectionLog);;
        }

        this._ws.send(this.CreateProtocol({
            PROTOCOL:this.PROTOCOL.DLDATA,
            USERNAME:USERNAME,
            PASSWORD:PASSWORD,
        }));

        this._AddCallback(this.PROTOCOL.DLDATA, CALLBACK);
    }

    GetData(USERNAME, CALLBACK){
        if(this._ws.readyState!=1){
            alert(this.connectionLog);;
        }

        this._ws.send(this.CreateProtocol({
            PROTOCOL:this.PROTOCOL.GETDATA,
            USERNAME:USERNAME,
            COOKIE:window.localStorage.getItem("COOKIE"),
        }));

        this._AddCallback(this.PROTOCOL.GETDATA, CALLBACK);
    }

    _AddCallback(TYPE, CALLBACK){
        this._CallbackQueueId[TYPE]=CALLBACK;
    }

    CreateProtocol(Data={}){
        return JSON.stringify(Data);
    }

    _GetRNGString(){
        const letters="qwertyuioplkjhgfdsazxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM=";
        let c="";
        for(let i=0;i<100;i++){
            c+=letters[Math.floor(Math.random()*letters.length)];
        }

        return c;
    }
}