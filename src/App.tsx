import React from 'react';
import Logo from './components/Logo'
import PromotionsTable from "./components/PromotionsTable";
import './App.css';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient();
const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="App">
                <Logo/>
                <PromotionsTable/>
            </div>
        </QueryClientProvider>
    );
}

export default App;
