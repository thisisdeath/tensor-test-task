import React, { ChangeEvent } from 'react'
import './Editor/Editor.css';

interface IProps {
    title: string;
    body: string;
    titleChangedCallback: (title: string) => void;
    bodyChangedCallback: (body: string) => void;
    disabledChangedCallback: () => void;
    disabled?: boolean;
    className?: string;
    removeButtonClickCallback: () => void;
}

export default function Editor(props: IProps) {
    return (
        <div className={`Editor ${props.className}`}>
            <div className='Editor__header'>
                <button className={`Editor__button ${props.disabled ? 'Editor__button-clickable' : ''}`} onClick={props.disabledChangedCallback} disabled={!props.disabled}>Редактировать</button>
                <button className='Editor__button Editor__button-clickable' onClick={() => props.removeButtonClickCallback()}>Удалить</button>
            </div>
            <input className='Editor__input Editor__title' value={props.title} onChange={(event: ChangeEvent<HTMLInputElement>) => { 
                props.titleChangedCallback(event.target.value) 
            }} disabled={props.disabled} placeholder='Название' /><br />
            <textarea className='Editor__input Editor__body' value={props.body} onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                props.bodyChangedCallback(event.target.value);
            }} disabled={props.disabled} placeholder='Текст' />
        </div>
    );
}