import React, { ChangeEvent } from 'react';
import './App.css';
import Editor from './components/Editor';
import List, { IItem } from './components/List';

type ISortMethod = 'убыванию даты' | 'возрастанию даты';

interface IState {
  title: string;
  body: string;
  disabled: boolean;
  selectedItem: string | null;
  items: IItem[];
  searchQuery: string;
  displayItems: IItem[];
  sortMethod: ISortMethod;
}

class App extends React.Component<{}, IState> {
  constructor(props: object) {
    super(props);

    if (localStorage.getItem('items') === null || localStorage.getItem('items') === '') {
      localStorage.setItem('items', '[]')
    }

    const items = [...JSON.parse(localStorage.getItem('items')!, (key, value) => {
      if (key === 'date') {
        return new Date(value);
      } else {
        return value;
      }
    })];

    this.state = {
      title: '',
      body: '',
      disabled: true,
      selectedItem: null,
      items,
      searchQuery: '',
      displayItems: items,
      sortMethod: 'убыванию даты'
    }
  }

  render() {
    return (
      <div className='App'>
        <header className='App__header'>
          <h1 className='App__heading'>
            Заметки
          </h1>
          <button className='App__addButton' onClick={this.addNewNote}> + </button>
        </header>
        <div className='App__body'>
          <div className='App__sidebar'>
            <div className='App__action'>
              <input className='App__searchbar' onChange={this.handleSearchQueryChangeCallback} placeholder='Поиск...' value={this.state.searchQuery}/>
              <div className='App__sortbar'>
                Сортировать по
                <select className='App__select' onChange={this.handleSortMethodChangeCallback}>
                  <option>убыванию даты</option>
                  <option>возрастанию даты</option>
                </select>
              </div>
            </div>
            <List className='App__list' items={this.state.displayItems} selectedItem={this.state.selectedItem} selectedItemChangeCallback={this.setActiveItem} removeItem={this.removeItem} setSelectedItem={(id) => this.setState({selectedItem: id})} />
          </div>
          {this.state.selectedItem && <Editor className='App__editor' title={this.state.title} titleChangedCallback={this.setActiveTitle} body={this.state.body} bodyChangedCallback={this.setActiveBody} disabled={this.state.disabled} disabledChangedCallback={this.enableEditor} removeButtonClickCallback={this.removeButtonClickCallback} />}
        </div>
      </div>
    )
  }

  setActiveItem = (id: string, newItem?: IItem) => {
    const item = this.state.items.find(item => item.id === id) || newItem || { title: '', body: '' };

    this.setState({
      selectedItem: id,
      title: item.title,
      body: item.body,
      disabled: true
    });
  }

  setActiveTitle = (title: string) => {
    const items = this.state.items.map(item => {
      if (item.id === this.state.selectedItem) {
        return { id: item.id, title, body: item.body, date: item.date }
      } else {
        return item
      }
    });

    this.setState({
      title,
      items,
      displayItems: items
    });

    saveChanges(items);
  }

  setActiveBody = (body: string) => {
    const items = this.state.items.map(item => {
      if (item.id === this.state.selectedItem) {
        return { id: item.id, title: item.title, body, date: item.date }
      } else {
        return item
      }
    });

    this.setState({
      body,
      items,
      displayItems: items
    });

    saveChanges(items);
  }

  addNewNote = () => {
    const id = `f${(~~(Math.random() * 1e8)).toString(16)}`;
    const newDate = new Date();
    const items = [{ id, title: 'Новая заметка', body: 'Текст заметки', date: newDate }, ...this.state.items];

    this.setActiveItem(id, { id, title: '', body: '', date: newDate });

    this.setState({
      items,
      disabled: false,
      displayItems: [...items]
    });

    if (this.state.searchQuery) {
      this.handleSearchQueryChange('', items);
    }

    saveChanges(items);
  }

  enableEditor = () => {
    this.setState({
      disabled: false
    });
  }

  removeButtonClickCallback = () => {
    this.removeItem(this.state.selectedItem as string);
  }

  removeItem = (id: string) => {
    const newItems = (this.state.items.filter((item: IItem) =>
      item.id !== id
    ));

    this.setState({
      items: newItems
    });

    const displayItems = this.handleSearchQueryChange(this.state.searchQuery, newItems);
    this.handleSortMethodChange(this.state.sortMethod, displayItems);

    saveChanges(newItems);
  }

  handleSearchQueryChangeCallback = (event: ChangeEvent<HTMLInputElement>) => {
    this.handleSearchQueryChange(event.target.value, this.state.items);
  }

  handleSearchQueryChange = (searchQuery: string, newItems: IItem[]) => {
    const items = App.filterItems(newItems, searchQuery);

    this.setState({
      searchQuery,
      displayItems: items,
      selectedItem: null
    });

    return items;
  }

  static filterItems(filteredItems: IItem[], searchQuery: string) {
    return filteredItems.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  handleSortMethodChangeCallback = (event: ChangeEvent<HTMLSelectElement>) => {
    this.handleSortMethodChange(event.target.value as ISortMethod, this.state.displayItems);
  }

  handleSortMethodChange = (sortMethod: ISortMethod, newItems: IItem[]) => {
    if (this.state.sortMethod !== sortMethod) {
      if (sortMethod === 'убыванию даты') {
        newItems.sort((a, b) => Number(b.date) - Number(a.date));
      } else {
        newItems.sort((a, b) => Number(a.date) - Number(b.date));
      }

      this.setState({
        displayItems: newItems.sort(),
        sortMethod 
      });
    }
  }
}

function saveChanges(items: IItem[]) {
  localStorage.setItem('items', JSON.stringify(items));
}

export default App;