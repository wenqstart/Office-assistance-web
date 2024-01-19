import React, { useEffect, useRef, useState } from 'react';
import CodeMirror from 'codemirror';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { CodemirrorBinding } from 'y-codemirror';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/lib/codemirror.css';
import {Button} from "antd";

const CodeMirrorComponent = () => {
    const editorRef = useRef(null);
    useEffect(() => {
        console.log(`ws${location.protocol.slice(4)}//${location.host}/ws`);
        // Cleanup function
        connectWebSocket()
        return () => {
            // Cleanup logic, if needed
        };
    }, []); // Empty dependency array means this effect runs once after the initial render
    const connectWebSocket = () => {
        const ydoc = new Y.Doc();
        const provider = new WebsocketProvider(
            `ws${':'}/localhost:3000/ws`,
            'health',
            ydoc
        );

        const ytext = ydoc.getText('codemirror');

        if (editorRef.current) {
            const editor = CodeMirror(editorRef.current, {
                mode: 'javascript',
                lineNumbers: true,
            });

            const binding = new CodemirrorBinding(ytext, editor, provider.awareness);

            // Cleanup function
            return () => {
                editor.toTextArea();
            };
        }
    };

    const handleConnectClick = () => {
        connectWebSocket();
        setButtonText((prevButtonText) => (prevButtonText === 'Connect' ? 'Disconnect' : 'Connect'));
    };

    return (
        // Render the component
        <div>
            <div ref={editorRef}></div>
        </div>
    );
};

export default CodeMirrorComponent;
