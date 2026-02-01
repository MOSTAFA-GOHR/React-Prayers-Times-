import MainContent from './components/MainContent'
import './App.css'
import Container from '@mui/material/Container';
import { useState } from 'react';
function App() {
  const [direction,setDirection] =useState("")
  function changeLanguage(lang){
    setDirection(lang)
  }
  return (
    <div className='App' dir={direction === "ar"?'rtl':'ltr' }>
      <Container maxWidth="lg">
          <MainContent changeDirection={changeLanguage} />
      </Container>
    </div>
  )
}

export default App
