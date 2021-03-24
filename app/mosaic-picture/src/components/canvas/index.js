import {useRef, useEffect} from 'react';

import './style.scss';

const Canvas = () => {

    let canvasRef = useRef(null);

    useEffect(() => {
        let canvas = canvasRef.current;
        canvas.width = 1200;
        canvas.height = 800;

    }, []);

    return (
        <canvas ref={canvasRef}/>
    )
}

export default Canvas;