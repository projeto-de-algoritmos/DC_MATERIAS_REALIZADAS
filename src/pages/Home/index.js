import React, { useState } from 'react'

import logoPNG from '../../assets/img/logo.png'
import pdfPNG from '../../assets/img/pdf.png'

import { loadFile } from '../../utils/loadFile'

import '../../assets/css/table.css'

const Home = () => {
  const [file, setFile] = useState('')

  const getBase64 = (e) => {
    var file = e.target.files[0]

    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      console.log(loadFile(reader.result.split(',')[1]))
      // setFile(reader.result)
      console.log(reader.result)
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    }
  }

  return (
    <div className='container'>
      {/* header */}
      <div className='header'>
        <div className='nav'>
          <div className='logo'>
            <img src={logoPNG} height={25} alt="logo" />
          </div>
          <div className='menus'>
            <ul className='menu'>
              <li>Ver um exemplo</li>
              <li>Sobre</li>
            </ul>
          </div>
        </div>
      </div>
      {/* page */}
      <div className='page'>
        <div className='central'>
          <div className='title'>
            <h1>Veja todas as disciplinas <br /> que você já cursou</h1>
          </div>
          <div className='description'>
            <h2>Carregue seu histórico escolar do SIGAA</h2>
          </div>
          <div className='upload-area'>
            <div className='method'>
              <input type="file" id="file-1" className="inputfile inputfile-1" accept='.pdf' onChange={getBase64} />
              <label htmlFor="file-1">
                {/*<svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17">
                  <path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z">
                  </path>
                </svg>*/}
                <span>Escolher</span>
              </label>
            </div>
            <h4>- OU -</h4>
            <div className='method'>
              <input type="file" id="file-2" className="inputfile inputfile-2" accept='.pdf' onChange={getBase64} />
              <label id='dropFile' htmlFor="file-2">
                <img src={pdfPNG} height={65} alt="logo" />
                <span>Arraste o documento aqui</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home