import React from 'react';
import { Jumbotron as Jumbo, Container } from 'react-bootstrap';
import styled from 'styled-components';
import mapleTrees from '../assets/mapleTrees.jpg';

const Styles = styled.div`
    .jumbo {
        background: url(${mapleTrees}) no-repeat fixed bottom;
        background-size: cover;
        color: #fff;
        height: 250px
        position: relative
        z-index: -2;
    }

    .overlay {
        background-color: #000;
        opacity: 0.8;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: -1;
    }
`;

export const Jumbotron = () => (
    <Styles>
        <Jumbo fluid className="jumbo">
            <div classname="overlay"></div>
            <Container>
                <h1>Welcome to our Poetry Visualizer</h1>
                <p>Translating poetry into art in real time.</p>
            </Container>
        </Jumbo>
    </Styles>
)
