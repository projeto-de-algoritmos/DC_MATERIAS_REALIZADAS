import React, { useCallback, useEffect, useState, useRef } from 'react'

import caretUpFilled from '@iconify/icons-ant-design/caret-up-filled'
import caretDownFilled from '@iconify/icons-ant-design/caret-down-filled'
import closeCircleFilled from '@iconify/icons-ant-design/close-circle-filled'
import { Icon } from '@iconify/react'

import { sendHistory } from '../../utils/historyAPI'
import { sort } from '../../utils/sort'

import logoPNG from '../../assets/img/logo.png'
import pdfPNG from '../../assets/img/pdf.png'
import '../../assets/css/table.css'

const Home = () => {
  const dropArea = useRef()

  const [description, setDescription] = useState('')
  const [dropText, setDropText] = useState('')

  const [filter, setFilter] = useState('nome')
  const [disciplinas, setDisciplinas] = useState([])
  const [numDisciplinas, setNumDisciplinas] = useState(0)

  const [isModal, setIsModal] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const getHistoryResults = useCallback((file) => {
    let reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onerror = (error) => {
      console.log('Error: ', error)
    }

    reader.onload = async () => {
      const response = await sendHistory(reader.result)

      if (response.status === 200) {
        const disciplinas = response.body.materias
        const sorted = sort(disciplinas, filter)

        setDisciplinas(sorted)
        setNumDisciplinas(sorted.length)
        setIsLoaded(true)
        setDescription('Histórico carregado:')
      } else {
        alert('Erro com o backend.')
      }
    }
  }, [filter])

  const getHistoryExample = () => {
    const sorted = sort(null, filter)

    setDisciplinas(sorted)
    setNumDisciplinas(sorted.length)
    setIsLoaded(true)
    setDescription('Histórico carregado:')
  }

  const handleSort = (filter) => {
    const sorted = sort(disciplinas, filter)

    setFilter(filter)
    setDisciplinas(sorted)
    setNumDisciplinas(sorted.length)
  }

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()

    setDropText('Solte o documento aqui')
    setIsDragging(true)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      getHistoryResults(e.dataTransfer.files[0])
      e.dataTransfer.clearData()
    }

    setDropText('Arraste o documento aqui')
    setIsDragging(false)
  }, [getHistoryResults])

  useEffect(() => {
    const dropFile = dropArea.current

    if (dropFile) {
      dropFile.addEventListener('dragover', handleDrag)
      dropFile.addEventListener('drop', handleDrop)

      setDescription('Carregue seu histórico escolar do SIGAA:')
      setDropText('Arraste o documento aqui')
    }

    const modal = localStorage.getItem('modal') ? false : true
    setIsModal(modal)
  }, [handleDrag, handleDrop])

  return (
    <div className='container'>

      {/* header */}
      <div className='header'>
        <div className='nav'>
          <div className='logo'>
            <a href='/'>
              <img src={logoPNG} height={25} alt='logo' />
            </a>
          </div>
          <div className='menus'>
            <ul className='menu'>
              <li onClick={() => getHistoryExample('nome')}>Ver um exemplo</li>
              <li onClick={() => setIsModal(true)}>Sobre</li>
            </ul>
          </div>
        </div>
      </div>

      {/* page */}
      <div className={`page ${isLoaded}`}>
        <div className={`central ${isLoaded}`}>
          <div className='title'>
            <h1>Veja todas as disciplinas <br /> que você já cursou</h1>
          </div>
          <div className='description'>
            <h2>{description}</h2>
          </div>
          {!isLoaded ?
            <div className='upload-area'>
              <div className='method'>
                <input
                  type='file'
                  id='file-1'
                  className='inputfile inputfile-1'
                  accept='.pdf'
                  onChange={(e) => getHistoryResults(e.target.files[0])}
                />
                <label htmlFor='file-1'>
                  <span>Escolher</span>
                </label>
              </div>
              <h4>- OU -</h4>
              <div className='method'>
                <div ref={dropArea} className={`inputfile-2 ${isDragging}`}>
                  <img src={pdfPNG} height={65} alt='logo' />
                  <span>{dropText}</span>
                </div>
              </div>
            </div>
          :
            <div className='table'>
              <div className='row header'>
                <div className='cell'>
                  <button onClick={() => handleSort('nome')}>
                    Disciplinas ({numDisciplinas})
                    <Icon
                      icon={filter === 'nome' ? caretUpFilled : caretDownFilled}
                    />
                  </button>
                </div>
                <div className='cell'>
                  <button onClick={() => handleSort('periodo')}>
                    Período
                    <Icon
                      icon={filter === 'periodo' ? caretUpFilled : caretDownFilled}
                    />
                  </button>
                </div>
                <div className='cell'>
                  <button onClick={() => handleSort('mencao')}>
                    Menção
                    <Icon
                      icon={filter === 'mencao' ? caretUpFilled : caretDownFilled}
                    />
                  </button>
                </div>
              </div>
              {disciplinas.map((disciplina, index) => (
                <div key={index} className='row'>
                  <div className='cell' data-title='Disciplina'>
                    {disciplina.nome}
                  </div>
                  <div className='cell' data-title='Período'>
                    {disciplina.periodo}
                  </div>
                  <div className='cell' data-title='Menção'>
                    {disciplina.mencao}
                  </div>
                </div>
              ))}
            </div>
          }
          </div>
      </div>

      {/* modal */}
      <div className={`modal-overlay ${isModal}`}>
        <div className='modal'>
          <div className='modal-header'>
            <h5 className='modal-title'>Sobre</h5>
            <Icon
              icon={closeCircleFilled}
              style={{ color: '#fff', fontSize: '25px' }}
              onClick={() => {
                localStorage.setItem('modal', '1')
                setIsModal(false)
              }}
            />
          </div>
          <div className='modal-body'>
            <p>
              O MatériasRealizadas é apenas um projeto com o intuito de mostrar
              uma aplicação prática do algoritmo MergeSort (Dividir e 
              Conquistar). <br /><br />
              Seu histórico é salvo apenas localmente e <b>não é 
              compartilhado por ninguém</b>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
