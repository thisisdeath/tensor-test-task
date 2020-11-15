import React, { MouseEvent } from 'react';
import './List/List.css';

export interface IItem {
    id: string;
    title: string;
    body: string;
    date: Date;
}

interface IProps {
    items: IItem[];
    selectedItem?: string | null;
    selectedItemChangeCallback?: (id: string) => void;
    className?: string;
    removeItem: (id: string) => void;
    setSelectedItem: (id: string | null) => void;
}

export default function List(props: IProps) {
    return (
        <ul className={`List ${props.className}`}>
            {props.items.map(item =>
                <li className={`List__item ${item.id === props.selectedItem ? 'List__item-selected' : ''}`} onClick={() => {
                    props.selectedItemChangeCallback && props.selectedItemChangeCallback(item.id)
                }}>
                    <div className='List__element__header'>
                        <div className='List__item__title'><b>{item.title}</b></div>
                        <div className='List__delete__item' onClick={(event: MouseEvent) => {
                            event.stopPropagation()

                            props.setSelectedItem(null)
                            props.removeItem(item.id)
                        }}>X</div>
                    </div>
                    <div className='List__item__body'>{item.body}</div>
                </li>
            )}
        </ul>
    )
}
