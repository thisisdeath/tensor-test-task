import React, { useState } from 'react';
import './App.css';
import Editor from './components/Editor';
import List, { IItem } from './components/List';

function App() {
  if (localStorage.getItem('items') === '') {
    localStorage.setItem('items', '[]')
  }
  
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [disabled, setDisable] = useState(true);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [items, setItems] = useState([...JSON.parse(localStorage.getItem('items')!)]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([...JSON.parse(localStorage.getItem('items')!)]);
  const [sortMethod, setSortMethod] = useState('убыванию даты');

  const setActiveItem = (id: string, newItem?: IItem) => {
    setSelectedItem(id);
    let item = items.find(item => item.id === id) || newItem || { title: '', body: '' };
    setTitle(item.title);
    setBody(item.body);
    setDisable(true);
    localStorage.setItem('items', JSON.stringify(items));
  }

  const setActiveTitle = (title: string) => {
    setTitle(title);
    setItems(items.map(item => {
      if (item.id === selectedItem) {
        return { id: item.id, title, body: item.body }
      } else {
        return item
      }
    }))
  }

  const setActiveBody = (body: string) => {
    setBody(body);
    setItems(items.map(item => {
      if (item.id === selectedItem) {
        return { id: item.id, title: item.title, body }
      } else {
        return item
      }
    }))
  }

  const addNewNote = () => {
    let id = `f${(~~(Math.random() * 1e8)).toString(16)}`;
    setItems([{ id, title: 'Новая заметка', body: 'Текст заметки' }, ...items]);
    setActiveItem(id, { id, title: '', body: '' });
    setDisable(false);
    localStorage.setItem('items', JSON.stringify(items));
  }

  const enableEditor = () => {
    setDisable(false);
  }

  const removeItem = (id: string) => {
    let newItems = (items.filter((item: IItem) =>
      item.id !== id
    ))
    setItems(newItems)
    setFilteredItems(newItems)
    setSelectedItem(null)
    localStorage.setItem('items', JSON.stringify(newItems));
  }

  return (
    <div className='App'>
      <header className='App__header'>
        <h1 className='App__heading'>
          Заметки
        </h1>
        <button className='App__addButton' onClick={addNewNote}> + </button>
      </header>
      <div className='App__body'>
        <List className='App__list' items={items} setItems={setItems} selectedItem={selectedItem} selectedItemChangeCallback={setActiveItem} searchQuery={searchQuery} setSearchQuery={setSearchQuery} filteredItems={filteredItems} setFilteredItems={setFilteredItems} sortMethod={sortMethod} setSortMethod={setSortMethod} removeItem={removeItem} setSelectedItem={setSelectedItem} />
        {selectedItem && <Editor title={title} titleChangedCallback={setActiveTitle} body={body} bodyChangedCallback={setActiveBody} id={selectedItem} disabled={disabled} disabledChangedCallback={enableEditor} removeItem={removeItem} />}
      </div>
    </div>
  )
}

export default App;