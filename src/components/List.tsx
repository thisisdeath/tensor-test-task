import React, { ChangeEvent } from 'react';
import './List/List.css';

export interface IItem {
    id: string;
    title: string;
    body: string;
}

interface IProps {
    items: IItem[];
    setItems: (items: IItem[]) => void;
    selectedItem?: string | null;
    selectedItemChangeCallback?: (id: string) => void;
    className?: string;
    searchQuery: string;
    setSearchQuery: (searchQuery: string) => void;
    filteredItems: IItem[];
    setFilteredItems: (items: IItem[]) => void;
    sortMethod: string;
    setSortMethod: (sortMethod: string) => void;
    removeItem: (id: string) => void;
    setSelectedItem: (id: string | null) => void;
}

export default class List extends React.Component<IProps> {

    render() {
        return (
            <ul className={`List ${this.props.className}`}>
                <div className='List__Header'>
                    <input onChange={this.handleSearchQueryChange} placeholder='Поиск...' />
                    <div>
                        <text>Сортировать по </text>
                        <select onChange={this.handleSortMethodChange}>
                            <option>убыванию даты</option>
                            <option>возрастанию даты</option>
                        </select>
                    </div>
                </div>
                {this.props.sortMethod === 'убыванию даты'
                    ? this.props.searchQuery
                        ? this.props.filteredItems.map(item =>
                            <li className={`List__item ${item.id === this.props.selectedItem ? 'List__item-selected' : ''}`} onClick={() => this.selectItem(item.id)}>
                                <div className='List__item__title'>
                                    <b>{item.title}</b>
                                    <button className='List__delete__item' onClick={() => {
                                        this.props.setSelectedItem(null)
                                        this.props.removeItem(item.id)
                                    }}>X</button>
                                </div>
                                <div className='List__item__body'>{item.body}</div>
                            </li>
                        ) : this.props.items.map(item =>
                            <li className={`List__item ${item.id === this.props.selectedItem ? 'List__item-selected' : ''}`} onClick={() => this.selectItem(item.id)}>
                                <div className='List__element__header'>
                                    <div className='List__item__title'><b>{item.title}</b></div>
                                    <button className='List__delete__item' onClick={() => {
                                        this.props.setSelectedItem(null)
                                        this.props.removeItem(item.id)
                                    }}>X</button>
                                </div>
                                <div className='List__item__body'>{item.body}</div>
                            </li>
                        ) : this.props.searchQuery
                        ? this.props.filteredItems.map(item =>
                            <li className={`List__item ${item.id === this.props.selectedItem ? 'List__item-selected' : ''}`} onClick={() => this.selectItem(item.id)}>
                                <div className='List__item__title'>
                                    <b>{item.title}</b>
                                    <button className='List__delete__item' onClick={() => {
                                        this.props.setSelectedItem(null)
                                        this.props.removeItem(item.id)
                                    }}>X</button>
                                </div>
                                <div className='List__item__body'>{item.body}</div>
                            </li>
                        ).reverse() : this.props.items.map(item =>
                            <li className={`List__item ${item.id === this.props.selectedItem ? 'List__item-selected' : ''}`} onClick={() => this.selectItem(item.id)}>
                                <div className='List__item__title'>
                                    <b>{item.title}</b>
                                    <button className='List__delete__item' onClick={() => {
                                        this.props.setSelectedItem(null)
                                        this.props.removeItem(item.id)
                                    }}>X</button>
                                </div>
                                <div className='List__item__body'>{item.body}</div>
                            </li>
                        ).reverse()}
            </ul>
        )
    }
    selectItem(id: string) {
        this.props.selectedItemChangeCallback && this.props.selectedItemChangeCallback(id);
    }
    handleSearchQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.props.setSearchQuery(event.target.value);
        this.props.setFilteredItems(this.filterItems(this.props.items, event.target.value))
    }
    filterItems(items: IItem[], searchQuery: string) {
        this.props.setSelectedItem(null);
        return items.filter(item =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }
    handleSortMethodChange = (event: ChangeEvent<HTMLSelectElement>) => {
        this.props.setSortMethod(event.target.value)
    }
}
