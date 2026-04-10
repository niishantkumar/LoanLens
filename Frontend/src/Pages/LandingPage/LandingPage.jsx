import React from 'react';
import Hero from './Hero';
import EmiCalc from './EmiCalc'


function LandingPage() {


    return (
        <div className='container-fluid mt-2 mb-5'>
            <Hero />
            <EmiCalc />
        </div>
    );
}

export default LandingPage;