import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ChatBot from './Chatbot';
import RoutesOfThePage from './components/routes';

function App() {
  return (
    <>
    <RoutesOfThePage />
    <ChatBot />
    </>
  );
}

export default App;
