import React from 'react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import WeatherTable from './components/WeatherTable';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import WeatherDataTable from "./components/WeatherDataTable";

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <div className="App">
                <h1>Дневник наблюдения за погодой</h1>
                <WeatherDataTable />
                {/*<WeatherTable />*/}
            </div>
        </Provider>
    );
};

export default App;
