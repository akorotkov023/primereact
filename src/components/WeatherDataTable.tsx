import React, {useState} from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from "primereact/dialog";
import { InputText } from 'primereact/inputtext';
import { useForm, Controller } from 'react-hook-form';


import {
    useAddWeatherEntryMutation,
    useDeleteWeatherEntryMutation,
    useGetUsersQuery,
    useGetWeatherEntriesQuery
} from "../api/weatherApi";
import {Dropdown} from "primereact/dropdown";
import {InputTextarea} from "primereact/inputtextarea";



const WeatherDataTable: React.FC = () => {
    const { data: weatherEntries = [], error, isLoading, refetch } = useGetWeatherEntriesQuery();
    const { data: users = [] } = useGetUsersQuery();
    const [deleteWeatherEntry] = useDeleteWeatherEntryMutation();
    const [addWeatherEntry] = useAddWeatherEntryMutation();
    const [visible, setVisible] = useState(false);
    const [formData, setFormData] = useState({ date: '2024-10-11T19:00', temperature: '12', weather: 'солнечно', userName: 'Андрей', comment: 'Тест' });

    const weathers = [
        { name: 'Солнечно', value: 'Солнечно' },
        { name: 'Дождливо', value: 'Дождливо' },
        { name: 'Облачно', value: 'Облачно' },
    ];

    const defaultValues = {
        date: formData.date,
        temperature: formData.temperature,
        weather: formData.weather,
        userName: formData.userName,
        comment: formData.comment,
    }

    const { control, formState: { errors }, handleSubmit, reset } = useForm({ defaultValues });

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
            <Button label="Добавить запись" onClick={() => setVisible(true)}/>
            <DataTable value={weatherEntries} paginator rows={10}>
                <Column field="date" header="Дата и время"/>
                <Column field="temperature" header="Температура"/>
                <Column field="weather" header="Погода"/>
                <Column field="userName" header="Кто заполнил"/>
                <Column field="comment" header="Комментарий"/>
                <Column
                    header="Действия"
                    body={(rowData) => (
                        <Button label="Удалить" onClick={() => handleDeleteEntry(rowData.id)}/>
                    )}
                />
            </DataTable>

            <div>
                <Dialog header="Добавление записи"
                        visible={visible}
                        onHide={() => {
                            if (!visible) return;
                            setVisible(false)
                        }}
                        style={{width: '50vw'}}
                >

                    <div>
                        <label style={{ display: 'block', marginBottom: '2px'}}>Дата</label>
                        <InputText
                            type="datetime-local"
                            value={formData.date}
                            onChange={(e) => setFormData({...formData, date: e.target.value})}
                            required
                            style={{margin: '20px 0'}}
                        />
                    </div>
                    <div>
                        <label style={{display: 'block', marginBottom: '2px'}}>Температура</label>
                        <InputText
                            type="number"
                            value={formData.temperature}
                            onChange={(e) => setFormData({...formData, temperature: e.target.value})}
                            required
                            min="-50"
                            max="60"
                            step="0.01"
                            style={{margin: '20px 0'}}
                        />
                    </div>

                    <div>

                        <label style={{display: 'block', marginBottom: '2px'}}>Погода</label>
                        <Dropdown
                            style={{margin: '20px 0'}}
                            value={formData.weather}
                            options={weathers}
                            onChange={(e) => setFormData({...formData, weather: e.value})}
                            optionLabel="name"
                            placeholder="Выбрать погоду"
                            className="w-full md:w-14rem"
                        />

                    </div>
                    <div>
                        <label style={{display: 'block', marginBottom: '2px'}}>Кто заполнил</label>
                        <Dropdown
                            style={{margin: '20px 0'}}
                            value={formData.userName}
                            options={users}
                            onChange={(e) => setFormData({...formData, userName: e.value})}
                            optionLabel="name"
                            placeholder="Кто заполнил"
                            className="w-full md:w-14rem"
                        />
                    </div>
                    <div>
                        <label style={{display: 'block', marginBottom: '2px'}}>Комментарий</label>

                        <InputTextarea
                            value={formData.comment}
                            onChange={(e) => setFormData({...formData, comment: e.target.value})}
                            rows={5} cols={30}
                        />

                        {/*<textarea*/}
                        {/*    style={{margin: '20px 0'}}*/}
                        {/*    value={formData.comment}*/}
                        {/*    onChange={(e) => setFormData({...formData, comment: e.target.value})}*/}
                        {/*/>*/}
                    </div>
                    <div>
                        <Button label="Сохранить" onClick={handleAddEntry}/>
                    </div>
                </Dialog>
            </div>
        </div>
    );
};

export default WeatherDataTable;
