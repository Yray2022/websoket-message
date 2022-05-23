import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import "./App.css"

const WebSock = () => {

    const [message, setMessage] = useState([])
    const [value, setValue] = useState('')
    const socket = useRef()
    const [connected, setConnected] = useState(false)
    const [username, setUsername] = useState('')


    function connect() {
        socket.current = new WebSocket('ws://localhost:5000')

        socket.current.onopen = () => {
            setConnected(true)
            const message = {
                event: 'connection',
                username,
                id: Date.now()
            }
            socket.current.send(JSON.stringify(message))
        }
        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data)
            setMessage(prev => [message, ...prev])
        }
        socket.current.onclose = () => {
            console.log('Socket закрит')
        }
        socket.current.onerror = () => {
            console.log('Socket произошла ошибка')
        }  
    }

    const sendMessage = async() => {
       const message = {
           username,
           message: value,
           id: Date.now(),
           event: 'message'
       }
       socket.current.send(JSON.stringify(message))
       setValue('')
    }

    if (!connected) {
        return (
            <div className="center">
                <div className="form">
                    <input  
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    type="text" 
                    placeholder="Ваше имя"/>
                    <button onClick={connect}>
                        Войти
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className="center">
                <div className="form">
                    <input 
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    type="text"
                    placeholder="Собщение"
                    />
                    <button onClick={sendMessage}>
                        Отправить
                    </button>
                </div>
                </div>
                <div className="messages">
                    {message.map(mess => 
                        <div key={mess.id}>
                            {mess.event === 'connection'
                            ? <div className="connection__mesage">Пользователь {mess.username} подключился</div>
                            : <div className="message">{mess.username}. {mess.message}</div>
                            }
                        </div>    
                    )}
                </div>
        </div>
        
        
    )
}


export default WebSock 