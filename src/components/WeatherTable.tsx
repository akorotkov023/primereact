import React, {useEffect, useState} from 'react';
import { useGetWeatherEntriesQuery, useDeleteWeatherEntryMutation } from '../api/weatherApi';
import { useGetUsersQuery } from '../api/weatherApi';
import { useAddWeatherEntryMutation } from '../api/weatherApi';

import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

const WeatherTable: React.FC = () => {
    const { data: weatherEntries = [], error, isLoading, refetch } = useGetWeatherEntriesQuery();
    const { data: users = [] } = useGetUsersQuery();
    const [deleteWeatherEntry] = useDeleteWeatherEntryMutation();
    const [addWeatherEntry] = useAddWeatherEntryMutation();
    const [visible, setVisible] = useState(false);
    const [formData, setFormData] = useState({ date: '2024-10-27 19:00', temperature: '12', weather: 'солнечно', userId: '1', comment: 'Тест' });

    const handleAddEntry = async () => {
        await addWeatherEntry(formData);
        setVisible(false);
        refetch()
    };

    const handleDeleteEntry =  async (id: number) => {
        await deleteWeatherEntry(id)
        refetch()
    };


    return (
        <div>

            <Button label="Добавить запись" onClick={() => setVisible(true)} />
            <Dialog header="Добавить запись" visible={visible} onHide={() => setVisible(false)}>
                <div>
                    <input type="datetime-local" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
                    <input type="number" value={formData.temperature} onChange={(e) => setFormData({ ...formData, temperature: e.target.value })} required min="-50" max="60" step="0.01" />

                    <select value={formData.weather} onChange={(e) => setFormData({ ...formData, weather: e.target.value })}>
                        <option value="">Выберите погоду</option>
                        <option value="Солнечно">Солнечно</option>
                        <option value="Дождливо">Дождливо</option>
                        <option value="Облачно">Облачно</option>
                    </select>

                    <select value={formData.userId} onChange={(e) => setFormData({ ...formData, userId: e.target.value })}>
                        <option value="">Кто заполнил</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>{user.name}</option>
                        ))}
                    </select>

                    <textarea value={formData.comment} onChange={(e) => setFormData({ ...formData, comment: e.target.value })} />

                    <Button label="Сохранить" onClick={handleAddEntry} />
                </div>
            </Dialog>


            <table>
                <thead>
                <tr>
                    <th>Дата и время</th>
                    <th>Температура</th>
                    <th>Погода</th>
                    <th>Кто заполнил</th>
                    <th>Комментарий</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {weatherEntries.map(entry => (
                    <tr key={entry.id}>
                        <td>{entry.date}</td>
                        <td>{entry.temperature}</td>
                        <td>{entry.weather}</td>
                        <td>{entry.userId}</td>
                        <td>{entry.comment}</td>
                        <td>
                            <Button label="Удалить" onClick={() => handleDeleteEntry(entry.id)} />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default WeatherTable;
