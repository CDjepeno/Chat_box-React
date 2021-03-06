import React, { useEffect, useRef, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import './App.css';
import './animations.css'
import Form from './pages/Form';
import Message from './component/Message';
import FirebaseService from './services/FirebaseAPI';
import {CSSTransition, TransitionGroup} from 'react-transition-group'


type Params = {
  pseudo: string;
}

export interface MessageType {
  msg: {
    message: string
    pseudo: string
  }
}


const App: React.FC<RouteComponentProps<Params>> = ({match}) => {
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState<any>([])
	const [length, setLength] = useState(140);
	let Messages;

	const elementPosition = useRef<HTMLInputElement>(null);
	
	const addMessage = (Message: any) => {
		const msg: any = {...messages};

		msg[`message-${Date.now()}`] = Message

		setMessages(msg)
	}

	const handleChange = (e: any) => {
		const {value} = e.target; 
		const lengthR = 140 - value.length
		setLength(lengthR)
		setMessage(value)
	}
  
	const FetchMessages = async() => {
		const data: any = await FirebaseService.getMessages();
		setMessages(data)
	}

	useEffect(() => {
		FetchMessages();
	},[])

	const createMessage = (message: string) => {
		const pseudo = match.params.pseudo;
		const createM = {
		message: message,
		pseudo: pseudo
		}

		addMessage(createM)  
		FirebaseService.postMessage(createM)
		setMessage(" ")
		setLength(140)
	}

	const handleSubmit = (e: any) => {
		e.preventDefault();
		createMessage(message);
	}

	const isUser = (pseudo: string) => {
		return pseudo === match.params.pseudo		
	}

	if(messages){
		Messages  = Object.keys(messages).map(key => {
			return (
				<CSSTransition 
					key={key}
					timeout={200} 
					classNames='fade'
				>
					<Message 
						isUser={isUser} 
						message={messages[key]} 
						pseudo={messages[key]} 
					/>
				</CSSTransition>
			)
		})
	}

	useEffect(() => {
		const ref = elementPosition.current;
		
		if(ref)
		ref.scrollTop = ref.scrollHeight;

	},[message])
	
	return (
		<div className="box">
		<div>
			<div className="messages" ref={elementPosition}>
			{Messages  && 
			<TransitionGroup className="message">
				{Messages}
			</TransitionGroup>
			}
			</div>
		</div>
		<Form 
			handleSubmit={handleSubmit} 
			handleChange={handleChange}
			message={message} 
			length={length}
		/>
		</div>
	);
}

export default App;
