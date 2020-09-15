import React, { useState, ChangeEvent } from 'react';
import './App.css';
import Editor from './components/Editor';
import List, { IItem } from './components/List';

function App() {

  if (localStorage.getItem('items') === null || localStorage.getItem('items') === '') {
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
    setFilteredItems(items);
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
    setFilteredItems(items);
  }

  const addNewNote = () => {
    let id = `f${(~~(Math.random() * 1e8)).toString(16)}`;
    setItems([{ id, title: 'Новая заметка', body: 'Текст заметки' }, ...items]);
    setActiveItem(id, { id, title: '', body: '' });
    setDisable(false);
    setFilteredItems(items);
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
    setFilteredItems(items);
    localStorage.setItem('items', JSON.stringify(newItems));
  }

  const handleSearchQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setItems(filterItems(filteredItems, event.target.value))
  }

  const filterItems = (filteredItems: IItem[], searchQuery: string) => {
    setSelectedItem(null);
    return filteredItems.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  const handleSortMethodChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if (sortMethod != event.target.value) {
      setItems(items.reverse())
      setSortMethod(event.target.value)
    }
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
        <div className='App__action'>
          <input onChange={handleSearchQueryChange} placeholder='Поиск...' />
          <div>
            <text>Сортировать по </text>
            <select onChange={handleSortMethodChange}>
              <option>убыванию даты</option>
              <option>возрастанию даты</option>
            </select>
          </div>
        </div>
        <List className='App__list' items={items} setItems={setItems} selectedItem={selectedItem} selectedItemChangeCallback={setActiveItem} removeItem={removeItem} setSelectedItem={setSelectedItem} />
        {selectedItem && <Editor title={title} titleChangedCallback={setActiveTitle} body={body} bodyChangedCallback={setActiveBody} id={selectedItem} disabled={disabled} disabledChangedCallback={enableEditor} removeItem={removeItem} />}
      </div>
    </div>
  )
}

export default App;