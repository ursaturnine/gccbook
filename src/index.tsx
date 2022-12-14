import ReactDOM from 'react-dom';
import { useState, useEffect, useRef } from 'react';
import * as esbuild from 'esbuild-wasm';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import './styles/index.css'

const App = () => {
    //ref.current refers to any type of variable
    const ref = useRef<any>();

    const [input, setInput] = useState('');
    const [code, setCode] = useState('');



    const startService = async () => {
        ref.current = await esbuild.startService({
            worker: true,
            wasmURL: '/esbuild.wasm'
        });
    }

    useEffect(() => {
        startService();
    }, [])

    const onClick = async () => {
        if (!ref.current) {
            return;
        }

        //transpile and build
        const result = await ref.current.build({
            entryPoints: ['index.js'],
            bundle: true,
            write: false,
            plugins: [unpkgPathPlugin()],
            define: {
                'process.env.NODE_ENV': '"production"',
                global: 'window'
            }
        });

        // console.log(result);

        setCode(result.outputFiles[0].text);
    }

    return <div>
        <div><h1>Girls Code Club Interactive Code Notebook</h1></div>
        <textarea value={input} onChange={e => setInput(e.target.value)}></textarea>
        <div>
            <button onClick={onClick}>Submit</button>
        </div>
        <pre>{code}</pre>
    </div>
};

ReactDOM.render(<App />, document.querySelector('#root'));